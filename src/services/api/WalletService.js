// src/services/api/WalletService.js
import apiClient from './config';

/**
 * Wallet Service
 * All endpoints require authentication (Bearer token in headers)
 * Base path: /wallet
 */
export const walletService = {
  // ============================================
  // WALLET RECHARGE
  // ============================================

  /**
   * Create recharge transaction
   * API: POST /wallet/recharge
   * 
   * @param {Object} rechargeData - Recharge details
   * @param {number} rechargeData.amount - Amount to recharge (min ₹100)
   * @param {string} rechargeData.paymentGateway - 'razorpay' | 'stripe' | 'paypal'
   * @param {string} rechargeData.currency - Optional: 'INR' | 'USD' | 'EUR' (default: INR)
   * 
   * Returns:
   * {
   *   success: true,
   *   message: "Recharge transaction created",
   *   data: {
   *     transactionId: "TXN_20251012_ABC123",
   *     amount: 500,
   *     currency: "INR",
   *     status: "pending",
   *     gateway: "razorpay",
   *     gatewayOrderId: "order_xyz123",      // Razorpay order ID
   *     clientSecret: "pi_xyz_secret_abc",   // Stripe only
   *     paymentUrl: "https://paypal.com/...", // PayPal only
   *   }
   * }
   * 
   * Example:
   * const result = await walletService.rechargeWallet({
   *   amount: 500,
   *   paymentGateway: 'razorpay',
   *   currency: 'INR'
   * });
   */
  rechargeWallet: async (rechargeData) => {
    try {
      console.log('📡 Creating recharge transaction...', rechargeData);

      // Validate amount
      if (rechargeData.amount < 100) {
        throw new Error('Minimum recharge amount is ₹100');
      }

      const response = await apiClient.post('/wallet/recharge', rechargeData);

      if (response.data.success) {
        console.log('✅ Recharge transaction created:', response.data.data);
        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to create recharge transaction');
    } catch (error) {
      console.error('❌ Recharge wallet error:', error);
      throw error;
    }
  },

  // ============================================
  // PAYMENT VERIFICATION
  // ============================================

  /**
   * Verify payment after gateway response
   * API: POST /wallet/verify-payment
   * 
   * @param {Object} verificationData - Payment verification details
   * @param {string} verificationData.transactionId - Transaction ID from recharge response
   * @param {string} verificationData.paymentId - Payment ID from gateway
   * @param {string} verificationData.status - 'completed' | 'failed'
   * 
   * Returns:
   * {
   *   success: true,
   *   message: "Payment verified successfully",
   *   data: {
   *     transactionId: "TXN_20251012_ABC123",
   *     status: "completed",
   *     balanceAfter: 1500.00
   *   }
   * }
   * 
   * Example:
   * await walletService.verifyPayment({
   *   transactionId: 'TXN_20251012_ABC123',
   *   paymentId: 'pay_xyz123',
   *   status: 'completed'
   * });
   */
  verifyPayment: async (verificationData) => {
    try {
      console.log('📡 Verifying payment...', verificationData);

      const response = await apiClient.post('/wallet/verify-payment', verificationData);

      if (response.data.success) {
        console.log('✅ Payment verified:', response.data.data);
        return {
          success: true,
          message: response.data.message,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Payment verification failed');
    } catch (error) {
      console.error('❌ Verify payment error:', error);
      throw error;
    }
  },

  // ============================================
  // TRANSACTION HISTORY
  // ============================================

  /**
   * Get wallet transactions with pagination and filters
   * API: GET /wallet/transactions
   * 
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20, max: 50)
   * @param {string} params.type - Optional: 'recharge' | 'deduction' | 'refund' | 'bonus'
   * @param {string} params.status - Optional: 'pending' | 'completed' | 'failed' | 'cancelled'
   * 
   * Returns:
   * {
   *   success: true,
   *   data: {
   *     transactions: [
   *       {
   *         _id: "...",
   *         transactionId: "TXN_20251012_ABC123",
   *         type: "recharge",
   *         amount: 500,
   *         balanceBefore: 1000,
   *         balanceAfter: 1500,
   *         description: "Wallet recharge of INR 500",
   *         paymentGateway: "razorpay",
   *         paymentId: "pay_xyz123",
   *         status: "completed",
   *         createdAt: "2025-10-12T12:00:00.000Z"
   *       }
   *     ],
   *     pagination: {
   *       page: 1,
   *       limit: 20,
   *       total: 45,
   *       pages: 3
   *     }
   *   }
   * }
   * 
   * Example:
   * const result = await walletService.getTransactions({
   *   page: 1,
   *   limit: 20,
   *   type: 'recharge',
   *   status: 'completed'
   * });
   */
  getTransactions: async (params = {}) => {
    try {
      console.log('📡 Fetching wallet transactions...', params);

      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);

      const response = await apiClient.get(
        `/wallet/transactions?${queryParams.toString()}`
      );

      if (response.data.success) {
        console.log('✅ Transactions fetched:', response.data.data.transactions.length, 'items');
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch transactions');
    } catch (error) {
      console.error('❌ Get transactions error:', error);
      throw error;
    }
  },

  // ============================================
  // TRANSACTION DETAILS
  // ============================================

  /**
   * Get single transaction details
   * API: GET /wallet/transactions/:transactionId
   * 
   * @param {string} transactionId - Transaction ID to fetch
   * 
   * Returns:
   * {
   *   success: true,
   *   data: {
   *     _id: "...",
   *     transactionId: "TXN_20251012_ABC123",
   *     userId: "...",
   *     type: "recharge",
   *     amount: 500,
   *     balanceBefore: 1000,
   *     balanceAfter: 1500,
   *     description: "Wallet recharge of INR 500",
   *     paymentGateway: "razorpay",
   *     paymentId: "pay_xyz123",
   *     orderId: null,
   *     status: "completed",
   *     createdAt: "2025-10-12T12:00:00.000Z",
   *     updatedAt: "2025-10-12T12:05:00.000Z"
   *   }
   * }
   * 
   * Example:
   * const result = await walletService.getTransactionDetails('TXN_20251012_ABC123');
   */
  getTransactionDetails: async (transactionId) => {
    try {
      console.log('📡 Fetching transaction details:', transactionId);

      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      const response = await apiClient.get(`/wallet/transactions/${transactionId}`);

      if (response.data.success) {
        console.log('✅ Transaction details fetched:', response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch transaction details');
    } catch (error) {
      console.error('❌ Get transaction details error:', error);
      throw error;
    }
  },

  // ============================================
  // WALLET STATISTICS
  // ============================================

  /**
   * Get wallet statistics
   * API: GET /wallet/stats
   * 
   * Returns:
   * {
   *   success: true,
   *   data: {
   *     currentBalance: 1500.00,
   *     totalRecharged: 5000.00,
   *     totalSpent: 3500.00,
   *     totalTransactions: 25,
   *     lastRechargeAt: "2025-10-12T12:00:00.000Z",
   *     lastTransactionAt: "2025-10-12T14:30:00.000Z"
   *   }
   * }
   * 
   * Example:
   * const stats = await walletService.getWalletStats();
   * console.log('Current Balance:', stats.data.currentBalance);
   */
  getWalletStats: async () => {
    try {
      console.log('📡 Fetching wallet statistics...');

      const response = await apiClient.get('/wallet/stats');

      if (response.data.success) {
        console.log('✅ Wallet stats fetched:', response.data.data);
        return {
          success: true,
          data: response.data.data,
        };
      }

      throw new Error(response.data.message || 'Failed to fetch wallet stats');
    } catch (error) {
      console.error('❌ Get wallet stats error:', error);
      throw error;
    }
  },

  // ============================================
  // HELPER: REFRESH BALANCE
  // ============================================

  /**
   * Quick helper to get current wallet balance
   * Uses getWalletStats internally
   * 
   * Returns: number (balance)
   * 
   * Example:
   * const balance = await walletService.refreshBalance();
   * console.log('Balance:', balance);
   */
  refreshBalance: async () => {
    try {
      const stats = await walletService.getWalletStats();
      return stats.data.currentBalance;
    } catch (error) {
      console.error('❌ Refresh balance error:', error);
      throw error;
    }
  },

  /**
 * Get payment gateway logs (recharge attempts with gateway details)
 * API: GET /wallet/transactions?type=recharge
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Optional: filter by status
 * 
 * Returns payment gateway transaction logs
 */
getPaymentLogs: async (params = {}) => {
  try {
    console.log('📡 Fetching payment logs...', params);

    const queryParams = new URLSearchParams();

    // ✅ Payment logs = recharge transactions only
    queryParams.append('type', 'recharge');
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);

    const response = await apiClient.get(
      `/wallet/transactions?${queryParams.toString()}`
    );

    if (response.data.success) {
      console.log('✅ Payment logs fetched:', response.data.data.transactions.length, 'items');
      
      // Transform to match payment log structure
      const logs = response.data.data.transactions.map(txn => ({
        _id: txn._id,
        paymentId: txn.paymentId || txn.transactionId,
        description: txn.description || `Wallet recharge of ₹${txn.amount}`,
        amount: txn.amount,
        status: txn.status,
        paymentGateway: txn.paymentGateway,
        createdAt: txn.createdAt,
        updatedAt: txn.updatedAt
      }));

      return {
        success: true,
        data: {
          logs,
          pagination: response.data.data.pagination
        }
      };
    }

    throw new Error(response.data.message || 'Failed to fetch payment logs');
  } catch (error) {
    console.error('❌ Get payment logs error:', error);
    throw error;
  }
},
};

export default walletService;
