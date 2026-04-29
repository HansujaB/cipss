// insightsService.js
// Hotspot detection, trends, and LLM insights from backend

import { apiFetch } from './api';

/**
 * Fetch hotspot grid cells for a given domain.
 * @param {object} params - { domain, lat, lng, radius, limit }
 * @returns {Promise<Array>}
 */
export const getHotspots = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.domain) query.append('domain', params.domain);
    if (params.lat) query.append('lat', params.lat);
    if (params.lng) query.append('lng', params.lng);
    if (params.radius) query.append('radius', params.radius);
    if (params.limit) query.append('limit', params.limit);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const data = await apiFetch(`/insights/hotspots${qs}`);
    return data.hotspots || data || [];
  } catch (error) {
    console.warn('[insightsService] getHotspots failed:', error.message);
    return [];
  }
};

/**
 * Fetch trend data with optional LLM narration.
 * @param {object} params - { domain, area, period }
 * @returns {Promise<object>}
 */
export const getTrends = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.domain) query.append('domain', params.domain);
    if (params.area) query.append('area', params.area);
    if (params.period) query.append('period', params.period);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await apiFetch(`/insights/trends${qs}`);
  } catch (error) {
    console.warn('[insightsService] getTrends failed:', error.message);
    return { trends: [], narration: null };
  }
};

/**
 * Fetch need score for a specific lat/lng + domain.
 * @param {object} params - { lat, lng, domain }
 * @returns {Promise<object>}
 */
export const getNeedScore = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.lat) query.append('lat', params.lat);
    if (params.lng) query.append('lng', params.lng);
    if (params.domain) query.append('domain', params.domain);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await apiFetch(`/insights/need-score${qs}`);
  } catch (error) {
    console.warn('[insightsService] getNeedScore failed:', error.message);
    return null;
  }
};
