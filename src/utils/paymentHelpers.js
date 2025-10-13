// src/services/utils/paymentHelpers.js

/**
 * Payment Helper Utilities
 * Format, validate, and process payment-related data
 */

// ============================================
// CURRENCY FORMATTING
// ============================================

/**
 * Format amount with currency symbol
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted amount
 */
export const formatCurrency = (amount, currency = 'INR') => {
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = symbols[currency] || currency;
  const formattedAmount = parseFloat(amount).toFixed(2);

  // For INR, use Indian number format
  if (currency === 'INR') {
    return `${symbol}${formatIndianNumber(amount)}`;
  }

  return `${symbol}${formattedAmount}`;
};

/**
 * Format number in Indian numbering system (lakhs, crores)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatIndianNumber = (num) => {
  const n = parseFloat(num).toFixed(2);
  const parts = n.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian format: 12,34,567.89
  const lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);

  const formatted =
    otherNumbers !== ''
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      : lastThree;

  return decimalPart ? `${formatted}.${decimalPart}` : formatted;
};

// ============================================
// DATE/TIME FORMATTING
// ============================================

/**
 * Format transaction date/time
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatTransactionDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  // Today
  if (diffInHours < 24) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `Today at ${displayHours}:${minutes} ${ampm}`;
  }

  // Yesterday
  if (diffInHours < 48) {
    return 'Yesterday';
  }

  // Older dates
  const day = date.getDate();
  const month = date.toLocaleString('en-IN', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Format time only
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time
 */
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================
// TRANSACTION STATUS HELPERS
// ============================================

/**
 * Get color for transaction status
 * @param {string} status - Transaction status
 * @returns {string} Color hex code
 */
export const getStatusColor = (status) => {
  const colors = {
    completed: '#10B981', // Green
    pending: '#F59E0B', // Orange
    failed: '#EF4444', // Red
    cancelled: '#6B7280', // Gray
  };

  return colors[status] || colors.cancelled;
};

/**
 * Get status display text
 * @param {string} status - Transaction status
 * @returns {string} Display text
 */
export const getStatusText = (status) => {
  const texts = {
    completed: 'Success',
    pending: 'Pending',
    failed: 'Failed',
    cancelled: 'Cancelled',
  };

  return texts[status] || status;
};

// ============================================
// TRANSACTION TYPE HELPERS
// ============================================

/**
 * Get icon/emoji for transaction type
 * @param {string} type - Transaction type
 * @returns {string} Icon/emoji
 */
export const getTransactionIcon = (type) => {
  const icons = {
    recharge: '💰',
    deduction: '🛒',
    refund: '↩️',
    bonus: '🎁',
  };

  return icons[type] || '💵';
};

/**
 * Get transaction type display text
 * @param {string} type - Transaction type
 * @returns {string} Display text
 */
export const getTransactionTypeText = (type) => {
  const texts = {
    recharge: 'Wallet Recharge',
    deduction: 'Payment',
    refund: 'Refund',
    bonus: 'Bonus',
  };

  return texts[type] || type;
};

/**
 * Get color for transaction type
 * @param {string} type - Transaction type
 * @returns {string} Color hex code
 */
export const getTransactionTypeColor = (type) => {
  const colors = {
    recharge: '#10B981', // Green
    deduction: '#EF4444', // Red
    refund: '#3B82F6', // Blue
    bonus: '#8B5CF6', // Purple
  };

  return colors[type] || '#6B7280';
};

// ============================================
// PAYMENT GATEWAY HELPERS
// ============================================

/**
 * Get payment gateway display name
 * @param {string} gateway - Gateway code
 * @returns {string} Display name
 */
export const getPaymentGatewayName = (gateway) => {
  const names = {
    razorpay: 'Razorpay',
    stripe: 'Stripe',
    paypal: 'PayPal',
  };

  return names[gateway] || gateway;
};

/**
 * Get payment gateway logo URL
 * @param {string} gateway - Gateway code
 * @returns {string} Logo URL
 */
export const getPaymentGatewayLogo = (gateway) => {
  const logos = {
    razorpay: 'https://razorpay.com/assets/razorpay-glyph.svg',
    stripe: 'https://stripe.com/img/v3/home/social.png',
    paypal: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg',
  };

  return logos[gateway] || null;
};

// ============================================
// AMOUNT VALIDATION
// ============================================

/**
 * Validate recharge amount
 * @param {number} amount - Amount to validate
 * @param {number} minAmount - Minimum allowed (default: 100)
 * @param {number} maxAmount - Maximum allowed (default: 50000)
 * @returns {Object} Validation result
 */
export const validateRechargeAmount = (amount, minAmount = 100, maxAmount = 50000) => {
  if (!amount || isNaN(amount)) {
    return {
      valid: false,
      error: 'Please enter a valid amount',
    };
  }

  const numAmount = parseFloat(amount);

  if (numAmount < minAmount) {
    return {
      valid: false,
      error: `Minimum recharge amount is ${formatCurrency(minAmount)}`,
    };
  }

  if (numAmount > maxAmount) {
    return {
      valid: false,
      error: `Maximum recharge amount is ${formatCurrency(maxAmount)}`,
    };
  }

  return { valid: true };
};

/**
 * Get suggested recharge amounts
 * @param {string} currency - Currency code
 * @returns {Array<number>} Suggested amounts
 */
export const getSuggestedAmounts = (currency = 'INR') => {
  if (currency === 'INR') {
    return [100, 500, 1000, 2000, 5000];
  }

  // International
  return [10, 25, 50, 100, 200];
};

// ============================================
// TRANSACTION GROUPING
// ============================================

/**
 * Group transactions by date
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Grouped transactions
 */
export const groupTransactionsByDate = (transactions) => {
  const grouped = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    const dateKey = date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(transaction);
  });

  return grouped;
};

export default {
  formatCurrency,
  formatIndianNumber,
  formatTransactionDate,
  formatTime,
  getStatusColor,
  getStatusText,
  getTransactionIcon,
  getTransactionTypeText,
  getTransactionTypeColor,
  getPaymentGatewayName,
  getPaymentGatewayLogo,
  validateRechargeAmount,
  getSuggestedAmounts,
  groupTransactionsByDate,
};
