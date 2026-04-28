import { campaigns } from '../constants/dummyData';
import { calculateImpactScore } from '../utils/impactScore';

// 🔥 NEW: store joined campaigns locally
let joinedCampaignIds = [];
let userPoints = 0;
/**
 * Returns all campaigns with computed impactScore.
 */
export const getCampaigns = () => {
  return campaigns.map((campaign) => ({
    ...campaign,
    impactScore: calculateImpactScore(
      campaign.needScore,
      campaign.trustScore,
      campaign.expectedImpact
    ),
    joined: joinedCampaignIds.includes(campaign.id), // 🔥 NEW
  }));
};

/**
 * Returns a single campaign by ID with impactScore.
 */
export const getCampaignById = (id) => {
  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) return null;

  return {
    ...campaign,
    impactScore: calculateImpactScore(
      campaign.needScore,
      campaign.trustScore,
      campaign.expectedImpact
    ),
    joined: joinedCampaignIds.includes(id),
  };
};

/**
 * 🔥 NEW: Join campaign
 */
export const joinCampaign = (id) => {
  if (!joinedCampaignIds.includes(id)) {
    joinedCampaignIds.push(id);
    userPoints+=10;
  }
};

/**
 * 🔥 NEW: Leave campaign
 */
export const leaveCampaign = (id) => {
  joinedCampaignIds = joinedCampaignIds.filter((cid) => cid !== id);
};
export const getUserPoints = () => {
  return userPoints;
};

/**
 * 🔥 NEW: Get joined campaigns
 */
export const getJoinedCampaigns = () => {
  return getCampaigns().filter((c) => joinedCampaignIds.includes(c.id));
};

/**
 * Returns campaigns filtered by domain.
 */
export const getCampaignsByDomain = (domain) => {
  return getCampaigns().filter((c) => c.domain === domain);
};

/**
 * Returns campaigns sorted by impactScore descending.
 */
export const getTopCampaigns = (limit = 3) => {
  return getCampaigns()
    .sort((a, b) => parseFloat(b.impactScore) - parseFloat(a.impactScore))
    .slice(0, limit);
};