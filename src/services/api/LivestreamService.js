// src/services/api/LivestreamService.js
import apiClient from './config';

/**
 * Livestream Service
 * All endpoints for viewing and interacting with livestreams
 * Base path: /streams
 */
export const livestreamService = {
  // ============================================
  // BROWSE & JOIN STREAMS
  // ============================================

  /**
   * Get all live streams (for vertical scroll)
   * API: GET /streams/live
   * 
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * 
   * Returns array of live streams with:
   * - streamId, title, description
   * - hostId (astrologer info)
   * - viewerCount, totalViews
   * - streamType, entryFee
   * - agoraChannelName, agoraToken
   */
  getLiveStreams: async (params = {}) => {
    try {
      console.log('📡 Fetching live streams...', params);
      const response = await apiClient.get('/streams/live', { params });

      if (response.data.success) {
        console.log('✅ Live streams fetched:', response.data.data.streams.length, 'items');
        return {
          success: true,
          data: response.data.data.streams,
          pagination: response.data.data.pagination,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch streams');
    } catch (error) {
      console.error('❌ Get live streams error:', error);
      throw error;
    }
  },

  /**
   * Join a stream as viewer
   * API: POST /streams/:streamId/join
   * 
   * @param {string} streamId - Stream ID
   * 
   * Returns:
   * - Agora token for viewer
   * - Channel name
   * - Stream details
   */
  joinStream: async (streamId) => {
    try {
      console.log('📡 Joining stream:', streamId);
      const response = await apiClient.post(`/streams/${streamId}/join`);

      if (response.data.success) {
        console.log('✅ Joined stream:', response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to join stream');
    } catch (error) {
      console.error('❌ Join stream error:', error);
      throw error;
    }
  },

  /**
   * Leave a stream
   * API: POST /streams/:streamId/leave
   * 
   * @param {string} streamId - Stream ID
   */
  leaveStream: async (streamId) => {
    try {
      console.log('📡 Leaving stream:', streamId);
      const response = await apiClient.post(`/streams/${streamId}/leave`);

      if (response.data.success) {
        console.log('✅ Left stream');
        return {
          success: true,
          message: response.data.message,
        };
      }

      throw new Error(response.data.message || 'Failed to leave stream');
    } catch (error) {
      console.error('❌ Leave stream error:', error);
      throw error;
    }
  },

  // ============================================
  // INTERACTIONS
  // ============================================

  /**
   * Send a gift to host
   * API: POST /streams/:streamId/gifts
   * 
   * @param {string} streamId - Stream ID
   * @param {Object} giftData - Gift details
   * @param {string} giftData.giftType - Gift type (e.g., 'rose', 'heart', 'diamond')
   * @param {number} giftData.amount - Gift amount in rupees
   * 
   * Example:
   * {
   *   giftType: 'rose',
   *   amount: 50
   * }
   */
  sendGift: async (streamId, giftData) => {
    try {
      console.log('📡 Sending gift:', streamId, giftData);
      const response = await apiClient.post(`/streams/${streamId}/gifts`, giftData);

      if (response.data.success) {
        console.log('✅ Gift sent');
        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to send gift');
    } catch (error) {
      console.error('❌ Send gift error:', error);
      throw error;
    }
  },

  /**
   * Request a call (voice/video)
   * API: POST /streams/:streamId/call-requests
   * 
   * @param {string} streamId - Stream ID
   * @param {Object} callData - Call request details
   * @param {string} callData.callType - 'voice' | 'video'
   * @param {string} callData.callMode - 'public' | 'private'
   * 
   * Example:
   * {
   *   callType: 'video',
   *   callMode: 'public'
   * }
   */
  requestCall: async (streamId, callData) => {
    try {
      console.log('📡 Requesting call:', streamId, callData);
      const response = await apiClient.post(`/streams/${streamId}/call/request`, callData);

      if (response.data.success) {
        console.log('✅ Call requested');
        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to request call');
    } catch (error) {
      console.error('❌ Request call error:', error);
      throw error;
    }
  },

  /**
   * Follow/unfollow host
   * API: POST /streams/:streamId/follow
   * 
   * @param {string} streamId - Stream ID
   */
  toggleFollow: async (streamId) => {
    try {
      console.log('📡 Toggling follow:', streamId);
      const response = await apiClient.post(`/streams/${streamId}/follow`);

      if (response.data.success) {
        console.log('✅ Follow toggled');
        return {
          success: true,
          message: response.data.message,
          isFollowing: response.data.data.isFollowing,
        };
      }

      throw new Error(response.data.message || 'Failed to toggle follow');
    } catch (error) {
      console.error('❌ Toggle follow error:', error);
      throw error;
    }
  },

  // ============================================
  // STREAM DETAILS
  // ============================================

  /**
   * Get stream details
   * API: GET /streams/:streamId
   * 
   * @param {string} streamId - Stream ID
   * 
   * Returns complete stream info including:
   * - Host details
   * - Call settings
   * - Viewer count
   * - Current state
   */
  getStreamDetails: async (streamId) => {
    try {
      console.log('📡 Fetching stream details:', streamId);
      const response = await apiClient.get(`/streams/${streamId}`);

      if (response.data.success) {
        console.log('✅ Stream details fetched');
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch stream details');
    } catch (error) {
      console.error('❌ Get stream details error:', error);
      throw error;
    }
  },
};

export default livestreamService;
