import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import { SUPPORTED_LANGUAGES } from '../constants/languages';

export { SUPPORTED_LANGUAGES };

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine current user via profile endpoint
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      if (response && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen to unauthorized event from API interceptor
    const handleUnauthorized = () => {
      localStorage.removeItem('fmch_token');
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('fmch:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('fmch:unauthorized', handleUnauthorized);
    };
  }, [refreshUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (data?.token) {
        localStorage.setItem('fmch_token', data.token);
      }
      if (data?.user) {
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      }
      await refreshUser();
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.errors?.email ||
        err.response?.data?.errors?.password ||
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.signup(userData);
      if (data?.token) {
        localStorage.setItem('fmch_token', data.token);
      }
      if (data?.user) {
        setUser(data.user);
        setLoading(false);
        return { success: true, user: data.user };
      }
      await refreshUser();
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errs = err.response?.data?.errors;
      let errorMsg = err.response?.data?.message || 'Registration failed';
      if (errs) {
        const fieldErrors = Object.values(errs).filter(Boolean);
        if (fieldErrors.length > 0) {
          errorMsg = fieldErrors.join(', ');
        }
      }
      throw new Error(errorMsg);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('fmch_token');
      setUser(null);
      setLoading(false);
    }
  };

  const updateLanguagePreference = async (langCode) => {
    if (!user || !user.id) return;
    try {
      const res = await userService.updateLanguage(user.id, langCode);
      if (res && res.data) {
        setUser(res.data);
      } else {
        setUser((prev) => (prev ? { ...prev, preferredLanguage: langCode } : null));
      }
    } catch (err) {
      console.error('Failed to update language preference:', err);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshUser,
    updateLanguagePreference,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

