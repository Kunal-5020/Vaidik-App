// src/services/api/astrologerService.js
import apiClient from './config';

/**
 * Astrologer Service
 * Endpoints for browsing, searching, and viewing astrologer details
 * Most endpoints are public (no authentication required)
 * Base path: /astrologers
 */
export const astrologerService = {
  /**
   * Get all astrologers with filtering and sorting
   * API: GET /astrologers?page=1&limit=20&sortBy=rating&specialization=vedic
   * 
   * @param {Object} params - Filter and pagination parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @param {string} params.sortBy - Sort by: 'rating' | 'experience' | 'price' (optional)
   * @param {string} params.specialization - Filter by specialization: 'vedic' | 'tarot' | 'numerology' (optional)
   * @param {string} params.language - Filter by language: 'hindi' | 'english' (optional)
   * @param {string} params.availability - Filter by status: 'online' | 'busy' | 'offline' (optional)
   * @param {string} params.q - Search query for name search (optional)
   * 
   * Returns:
   * {
   *   astrologers: [...],
   *   pagination: { page, limit, total, pages }
   * }
   * 
   * Example:
   * getAstrologers({ 
   *   page: 1, 
   *   limit: 20, 
   *   sortBy: 'rating', 
   *   specialization: 'vedic',
   *   availability: 'online'
   * })
   */
  getAstrologers: async (params = {}) => {
    try {
      console.log('📡 Fetching astrologers with params:', params);

      // Default params
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 20,
        ...params, // Spread any additional params (sortBy, specialization, etc.)
      };

      const response = await apiClient.get('/astrologers', {
        params: queryParams,
      });

      if (response.data.success) {
        console.log(
          '✅ Astrologers fetched:',
          response.data.data.astrologers.length,
          'items'
        );
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch astrologers');
    } catch (error) {
      console.error('❌ Get astrologers error:', error);
      throw error;
    }
  },

  /**
   * Search astrologers by name
   * Uses the same endpoint as getAstrologers but with 'q' query parameter
   * API: GET /astrologers?q=ram&page=1&limit=20
   * 
   * @param {string} query - Search query (astrologer name)
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * 
   * Example:
   * searchAstrologers('ram kumar', 1, 20)
   */
  searchAstrologers: async (query, page = 1, limit = 20) => {
    try {
      console.log('🔍 Searching astrologers:', query);

      if (!query || query.trim() === '') {
        console.warn('⚠️ Empty search query');
        return {
          success: true,
          data: {
            astrologers: [],
            pagination: { page: 1, limit: 20, total: 0, pages: 0 },
          },
        };
      }

      const response = await apiClient.get('/astrologers', {
        params: {
          q: query.trim(),
          page,
          limit,
        },
      });

      if (response.data.success) {
        console.log(
          '✅ Search results:',
          response.data.data.astrologers.length,
          'items'
        );
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Search failed');
    } catch (error) {
      console.error('❌ Search astrologers error:', error);
      throw error;
    }
  },

  /**
   * Get single astrologer details
   * API: GET /astrologers/:id
   * 
   * Returns complete astrologer profile including:
   * - Basic info (name, bio, experience, etc.)
   * - Pricing (chat, call, videoCall)
   * - Ratings & stats
   * - Availability status
   * - Recent reviews (embedded in response)
   * 
   * @param {string} astrologerId - Astrologer ID
   * 
   * Example:
   * getAstrologerDetails('64f5a1b2c3d4e5f6g7h8i9j0')
   */
  getAstrologerDetails: async (astrologerId) => {
    try {
      if (!astrologerId) {
        throw new Error('Astrologer ID is required');
      }

      console.log('📡 Fetching astrologer details:', astrologerId);

      const response = await apiClient.get(`/astrologers/${astrologerId}`);

      if (response.data.success) {
        console.log('✅ Astrologer details fetched:', response.data.data.name);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch astrologer details');
    } catch (error) {
      console.error('❌ Get astrologer details error:', error);
      throw error;
    }
  },

  /**
   * Register as astrologer (Onboarding)
   * API: POST /astrologers/register
   * 
   * Note: This is a multipart/form-data request for file uploads
   * Use FormData to send profile picture and documents
   * 
   * @param {Object} astrologerData - Astrologer registration data
   * @param {File} profilePicture - Profile picture file
   * @param {Array<File>} documents - Verification documents (certificates, ID proof, etc.)
   * 
   * Example:
   * const formData = new FormData();
   * formData.append('name', 'Pandit Ram Kumar');
   * formData.append('email', 'ram@example.com');
   * formData.append('phoneNumber', '+919876543210');
   * formData.append('experienceYears', '15');
   * formData.append('specializations', JSON.stringify(['Vedic', 'KP System']));
   * formData.append('languages', JSON.stringify(['Hindi', 'English']));
   * formData.append('pricing', JSON.stringify({ chat: 20, call: 30, videoCall: 50 }));
   * formData.append('profilePicture', profilePictureFile);
   * formData.append('documents', documentFile1);
   * formData.append('documents', documentFile2);
   * 
   * registerAsAstrologer(formData)
   */
  registerAsAstrologer: async (formData) => {
    try {
      console.log('📡 Registering as astrologer...');

      const response = await apiClient.post('/astrologers/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log('✅ Astrologer registration submitted');
        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.error('❌ Register astrologer error:', error);
      throw error;
    }
  },

  /**
   * Get filtered astrologers by specialization
   * Convenience method for filtering by specialization
   * 
   * @param {string} specialization - Specialization type
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getAstrologersBySpecialization: async (specialization, page = 1, limit = 20) => {
    try {
      return await astrologerService.getAstrologers({
        specialization,
        page,
        limit,
      });
    } catch (error) {
      console.error('❌ Get astrologers by specialization error:', error);
      throw error;
    }
  },

  /**
   * Get online astrologers only
   * Convenience method for filtering online astrologers
   * 
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getOnlineAstrologers: async (page = 1, limit = 20) => {
    try {
      return await astrologerService.getAstrologers({
        availability: 'online',
        page,
        limit,
      });
    } catch (error) {
      console.error('❌ Get online astrologers error:', error);
      throw error;
    }
  },

  /**
   * Get top-rated astrologers
   * Convenience method for sorting by rating
   * 
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getTopRatedAstrologers: async (page = 1, limit = 20) => {
    try {
      return await astrologerService.getAstrologers({
        sortBy: 'rating',
        page,
        limit,
      });
    } catch (error) {
      console.error('❌ Get top-rated astrologers error:', error);
      throw error;
    }
  },

  /**
   * Get astrologers by language
   * Convenience method for filtering by language
   * 
   * @param {string} language - Language preference ('hindi', 'english', etc.)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getAstrologersByLanguage: async (language, page = 1, limit = 20) => {
    try {
      return await astrologerService.getAstrologers({
        language,
        page,
        limit,
      });
    } catch (error) {
      console.error('❌ Get astrologers by language error:', error);
      throw error;
    }
  },
};

export default astrologerService;
