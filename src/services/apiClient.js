// ─────────────────────────────────────────────────────────
// API Client
// CIPSS Frontend — HTTP client for backend calls
// ─────────────────────────────────────────────────────────

import API_BASE_URL from '../config/api';

// ── Token storage (in-memory for now) ────────────────────
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const clearAuthToken = () => {
  authToken = null;
};

// ── Core fetch wrapper ────────────────────────────────────
const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// ── Convenience methods ───────────────────────────────────
export const get = (endpoint) =>
  apiClient(endpoint, { method: 'GET' });

export const post = (endpoint, body) =>
  apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const put = (endpoint, body) =>
  apiClient(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const del = (endpoint) =>
  apiClient(endpoint, { method: 'DELETE' });

export default apiClient;
