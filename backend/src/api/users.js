// ─────────────────────────────────────────────────────────
// User routes — /api/v1/users
// ─────────────────────────────────────────────────────────

const { Router } = require('express');
const { body } = require('express-validator');
const prisma = require('../lib/prisma');
const { authMiddleware } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { getUserRewardSummary } = require('../services/rewards');

const router = Router();

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        volunteerProfile: true,
        influencerProfile: true,
        companyProfile: true,
        ngoProfile: true,
        participations: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const rewardSummary = await getUserRewardSummary(user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      volunteerProfile: user.volunteerProfile,
      influencerProfile: user.influencerProfile,
      companyProfile: user.companyProfile,
      ngoProfile: user.ngoProfile,
      campaignsJoined: user.participations.length,
      rewards: rewardSummary,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/me/rewards/daily', authMiddleware, async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const existing = await prisma.rewardEvent.findFirst({
      where: {
        userId: req.user.id,
        type: 'daily_bonus',
        createdAt: {
          gte: new Date(`${today}T00:00:00.000Z`),
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Daily bonus already claimed today' });
    }

    const event = await prisma.rewardEvent.create({
      data: {
        userId: req.user.id,
        type: 'daily_bonus',
        pointsDelta: 5,
        creditsDelta: 10,
        description: 'Daily volunteer bonus',
      },
    });

    await prisma.volunteerProfile.updateMany({
      where: { userId: req.user.id },
      data: { credits: { increment: 10 } },
    });

    const rewards = await getUserRewardSummary(req.user.id);

    res.status(201).json({ success: true, event, rewards });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/me/rewards/redeem',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('title required'),
    body('cost').isInt({ min: 1 }).withMessage('cost must be at least 1'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const profile = await prisma.volunteerProfile.findUnique({
        where: { userId: req.user.id },
      });

      if (!profile) {
        return res.status(404).json({ error: 'Volunteer profile not found' });
      }

      if (profile.credits < req.body.cost) {
        return res.status(400).json({ error: 'Not enough credits' });
      }

      const event = await prisma.$transaction(async (tx) => {
        await tx.volunteerProfile.update({
          where: { userId: req.user.id },
          data: { credits: { decrement: req.body.cost } },
        });

        return tx.rewardEvent.create({
          data: {
            userId: req.user.id,
            type: 'reward_redeemed',
            creditsDelta: -req.body.cost,
            description: req.body.title,
            metadata: {
              title: req.body.title,
            },
          },
        });
      });

      const rewards = await getUserRewardSummary(req.user.id);
      res.status(201).json({ success: true, event, rewards });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
