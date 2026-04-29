// api.js
// Base API configuration

import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config/api';

const AUTH_TOKEN_KEY = 'cipss_token';
const CURRENT_USER_KEY = 'cipss_user';

let authToken = null;
let currentUser = null;

/**
 * Set the authentication token
 * @param {string} token
 */
export const setAuthToken = (token) => {
  authToken = token;
  global.authToken = token;
  return AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Get the current authentication token
 * @returns {string|null}
 */
export const getAuthToken = async () => {
  if (authToken || global.authToken) {
    return authToken || global.authToken || null;
  }

  const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  authToken = storedToken;
  global.authToken = storedToken;
  return storedToken;
};

/**
 * Clear the authentication token
 */
export const clearAuthToken = () => {
  authToken = null;
  global.authToken = null;
  return AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};

export const setCurrentUser = (user) => {
  currentUser = user;
  global.currentUser = user;
  return AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = async () => {
  if (currentUser || global.currentUser) {
    return currentUser || global.currentUser || null;
  }

  const storedUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
  if (!storedUser) {
    return null;
  }

  const parsedUser = JSON.parse(storedUser);
  currentUser = parsedUser;
  global.currentUser = parsedUser;
  return parsedUser;
};

export const clearCurrentUser = () => {
  currentUser = null;
  global.currentUser = null;
  return AsyncStorage.removeItem(CURRENT_USER_KEY);
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
