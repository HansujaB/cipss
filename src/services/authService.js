// authService.js
// Authentication API integration

import { API_BASE_URL } from './api';

/**
 * Register a new user
 * @param {object} userData - { email, password, name, role }
 * @returns {Promise<{user: object, token: string}>}
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Store token
    if (data.token) {
      await setAuthToken(data.token);
    }

    return data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }

    // Store token
    if (data.token) {
      await setAuthToken(data.token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Store auth token
 * @param {string} token
 */
export const setAuthToken = async (token) => {
  // In a real app, use AsyncStorage
  global.authToken = token;
};

/**
 * Get stored auth token
 * @returns {string|null}
 */
export const getAuthToken = async () => {
  // In a real app, use AsyncStorage
  return global.authToken || null;
};

/**
 * Clear auth token (logout)
 */
export const clearAuthToken = async () => {
  global.authToken = null;
};

/**
 * Get current user from token
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    // Decode JWT to get user info
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  await clearAuthToken();
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
  const token = await getAuthToken();
  return !!token;
};

/**
 * Check if user has required role
 * @param {object} user
 * @param {string|Array} requiredRoles
 * @returns {boolean}
 */
export const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }
  
  return user.role === requiredRoles;
};
