// src/services/api/PaymentService.js
import { Alert, Linking, Platform } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import walletService from './WalletService';

/**
 * Payment Service
 * Handles payment gateway integration for wallet recharge
 * Auto-selects payment method based on currency
 */

// ============================================
// PAYMENT GATEWAY CONFIGURATION
// ============================================

/**
 * Replace these with your actual keys from gateway dashboards
 */
export const PAYMENT_CONFIG = {
  razorpay: {
    key: 'rzp_test_pgNwN5gpPzbjfq', // ⚠️ Replace with your Razorpay key
    merchantName: 'Vaidik Talk',
    merchantLogo: 'https://vaidiktalk.store/cdn/shop/files/logo.png?v=1747895829&width=300', // Replace with your logo URL
    themeColor: '#6366F1',
  },
  stripe: {
    publishableKey: 'pk_test_YOUR_KEY_HERE', // ⚠️ Replace with your Stripe key
    merchantIdentifier: 'merchant.com.vaidiktalk',
  },
  paypal: {
    returnUrl: 'vaidiktalk://payment/success',
    cancelUrl: 'vaidiktalk://payment/cancel',
  },
};

// ============================================
// CURRENCY TO GATEWAY MAPPING
// ============================================

/**
 * Auto-detect payment gateway based on currency
 * INR → Razorpay (default for India)
 * USD, EUR, GBP → Stripe or PayPal (user choice)
 * 
 * @param {string} currency - Currency code (INR, USD, EUR, etc.)
 * @returns {Object} Available gateways for the currency
 */
export const getAvailableGateways = (currency = 'INR') => {
  const currencyUpper = currency.toUpperCase();

  if (currencyUpper === 'INR') {
    return {
      default: 'razorpay',
      available: ['razorpay'],
      currencies: { razorpay: 'INR' },
    };
  }

  // International currencies
  return {
    default: 'stripe',
    available: ['stripe', 'paypal'],
    currencies: {
      stripe: currencyUpper,
      paypal: currencyUpper,
    },
  };
};

/**
 * Get default currency based on user location or app settings
 * You can enhance this with actual location detection
 */
export const getDefaultCurrency = () => {
  // TODO: Detect from user profile or device location
  return 'INR'; // Default to INR for Indian app
};

// ============================================
// PAYMENT SERVICE CLASS
// ============================================

