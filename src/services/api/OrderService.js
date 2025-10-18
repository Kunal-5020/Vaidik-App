// src/services/api/OrderService.js
import apiClient from './config';
import walletService from './WalletService';

export const orderService = {
  /**
   * Check if user has sufficient balance for consultation
   * @param {number} pricePerMinute - Astrologer's price per minute
   * @param {number} minimumMinutes - Minimum consultation minutes (default: 5)
   */
  checkBalance: async (pricePerMinute, minimumMinutes = 5) => {
    try {
      console.log('💰 Checking balance for consultation:', {
        pricePerMinute,
        minimumMinutes,
        requiredAmount: pricePerMinute * minimumMinutes,
      });

      const walletData = await walletService.getWalletStats();
      const currentBalance = walletData.data.currentBalance;
      const requiredAmount = pricePerMinute * minimumMinutes;

      const hasSufficientBalance = currentBalance >= requiredAmount;

      console.log(hasSufficientBalance ? '✅ Sufficient balance' : '❌ Insufficient balance', {
        currentBalance,
        requiredAmount,
        shortfall: hasSufficientBalance ? 0 : requiredAmount - currentBalance,
      });

      return {
        success: hasSufficientBalance,
        currentBalance,
        requiredAmount,
        shortfall: hasSufficientBalance ? 0 : requiredAmount - currentBalance,
      };
    } catch (error) {
      console.error('❌ Check balance error:', error);
      throw error;
    }
  },

  /**
   * Create consultation order
   * API: POST /orders
   */
  createOrder: async (orderData) => {
    try {
      console.log('📡 Creating order...', orderData);

      const response = await apiClient.post('/orders', orderData);

      if (response.data.success) {
        console.log('✅ Order created:', response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to create order');
    } catch (error) {
      console.error('❌ Create order error:', error);
      throw error;
    }
  },

  /**
   * Get user orders with pagination
   * API: GET /orders
   */
  getOrders: async (params = {}) => {
    try {
      const { page = 1, limit = 20, type, status } = params;

      console.log('📡 Fetching orders...', params);

      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      if (type) queryParams.append('type', type);
      if (status) queryParams.append('status', status);

      const response = await apiClient.get(`/orders?${queryParams.toString()}`);

      if (response.data.success) {
        console.log('✅ Orders fetched:', response.data.data.orders.length);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch orders');
    } catch (error) {
      console.error('❌ Get orders error:', error);
      throw error;
    }
  },

  /**
   * Get order details
   * API: GET /orders/:orderId
   */
  getOrderDetails: async (orderId) => {
    try {
      console.log('📡 Fetching order details:', orderId);

      const response = await apiClient.get(`/orders/${orderId}`);

      if (response.data.success) {
        console.log('✅ Order details fetched');
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch order details');
    } catch (error) {
      console.error('❌ Get order details error:', error);
      throw error;
    }
  },

  /**
   * Cancel order
   * API: PATCH /orders/:orderId/cancel
   */
  cancelOrder: async (orderId, reason) => {
    try {
      console.log('📡 Cancelling order:', orderId, reason);

      const response = await apiClient.patch(`/orders/${orderId}/cancel`, { reason });

      if (response.data.success) {
        console.log('✅ Order cancelled');
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to cancel order');
    } catch (error) {
      console.error('❌ Cancel order error:', error);
      throw error;
    }
  },

  /**
   * Add review to order
   * API: POST /orders/:orderId/review
   */
  addReview: async (orderId, rating, review) => {
    try {
      console.log('📡 Adding review:', orderId, rating);

      const response = await apiClient.post(`/orders/${orderId}/review`, { rating, review });

      if (response.data.success) {
        console.log('✅ Review added');
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to add review');
    } catch (error) {
      console.error('❌ Add review error:', error);
      throw error;
    }
  },
};

export default orderService;
