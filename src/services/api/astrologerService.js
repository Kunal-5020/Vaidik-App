// src/services/api/AstrologerService.js
import apiClient from './config';

/**
 * Astrologer Service
 * Endpoints for browsing, searching, and viewing astrologer details
 * Base path: /astrologers
 */
export const astrologerService = {
  /**
   * Advanced search with all filters
   * API: GET /astrologers/search
   * 
   * @param {Object} params - Filter and pagination parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @param {string} params.search - Text search in name/bio
   * @param {Array<string>} params.skills - Array of specializations (e.g., ['vedic', 'tarot'])
   * @param {Array<string>} params.languages - Array of languages (e.g., ['hindi', 'english'])
   * @param {Array<string>} params.genders - Array of genders (e.g., ['male', 'female'])
   * @param {Array<string>} params.countries - Array of countries (e.g., ['india', 'outside-india'])
   * @param {Array<string>} params.topAstrologers - Array of tiers (e.g., ['celebrity', 'top-choice'])
   * @param {string} params.sortBy - Sort option (popularity, rating-high-low, price-low-high, etc.)
   * @param {number} params.minPrice - Minimum price filter
   * @param {number} params.maxPrice - Maximum price filter
   * @param {number} params.minRating - Minimum rating filter
   * @param {number} params.minExperience - Minimum experience in years
   * @param {number} params.maxExperience - Maximum experience in years
   * @param {boolean} params.isOnline - Filter online astrologers only
   * @param {boolean} params.isLive - Filter live streaming astrologers only
   * @param {boolean} params.chatEnabled - Filter chat-enabled astrologers
   * @param {boolean} params.callEnabled - Filter call-enabled astrologers
   */
  searchAstrologers: async (params = {}) => {
    try {
      console.log('📡 Searching astrologers with filters:', params);

      const response = await apiClient.get('/astrologers/search', {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...params,
        },
      });

      if (response.data.success) {
        console.log(
          '✅ Astrologers fetched:',
          response.data.data.astrologers.length,
          'items'
        );
        return {
          success: true,
          data: response.data.data.astrologers,
          pagination: response.data.data.pagination,
          appliedFilters: response.data.data.appliedFilters,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch astrologers');
    } catch (error) {
      console.error('❌ Search astrologers error:', error);
      throw error;
    }
  },

  /**
   * Get filter options with counts
   * API: GET /astrologers/filter-options
   * 
   * Returns all available filter options with counts for building dynamic UI
   */
  getFilterOptions: async () => {
    try {
      console.log('📡 Fetching filter options...');

      const response = await apiClient.get('/astrologers/filter-options');

      if (response.data.success) {
        console.log('✅ Filter options fetched');
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch filter options');
    } catch (error) {
      console.error('❌ Get filter options error:', error);
      throw error;
    }
  },

  /**
   * Legacy method - redirects to searchAstrologers
   * @deprecated Use searchAstrologers instead
   */
  getAstrologers: async (params = {}) => {
    // Map old params to new format
    const mappedParams = {
      page: params.page,
      limit: params.limit,
      search: params.q,
      sortBy: mapLegacySortBy(params.sortBy),
    };

    // Map specialization to skills array
    if (params.specialization) {
      mappedParams.skills = [params.specialization];
    }

    // Map language to languages array
    if (params.language) {
      mappedParams.languages = [params.language];
    }

    // Map availability to isOnline
    if (params.availability === 'online') {
      mappedParams.isOnline = true;
    }

    return await astrologerService.searchAstrologers(mappedParams);
  },

  /**
   * Get single astrologer details
   * API: GET /astrologers/:id
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
   * Get featured astrologers
   * API: GET /astrologers/featured
   */
  getFeaturedAstrologers: async (limit = 10) => {
    try {
      console.log('📡 Fetching featured astrologers...');

      const response = await apiClient.get('/astrologers/featured', {
        params: { limit },
      });

      if (response.data.success) {
        console.log('✅ Featured astrologers fetched:', response.data.count);
        return {
          success: true,
          data: response.data.data,
          count: response.data.count,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch featured astrologers');
    } catch (error) {
      console.error('❌ Get featured astrologers error:', error);
      throw error;
    }
  },

  /**
   * Get top-rated astrologers
   * API: GET /astrologers/top-rated
   */
  getTopRatedAstrologers: async (limit = 10) => {
    try {
      console.log('📡 Fetching top-rated astrologers...');

      const response = await apiClient.get('/astrologers/top-rated', {
        params: { limit },
      });

      if (response.data.success) {
        console.log('✅ Top-rated astrologers fetched:', response.data.count);
        return {
          success: true,
          data: response.data.data,
          count: response.data.count,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch top-rated astrologers');
    } catch (error) {
      console.error('❌ Get top-rated astrologers error:', error);
      throw error;
    }
  },

  /**
   * Get online astrologers
   * API: GET /astrologers/online
   */
  getOnlineAstrologers: async (limit = 20) => {
    try {
      console.log('📡 Fetching online astrologers...');

      const response = await apiClient.get('/astrologers/online', {
        params: { limit },
      });

      if (response.data.success) {
        console.log('✅ Online astrologers fetched:', response.data.count);
        return {
          success: true,
          data: response.data.data,
          count: response.data.count,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch online astrologers');
    } catch (error) {
      console.error('❌ Get online astrologers error:', error);
      throw error;
    }
  },

  /**
   * Get live astrologers
   * API: GET /astrologers/live
   */
  getLiveAstrologers: async (limit = 20) => {
    try {
      console.log('📡 Fetching live astrologers...');

      const response = await apiClient.get('/astrologers/live', {
        params: { limit },
      });

      if (response.data.success) {
        console.log('✅ Live astrologers fetched:', response.data.count);
        return {
          success: true,
          data: response.data.data,
          count: response.data.count,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch live astrologers');
    } catch (error) {
      console.error('❌ Get live astrologers error:', error);
      throw error;
    }
  },

  /**
   * Get astrologers by specialization
   * API: GET /astrologers/specialization/:specialization
   */
  getAstrologersBySpecialization: async (specialization, limit = 10) => {
    try {
      console.log('📡 Fetching astrologers by specialization:', specialization);

      const response = await apiClient.get(`/astrologers/specialization/${specialization}`, {
        params: { limit },
      });

      if (response.data.success) {
        console.log('✅ Astrologers by specialization fetched:', response.data.count);
        return {
          success: true,
          data: response.data.data,
          count: response.data.count,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch astrologers by specialization');
    } catch (error) {
      console.error('❌ Get astrologers by specialization error:', error);
      throw error;
    }
  },

  /**
   * Get random astrologers for discovery
   * API: GET /astrologers/random
   */
  getRandomAstrologers: async (limit = 5) => {
    try {
      console.log('📡 Fetching random astrologers...');

      const response = await apiClient.get('/astrologers/random', {
        params: { limit },
      });

      if (response.data.success) {
        console.log('✅ Random astrologers fetched:', response.data.count);
        return {
          success: true,
          data: response.data.data,
          count: response.data.count,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch random astrologers');
    } catch (error) {
      console.error('❌ Get random astrologers error:', error);
      throw error;
    }
  },

  /**
   * Register as astrologer (Onboarding)
   * API: POST /astrologers/register
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
};

/**
 * Helper function to map legacy sortBy values to new enum values
 */
function mapLegacySortBy(sortBy) {
  const sortMap = {
    'rating': 'rating-high-low',
    'experience': 'exp-high-low',
    'price': 'price-low-high',
  };
  return sortMap[sortBy] || 'popularity';
}

export default astrologerService;
