// ─────────────────────────────────────────────────────────
// Influencer routes — /api/v1/influencers
// ─────────────────────────────────────────────────────────

const { Router } = require('express');
const { body, query } = require('express-validator');
const prisma = require('../lib/prisma');
const { handleValidationErrors } = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { validateTrustScore } = require('../services/llmInsights');

const router = Router();

function computeInfluencerTrust(profile) {
  const followerScore = Math.min((profile.followers || 0) / 100000, 1);
  const engagementScore = Math.min((profile.engagementRate || 0) / 0.08, 1);
  const impactScore = Math.min((profile.impactScore || 0) / 100, 1);
  const verifiedScore = profile.verified ? 1 : 0.5;

  const raw =
    followerScore * 0.2 +
    engagementScore * 0.35 +
    impactScore * 0.3 +
    verifiedScore * 0.15;

  return parseFloat((raw * 100).toFixed(2));
}

function detectFraudSignals(profile) {
  const signals = [];
  if ((profile.followers || 0) > 50000 && (profile.engagementRate || 0) < 0.005) {
    signals.push('High followers with unusually low engagement');
  }
  if ((profile.engagementRate || 0) > 0.2) {
    signals.push('Engagement rate unusually high');
  }
  if (!profile.socialHandle) {
    signals.push('Missing public social handle');
  }
  return signals;
}

router.post(
  '/profile',
  authMiddleware,
  requireRole('influencer'),
  [
    body('socialHandle').notEmpty().withMessage('socialHandle required'),
    body('platform').notEmpty().withMessage('platform required'),
    body('followers').optional().isInt({ min: 0 }),
    body('engagementRate').optional().isFloat({ min: 0 }),
    body('impactScore').optional().isFloat({ min: 0, max: 100 }),
    body('verified').optional().isBoolean(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const nextProfile = {
        socialHandle: req.body.socialHandle,
        platform: req.body.platform,
        followers: req.body.followers || null,
        engagementRate: req.body.engagementRate || null,
        impactScore: req.body.impactScore || null,
        verified: req.body.verified || false,
      };

      const trustScore = computeInfluencerTrust(nextProfile);

      const profile = await prisma.influencerProfile.upsert({
        where: { userId: req.user.id },
        update: {
          ...nextProfile,
          trustScore,
        },
        create: {
          userId: req.user.id,
          ...nextProfile,
          trustScore,
        },
      });

      const fraudSignals = detectFraudSignals(profile);

      res.status(201).json({
        profile,
        fraudSignals,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/recommendations',
  [
    query('campaign_id').optional().isUUID(),
    query('domain').optional().isString(),
    query('area').optional().isString(),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      let campaign = null;
      if (req.query.campaign_id) {
        campaign = await prisma.campaign.findUnique({
          where: { id: req.query.campaign_id },
        });
      }

      const profiles = await prisma.influencerProfile.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: [{ trustScore: 'desc' }, { impactScore: 'desc' }],
        take: 10,
      });

      const recommendations = profiles.map((profile) => {
        const fraudSignals = detectFraudSignals(profile);
        const domainBoost =
          campaign?.domain === 'environment' && profile.platform === 'instagram' ? 5 : 0;
        return {
          userId: profile.userId,
          name: profile.user.name,
          socialHandle: profile.socialHandle,
          platform: profile.platform,
          trustScore: profile.trustScore || computeInfluencerTrust(profile),
          impactScore: profile.impactScore,
          followers: profile.followers,
          engagementRate: profile.engagementRate,
          fraudSignals,
          recommendationScore: parseFloat(
            (((profile.trustScore || 0) + (profile.impactScore || 0) + domainBoost) / 2).toFixed(2)
          ),
        };
      });

      res.json({
        campaign,
        recommendations,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/score/:userId', async (req, res, next) => {
  try {
    const profile = await prisma.influencerProfile.findUnique({
      where: { userId: req.params.userId },
      include: { user: { select: { name: true } } },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Influencer profile not found' });
    }

    const trustScore = profile.trustScore || computeInfluencerTrust(profile);
    const fraudSignals = detectFraudSignals(profile);
    const llmValidation = await validateTrustScore(
      { id: profile.userId, name: profile.user.name, domain: 'influencer', verified: profile.verified },
      trustScore,
      {
        engagement: profile.engagementRate || 0,
        authenticity: fraudSignals.length === 0 ? 0.9 : 0.4,
        consistency: (profile.impactScore || 0) / 100,
        pastImpact: (profile.impactScore || 0) / 100,
      }
    );

    res.json({
      trustScore,
      fraudSignals,
      llmValidation,
      profile,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
