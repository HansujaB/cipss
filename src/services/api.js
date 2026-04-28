// api.js
// Base API configuration

// Update this to match your backend URL
export const API_BASE_URL = 'http://localhost:3000/api/v1';

// In production, use environment variable
// export const API_BASE_URL = process.env.API_URL || 'https://your-api.com/api/v1';

let authToken = null;

/**
 * Set the authentication token
 * @param {string} token
 */
export const setAuthToken = (token) => {
  authToken = token;
};

/**
 * Get the current authentication token
 * @returns {string|null}
 */
export const getAuthToken = async () => {
  // In a real app, you might fetch this from AsyncStorage
  // For now, return the in-memory token
  return authToken;
};

/**
 * Clear the authentication token
 */
export const clearAuthToken = () => {
  authToken = null;
};

/**
 * Generic API fetch wrapper
 * @param {string} endpoint
 * @param {object} options
 * @returns {Promise<any>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.status}`);
  }

  return data;
};
