// ─────────────────────────────────────────────────────────
// Payments Routes — /api/v1/payments
// Development-friendly funding ledger for campaigns
// ─────────────────────────────────────────────────────────

const { Router } = require('express');
const { body, param } = require('express-validator');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { handleValidationErrors } = require('../middleware/validate');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = Router();
const PLATFORM_FEE_RATE = 0.05;

function buildFundingSummary(transactions) {
  const succeeded = transactions.filter((transaction) => transaction.status === 'succeeded');
  const totals = succeeded.reduce(
    (acc, transaction) => {
      acc.raised += transaction.amount;
      acc.platformFees += transaction.platformFee;
      acc.netAmount += transaction.netAmount;
      return acc;
    },
    { raised: 0, platformFees: 0, netAmount: 0 }
  );

  return {
    totalRaised: parseFloat(totals.raised.toFixed(2)),
    platformFees: parseFloat(totals.platformFees.toFixed(2)),
    netAmount: parseFloat(totals.netAmount.toFixed(2)),
    totalDonors: succeeded.length,
  };
}

function hasRazorpayConfig() {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

router.post(
  '/create-order',
  [
    body('campaign_id').isUUID().withMessage('Valid campaign_id required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
    body('donor_name').optional().isString(),
    body('donor_email').optional().isEmail().withMessage('donor_email must be valid'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { campaign_id, amount, donor_name, donor_email } = req.body;

      const campaign = await prisma.campaign.findUnique({ where: { id: campaign_id } });
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const parsedAmount = parseFloat(amount);
      const platformFee = parseFloat((parsedAmount * PLATFORM_FEE_RATE).toFixed(2));
      const netAmount = parseFloat((parsedAmount - platformFee).toFixed(2));

      const transaction = await prisma.fundingTransaction.create({
        data: {
          campaignId: campaign_id,
          userId: req.user?.id || null,
          amount: parsedAmount,
          platformFee,
          netAmount,
          donorName: donor_name || req.user?.name || 'Anonymous',
          donorEmail: donor_email || req.user?.email || null,
          paymentProvider: hasRazorpayConfig() ? 'razorpay' : 'mock',
          providerOrderId: `order_${Date.now()}`,
          receipt: `rcpt_${Date.now()}`,
        },
      });

      if (hasRazorpayConfig()) {
        const authHeader = Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString('base64');

        const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(parsedAmount * 100),
            currency: 'INR',
            receipt: transaction.receipt,
            payment_capture: 1,
            notes: {
              campaignId: campaign.id,
              transactionId: transaction.id,
            },
          }),
        });

        const order = await orderResponse.json();
        if (!orderResponse.ok) {
          throw new Error(order.error?.description || 'Failed to create Razorpay order');
        }

        const updated = await prisma.fundingTransaction.update({
          where: { id: transaction.id },
          data: {
            providerOrderId: order.id,
          },
        });

        return res.status(201).json({
          development: false,
          order,
          transaction: updated,
          razorpay_key: process.env.RAZORPAY_KEY_ID,
        });
      }

      res.status(201).json({
        development: true,
        order: {
          id: transaction.providerOrderId,
          amount: Math.round(parsedAmount * 100),
          currency: 'INR',
        },
        transaction,
        razorpay_key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/mock-verify/:transactionId',
  authMiddleware,
  [param('transactionId').isUUID().withMessage('Valid transactionId required'), handleValidationErrors],
  async (req, res, next) => {
    try {
      const transaction = await prisma.fundingTransaction.findUnique({
        where: { id: req.params.transactionId },
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      const updated = await prisma.fundingTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'succeeded',
          providerPaymentId: `payment_${Date.now()}`,
        },
      });

      res.json({ success: true, transaction: updated });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/verify',
  authMiddleware,
  [
    body('razorpay_order_id').notEmpty().withMessage('razorpay_order_id required'),
    body('razorpay_payment_id').notEmpty().withMessage('razorpay_payment_id required'),
    body('razorpay_signature').notEmpty().withMessage('razorpay_signature required'),
    handleValidationErrors,
  ],
  async (req, res, next) => {
    try {
      const { razorpay_order_id, razorpay_payment_id } = req.body;

      const transaction = await prisma.fundingTransaction.findFirst({
        where: { providerOrderId: razorpay_order_id },
      });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found for order' });
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (hasRazorpayConfig() && expectedSignature !== req.body.razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      const updated = await prisma.fundingTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'succeeded',
          providerPaymentId: razorpay_payment_id,
        },
      });

      res.json({ success: true, transaction: updated });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/campaign/:campaignId', async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.campaignId },
      include: {
        funding: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            amount: true,
            donorName: true,
            donorEmail: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const summary = buildFundingSummary(campaign.funding);

    res.json({
      campaign: {
        id: campaign.id,
        title: campaign.title,
        fundingGoal: campaign.fundingGoal,
      },
      donors: campaign.funding.filter((transaction) => transaction.status === 'succeeded'),
      ...summary,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/transactions', authMiddleware, async (req, res, next) => {
  try {
    const transactions = await prisma.fundingTransaction.findMany({
      where: { userId: req.user.id },
      include: {
        campaign: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ transactions });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', authMiddleware, requireRole('company', 'ngo_admin'), async (_req, res, next) => {
  try {
    const transactions = await prisma.fundingTransaction.findMany({
      where: { status: 'succeeded' },
    });

    res.json(buildFundingSummary(transactions));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
