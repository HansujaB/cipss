// authService.js
// Authentication API integration

import {
  setAuthToken as storeAuthToken,
  getAuthToken as readAuthToken,
  clearAuthToken as removeAuthToken,
  setCurrentUser as storeCurrentUser,
  getCurrentUser as readCurrentUser,
  clearCurrentUser,
} from './api';
import API_BASE_URL from '../config/api';

export const register = async (userData) => {
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

  if (data.token) {
    await storeAuthToken(data.token);
  }
  if (data.user) {
    storeCurrentUser(data.user);
  }

  return data;
};

export const login = async (email, password) => {
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

  if (data.token) {
    await storeAuthToken(data.token);
  }
  if (data.user) {
    storeCurrentUser(data.user);
  }

  return data;
};

export const setAuthToken = storeAuthToken;
export const getAuthToken = readAuthToken;

export const getCurrentUser = async () => readCurrentUser();

export const clearAuthState = async () => {
  await removeAuthToken();
  await clearCurrentUser();
};

export const logout = async () => {
  await clearAuthState();
};

export const isAuthenticated = async () => {
  const token = await readAuthToken();
  return !!token;
};

export const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) return false;

  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }

  return user.role === requiredRoles;
};
