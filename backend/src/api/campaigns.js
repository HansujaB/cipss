// ─────────────────────────────────────────────────────────
// Campaign Routes — /api/v1/campaigns
// ─────────────────────────────────────────────────────────

const { Router } = require('express');
const { body, param, query } = require('express-validator');
const prisma = require('../lib/prisma');
const { handleValidationErrors } = require('../middleware/validate');
const { authMiddleware } = require('../middleware/auth');
const { computeNeedScore } = require('../services/needScore');
const { computeImpactScore } = require('../services/impactScore');
const { computeTrustScore } = require('../services/trustScore');
const { getCampaignRecommendation, assessImpact } = require('../services/llmInsights');
const { geocodeArea, getCampaignMapUrls, hasGoogleMaps } = require('../services/googleMaps');
const { getHotspots } = require('../services/hotspot');
const { createResumableUpload, hasStorage } = require('../services/storage');
const { grantReward, issueCertificate } = require('../services/rewards');

const router = Router();

function serializeCampaign(campaign) {
  const successfulFunding = (campaign.funding || []).filter(
    (transaction) => transaction.status === 'succeeded'
  );
  const fundingRaised = successfulFunding.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const volunteersCount =
    campaign._count?.participations ?? campaign.participations?.length ?? 0;

  return {
    id: campaign.id,
    ngoId: campaign.ngoId,
    title: campaign.title,
    description: campaign.description,
    domain: campaign.domain,
    lat: campaign.lat,
    lng: campaign.lng,
    area: campaign.area,
    location: campaign.area || [campaign.lat, campaign.lng].filter(Boolean).join(', ') || 'TBD',
    status: campaign.status,
    needScore: campaign.needScore,
    trustScore: campaign.trustScore,
    impactScore: campaign.impactScore,
    fundingGoal: campaign.fundingGoal || 0,
    fundingRaised: parseFloat(fundingRaised.toFixed(2)),
    plannedVolunteers: campaign.plannedVolunteers,
    actualVolunteers: campaign.actualVolunteers,
    volunteers: volunteersCount,
    plannedWasteKg: campaign.plannedWasteKg,
    actualWasteKg: campaign.actualWasteKg,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    createdAt: campaign.createdAt,
    ngo: campaign.ngo
      ? {
          id: campaign.ngo.id,
          name: campaign.ngo.name,
          verified: campaign.ngo.verified,
        }
      : null,
    proofsCount: campaign._count?.proofs ?? campaign.proofs?.length ?? 0,
    ...getCampaignMapUrls({
      title: campaign.title,
      area: campaign.area,
      lat: campaign.lat,
      lng: campaign.lng,
    }),
  };
}

// ── POST /campaigns — Create campaign ────────────────────

