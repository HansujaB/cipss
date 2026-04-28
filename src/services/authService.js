// ─────────────────────────────────────────────────────────
// Auth Service
// CIPSS Frontend — Authentication API calls
// ─────────────────────────────────────────────────────────

import { post } from './apiClient';
import { setAuthToken, clearAuthToken } from './apiClient';

// ── Register ──────────────────────────────────────────────
export const register = async (name, email, password, role = 'volunteer') => {
  try {
    const data = await post('/auth/register', { name, email, password, role });
    if (data.token) {
      setAuthToken(data.token);
    }
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Login ─────────────────────────────────────────────────
export const login = async (email, password) => {
  try {
    const data = await post('/auth/login', { email, password });
    if (data.token) {
      setAuthToken(data.token);
    }
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ── Logout ────────────────────────────────────────────────
export const logout = () => {
  clearAuthToken();
  return { success: true };
};
