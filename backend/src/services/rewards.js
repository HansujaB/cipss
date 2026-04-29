// ─────────────────────────────────────────────────────────
// Rewards and certificates service
// ─────────────────────────────────────────────────────────

const prisma = require('../lib/prisma');

async function grantReward({
  userId,
  campaignId = null,
  type,
  pointsDelta = 0,
  creditsDelta = 0,
  description = null,
  metadata = null,
}) {
  const [event] = await prisma.$transaction([
    prisma.rewardEvent.create({
      data: {
        userId,
        campaignId,
        type,
        pointsDelta,
        creditsDelta,
        description,
        metadata,
      },
    }),
    prisma.volunteerProfile.updateMany({
      where: { userId },
      data: {
        credits: { increment: creditsDelta },
      },
    }),
  ]);

  return event;
}

async function issueCertificate({
  userId,
  campaignId,
  title,
  description = null,
  certificateUrl = null,
  metadata = null,
}) {
  return prisma.$transaction(async (tx) => {
    const certificate = await tx.certificate.upsert({
      where: {
        userId_campaignId: {
          userId,
          campaignId,
        },
      },
      update: {
        title,
        description,
        certificateUrl,
        metadata,
      },
      create: {
        userId,
        campaignId,
        title,
        description,
        certificateUrl,
        metadata,
      },
    });

    await tx.volunteerProfile.updateMany({
      where: { userId },
      data: {
        certificates: { increment: 1 },
      },
    });

    return certificate;
  });
}

async function getUserRewardSummary(userId) {
  const [profile, events, certificates] = await Promise.all([
    prisma.volunteerProfile.findUnique({ where: { userId } }),
    prisma.rewardEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.certificate.findMany({
      where: { userId },
      include: {
        campaign: {
          select: { id: true, title: true, area: true },
        },
      },
      orderBy: { issuedAt: 'desc' },
    }),
  ]);

  const totalPoints = events.reduce((sum, event) => sum + event.pointsDelta, 0);

  return {
    credits: profile?.credits || 0,
    certificatesCount: profile?.certificates || 0,
    totalPoints,
    events,
    certificates,
  };
}

module.exports = {
  grantReward,
  issueCertificate,
  getUserRewardSummary,
};