router.post(
  '/',
  authMiddleware,
  [
    body('ngo_id').optional().isUUID().withMessage('Valid NGO ID required'),
    body('title').notEmpty().withMessage('Campaign title required'),
    body('description').optional().isString(),
    body('domain')
      .isIn(['waste_management', 'education', 'environment'])
      .withMessage('Invalid domain'),
    body('lat').optional().isFloat(),
    body('lng').optional().isFloat(),
    body('area').optional().isString(),
    body('planned_volunteers').optional().isInt({ min: 0 }),
    body('planned_waste_kg').optional().isFloat({ min: 0 }),
    body('funding_goal').optional().isFloat({ min: 0 }),
    body('start_date').optional().isISO8601(),
    body('end_date').optional().isISO8601(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const {
        ngo_id, title, description, domain, lat, lng, area,
        planned_volunteers, planned_waste_kg,
        funding_goal,
        start_date, end_date,
      } = req.body;

      let ngo = null;

      if (ngo_id) {
        ngo = await prisma.nGO.findUnique({ where: { id: ngo_id } });
      } else if (req.user.role === 'ngo_admin') {
        ngo = await prisma.nGO.findFirst({
          where: {
            OR: [
              { profile: { is: { userId: req.user.id } } },
              { name: req.user.name || req.user.email },
            ],
          },
        });

        if (!ngo) {
          ngo = await prisma.nGO.create({
            data: {
              name: req.user.name || req.user.email,
              domain,
              profile: {
                create: {
                  userId: req.user.id,
                },
              },
            },
          });
        }
      }

      if (!ngo) {
        return res.status(404).json({ error: 'NGO not found. Provide ngo_id or register an NGO account.' });
      }

      const geocodedLocation =
        !lat && !lng && area ? await geocodeArea(area) : null;
      const resolvedLat = lat || geocodedLocation?.lat || null;
      const resolvedLng = lng || geocodedLocation?.lng || null;
      const resolvedArea = geocodedLocation?.formattedAddress || area || null;

      // ── Auto-compute Need Score ────────────────────
      let needScore = null;
      if (resolvedArea || (resolvedLat && resolvedLng)) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);

        const metricsInArea = await prisma.nGOMetric.findMany({
          where: {
            domain,
            date: { gte: thirtyDaysAgo },
            ...(resolvedArea ? { area: resolvedArea } : {}),
          },
          orderBy: { date: 'desc' },
          take: 100,
        });

        if (metricsInArea.length > 0) {
          const totalWaste = metricsInArea.reduce((sum, m) => sum + (m.wasteKg || 0), 0);
          const recencyDays = (Date.now() - new Date(metricsInArea[0].date).getTime()) / 86_400_000;

          // Count completed campaigns in the area
          const completedCampaigns = await prisma.campaign.count({
            where: { domain, area: resolvedArea, status: 'completed' },
          });
          const pastAction = Math.min(completedCampaigns / Math.max(metricsInArea.length, 1), 1);

          needScore = computeNeedScore({
            frequency: metricsInArea.length,
            severity: totalWaste,
            recency: recencyDays,
            pastAction,
          });
        }
      }

      // ── Auto-compute Trust Score ───────────────────
      let trustScore = null;
      const allCampaigns = await prisma.campaign.findMany({
        where: { ngoId: ngo.id },
      });
      if (allCampaigns.length > 0) {
        const completed = allCampaigns.filter((c) => c.status === 'completed');
        const consistency = completed.length / allCampaigns.length;
        const avgImpact =
          completed.reduce((sum, c) => sum + (c.impactScore || 0), 0) /
          Math.max(completed.length, 1) / 100;

        trustScore = computeTrustScore({
          engagement: 0.5, // placeholder — could be enriched from external data
          authenticity: ngo.verified ? 0.9 : 0.5,
          consistency,
          pastImpact: avgImpact,
        });
      }

      // ── Create campaign ────────────────────────────
      const campaign = await prisma.campaign.create({
        data: {
          ngoId: ngo.id,
          title,
          domain,
          description: description || null,
          lat: resolvedLat,
          lng: resolvedLng,
          area: resolvedArea,
          needScore,
          trustScore,
          fundingGoal: funding_goal || null,
          plannedVolunteers: planned_volunteers || null,
          plannedWasteKg: planned_waste_kg || null,
          startDate: start_date ? new Date(start_date) : null,
          endDate: end_date ? new Date(end_date) : null,
        },
      });

      // ── LLM Recommendation (async, non-blocking) ──
      // Fire and forget — don't block the response
      getCampaignRecommendation(campaign)
        .then(async (rec) => {
          if (rec) {
            await prisma.campaign.update({
              where: { id: campaign.id },
              data: { llmRecommendation: JSON.stringify(rec) },
            });
          }
        })
        .catch((err) => console.error('[LLM] Campaign rec failed:', err.message));

      const created = await prisma.campaign.findUnique({
        where: { id: campaign.id },
        include: {
          ngo: { select: { id: true, name: true, verified: true } },
          funding: true,
          _count: { select: { participations: true, proofs: true } },
        },
      });

      res.status(201).json(serializeCampaign(created));
    } catch (err) {
      next(err);
    }
  }
);

