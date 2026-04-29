import { apiFetch } from './api';
import { campaigns as dummyCampaigns } from '../constants/dummyData';
import { calculateImpactScore } from '../utils/impactScore';

const normalizeCampaign = (campaign) => ({
  ...campaign,
  location: campaign.location || campaign.area || 'TBD',
  description: campaign.description || 'No description yet.',
  fundingGoal: campaign.fundingGoal || 0,
  fundingRaised: campaign.fundingRaised || 0,
  volunteers: campaign.volunteers || campaign.plannedVolunteers || 0,
  impactScore: campaign.impactScore || calculateImpactScore(
    campaign.needScore || 7,
    campaign.trustScore || 7,
    campaign.expectedImpact || 7
  ),
  expectedImpact: campaign.impactScore || 7,
  needScore: campaign.needScore || 7,
  trustScore: campaign.trustScore || 7,
});

// Fallback dummy campaigns with impact scores
const fallbackCampaigns = dummyCampaigns.map(c => ({
  ...c,
  impactScore: calculateImpactScore(c.needScore, c.trustScore, c.expectedImpact),
}));

export const getCampaigns = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'All') {
        params.append(key, value);
      }
    });
    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await apiFetch(`/campaigns${query}`);
    const campaigns = (data.campaigns || []).map(normalizeCampaign);
    // If backend has no campaigns, use dummy data
    return campaigns.length > 0 ? campaigns : fallbackCampaigns;
  } catch (error) {
    console.log('Using fallback campaigns:', error.message);
    return fallbackCampaigns;
  }
};

export const getCampaignById = async (id) => {
  try {
    const campaign = await apiFetch(`/campaigns/${id}`);
    return normalizeCampaign(campaign);
  } catch (error) {
    // Try dummy data
    const dummy = fallbackCampaigns.find(c => c.id === id);
    if (dummy) return dummy;
    throw error;
  }
};

export const createCampaign = async (payload) => {
  const campaign = await apiFetch('/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeCampaign(campaign);
};

export const getDashboardSummary = async () => {
  try {
    return await apiFetch('/campaigns/dashboard/summary');
  } catch (error) {
    // Fallback: build summary from campaigns list
    const campaigns = await getCampaigns();
    const totalFunding = campaigns.reduce((s, c) => s + (c.fundingRaised || 0), 0);
    const totalVolunteers = campaigns.reduce((s, c) => s + (c.volunteers || 0), 0);
    const avgImpact = campaigns.length
      ? (campaigns.reduce((s, c) => s + parseFloat(c.impactScore || 0), 0) / campaigns.length).toFixed(1)
      : 0;
    const topCampaigns = [...campaigns]
      .sort((a, b) => parseFloat(b.impactScore) - parseFloat(a.impactScore))
      .slice(0, 3);

    return {
      stats: {
        totalCampaigns: campaigns.length,
        totalFunding,
        totalVolunteers,
        avgImpact,
      },
      topCampaigns,
      hotspots: [],
      googleServices: { mapsEnabled: false },
    };
  }
};

export const getJoinedCampaigns = async () => {
  try {
    const data = await apiFetch('/campaigns/mine/joined');
    return (data.campaigns || []).map(normalizeCampaign);
  } catch (error) {
    return [];
  }
};

export const getTopCampaigns = async () => {
  const data = await getDashboardSummary();
  return (data.topCampaigns || []).map(c => normalizeCampaign(c));
};

export const joinCampaign = async (id) => {
  try {
    return await apiFetch(`/campaigns/${id}/join`, { method: 'POST' });
  } catch (error) {
    console.log('Join campaign error:', error.message);
    return { success: true };
  }
};

export const leaveCampaign = async (id) => {
  try {
    return await apiFetch(`/campaigns/${id}/join`, { method: 'DELETE' });
  } catch (error) {
    return { success: true };
  }
};

export const submitCampaignProof = async (id, payload) => {
  return apiFetch(`/campaigns/${id}/proofs`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// Legacy sync exports for compatibility
export const getUserPoints = () => 0;
