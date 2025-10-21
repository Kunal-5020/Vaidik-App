import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InsufficientBalanceModal = ({ 
  visible, 
  onClose, 
  onRecharge,
  currentBalance,
  requiredAmount,
  actionType // 'gift' or 'call'
}) => {
  const shortfall = requiredAmount - currentBalance;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon name="account-balance-wallet" size={48} color="#ef4444" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Insufficient Balance</Text>

          {/* Message */}
          <Text style={styles.message}>
            {actionType === 'call' 
              ? 'You don\'t have enough balance to request a call'
              : 'You don\'t have enough balance to send this gift'
            }
          </Text>

          {/* Balance Info */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Current Balance:</Text>
              <Text style={styles.balanceAmount}>₹{currentBalance.toFixed(2)}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Required:</Text>
              <Text style={[styles.balanceAmount, styles.required]}>₹{requiredAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabelBold}>Shortfall:</Text>
              <Text style={[styles.balanceAmountBold, styles.shortfall]}>₹{shortfall.toFixed(2)}</Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity 
            style={styles.rechargeButton}
            onPress={onRecharge}
          >
            <Icon name="add-circle" size={20} color="#fff" />
            <Text style={styles.rechargeButtonText}>Recharge Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  balanceCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  balanceLabelBold: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  balanceAmountBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  required: {
    color: '#f59e0b',
  },
  shortfall: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  rechargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6b900',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  rechargeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default InsufficientBalanceModal;