router.get('/mine/joined', authMiddleware, async (req, res, next) => {
  try {
    const participations = await prisma.campaignParticipation.findMany({
      where: { userId: req.user.id },
      include: {
        campaign: {
          include: {
            ngo: { select: { id: true, name: true, verified: true } },
            funding: { select: { amount: true, status: true } },
            _count: { select: { participations: true, proofs: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    res.json({
      campaigns: participations.map((entry) => ({
        ...serializeCampaign(entry.campaign),
        participationStatus: entry.status,
        joinedAt: entry.joinedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/dashboard/summary', async (req, res, next) => {
  try {
    const [campaigns, topCampaigns, hotspots] = await Promise.all([
      prisma.campaign.findMany({
        include: {
          ngo: { select: { id: true, name: true, verified: true } },
          funding: { select: { amount: true, status: true } },
          _count: { select: { participations: true, proofs: true } },
        },
      }),
      prisma.campaign.findMany({
        where: { impactScore: { not: null } },
        include: {
          ngo: { select: { id: true, name: true, verified: true } },
          funding: { select: { amount: true, status: true } },
          _count: { select: { participations: true, proofs: true } },
        },
        orderBy: [{ impactScore: 'desc' }, { needScore: 'desc' }],
        take: 3,
      }),
      getHotspots('waste_management', 5).catch(() => []),
    ]);

    const serialized = campaigns.map(serializeCampaign);
    const totals = serialized.reduce(
      (acc, campaign) => {
        acc.totalCampaigns += 1;
        acc.totalFunding += campaign.fundingRaised || 0;
        acc.totalVolunteers += campaign.volunteers || 0;
        acc.avgImpact += campaign.impactScore || 0;
        return acc;
      },
      { totalCampaigns: 0, totalFunding: 0, totalVolunteers: 0, avgImpact: 0 }
    );

    const avgImpact =
      totals.totalCampaigns > 0
        ? parseFloat((totals.avgImpact / totals.totalCampaigns).toFixed(1))
        : 0;

    const categoryMap = serialized.reduce((acc, campaign) => {
      if (!acc[campaign.domain]) {
        acc[campaign.domain] = {
          name: campaign.domain,
          campaigns: 0,
          volunteers: 0,
          funding: 0,
          impactTotal: 0,
        };
      }
      acc[campaign.domain].campaigns += 1;
      acc[campaign.domain].volunteers += campaign.volunteers || 0;
      acc[campaign.domain].funding += campaign.fundingRaised || 0;
      acc[campaign.domain].impactTotal += campaign.impactScore || 0;
      return acc;
    }, {});

    const categories = Object.values(categoryMap).map((category) => ({
      ...category,
      avgImpact:
        category.campaigns > 0
          ? parseFloat((category.impactTotal / category.campaigns).toFixed(1))
          : 0,
    }));

    const monthlyMap = serialized.reduce((acc, campaign) => {
      const date = new Date(campaign.createdAt || Date.now());
      const month = date.toLocaleString('en', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, impact: 0, campaigns: 0, funding: 0 };
      }
      acc[month].campaigns += 1;
      acc[month].funding += campaign.fundingRaised || 0;
      acc[month].impact += campaign.impactScore || 0;
      return acc;
    }, {});

    const monthlyProgress = Object.values(monthlyMap).map((entry) => ({
      ...entry,
      impact:
        entry.campaigns > 0
          ? parseFloat((entry.impact / entry.campaigns).toFixed(1))
          : 0,
    }));

    res.json({
      stats: {
        totalCampaigns: totals.totalCampaigns,
        totalFunding: parseFloat(totals.totalFunding.toFixed(2)),
        totalVolunteers: totals.totalVolunteers,
        avgImpact,
      },
      topCampaigns: topCampaigns.map(serializeCampaign),
      categories,
      monthlyProgress,
      googleServices: {
        mapsEnabled: hasGoogleMaps(),
        storageEnabled: hasStorage(),
      },
      hotspots: hotspots.map((spot) => ({
        ...spot,
        ...getCampaignMapUrls({
          area: spot.area,
          lat: spot.lat,
          lng: spot.lng,
        }),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /campaigns — List campaigns ──────────────────────

router.get(
  '/',
  [
    query('domain').optional().isString(),
    query('status').optional().isIn(['draft', 'active', 'completed']),
    query('ngo_id').optional().isUUID(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { domain, status, ngo_id, limit = '20', offset = '0' } = req.query;

      const where = {};
      if (domain) where.domain = domain;
      if (status) where.status = status;
      if (ngo_id) where.ngoId = ngo_id;

      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where,
          include: {
            ngo: { select: { id: true, name: true, verified: true } },
            funding: {
              select: { amount: true, status: true },
            },
            _count: {
              select: { participations: true, proofs: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: parseInt(limit),
          skip: parseInt(offset),
        }),
        prisma.campaign.count({ where }),
      ]);

      res.json({
        campaigns: campaigns.map(serializeCampaign),
        pagination: { total, limit: parseInt(limit), offset: parseInt(offset) },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /campaigns/recommended — Top by need score ───────
// IMPORTANT: This must be defined BEFORE /:id to avoid route conflict

router.get('/recommended', async (req, res, next) => {
  try {
    const { domain, limit = '10' } = req.query;

    const where = { status: { not: 'completed' }, needScore: { not: null } };
    if (domain) where.domain = domain;

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        ngo: { select: { id: true, name: true, verified: true } },
        funding: {
          select: { amount: true, status: true },
        },
        _count: {
          select: { participations: true, proofs: true },
        },
      },
      orderBy: { needScore: 'desc' },
      take: parseInt(limit),
    });

    res.json({ campaigns: campaigns.map(serializeCampaign) });
  } catch (err) {
    next(err);
  }
});

// ── GET /campaigns/:id — Single campaign ─────────────────

router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid campaign ID'), handleValidationErrors],
  async (req, res, next) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: req.params.id },
        include: {
          ngo: true,
          funding: {
            where: { status: 'succeeded' },
            select: {
              id: true,
              amount: true,
              donorName: true,
              createdAt: true,
            },
          },
          participations: {
            select: {
              id: true,
              userId: true,
              status: true,
              joinedAt: true,
            },
          },
          proofs: {
            select: {
              id: true,
              mediaUrl: true,
              mediaType: true,
              caption: true,
              verified: true,
              aiValidated: true,
              createdAt: true,
            },
          },
          _count: {
            select: { participations: true, proofs: true },
          },
        },
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      // Parse LLM recommendation if available
      let llmRecommendation = null;
      if (campaign.llmRecommendation) {
        try {
          llmRecommendation = JSON.parse(campaign.llmRecommendation);
        } catch {
          llmRecommendation = campaign.llmRecommendation;
        }
      }

      res.json({
        ...serializeCampaign(campaign),
        donors: campaign.funding,
        participations: campaign.participations,
        proofs: campaign.proofs,
        llmRecommendation,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:id/join',
  authMiddleware,
  [param('id').isUUID().withMessage('Invalid campaign ID'), handleValidationErrors],
  async (req, res, next) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: req.params.id },
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const participation = await prisma.campaignParticipation.upsert({
        where: {
          campaignId_userId: {
            campaignId: campaign.id,
            userId: req.user.id,
          },
        },
        create: {
          campaignId: campaign.id,
          userId: req.user.id,
          status: 'joined',
        },
        update: {
          status: 'joined',
        },
      });

      res.status(201).json({ success: true, participation });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:id/join',
  authMiddleware,
  [param('id').isUUID().withMessage('Invalid campaign ID'), handleValidationErrors],
  async (req, res, next) => {
    try {
      await prisma.campaignParticipation.delete({
        where: {
          campaignId_userId: {
            campaignId: req.params.id,
            userId: req.user.id,
          },
        },
      });

      res.json({ success: true });
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Participation not found' });
      }
      next(err);
    }
  }
);

router.post(
  '/:id/check-in',
  authMiddleware,
  [
    param('id').isUUID().withMessage('Invalid campaign ID'),
    body('lat').optional().isFloat(),
    body('lng').optional().isFloat(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const participation = await prisma.campaignParticipation.findUnique({
        where: {
          campaignId_userId: {
            campaignId: req.params.id,
            userId: req.user.id,
          },
        },
        include: {
          campaign: true,
        },
      });

      if (!participation) {
        return res.status(404).json({ error: 'Join the campaign before checking in' });
      }

      const updated = await prisma.campaignParticipation.update({
        where: {
          campaignId_userId: {
            campaignId: req.params.id,
            userId: req.user.id,
          },
        },
        data: {
          status: 'checked_in',
          checkedInAt: new Date(),
          checkInLat: req.body.lat || null,
          checkInLng: req.body.lng || null,
        },
      });

      const rewardEvent = await grantReward({
        userId: req.user.id,
        campaignId: req.params.id,
        type: 'campaign_check_in',
        pointsDelta: 10,
        creditsDelta: 5,
        description: `Checked in for ${participation.campaign.title}`,
      });

      res.json({
        success: true,
        participation: updated,
        rewardEvent,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:id/proofs/upload-url',
  authMiddleware,
  [
    param('id').isUUID().withMessage('Invalid campaign ID'),
    body('contentType').optional().isString(),
    body('extension').optional().isString(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      if (!hasStorage()) {
        return res.status(400).json({
          error: 'Cloud storage is not configured',
          hint: 'Set GCS_BUCKET and Google Cloud credentials to enable uploads',
        });
      }

      const objectName = `campaign-proofs/${req.params.id}/${req.user.id}-${Date.now()}.${
        req.body.extension || 'jpg'
      }`;

      const upload = await createResumableUpload({
        objectName,
        contentType: req.body.contentType || 'image/jpeg',
        metadata: {
          campaignId: req.params.id,
          uploadedBy: req.user.id,
        },
      });

      res.status(201).json({
        success: true,
        storageEnabled: true,
        upload,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:id/proofs',
  authMiddleware,
  [
    param('id').isUUID().withMessage('Invalid campaign ID'),
    body('media_url').isString().notEmpty().withMessage('media_url required'),
    body('media_type').optional().isIn(['image', 'video']),
    body('caption').optional().isString(),
    body('geo_lat').optional().isFloat(),
    body('geo_lng').optional().isFloat(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: req.params.id },
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const proof = await prisma.campaignProof.create({
        data: {
          campaignId: campaign.id,
          submittedByUserId: req.user.id,
          mediaUrl: req.body.media_url,
          mediaType: req.body.media_type || 'image',
          caption: req.body.caption || null,
          geoLat: req.body.geo_lat || null,
          geoLng: req.body.geo_lng || null,
          aiValidated: false,
          verified: false,
        },
      });

      res.status(201).json({ success: true, proof });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:id/certificate',
  authMiddleware,
  [param('id').isUUID().withMessage('Invalid campaign ID'), handleValidationErrors],
  async (req, res, next) => {
    try {
      const participation = await prisma.campaignParticipation.findUnique({
        where: {
          campaignId_userId: {
            campaignId: req.params.id,
            userId: req.user.id,
          },
        },
        include: {
          campaign: true,
        },
      });

      if (!participation) {
        return res.status(404).json({ error: 'Participation not found' });
      }

      if (!['checked_in', 'completed'].includes(participation.status)) {
        return res.status(400).json({ error: 'Check in before requesting a certificate' });
      }

      const certificate = await issueCertificate({
        userId: req.user.id,
        campaignId: req.params.id,
        title: `Certificate of Participation — ${participation.campaign.title}`,
        description: `Issued for participating in ${participation.campaign.title}`,
        certificateUrl: `https://cipss-platform-b289f.web.app/certificates/${req.params.id}/${req.user.id}`,
        metadata: {
          campaignTitle: participation.campaign.title,
          area: participation.campaign.area,
          issuedForStatus: participation.status,
        },
      });

      await grantReward({
        userId: req.user.id,
        campaignId: req.params.id,
        type: 'certificate_issued',
        pointsDelta: 15,
        creditsDelta: 10,
        description: `Certificate issued for ${participation.campaign.title}`,
      });

      res.status(201).json({
        success: true,
        certificate,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── PATCH /campaigns/:id/complete — Mark done + score ────

router.patch(
  '/:id/complete',
  authMiddleware,
  [
    param('id').isUUID().withMessage('Invalid campaign ID'),
    body('actual_volunteers').optional().isInt({ min: 0 }),
    body('actual_waste_kg').optional().isFloat({ min: 0 }),
    body('proof_submitted').optional().isBoolean(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: req.params.id },
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const actualVolunteers = req.body.actual_volunteers ?? campaign.actualVolunteers ?? 0;
      const actualWasteKg = req.body.actual_waste_kg ?? campaign.actualWasteKg ?? 0;
      const proofSubmitted = req.body.proof_submitted ?? false;

      // ── Compute Impact Score ───────────────────────
      const volunteerRate =
        campaign.plannedVolunteers && campaign.plannedVolunteers > 0
          ? actualVolunteers / campaign.plannedVolunteers
          : 1;

      const impactScore = computeImpactScore({
        workDone: actualWasteKg,
        workPlanned: campaign.plannedWasteKg || actualWasteKg,
        volunteerRate,
        proofSubmitted,
      });

      // ── Update campaign ────────────────────────────
      const updated = await prisma.campaign.update({
        where: { id: req.params.id },
        data: {
          status: 'completed',
          actualVolunteers,
          actualWasteKg,
          impactScore,
          endDate: new Date(),
        },
      });

      // ── LLM Impact Assessment (async) ──────────────
      let llmAssessment = null;
      assessImpact(updated)
        .then(async (assessment) => {
          if (assessment) {
            llmAssessment = assessment;
            // Store as part of the recommendation field
            const existing = updated.llmRecommendation
              ? JSON.parse(updated.llmRecommendation)
              : {};
            await prisma.campaign.update({
              where: { id: updated.id },
              data: {
                llmRecommendation: JSON.stringify({
                  ...existing,
                  impact_assessment: assessment,
                }),
              },
            });
          }
        })
        .catch((err) => console.error('[LLM] Impact assessment failed:', err.message));

      res.json({
        ...updated,
        impact_score: impactScore,
        message: 'Campaign completed and impact score computed',
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
