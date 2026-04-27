// ─────────────────────────────────────────────────────────
// Score Routes — /api/v1/score
// ─────────────────────────────────────────────────────────

const { Router } = require('express');
const { query } = require('express-validator');
const prisma = require('../lib/prisma');
const { handleValidationErrors } = require('../middleware/validate');
const { computeNeedScore } = require('../services/needScore');
const { computeTrustScore } = require('../services/trustScore');
const { computeImpactScore } = require('../services/impactScore');
const { validateTrustScore } = require('../services/llmInsights');

const router = Router();

// ── GET /score/need — Need score for an area + domain ────

router.get(
  '/need',
  [
    query('area').optional().isString(),
    query('domain').notEmpty().withMessage('domain query param required'),
    query('lat').optional().isFloat(),
    query('lng').optional().isFloat(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { area, domain, lat, lng } = req.query;

      const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);

      const where = {
        domain,
        date: { gte: thirtyDaysAgo },
      };
      if (area) where.area = area;

      const metrics = await prisma.nGOMetric.findMany({
        where,
        orderBy: { date: 'desc' },
        take: 200,
      });

      if (metrics.length === 0) {
        return res.json({
          need_score: 0,
          detail: 'No reports found for this area/domain in the last 30 days',
          factors: { frequency: 0, severity: 0, recency: 30, pastAction: 0 },
        });
      }

      const totalWaste = metrics.reduce((sum, m) => sum + (m.wasteKg || 0), 0);
      const recencyDays =
        (Date.now() - new Date(metrics[0].date).getTime()) / 86_400_000;

      // Count completed campaigns in this area for pastAction
      const completedCampaigns = await prisma.campaign.count({
        where: { domain, ...(area ? { area } : {}), status: 'completed' },
      });
      const pastAction = Math.min(
        completedCampaigns / Math.max(metrics.length, 1),
        1
      );

      const factors = {
        frequency: metrics.length,
        severity: totalWaste,
        recency: parseFloat(recencyDays.toFixed(2)),
        pastAction: parseFloat(pastAction.toFixed(4)),
      };

      const needScore = computeNeedScore(factors);

      res.json({
        need_score: needScore,
        area: area || null,
        domain,
        report_count: metrics.length,
        factors,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /score/trust — Trust score for an NGO ────────────

router.get(
  '/trust',
  [
    query('ngo_id').isUUID().withMessage('Valid ngo_id required'),
    query('llm_validate')
      .optional()
      .isBoolean()
      .withMessage('llm_validate must be boolean'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { ngo_id, llm_validate } = req.query;

      const ngo = await prisma.nGO.findUnique({
        where: { id: ngo_id },
        include: {
          campaigns: true,
          _count: { select: { metrics: true } },
        },
      });

      if (!ngo) {
        return res.status(404).json({ error: 'NGO not found' });
      }

      // ── Compute factors ────────────────────────────
      const totalCampaigns = ngo.campaigns.length;
      const completedCampaigns = ngo.campaigns.filter(
        (c) => c.status === 'completed'
      );

      const consistency =
        totalCampaigns > 0
          ? completedCampaigns.length / totalCampaigns
          : 0;

      const avgImpact =
        completedCampaigns.length > 0
          ? completedCampaigns.reduce((s, c) => s + (c.impactScore || 0), 0) /
            completedCampaigns.length / 100
          : 0;

      // Engagement proxy: ratio of metrics to campaigns (active data contribution)
      const engagement = Math.min(
        ngo._count.metrics / Math.max(totalCampaigns * 10, 1),
        1
      );

      const factors = {
        engagement: parseFloat(engagement.toFixed(4)),
        authenticity: ngo.verified ? 0.9 : 0.5,
        consistency: parseFloat(consistency.toFixed(4)),
        pastImpact: parseFloat(avgImpact.toFixed(4)),
      };

      const trustScore = computeTrustScore(factors);

      // ── Optional LLM validation ────────────────────
      let llmValidation = null;
      if (llm_validate === 'true') {
        llmValidation = await validateTrustScore(ngo, trustScore, factors);
      }

      res.json({
        trust_score: trustScore,
        ngo_id,
        ngo_name: ngo.name,
        verified: ngo.verified,
        factors,
        total_campaigns: totalCampaigns,
        completed_campaigns: completedCampaigns.length,
        ...(llmValidation ? { llm_validation: llmValidation } : {}),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /score/impact — Impact score for a campaign ──────

router.get(
  '/impact',
  [
    query('campaign_id')
      .isUUID()
      .withMessage('Valid campaign_id required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { campaign_id } = req.query;

      const campaign = await prisma.campaign.findUnique({
        where: { id: campaign_id },
        include: { ngo: { select: { name: true } } },
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      // If already computed, return cached value
      if (campaign.impactScore !== null) {
        return res.json({
          impact_score: campaign.impactScore,
          campaign_id,
          campaign_title: campaign.title,
          status: campaign.status,
          precomputed: true,
        });
      }

      // Compute on-the-fly if campaign has actual data
      if (campaign.actualWasteKg === null && campaign.actualVolunteers === null) {
        return res.json({
          impact_score: null,
          campaign_id,
          message:
            'Campaign has no actual results yet. Complete the campaign first.',
        });
      }

      const volunteerRate =
        campaign.plannedVolunteers && campaign.plannedVolunteers > 0
          ? (campaign.actualVolunteers || 0) / campaign.plannedVolunteers
          : 1;

      const impactScore = computeImpactScore({
        workDone: campaign.actualWasteKg || 0,
        workPlanned: campaign.plannedWasteKg || campaign.actualWasteKg || 1,
        volunteerRate,
        proofSubmitted: false,
      });

      res.json({
        impact_score: impactScore,
        campaign_id,
        campaign_title: campaign.title,
        ngo: campaign.ngo.name,
        status: campaign.status,
        factors: {
          work_done: campaign.actualWasteKg || 0,
          work_planned: campaign.plannedWasteKg || 0,
          volunteer_rate: parseFloat(volunteerRate.toFixed(4)),
          proof_submitted: false,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
