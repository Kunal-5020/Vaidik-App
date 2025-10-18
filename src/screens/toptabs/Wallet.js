// src/screens/Wallet/WalletScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import walletService from '../../services/api/WalletService';

const WalletScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [paymentLogs, setPaymentLogs] = useState([]);

  useEffect(() => {
    loadWalletData();
  }, [activeTab]);

  // Load wallet data
  const loadWalletData = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Load wallet balance
      const statsResponse = await walletService.getWalletStats();
      if (statsResponse.success) {
        setWalletBalance(statsResponse.data.currentBalance || 0);
      }

      // Load transactions or payment logs based on active tab
      if (activeTab === 'transactions') {
        const txnResponse = await walletService.getTransactions({ page: 1, limit: 50 });
        if (txnResponse.success) {
          const formattedTxns = txnResponse.data.transactions.map(txn => ({
            id: txn._id,
            title: txn.description || getTransactionTitle(txn),
            date: new Date(txn.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            txnId: `#${txn.transactionId || txn._id}`,
            amount: txn.type === 'credit' ? `+₹${txn.amount}` : `-₹${txn.amount}`,
            type: txn.type,
          }));
          setTransactions(formattedTxns);
        }
      } else {
        const logsResponse = await walletService.getPaymentLogs({ page: 1, limit: 50 });
        if (logsResponse.success) {
          const formattedLogs = logsResponse.data.logs.map(log => ({
            id: log._id,
            title: log.description || 'Payment',
            date: new Date(log.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            txnId: `#${log.paymentId || log._id}`,
            amount: `₹${log.amount}`,
            status: log.status,
          }));
          setPaymentLogs(formattedLogs);
        }
      }
    } catch (error) {
      console.error('Load wallet data error:', error);
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper function to generate transaction title
  const getTransactionTitle = (txn) => {
    switch (txn.type) {
      case 'credit':
        if (txn.reason === 'recharge') return 'Wallet Recharge';
        if (txn.reason === 'refund') return 'Refund';
        if (txn.reason === 'bonus') return 'Bonus Money';
        return 'Credit';
      case 'debit':
        if (txn.reason === 'chat') return `Chat with Astrologer`;
        if (txn.reason === 'call') return `Call with Astrologer`;
        return 'Debit';
      default:
        return 'Transaction';
    }
  };

  // Render transaction card
  const renderTransaction = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardTxn}>{item.txnId}</Text>
      </View>
      <Text style={[styles.amount, item.type === 'credit' ? styles.credit : styles.debit]}>
        {item.amount}
      </Text>
    </View>
  );

  // Render payment log card
  const renderPaymentLog = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardTxn}>{item.txnId}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.amount}>{item.amount}</Text>
        <Text style={[styles.status, item.status === 'success' ? styles.statusSuccess : styles.statusFailed]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Balance Section */}
        <View style={styles.balanceBox}>
          <View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>₹ {walletBalance.toFixed(0)}</Text>
          </View>
          <TouchableOpacity
            style={styles.rechargeBtn}
            onPress={() => navigation.navigate('AddCash')}
          >
            <Text style={styles.rechargeText}>Recharge</Text>
          </TouchableOpacity>
        </View>

        {/* Inner Tabs */}
        <View style={styles.innerTabs}>
          <TouchableOpacity
            style={[styles.innerTab, activeTab === 'transactions' && styles.activeInnerTab]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text
              style={[
                styles.innerTabText,
                activeTab === 'transactions' && styles.activeInnerTabText,
              ]}
            >
              Wallet Transactions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.innerTab, activeTab === 'logs' && styles.activeInnerTab]}
            onPress={() => setActiveTab('logs')}
          >
            <Text style={[styles.innerTabText, activeTab === 'logs' && styles.activeInnerTabText]}>
              Payment Logs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transaction/Payment List */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#000333" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : activeTab === 'transactions' ? (
          transactions.length > 0 ? (
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={renderTransaction}
              contentContainerStyle={{ paddingBottom: 20 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => loadWalletData(true)} />
              }
            />
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          )
        ) : paymentLogs.length > 0 ? (
          <FlatList
            data={paymentLogs}
            keyExtractor={(item) => item.id}
            renderItem={renderPaymentLog}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => loadWalletData(true)} />
            }
          />
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No payment logs available</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  balanceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  balanceLabel: { fontSize: 14, color: '#666' },
  balanceValue: { fontSize: 26, fontWeight: '700', marginTop: 4, color: '#000' },
  rechargeBtn: {
    backgroundColor: '#000333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rechargeText: { fontWeight: '600', color: '#fff', fontSize: 14 },

  innerTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  innerTab: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeInnerTab: {
    backgroundColor: '#000333',
    borderColor: '#000333',
  },
  innerTabText: { fontSize: 13, color: '#666', fontWeight: '500' },
  activeInnerTabText: { color: '#fff', fontWeight: '600' },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#000' },
  cardDate: { fontSize: 12, color: '#777', marginTop: 2 },
  cardTxn: { fontSize: 11, color: '#aaa', marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '700', alignSelf: 'center' },
  credit: { color: '#4CAF50' },
  debit: { color: '#f44336' },
  status: { fontSize: 11, marginTop: 4, textTransform: 'capitalize' },
  statusSuccess: { color: '#4CAF50' },
  statusFailed: { color: '#f44336' },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, color: '#666' },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  emptyText: { color: '#999', fontSize: 15 },
});

export default WalletScreen;
