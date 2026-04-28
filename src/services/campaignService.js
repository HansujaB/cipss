// ─────────────────────────────────────────────────────────
// Campaign Service
// CIPSS Frontend — Live backend API calls
// ─────────────────────────────────────────────────────────

import { get, post } from './apiClient';
import { campaigns as dummyData } from '../constants/dummyData';

// ── Fallback to dummy data if API fails ───────────────────
const withFallback = async (apiFn, fallbackFn) => {
  try {
    return await apiFn();
  } catch (error) {
    console.warn('API unavailable, using local data:', error.message);
    return fallbackFn();
  }
};

// ── Get all campaigns ─────────────────────────────────────
export const getCampaigns = async () => {
  return withFallback(
    async () => {
      const data = await get('/campaigns');
      return data.campaigns || data;
    },
    () => dummyData
  );
};

// ── Get campaign by ID ────────────────────────────────────
export const getCampaignById = async (id) => {
  return withFallback(
    async () => {
      const data = await get(`/campaigns/${id}`);
      return data.campaign || data;
    },
    () => dummyData.find((c) => c.id === id) || null
  );
};

// ── Get recommended campaigns ─────────────────────────────
export const getTopCampaigns = async (limit = 3) => {
  return withFallback(
    async () => {
      const data = await get('/campaigns/recommended');
      const campaigns = data.campaigns || data;
      return campaigns.slice(0, limit);
    },
    () => [...dummyData].slice(0, limit)
  );
};

// ── Get campaigns by domain ───────────────────────────────
export const getCampaignsByDomain = async (domain) => {
  return withFallback(
    async () => {
      const data = await get(`/campaigns?domain=${domain}`);
      return data.campaigns || data;
    },
    () => dummyData.filter((c) => c.domain === domain)
  );
};

// ── Join a campaign ───────────────────────────────────────
export const joinCampaign = async (id) => {
  try {
    await post(`/campaigns/${id}/join`, {});
    return true;
  } catch {
    return false;
  }
};

// ── Leave a campaign ──────────────────────────────────────
export const leaveCampaign = async (id) => {
  try {
    await post(`/campaigns/${id}/leave`, {});
    return true;
  } catch {
    return false;
  }
};

// ── Get impact scores ─────────────────────────────────────
export const getCampaignScores = async (campaignId) => {
  return withFallback(
    async () => {
      const data = await get(`/score/impact?campaignId=${campaignId}`);
      return data;
    },
    () => null
  );
};
