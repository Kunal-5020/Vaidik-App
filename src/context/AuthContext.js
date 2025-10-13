// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '../services/api/UserService';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authStatus = await AuthService.checkAuthStatus();
      setIsAuthenticated(authStatus.isAuthenticated);
      if (authStatus.user) {
        setUser(authStatus.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    if (!isAuthenticated) {
      console.log('⚠️ User not authenticated, cannot fetch profile');
      return null;
    }

    try {
      setLoading(true);
      console.log('📡 Fetching user profile...');

      const response = await userService.getProfile();

      if (response.success && response.data) {
        console.log('✅ User profile fetched:', response.data);
        setUser(response.data);

        // Update AsyncStorage
        await AuthService.storeUser(response.data);

        return response.data;
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('❌ Fetch profile error:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send OTP
   * @param {string} phoneNumber - Phone number WITHOUT country code (e.g., "9876543210")
   * @param {string} countryCode - Country code (default: "+91")
   */
  const sendOtp = async (phoneNumber, countryCode = '+91') => {
    try {
      setLoading(true);
      setError(null);
      const result = await AuthService.sendOtp(phoneNumber, countryCode);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP
   * @param {string} phoneNumber - Phone number WITHOUT country code
   * @param {string} countryCode - Country code (default: "+91")
   * @param {string} otp - 6-digit OTP
   */
  const verifyOtp = async (phoneNumber, countryCode = '+91', otp) => {
    try {
      setLoading(true);
      setError(null);
      const result = await AuthService.verifyOtp(phoneNumber, countryCode, otp);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
      }

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithTruecaller = async (truecallerData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await AuthService.verifyTruecaller(truecallerData);
      console.log('📥 Truecaller login response:', result);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
      }

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearError = () => setError(null);

  const refreshUser = async () => {
    await fetchUserProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        sendOtp,
        verifyOtp,
        loginWithTruecaller,
        logout,
        checkAuthStatus,
        fetchUserProfile,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
