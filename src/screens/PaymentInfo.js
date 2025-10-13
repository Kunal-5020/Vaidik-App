import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import paymentService from '../services/api/PaymentService';
import walletService from '../services/api/WalletService';
import {
  formatCurrency,
  formatIndianNumber,
  validateRechargeAmount,
} from '../utils/paymentHelpers';

const PaymentInfoScreen = ({ navigation, route }) => {
  const { amount } = route.params || {};

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // User details - Replace with actual user data from context/AsyncStorage
  const [userDetails] = useState({
    email: 'user@example.com', // Get from user context
    phone: '9876543210', // Get from user context
    name: 'User Name', // Get from user context
  });

  // Calculate bonus (same logic as your amounts array)
  const calculateBonus = (amt) => {
    if (amt >= 100000) return { percentage: 20, amount: amt * 0.2 };
    if (amt >= 50000) return { percentage: 20, amount: amt * 0.2 };
    if (amt >= 20000) return { percentage: 15, amount: amt * 0.15 };
    if (amt >= 15000) return { percentage: 15, amount: amt * 0.15 };
    if (amt >= 8000) return { percentage: 12, amount: amt * 0.12 };
    if (amt >= 4000) return { percentage: 12, amount: amt * 0.12 };
    if (amt >= 1000) return { percentage: 10, amount: amt * 0.1 };
    if (amt >= 50) return { percentage: 100, amount: amt * 1.0 }; // 100% Extra
    return { percentage: 0, amount: 0 };
  };

  const bonus = calculateBonus(amount);
  const totalAmount = amount + bonus.amount;

  // Fetch current wallet balance
  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const stats = await walletService.getWalletStats();
      setCurrentBalance(stats.data.currentBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setCurrentBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Handle payment processing
  const handlePayment = async () => {
    // Validate amount
    const validation = validateRechargeAmount(amount, 50, 100000);
    if (!validation.valid) {
      Alert.alert('Invalid Amount', validation.error);
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🚀 Starting payment flow for amount:', amount);

      // Use the complete Razorpay payment flow
      await paymentService.completeRazorpayFlow(
        amount,
        userDetails,
        // Success callback
        (newBalance) => {
          setIsProcessing(false);
          console.log('✅ Payment successful! New balance:', newBalance);

          // Show success alert with details
          Alert.alert(
            '🎉 Payment Successful!',
            `₹${formatIndianNumber(amount)} has been added to your wallet.\n\n` +
              `Bonus: ₹${formatIndianNumber(bonus.amount)}\n` +
              `Total Credit: ₹${formatIndianNumber(totalAmount)}\n\n` +
              `New Balance: ₹${formatIndianNumber(newBalance)}`,
            [
              {
                text: 'View Wallet',
                onPress: () => navigation.replace('WalletHome'),
              },
              {
                text: 'Done',
                onPress: () => navigation.goBack(),
                style: 'cancel',
              },
            ]
          );
        },
        // Failure callback
        (error) => {
          setIsProcessing(false);
          console.error('❌ Payment failed:', error);

          Alert.alert(
            'Payment Failed',
            error || 'Unable to process payment. Please try again.',
            [
              {
                text: 'Retry',
                onPress: () => handlePayment(),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        }
      );
    } catch (error) {
      setIsProcessing(false);
      console.error('❌ Payment error:', error);
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={isProcessing}
          >
            <Image
              source={require('../assets/back.png')}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Summary</Text>
          <View style={styles.walletBox}>
            <Feather name="credit-card" size={18} color="#000" />
            {isLoadingBalance ? (
              <ActivityIndicator size="small" color="#000" style={{ marginLeft: 5 }} />
            ) : (
              <Text style={styles.walletText}> ₹{formatIndianNumber(currentBalance)} </Text>
            )}
          </View>
        </View>

        <View style={styles.line} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Payment Amount Card */}
          <View style={styles.amountCard}>
            <View style={styles.amountCardHeader}>
              <Feather name="wallet" size={24} color="#6366F1" />
              <Text style={styles.amountCardTitle}>Recharge Amount</Text>
            </View>
            <Text style={styles.mainAmount}>₹{formatIndianNumber(amount)}</Text>
            {bonus.amount > 0 && (
              <View style={styles.bonusTag}>
                <Text style={styles.bonusTagText}>
                  🎁 {bonus.percentage}% Bonus: ₹{formatIndianNumber(bonus.amount)}
                </Text>
              </View>
            )}
          </View>

          {/* Payment Breakdown */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Payment Breakdown</Text>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Recharge Amount</Text>
              <Text style={styles.breakdownValue}>₹{formatIndianNumber(amount)}</Text>
            </View>

            {bonus.amount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, styles.bonusText]}>
                  Bonus ({bonus.percentage}%)
                </Text>
                <Text style={[styles.breakdownValue, styles.bonusText]}>
                  + ₹{formatIndianNumber(bonus.amount)}
                </Text>
              </View>
            )}

            <View style={styles.breakdownDivider} />

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabelBold}>You'll Get</Text>
              <Text style={styles.breakdownValueBold}>
                ₹{formatIndianNumber(totalAmount)}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>You Pay</Text>
              <Text style={styles.breakdownValue}>₹{formatIndianNumber(amount)}</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentMethodCard}>
            <Text style={styles.paymentMethodTitle}>Payment Method</Text>
            <View style={styles.paymentMethodRow}>
              <View style={styles.paymentMethodInfo}>
                <View style={styles.razorpayLogo}>
                  <Text style={styles.razorpayText}>Razorpay</Text>
                </View>
                <Text style={styles.paymentMethodDesc}>
                  Cards, UPI, Netbanking & More
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </View>
          </View>

          {/* Security Info */}
          <View style={styles.securityCard}>
            <View style={styles.securityRow}>
              <Feather name="shield" size={16} color="#10B981" />
              <Text style={styles.securityText}>100% Secure Payment</Text>
            </View>
            <View style={styles.securityRow}>
              <Feather name="lock" size={16} color="#10B981" />
              <Text style={styles.securityText}>256-bit SSL Encrypted</Text>
            </View>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By proceeding, you agree to our Terms & Conditions and Privacy Policy
          </Text>
        </ScrollView>

        {/* Pay Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator color="#000" size="small" />
                <Text style={styles.payButtonText}>Processing...</Text>
              </View>
            ) : (
              <View style={styles.payButtonContent}>
                <Text style={styles.payButtonText}>
                  Pay ₹{formatIndianNumber(amount)}
                </Text>
                <Feather name="arrow-right" size={20} color="#000" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentInfoScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 30,
    flex: 1,
    color: '#111827',
  },
  walletBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  walletText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  leftIcon: {
    width: 20,
    height: 20,
    tintColor: 'grey',
  },
  line: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },

  // Amount Card
  amountCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  amountCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  amountCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  mainAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  bonusTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bonusTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803D',
  },

  // Breakdown Card
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 15,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  breakdownValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  breakdownLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  breakdownValueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  bonusText: {
    color: '#15803D',
    fontWeight: '600',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },

  // Payment Method Card
  paymentMethodCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 15,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  razorpayLogo: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  razorpayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  paymentMethodDesc: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Security Card
  securityCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    marginLeft: 6,
  },

  // Terms
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  payButton: {
    backgroundColor: '#f8d900',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f8d900',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 8,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
