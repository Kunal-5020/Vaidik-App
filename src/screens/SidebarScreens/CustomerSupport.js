// src/screens/ProfileHelpSupportScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/api/UserService';
import walletService from '../../services/api/WalletService';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function ProfileHelpSupportScreen({ navigation }) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    loadProfileData();
    loadWalletBalance();
  }, []);

  // Load user profile from backend
  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      
      if (response.success) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load wallet balance
  const loadWalletBalance = async () => {
    try {
      const response = await walletService.getWalletStats();
      
      if (response.success) {
        setWalletBalance(response.data.currentBalance || 0);
      }
    } catch (error) {
      console.error('Load wallet error:', error);
    }
  };

  // Handle navigation
  const onPress = (action) => {
    switch (action) {
      case 'edit':
        navigation.navigate('Profile');
        break;
      case 'recharge':
        navigation.navigate('AddCash');
        break;
      case 'orders':
        navigation.navigate('order');
        break;
      case 'wallet':
        navigation.navigate('Wallet');
        break;
      default:
        console.log('Pressed', action);
    }
  };

  if (loading && !profileData) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/left.png')} style={styles.leftIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help and Support</Text>
          <View style={{ width: 120 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../assets/left.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help and Support</Text>
        <View style={{ width: 120 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileTop}>
            <Image
              source={{
                uri: profileData?.profileImage || user?.profileImage || 'https://i.pravatar.cc/100',
              }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {profileData?.name || user?.name || 'Guest User'}
              </Text>
              <Text style={styles.phone}>
                {profileData?.phoneNumber || user?.phoneNumber || 'N/A'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onPress('edit')}
            >
              <Icon name="square-edit-outline" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={styles.walletRow}>
            <Text style={styles.walletLabel}>Wallet & Recharge</Text>
            <View style={styles.walletRight}>
              <Text style={styles.amount}>₹ {walletBalance.toFixed(0)}</Text>
              <TouchableOpacity
                style={styles.rechargeBtn}
                onPress={() => onPress('recharge')}
              >
                <Text style={styles.rechargeText}>Recharge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Action Grid */}
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => onPress('orders')}
          >
            <Icon name="history" size={22} color="#000" />
            <Text style={styles.gridLabel}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => onPress('wallet')}
          >
            <Icon name="wallet" size={22} color="#000" />
            <Text style={styles.gridLabel}>My Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate('ChatSupport')}
          >
            <Icon name="account-voice" size={22} color="#000" />
            <Text style={styles.gridLabel}>Astrologer Assistant</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Support */}
        <TouchableOpacity
          style={styles.supportRow}
          onPress={() => navigation.navigate('ChatSupport')}
        >
          <View style={styles.supportLeft}>
            <Icon name="headset" size={20} color="#000" />
            <Text style={styles.supportText}>Customer Support</Text>
          </View>
          <Icon name="chevron-right" size={22} color="#aaa" />
        </TouchableOpacity>

        {/* Account & Settings */}
        <Text style={styles.sectionTitle}>Account & Settings</Text>

        <TouchableOpacity
          style={styles.listRow}
          onPress={() => navigation.navigate('Following')}
        >
          <View style={styles.listLeft}>
            <Icon
              name="heart-outline"
              size={20}
              color="#000"
              style={styles.listIcon}
            />
            <Text style={styles.listText}>Favorite Astrologers</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listRow}
          onPress={() => navigation.navigate('Setting')}
        >
          <View style={styles.listLeft}>
            <Icon
              name="cog-outline"
              size={20}
              color="#000"
              style={styles.listIcon}
            />
            <Text style={styles.listText}>Settings</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listRow}
          onPress={() => navigation.navigate('ManagePrivacy')}
        >
          <View style={styles.listLeft}>
            <Icon
              name="lock-outline"
              size={20}
              color="#000"
              style={styles.listIcon}
            />
            <Text style={styles.listText}>Manage My Privacy</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#aaa" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'rgb(245, 245, 245)' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: '400', color: '#000' },
  container: { padding: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#eee',
  },
  profileTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
  },
  profileInfo: { marginLeft: 12, flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  phone: { color: '#555', marginTop: 2, fontSize: 14 },
  editButton: { padding: 6 },

  walletRow: {
    marginTop: 14,
    backgroundColor: '#fff8ee',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: { color: '#555', fontSize: 14 },
  walletRight: { flexDirection: 'row', alignItems: 'center' },
  amount: { fontSize: 18, fontWeight: '700', marginRight: 12 },
  rechargeBtn: {
    backgroundColor: '#FFD800',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  rechargeText: { fontWeight: '600', color: '#000' },

  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  gridLabel: { marginTop: 6, fontSize: 13, textAlign: 'center' },

  supportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 22,
  },
  supportLeft: { flexDirection: 'row', alignItems: 'center' },
  supportText: { fontSize: 15, marginLeft: 12, color: '#000' },

  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  listLeft: { flexDirection: 'row', alignItems: 'center' },
  listIcon: { marginRight: 12 },
  listText: { fontSize: 15, color: '#000' },
  leftIcon: {
    width: 25,
    height: 25,
    marginLeft: 5,
    tintColor: '#000',
  },
});
