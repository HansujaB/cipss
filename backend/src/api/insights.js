// ─────────────────────────────────────────────────────────
// Insights Routes — /api/v1/insights
// Hotspots, trends, location-based need scores,
// and Gemini-powered analysis.
// ─────────────────────────────────────────────────────────

const { Router } = require('express');
const { query } = require('express-validator');
const prisma = require('../lib/prisma');
const { handleValidationErrors } = require('../middleware/validate');
const { getHotspots } = require('../services/hotspot');
const { computeNeedScore } = require('../services/needScore');
const { analyseHotspots, narrateTrend } = require('../services/llmInsights');

const router = Router();

// ── GET /insights/hotspots ───────────────────────────────
// Returns top high-need grid cells.
// Query: ?domain=waste_management&lat=28.61&lng=77.23&radius=10000&limit=10
// Optional: ?llm_analysis=true  → enriches with Gemini insights

router.get(
  '/hotspots',
  [
    query('domain').notEmpty().withMessage('domain query param required'),
    query('lat').optional().isFloat(),
    query('lng').optional().isFloat(),
    query('radius').optional().isFloat({ min: 0 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('llm_analysis')
      .optional()
      .isBoolean()
      .withMessage('llm_analysis must be boolean'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { domain, lat, lng, radius, limit = '10', llm_analysis } = req.query;

      const geo =
        lat && lng
          ? {
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              radius: parseFloat(radius || '10000'),
            }
          : null;

      const hotspots = await getHotspots(domain, parseInt(limit), geo);

      // ── Optional LLM enrichment ────────────────────
      let llmAnalysis = null;
      if (llm_analysis === 'true' && hotspots.length > 0) {
        llmAnalysis = await analyseHotspots(hotspots, domain);
      }

      res.json({
        hotspots,
        total: hotspots.length,
        domain,
        ...(llmAnalysis ? { llm_analysis: llmAnalysis } : {}),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /insights/trends ─────────────────────────────────
// Time-series data for a domain/area.
// Query: ?domain=waste_management&area=Najafgarh&period=90
// Optional: ?llm_narrate=true  → Gemini generates trend narrative

router.get(
  '/trends',
  [
    query('domain').notEmpty().withMessage('domain query param required'),
    query('area').optional().isString(),
    query('period')
      .optional()
      .isInt({ min: 7, max: 365 })
      .withMessage('period must be 7–365 days'),
    query('llm_narrate')
      .optional()
      .isBoolean()
      .withMessage('llm_narrate must be boolean'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const {
        domain,
        area,
        period = '90',
        llm_narrate,
      } = req.query;

      const since = new Date(
        Date.now() - parseInt(period) * 86_400_000
      );

      const where = {
        domain,
        date: { gte: since },
      };
      if (area) where.area = area;

      // ── Raw metrics bucketed by day ────────────────
      const metrics = await prisma.nGOMetric.findMany({
        where,
        orderBy: { date: 'asc' },
        select: {
          date: true,
          wasteKg: true,
          volunteers: true,
          beneficiaries: true,
          area: true,
        },
      });

      // Bucket into daily aggregates
      const dailyMap = {};
      for (const m of metrics) {
        const day = new Date(m.date).toISOString().slice(0, 10);
        if (!dailyMap[day]) {
          dailyMap[day] = {
            date: day,
            report_count: 0,
            total_waste_kg: 0,
            total_volunteers: 0,
            total_beneficiaries: 0,
          };
        }
        dailyMap[day].report_count++;
        dailyMap[day].total_waste_kg += m.wasteKg || 0;
        dailyMap[day].total_volunteers += m.volunteers || 0;
        dailyMap[day].total_beneficiaries += m.beneficiaries || 0;
      }

      const trendData = Object.values(dailyMap).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // ── Optional LLM narrative ─────────────────────
      let llmNarration = null;
      if (llm_narrate === 'true' && trendData.length > 0) {
        llmNarration = await narrateTrend(trendData, domain, area || 'all areas');
      }

      res.json({
        domain,
        area: area || 'all',
        period: parseInt(period),
        data_points: trendData.length,
        trends: trendData,
        ...(llmNarration ? { llm_narration: llmNarration } : {}),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /insights/need-score ─────────────────────────────
// Compute need score for a specific lat/lng location.
// Query: ?lat=28.61&lng=77.23&domain=waste_management&radius=5000

router.get(
  '/need-score',
  [
    query('lat')
      .isFloat({ min: 6.5, max: 35.7 })
      .withMessage('lat must be within India bounds (6.5–35.7)'),
    query('lng')
      .isFloat({ min: 68.1, max: 97.4 })
      .withMessage('lng must be within India bounds (68.1–97.4)'),
    query('domain').notEmpty().withMessage('domain required'),
    query('radius')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('radius must be positive (metres)'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const {
        lat: latStr,
        lng: lngStr,
        domain,
        radius: radiusStr = '5000',
      } = req.query;

      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      const radius = parseFloat(radiusStr);
      const degreeOffset = radius / 111_000;

      const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);

      const metrics = await prisma.nGOMetric.findMany({
        where: {
          domain,
          date: { gte: thirtyDaysAgo },
          lat: { gte: lat - degreeOffset, lte: lat + degreeOffset },
          lng: { gte: lng - degreeOffset, lte: lng + degreeOffset },
        },
        orderBy: { date: 'desc' },
      });

      if (metrics.length === 0) {
        return res.json({
          need_score: 0,
          lat,
          lng,
          domain,
          message: 'No reports within the specified radius in the last 30 days',
        });
      }

      const totalWaste = metrics.reduce((s, m) => s + (m.wasteKg || 0), 0);
      const recencyDays =
        (Date.now() - new Date(metrics[0].date).getTime()) / 86_400_000;

      const completedCampaigns = await prisma.campaign.count({
        where: {
          domain,
          status: 'completed',
          lat: { gte: lat - degreeOffset, lte: lat + degreeOffset },
          lng: { gte: lng - degreeOffset, lte: lng + degreeOffset },
        },
      });
      const pastAction = Math.min(
        completedCampaigns / Math.max(metrics.length, 1),
        1
      );

      const needScore = computeNeedScore({
        frequency: metrics.length,
        severity: totalWaste,
        recency: recencyDays,
        pastAction,
      });

      res.json({
        need_score: needScore,
        lat,
        lng,
        domain,
        radius,
        report_count: metrics.length,
        total_waste_kg: parseFloat(totalWaste.toFixed(2)),
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
