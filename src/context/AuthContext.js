// AuthContext.js
// Global authentication state management

import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser,
  isAuthenticated,
  hasRole,
} from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await loginApi(email, password);
      
      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await registerApi(userData);
      
      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      setIsLoggedIn(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const checkRole = (requiredRoles) => {
    return hasRole(user, requiredRoles);
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    register,
    logout,
    checkRole,
    isAdmin: () => checkRole('admin'),
    isNGO: () => checkRole('ngo_admin'),
    isCompany: () => checkRole('company'),
    isVolunteer: () => checkRole('volunteer'),
    isInfluencer: () => checkRole('influencer'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
