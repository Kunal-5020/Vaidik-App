// src/screens/Home/Home.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderIcons from '../../component/HeaderIcons';
import astrologerService from '../../services/api/AstrologerService';
import orderService from '../../services/api/OrderService';
import walletService from '../../services/api/WalletService';
import userService from '../../services/api/UserService';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const { user } = useAuth();
  
  // ✅ FIX: All hooks must be at the top in the same order
  const scrollViewRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ENG');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [liveAstrologers, setLiveAstrologers] = useState([]);
  const [chatAstrologers, setChatAstrologers] = useState([]);

  const languages = [
    { code: 'ENG', name: 'English' },
    { code: 'हिंदी', name: 'Hindi' },
    { code: 'FRA', name: 'French' },
  ];

  // Top banners (auto-toggle)
  const banners = [
    {
      id: 1,
      text: 'What will my future be in the next 5 years?',
      icon: 'person',
      color: '#ff9800',
      bg: '#fff8e1',
    },
    {
      id: 2,
      text: 'Get instant answers to your questions',
      icon: 'chatbubble-ellipses',
      color: '#e91e63',
      bg: '#fce4ec',
    },
  ];

  useEffect(() => {
    loadHomeData();
    
    // Auto-toggle banners every 5 seconds
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load all home screen data
  const loadHomeData = async () => {
    setLoading(true);
    try {
      // Load wallet balance
      try {
        const walletResponse = await walletService.getWalletStats();
        if (walletResponse.success) {
          setWalletBalance(walletResponse.data.currentBalance || 0);
        }
      } catch (error) {
        console.log('Wallet fetch skipped');
      }

      // Load all astrologers
      try {
        const response = await astrologerService.getAstrologers({
          page: 1,
          limit: 20,
        });
        if (response.success) {
          const astros = response.data.astrologers;
          // Filter online astrologers
          const onlineAstros = astros.filter((astro) => astro.availability?.isOnline === true);
          setLiveAstrologers(onlineAstros);
          setChatAstrologers(astros);
        }
      } catch (error) {
        console.log('Astrologers fetch skipped');
      }
    } catch (error) {
      console.error('Load home data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLanguage = async () => {
    try {
      const langCode = selectedLanguage === 'ENG' ? 'en' : selectedLanguage === 'हिंदी' ? 'hi' : 'fr';
      await userService.updatePreferences({ appLanguage: langCode });
      setModalVisible(false);
      Alert.alert('Success', 'Language updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update language');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView ref={scrollViewRef} style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Top Row: Profile Icons & Add Cash Button */}
          <View style={styles.topRow}>
            <HeaderIcons />

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCash')}
              >
                <Ionicons name="wallet" size={18} color="#0d1a3c" />
                <Text style={styles.addText}>₹{walletBalance.toFixed(0)}</Text>
                <Ionicons name="add-circle" size={18} color="#0d1a3c" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.translatorIconContainer]}
                onPress={() => setModalVisible(true)}
              >
                <Image
                  source={require('../../assets/translator.png')}
                  style={styles.translator}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileIconContainer}
                onPress={() => navigation.navigate('ChatSupport')}
              >
                <Image
                  source={require('../../assets/call-agent.png')}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <TouchableOpacity
            style={styles.searchBarContainer}
            onPress={() => navigation.navigate('SearchScreen')}
          >
            <Text style={styles.searchInput}>Search astrologers, astromall products</Text>
            <Feather name="search" size={24} color="#888" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fdd835" />
          </View>
        ) : (
          <>
            {/* 1. AUTO-TOGGLE BANNER */}
            <View style={[styles.banner, { backgroundColor: banners[currentBannerIndex].bg }]}>
              <Ionicons name={banners[currentBannerIndex].icon} size={50} color={banners[currentBannerIndex].color} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.bannerText}>{banners[currentBannerIndex].text}</Text>
                <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('Chat')}>
                  <Text style={styles.chatBtnText}>Chat Now</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. LIVE ASTROLOGERS */}
            {liveAstrologers.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Live Astrologers</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Call')}>
                    <Text style={styles.viewAll}>View All</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                  {liveAstrologers.map((astro) => (
                    <TouchableOpacity
                      key={astro._id}
                      style={styles.astrologerCard}
                      onPress={() => navigation.navigate('AstrologerProfile', { astrologerId: astro._id })}
                    >
                      <Image
                        source={{ uri: astro.profilePicture || 'https://i.pravatar.cc/100' }}
                        style={styles.liveAvatar}
                      />
                      <Text style={styles.astroName} numberOfLines={1}>
                        {astro.name}
                      </Text>
                      <View style={styles.onlineDot} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {/* 3. MIDDLE BANNER */}
            <View style={styles.offerCard}>
              <Ionicons name="gift" size={40} color="#4CAF50" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.offerText}>First Chat Free!</Text>
                <Text style={styles.offerSubText}>Get 5 minutes consultation absolutely free</Text>
              </View>
            </View>

            {/* 4. ASTROLOGERS FOR CHAT */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Astrologers for Chat</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {chatAstrologers.slice(0, 5).map((astro) => (
                <View key={astro._id} style={styles.astroCard}>
                  <Image
                    source={{ uri: astro.profilePicture || 'https://i.pravatar.cc/100' }}
                    style={styles.astroAvatar}
                  />
                  <Text style={styles.astroName} numberOfLines={1}>
                    {astro.name}
                  </Text>
                  <Text style={styles.astroRate}>₹ {astro.pricing?.chat || 5}/min</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{astro.ratings?.average?.toFixed(1) || '5.0'}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.chatBtnOutline}
                    onPress={() => navigation.navigate('AstrologerProfile', { astrologerId: astro._id })}
                  >
                    <Text style={{ color: 'green', fontWeight: 'bold' }}>Chat</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* 5. VAIDIK REMEDY */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vaidik Remedy</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {['Gemstone', 'Rudraksha', 'Yantra', 'Pooja'].map((remedy, idx) => (
                <View key={idx} style={styles.remedyCard}>
                  <Image
                    source={{ uri: `https://cdn-icons-png.flaticon.com/512/${1000 + idx}/1000${idx}.png` }}
                    style={styles.remedyImage}
                  />
                  <Text style={styles.remedyText}>{remedy}</Text>
                </View>
              ))}
            </ScrollView>

            {/* 6. VAIDIKTALK STORE */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vaidiktalk Store</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {['Books', 'Idols', 'Crystals', 'Incense'].map((product, idx) => (
                <View key={idx} style={styles.productCard}>
                  <Image
                    source={{ uri: `https://cdn-icons-png.flaticon.com/512/${2000 + idx}/2000${idx}.png` }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{product}</Text>
                  <Text style={styles.productPrice}>₹ {(idx + 1) * 100}</Text>
                </View>
              ))}
            </ScrollView>

            {/* 7. TRUST INDICATORS */}
            <View style={styles.trustSection}>
              <View style={styles.trustCard}>
                <MaterialCommunityIcons name="shield-lock" size={40} color="#4CAF50" />
                <Text style={styles.trustTitle}>Private & Confidential</Text>
                <Text style={styles.trustDesc}>Your information is 100% secure</Text>
              </View>
              <View style={styles.trustCard}>
                <MaterialCommunityIcons name="certificate" size={40} color="#2196F3" />
                <Text style={styles.trustTitle}>Verified Astrologers</Text>
                <Text style={styles.trustDesc}>All astrologers are certified</Text>
              </View>
              <View style={styles.trustCard}>
                <MaterialCommunityIcons name="credit-card-check" size={40} color="#FF9800" />
                <Text style={styles.trustTitle}>Secure Payments</Text>
                <Text style={styles.trustDesc}>100% payment protection</Text>
              </View>
            </View>

            <View style={{ height: 100 }} />
          </>
        )}
      </ScrollView>

      {/* FLOATING ACTION BUTTONS */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={[styles.floatingBtn, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('Chat')}
        >
          <MaterialCommunityIcons name="chat" size={20} color="#fff" />
          <Text style={styles.floatingBtnText}>Chat with Astrologer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatingBtn, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('Call')}
        >
          <MaterialCommunityIcons name="phone" size={20} color="#fff" />
          <Text style={styles.floatingBtnText}>Call with Astrologer</Text>
        </TouchableOpacity>
      </View>

      {/* Language Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.crossButton} onPress={() => setModalVisible(false)}>
              <Image source={require('../../assets/cross.png')} style={styles.sidebargirls} />
            </TouchableOpacity>
            <Text style={styles.cardTitle}>Choose Language</Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  selectedLanguage === lang.code && styles.selectedLangOption,
                ]}
                onPress={() => setSelectedLanguage(lang.code)}
              >
                <Text
                  style={[
                    styles.langText,
                    selectedLanguage === lang.code && styles.selectedLangText,
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.applyBtn} onPress={handleApplyLanguage}>
              <Text style={{ fontWeight: 'bold' }}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: 'white' },
  container: {
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 5,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  addText: { color: '#0d1a3c', fontWeight: 'bold', marginLeft: 5, marginRight: 5, fontSize: 13 },
  translatorIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  translator: { width: 28, height: 28, tintColor: 'grey' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginHorizontal: 10,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: '#999' },
  searchIcon: { marginLeft: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    margin: 10,
    marginTop: 15,
  },
  bannerText: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#000' },
  chatBtn: {
    backgroundColor: '#fdd835',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  chatBtnText: { fontWeight: '700', fontSize: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#000' },
  viewAll: { fontSize: 13, color: '#fdd835', fontWeight: '600' },
  astrologerCard: {
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    width: 90,
    position: 'relative',
  },
  liveAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#4CAF50' },
  astroName: { marginTop: 6, fontSize: 12, fontWeight: '600', textAlign: 'center', color: '#000' },
  onlineDot: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    margin: 10,
    marginTop: 15,
  },
  offerText: { fontSize: 16, fontWeight: '700', color: '#000' },
  offerSubText: { fontSize: 12, color: '#666', marginTop: 4 },
  astroCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
    width: 130,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  astroAvatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  astroRate: { fontSize: 12, color: '#4CAF50', fontWeight: '600', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { fontSize: 12, marginLeft: 4, color: '#666' },
  chatBtnOutline: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  remedyCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  remedyImage: { width: 50, height: 50, marginBottom: 8 },
  remedyText: { fontSize: 12, fontWeight: '600', color: '#000' },
  productCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    width: 110,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productImage: { width: 60, height: 60, marginBottom: 8 },
  productName: { fontSize: 12, fontWeight: '600', color: '#000', marginBottom: 4 },
  productPrice: { fontSize: 13, fontWeight: '700', color: '#4CAF50' },
  trustSection: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  trustCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  trustTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginTop: 10 },
  trustDesc: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },
  floatingButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  floatingBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  floatingBtnText: { fontSize: 13, fontWeight: '700', color: '#fff', marginLeft: 6 },
  sidebargirls: { width: 25, height: 25 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 20,
  },
  cardTitle: { fontWeight: 'bold', marginBottom: 15, fontSize: 18, textAlign: 'center' },
  langOption: {
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  selectedLangOption: { backgroundColor: 'lightyellow' },
  langText: { fontSize: 16, color: '#333', textAlign: 'center' },
  selectedLangText: { fontWeight: 'bold', color: '#000' },
  applyBtn: {
    backgroundColor: '#ffd700',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  crossButton: { borderRadius: 12, alignItems: 'flex-end', marginBottom: -5 },
});
