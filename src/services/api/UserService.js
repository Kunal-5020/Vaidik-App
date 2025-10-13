// src/services/api/UserService.js
import apiClient from './config';

/**
 * User Service
 * All endpoints require authentication (Bearer token in headers)
 * Base path: /users
 */
export const userService = {
  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Get current user profile
   * API: GET /users/profile
   * 
   * Returns complete user profile with all fields:
   * - Personal info (name, gender, dateOfBirth, etc.)
   * - Address info (city, state, country, pincode)
   * - Profile image
   * - Wallet details
   * - Stats
   * - Preferences
   */
  getProfile: async () => {
    try {
      console.log('📡 Fetching user profile...');
      const response = await apiClient.get('/users/profile');

      if (response.data.success) {
        console.log('✅ Profile fetched:', response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * API: PATCH /users/profile
   * 
   * Supported fields:
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.name - User's full name (2-100 chars)
   * @param {string} profileData.gender - 'male' | 'female' | 'other'
   * @param {string} profileData.dateOfBirth - Date in YYYY-MM-DD format
   * @param {string} profileData.timeOfBirth - Time in HH:MM format (24-hour)
   * @param {string} profileData.placeOfBirth - Birth place (max 200 chars)
   * @param {string} profileData.currentAddress - Current address (max 300 chars)
   * @param {string} profileData.city - City name (max 100 chars)
   * @param {string} profileData.state - State name (max 100 chars)
   * @param {string} profileData.country - Country name (max 100 chars)
   * @param {string} profileData.pincode - 6-digit pincode
   * @param {string} profileData.profileImage - Profile image URL
   * @param {string} profileData.profileImageS3Key - S3 key for image
   * @param {string} profileData.profileImageStorageType - 'local' | 's3'
   * 
   * Example:
   * {
   *   name: "John Doe",
   *   gender: "male",
   *   dateOfBirth: "1990-05-15",
   *   timeOfBirth: "14:30",
   *   placeOfBirth: "Mumbai, Maharashtra",
   *   city: "Mumbai",
   *   state: "Maharashtra",
   *   country: "India",
   *   pincode: "400001"
   * }
   */
  updateProfile: async (profileData) => {
    try {
      console.log('📡 Updating user profile...', profileData);
      const response = await apiClient.patch('/users/profile', profileData);

      if (response.data.success) {
        console.log('✅ Profile updated:', response.data.data);
        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  },

  // ============================================
  // PREFERENCES MANAGEMENT
  // ============================================

  /**
   * Get user preferences
   * API: GET /users/preferences
   * 
   * Returns:
   * {
   *   appLanguage: 'en' | 'hi' | 'ta' | etc.,
   *   notifications: { liveEvents: boolean, normal: boolean },
   *   privacy: { nameVisibleInReviews: boolean, restrictions: {...} }
   * }
   */
  getPreferences: async () => {
    try {
      console.log('📡 Fetching user preferences...');
      const response = await apiClient.get('/users/preferences');

      if (response.data.success) {
        console.log('✅ Preferences fetched:', response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch preferences');
    } catch (error) {
      console.error('❌ Get preferences error:', error);
      throw error;
    }
  },

  /**
   * Update user preferences
   * API: PATCH /users/preferences
   * 
   * @param {Object} preferences - Preferences to update
   * @param {string} preferences.appLanguage - Language code: 'en', 'hi', 'ta', etc.
   * @param {boolean} preferences.liveEventsNotification - Enable live events notifications
   * @param {boolean} preferences.normalNotification - Enable normal notifications
   * @param {boolean} preferences.nameVisibleInReviews - Show name in reviews
   * @param {boolean} preferences.astrologerChatAccessAfterEnd - Allow chat access after session
   * @param {boolean} preferences.downloadSharedImages - Allow image downloads
   * @param {boolean} preferences.restrictChatScreenshots - Restrict screenshots
   * @param {boolean} preferences.accessCallRecording - Allow call recording access
   * 
   * Example:
   * {
   *   appLanguage: 'hi',
   *   liveEventsNotification: true,
   *   normalNotification: true,
   *   nameVisibleInReviews: false
   * }
   */
  updatePreferences: async (preferences) => {
    try {
      console.log('📡 Updating user preferences...', preferences);
      const response = await apiClient.patch('/users/preferences', preferences);

      if (response.data.success) {
        console.log('✅ Preferences updated:', response.data.data);
        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to update preferences');
    } catch (error) {
      console.error('❌ Update preferences error:', error);
      throw error;
    }
  },

  // ============================================
  // WALLET MANAGEMENT
  // ============================================

  /**
   * Get wallet details
   * API: GET /users/wallet
   * 
   * Returns:
   * {
   *   balance: 500.00,
   *   totalRecharged: 2000.00,
   *   totalSpent: 1500.00,
   *   currency: 'INR',
   *   lastTransactionAt: "2025-10-09T10:30:00.000Z",
   *   lastRechargeAt: "2025-10-07T10:30:00.000Z"
   * }
   */
  getWallet: async () => {
    try {
      console.log('📡 Fetching wallet details...');
      const response = await apiClient.get('/users/wallet');

      if (response.data.success) {
        console.log('✅ Wallet fetched:', response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch wallet');
    } catch (error) {
      console.error('❌ Get wallet error:', error);
      throw error;
    }
  },

  // ============================================
  // FAVORITES MANAGEMENT
  // ============================================

  /**
   * Get favorite astrologers
   * API: GET /users/favorites
   * 
   * Returns array of favorite astrologers with details
   */
  getFavorites: async () => {
    try {
      console.log('📡 Fetching favorite astrologers...');
      const response = await apiClient.get('/users/favorites');

      if (response.data.success) {
        console.log('✅ Favorites fetched:', response.data.data.length, 'items');
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch favorites');
    } catch (error) {
      console.error('❌ Get favorites error:', error);
      throw error;
    }
  },

  /**
   * Add astrologer to favorites
   * API: POST /users/favorites/:astrologerId
   * 
   * @param {string} astrologerId - Astrologer ID
   */
  addFavorite: async (astrologerId) => {
    try {
      console.log('📡 Adding to favorites:', astrologerId);
      const response = await apiClient.post(`/users/favorites/${astrologerId}`);

      if (response.data.success) {
        console.log('✅ Added to favorites');
        return {
          success: true,
          message: response.data.message,
        };
      }

      throw new Error(response.data.message || 'Failed to add favorite');
    } catch (error) {
      console.error('❌ Add favorite error:', error);
      throw error;
    }
  },

  /**
   * Remove astrologer from favorites
   * API: DELETE /users/favorites/:astrologerId
   * 
   * @param {string} astrologerId - Astrologer ID
   */
  removeFavorite: async (astrologerId) => {
    try {
      console.log('📡 Removing from favorites:', astrologerId);
      const response = await apiClient.delete(`/users/favorites/${astrologerId}`);

      if (response.data.success) {
        console.log('✅ Removed from favorites');
        return {
          success: true,
          message: response.data.message,
        };
      }

      throw new Error(response.data.message || 'Failed to remove favorite');
    } catch (error) {
      console.error('❌ Remove favorite error:', error);
      throw error;
    }
  },

  // ============================================
  // STATISTICS
  // ============================================

  /**
   * Get user statistics
   * API: GET /users/statistics
   * 
   * Returns:
   * {
   *   wallet: { balance, totalRecharged, totalSpent, ... },
   *   stats: { totalSessions, totalMinutesSpent, totalAmount, totalRatings }
   * }
   */
  getStatistics: async () => {
    try {
      console.log('📡 Fetching user statistics...');
      const response = await apiClient.get('/users/statistics');

      if (response.data.success) {
        console.log('✅ Statistics fetched:', response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch statistics');
    } catch (error) {
      console.error('❌ Get statistics error:', error);
      throw error;
    }
  },

  // ============================================
  // ACCOUNT MANAGEMENT
  // ============================================

  /**
   * Delete user account (soft delete)
   * API: DELETE /users/account
   * 
   * Sets user status to 'deleted'
   */
  deleteAccount: async () => {
    try {
      console.log('📡 Deleting user account...');
      const response = await apiClient.delete('/users/account');

      if (response.data.success) {
        console.log('✅ Account deleted');
        return {
          success: true,
          message: response.data.message,
        };
      }

      throw new Error(response.data.message || 'Failed to delete account');
    } catch (error) {
      console.error('❌ Delete account error:', error);
      throw error;
    }
  },

  // ============================================
  // DEVICE TOKEN MANAGEMENT (FCM)
  // ============================================

  /**
   * Register device token for push notifications
   * API: POST /device-tokens
   * 
   * @param {string} fcmToken - Firebase Cloud Messaging device token
   * @param {string} deviceId - Optional device ID
   * 
   * Example:
   * {
   *   token: "firebase_device_token_xyz",
   *   deviceId: "device_uuid_123"
   * }
   */
  registerDeviceToken: async (fcmToken, deviceId) => {
    try {
      console.log('📡 Registering device token...');
      const response = await apiClient.post('/device-tokens', {
        token: fcmToken,
        deviceId: deviceId,
      });

      if (response.data.success) {
        console.log('✅ Device token registered');
        return {
          success: true,
          message: response.data.message,
        };
      }

      throw new Error(response.data.message || 'Failed to register device token');
    } catch (error) {
      console.error('❌ Register device token error:', error);
      throw error;
    }
  },

  /**
   * Remove device token
   * API: DELETE /device-tokens
   * 
   * @param {string} fcmToken - Firebase Cloud Messaging device token
   */
  removeDeviceToken: async (fcmToken) => {
    try {
      console.log('📡 Removing device token...');
      const response = await apiClient.delete('/device-tokens', {
        data: { token: fcmToken },
      });

      if (response.data.success) {
        console.log('✅ Device token removed');
        return {
          success: true,
          message: response.data.message,
        };
      }

      throw new Error(response.data.message || 'Failed to remove device token');
    } catch (error) {
      console.error('❌ Remove device token error:', error);
      throw error;
    }
  },
};

export default userService;
