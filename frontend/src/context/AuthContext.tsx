import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { User, AuthTokens, AuthContextType, AuthResponse } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedTokens = localStorage.getItem('tokens');
        
        if (storedUser && storedTokens) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign up new user
  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
        email,
        password,
        name,
      });

      if (response.data.success && response.data.userId) {
        return { success: true, userId: response.data.userId };
      } else {
        throw new Error(response.data.error || 'Signup failed');
      }
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.error || err.message 
        : 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Confirm email with verification code
  const confirmEmail = useCallback(async (email: string, code: string) => {
    try {
      setError(null);
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}${API_ENDPOINTS.CONFIRM}`, {
        email,
        code,
      });

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Confirmation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof AxiosError
        ? err.response?.data?.error || err.message
        : 'Confirmation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Sign in user
  const signin = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}${API_ENDPOINTS.SIGNIN}`, {
        email,
        password,
      });

      if (response.data.success && response.data.tokens && response.data.user) {
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
      const errorMessage = err instanceof AxiosError
        ? err.response?.data?.error || err.message
        : 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Sign out user
  const signout = useCallback(() => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  // Refresh access token
  const refreshToken = useCallback(async (): Promise<AuthTokens> => {
    try {
      const tokensStr = localStorage.getItem('tokens');
      if (!tokensStr) {
        throw new Error('No refresh token available');
      }

      const tokens: AuthTokens = JSON.parse(tokensStr);
      if (!tokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<AuthResponse>(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
        refreshToken: tokens.refreshToken,
      });

      if (response.data.success && response.data.tokens) {
        const newTokens: AuthTokens = {
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
  }, [signout]);

  // Get current access token
  const getAccessToken = useCallback((): string | null => {
    try {
      const tokensStr = localStorage.getItem('tokens');
      if (tokensStr) {
        const tokens: AuthTokens = JSON.parse(tokensStr);
        return tokens.accessToken;
      }
    } catch (err) {
      console.error('Failed to get access token:', err);
    }
    return null;
  }, []);

  const value: AuthContextType = {
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