export const paymentService = {
  // ============================================
  // INITIATE RECHARGE
  // ============================================

  /**
   * Step 1: Initiate recharge transaction
   * Creates transaction in backend and gets gateway order details
   * 
   * @param {number} amount - Amount to recharge
   * @param {string} gateway - 'razorpay' | 'stripe' | 'paypal'
   * @param {string} currency - Currency code (default: INR)
   * 
   * Returns: Recharge transaction data with gateway-specific fields
   */
  initiateRecharge: async (amount, gateway, currency = 'INR') => {
    try {
      console.log('💰 Initiating recharge:', { amount, gateway, currency });

      const rechargeData = await walletService.rechargeWallet({
        amount,
        paymentGateway: gateway,
        currency,
      });

      return rechargeData;
    } catch (error) {
      console.error('❌ Initiate recharge error:', error);
      throw error;
    }
  },

  // ============================================
  // RAZORPAY PAYMENT
  // ============================================

  /**
   * Process Razorpay payment (for INR)
   * Opens Razorpay checkout screen
   * 
   * @param {Object} rechargeData - Data from initiateRecharge
   * @param {Object} userDetails - User information
   * @param {string} userDetails.email - User email (optional)
   * @param {string} userDetails.phone - User phone number
   * @param {string} userDetails.name - User name
   * 
   * Returns: Promise<Razorpay response>
   */
  processRazorpayPayment: async (rechargeData, userDetails) => {
    return new Promise((resolve, reject) => {
      try {
        const options = {
          description: `Wallet recharge of ₹${rechargeData.data.amount}`,
          image: PAYMENT_CONFIG.razorpay.merchantLogo,
          currency: rechargeData.data.currency,
          key: PAYMENT_CONFIG.razorpay.key,
          amount: Math.round(rechargeData.data.amount * 100), // Amount in paise
          name: PAYMENT_CONFIG.razorpay.merchantName,
          order_id: rechargeData.data.gatewayOrderId,
          prefill: {
            email: userDetails.email || '',
            contact: userDetails.phone || '',
            name: userDetails.name || '',
          },
          theme: {
            color: PAYMENT_CONFIG.razorpay.themeColor,
          },
        };

        console.log('🔐 Opening Razorpay checkout...', options);

        RazorpayCheckout.open(options)
          .then((data) => {
            console.log('✅ Razorpay payment success:', data);
            resolve({
              success: true,
              paymentId: data.razorpay_payment_id,
              orderId: data.razorpay_order_id,
              signature: data.razorpay_signature,
            });
          })
          .catch((error) => {
            console.error('❌ Razorpay payment failed:', error);
            reject({
              success: false,
              code: error.code,
              description: error.description,
            });
          });
      } catch (error) {
        console.error('❌ Razorpay initialization error:', error);
        reject(error);
      }
    });
  },

  // ============================================
  // STRIPE PAYMENT
  // ============================================

  /**
   * Process Stripe payment (for international currencies)
   * Note: This requires @stripe/stripe-react-native and StripeProvider setup
   * See usage example in component section
   * 
   * @param {Object} rechargeData - Data from initiateRecharge
   * @param {Function} confirmPaymentFunction - useStripe().confirmPayment from component
   * 
   * Returns: Promise<Stripe PaymentIntent>
   */
  processStripePayment: async (rechargeData, confirmPaymentFunction) => {
    try {
      if (!rechargeData.data.clientSecret) {
        throw new Error('Client secret not found for Stripe payment');
      }

      console.log('🔐 Processing Stripe payment...');

      const { error, paymentIntent } = await confirmPaymentFunction(
        rechargeData.data.clientSecret,
        {
          paymentMethodType: 'Card',
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      console.log('✅ Stripe payment success:', paymentIntent.id);

      return {
        success: true,
        paymentId: paymentIntent.id,
        paymentIntent,
      };
    } catch (error) {
      console.error('❌ Stripe payment error:', error);
      throw error;
    }
  },

  // ============================================
  // PAYPAL PAYMENT
  // ============================================

  /**
   * Process PayPal payment (for international currencies)
   * Opens PayPal URL in browser/webview
   * 
   * @param {Object} rechargeData - Data from initiateRecharge
   * 
   * Returns: Promise<boolean> - true if URL opened successfully
   */
  processPayPalPayment: async (rechargeData) => {
    try {
      const paymentUrl = rechargeData.data.paymentUrl;

      if (!paymentUrl) {
        throw new Error('Payment URL not found for PayPal');
      }

      console.log('🔐 Opening PayPal payment URL...', paymentUrl);

      const supported = await Linking.canOpenURL(paymentUrl);

      if (supported) {
        await Linking.openURL(paymentUrl);
        return true;
      } else {
        throw new Error('Cannot open PayPal payment URL');
      }
    } catch (error) {
      console.error('❌ PayPal payment error:', error);
      throw error;
    }
  },

  // ============================================
  // COMPLETE PAYMENT FLOW (RAZORPAY)
  // ============================================

  /**
   * Complete end-to-end payment flow for Razorpay
   * Handles: Initiate → Pay → Verify → Update Balance
   * 
   * @param {number} amount - Amount to recharge
   * @param {Object} userDetails - User information
   * @param {Function} onSuccess - Callback on success (receives new balance)
   * @param {Function} onFailure - Callback on failure (receives error message)
   * 
   * Example:
   * await paymentService.completeRazorpayFlow(
   *   500,
   *   { email: 'user@example.com', phone: '9876543210', name: 'John Doe' },
   *   (newBalance) => console.log('Success! Balance:', newBalance),
   *   (error) => console.log('Failed:', error)
   * );
   */
  completeRazorpayFlow: async (amount, userDetails, onSuccess, onFailure) => {
    let rechargeData = null;

    try {
      // Step 1: Initiate recharge
      rechargeData = await paymentService.initiateRecharge(amount, 'razorpay', 'INR');

      // Step 2: Process Razorpay payment
      const paymentResult = await paymentService.processRazorpayPayment(
        rechargeData,
        userDetails
      );

      if (!paymentResult.success) {
        throw new Error('Payment was not successful');
      }

      // Step 3: Verify payment with backend
      const verificationResult = await walletService.verifyPayment({
        transactionId: rechargeData.data.transactionId,
        paymentId: paymentResult.paymentId,
        status: 'completed',
      });

      if (verificationResult.success) {
        // Step 4: Get updated balance
        const newBalance = verificationResult.data.balanceAfter;

        console.log('✅ Payment completed! New balance:', newBalance);

        if (onSuccess) {
          onSuccess(newBalance);
        }

        return {
          success: true,
          balance: newBalance,
          transactionId: rechargeData.data.transactionId,
        };
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('❌ Payment flow error:', error);

      // Mark payment as failed if transaction was created
      if (rechargeData?.data?.transactionId) {
        try {
          await walletService.verifyPayment({
            transactionId: rechargeData.data.transactionId,
            paymentId: 'FAILED',
            status: 'failed',
          });
        } catch (verifyError) {
          console.error('❌ Failed to mark transaction as failed:', verifyError);
        }
      }

      const errorMessage = error.description || error.message || 'Payment failed';

      if (onFailure) {
        onFailure(errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // ============================================
  // SHOW PAYMENT METHOD SELECTOR
  // ============================================

  /**
   * Show payment method selection alert
   * Auto-detects available methods based on currency
   * 
   * @param {number} amount - Amount to recharge
   * @param {string} currency - Currency code (default: INR)
   * @param {Function} onSelectGateway - Callback with selected gateway
   * 
   * Example:
   * paymentService.showPaymentMethodSelector(
   *   500,
   *   'USD',
   *   (gateway) => console.log('Selected:', gateway)
   * );
   */
  showPaymentMethodSelector: (amount, currency = 'INR', onSelectGateway) => {
    const gateways = getAvailableGateways(currency);

    // For INR, auto-select Razorpay (no choice needed)
    if (gateways.default === 'razorpay') {
      onSelectGateway('razorpay');
      return;
    }

    // For international, show options
    const buttons = [
      {
        text: 'Stripe',
        onPress: () => onSelectGateway('stripe'),
      },
      {
        text: 'PayPal',
        onPress: () => onSelectGateway('paypal'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ];

    Alert.alert(
      'Select Payment Method',
      `Choose your preferred payment method for ${currency} ${amount}`,
      buttons
    );
  },
};

export default paymentService;
