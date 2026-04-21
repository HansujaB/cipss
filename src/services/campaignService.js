import { campaigns } from '../constants/dummyData';
import { calculateImpactScore } from '../utils/impactScore';

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
  }));
};

/**
 * Returns a single campaign by ID with impactScore.
 * @param {string} id
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
  };
};

/**
 * Returns campaigns filtered by domain.
 * @param {string} domain
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