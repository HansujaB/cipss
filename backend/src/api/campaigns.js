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

const router = Router();

// ── POST /campaigns — Create campaign ────────────────────

router.post(
  '/',
  authMiddleware,
  [
    body('ngo_id').isUUID().withMessage('Valid NGO ID required'),
    body('title').notEmpty().withMessage('Campaign title required'),
    body('domain')
      .isIn(['waste_management', 'education', 'environment'])
      .withMessage('Invalid domain'),
    body('lat').optional().isFloat(),
    body('lng').optional().isFloat(),
    body('area').optional().isString(),
    body('planned_volunteers').optional().isInt({ min: 0 }),
    body('planned_waste_kg').optional().isFloat({ min: 0 }),
    body('start_date').optional().isISO8601(),
    body('end_date').optional().isISO8601(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const {
        ngo_id, title, domain, lat, lng, area,
        planned_volunteers, planned_waste_kg,
        start_date, end_date,
      } = req.body;

      // Verify NGO exists
      const ngo = await prisma.nGO.findUnique({ where: { id: ngo_id } });
      if (!ngo) {
        return res.status(404).json({ error: 'NGO not found' });
      }

      // ── Auto-compute Need Score ────────────────────
      let needScore = null;
      if (area || (lat && lng)) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);

        const metricsInArea = await prisma.nGOMetric.findMany({
          where: {
            domain,
            date: { gte: thirtyDaysAgo },
            ...(area ? { area } : {}),
          },
          orderBy: { date: 'desc' },
          take: 100,
        });

        if (metricsInArea.length > 0) {
          const totalWaste = metricsInArea.reduce((sum, m) => sum + (m.wasteKg || 0), 0);
          const recencyDays = (Date.now() - new Date(metricsInArea[0].date).getTime()) / 86_400_000;

          // Count completed campaigns in the area
          const completedCampaigns = await prisma.campaign.count({
            where: { domain, area, status: 'completed' },
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
        where: { ngoId: ngo_id },
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
          ngoId: ngo_id,
          title,
          domain,
          lat: lat || null,
          lng: lng || null,
          area: area || null,
          needScore,
          trustScore,
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

      res.status(201).json(campaign);
    } catch (err) {
      next(err);
    }
  }
);

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
          include: { ngo: { select: { name: true, verified: true } } },
          orderBy: { createdAt: 'desc' },
          take: parseInt(limit),
          skip: parseInt(offset),
        }),
        prisma.campaign.count({ where }),
      ]);

      res.json({
        campaigns,
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
      include: { ngo: { select: { name: true, verified: true } } },
      orderBy: { needScore: 'desc' },
      take: parseInt(limit),
    });

    res.json({ campaigns });
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
        include: { ngo: true },
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

      res.json({ ...campaign, llmRecommendation });
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
