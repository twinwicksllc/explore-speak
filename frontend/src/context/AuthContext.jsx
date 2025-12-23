import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedTokens = localStorage.getItem('tokens');
      
      if (storedUser && storedTokens) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Sign up new user
  const signup = async (email, password, name) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
        email,
        password,
        name,
      });

      if (response.data.success) {
        return { success: true, userId: response.data.userId };
      } else {
        throw new Error(response.data.error || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Confirm email with verification code
  const confirmEmail = async (email, code) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.CONFIRM}`, {
        email,
        code,
      });

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Confirmation failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Confirmation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Sign in user
  const signin = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.SIGNIN}`, {
        email,
        password,
      });

      if (response.data.success) {
        const { tokens, user: userData } = response.data;
        
        // Store tokens and user data
        localStorage.setItem('tokens', JSON.stringify(tokens));
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true, user: userData };
      } else {
        throw new Error(response.data.error || 'Sign in failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Sign out user
  const signout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Refresh access token
  const refreshToken = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem('tokens'));
      if (!tokens || !tokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
        refreshToken: tokens.refreshToken,
      });

      if (response.data.success) {
        const newTokens = {
          ...tokens,
          idToken: response.data.tokens.idToken,
          accessToken: response.data.tokens.accessToken,
        };
        
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        return newTokens;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (err) {
      // If refresh fails, sign out user
      signout();
      throw err;
    }
  };

  // Get current access token
  const getAccessToken = () => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      return JSON.parse(tokens).accessToken;
    }
    return null;
  };

  const value = {
    user,
    loading,
    error,
    signup,
    confirmEmail,
    signin,
    signout,
    refreshToken,
    getAccessToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
