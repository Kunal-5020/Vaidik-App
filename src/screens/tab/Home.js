import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import HeaderIcons from '../../component/HeaderIcons';
// import HomeStyle from '../../style/HomeStyle';

const Home = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ENG');

  // const styles = HomeStyle;
  const languages = [
    { code: 'ENG', name: 'English' },
    { code: 'हिंदी', name: 'Hindi' },
    { code: 'FRA', name: 'French' },
  ];

  const handleApplyLanguage = () => {
    setModalVisible(false);
    // Add your language change logic here if needed
  };

  return (
    <ScrollView style={styles.mainCantainer}>
      <View style={styles.container}>
        {/* Top Row: Profile Icons & Add Cash Button */}
        <View style={styles.topRow}>
          <HeaderIcons />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddCash')}
            >
              <Ionicons name="add-circle" size={20} color="#0d1a3c" />
              <Text style={styles.addText}>Add Cash</Text>
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

            {/* Language Selector Modal */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={styles.crossButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Image
                      source={require('../../assets/cross.png')}
                      style={styles.sidebargirls}
                    />
                  </TouchableOpacity>
                  <Text style={styles.cardTitle}>Choose Language</Text>
                  {languages.map(lang => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.langOption,
                        selectedLanguage === lang.code &&
                          styles.selectedLangOption,
                      ]}
                      onPress={() => setSelectedLanguage(lang.code)}
                    >
                      <Text
                        style={[
                          styles.langText,
                          selectedLanguage === lang.code &&
                            styles.selectedLangText,
                        ]}
                      >
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={handleApplyLanguage}
                  >
                    <Text style={{ fontWeight: 'bold' }}>APPLY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              style={styles.profileIconContainer}
              onPress={() => navigation.navigate('CustomerSupport')}
            >
              <Image
                source={require('../../assets/call-agent.png')}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View>
          <TouchableOpacity
            style={styles.searchBarContainer}
            onPress={() => navigation.navigate('SearchScreen')}
          >
            <Text style={styles.searchInput}>
              Search astrologers, astromall products
            </Text>
            <Feather
              name="search"
              size={24}
              color="#888"
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 MENU ITEMS */}
      <View style={styles.menuRow}>
        {[
          'Daily Horoscope',
          'Free Kundli',
          'Kundli Matching',
          'Astrology Blog',
        ].map((item, i) => (
          <View key={i} style={styles.menuItem}>
            <Ionicons name="star" size={28} color="#ffc107" />
            <Text style={styles.menuText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* 🔥 BANNER */}
      <View style={styles.banner}>
        <Ionicons name="person" size={50} color="#ff9800" />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.bannerText}>
            What will my future be in the next 5 years?
          </Text>
          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatBtnText}>Chat Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 LIVE ASTROLOGERS */}
      <Text style={styles.sectionTitle}>Live Astrologers</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
      >
        {['JyotiJ', 'Surinder1', 'Rubhika', 'Amar'].map((name, i) => (
          <View key={i} style={styles.astrologerCard}>
            <Ionicons name="person-circle" size={60} color="#888" />
            <Text style={styles.astroName}>{name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 🔥 OFFER CARD */}
      <View style={styles.offerCard}>
        <Ionicons name="chatbubble-ellipses" size={40} color="#e91e63" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.offerText}>Got any questions?</Text>
          <Text>Chat with Astrologer @INR 5/min</Text>
        </View>
        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatBtnText}>Chat Now</Text>
        </TouchableOpacity>

        {/* ============================= */}
      </View>
      {/* ============================= */}
      {/* 🔥 OFFER CARD */}
      <View style={styles.offerCard}>
        <Ionicons name="chatbubble-ellipses" size={40} color="#e91e63" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.offerText}>Got any questions?</Text>
          <Text>Chat with Astrologer @INR 5/min</Text>
        </View>
        <TouchableOpacity style={styles.chatBtn}>
          <Text style={styles.chatBtnText}>Chat Now</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 MY SESSIONS */}
      <Text style={styles.sectionTitle}>My Sessions</Text>
      <View style={styles.sessionRow}>
        <TouchableOpacity style={styles.sessionBtn}>
          <Text style={styles.sessionBtnText}>Chat with Astrologer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sessionBtn}>
          <Text style={styles.sessionBtnText}>Call with Astrologer</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 NEW BLACK OFFER */}
      <View style={styles.offerCardBlack}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
          }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.offerTitle}>Got any questions?</Text>
          <Text style={styles.offerSubtitle}>
            Chat with Astrologer @INR 5/min
          </Text>
        </View>
        <TouchableOpacity style={styles.chatNowYellow}>
          <Text style={styles.chatBtnText}>Chat Now</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 MY SESSIONS CARD */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Sessions</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <View style={styles.sessionCard}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.sessionAvatar}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.sessionName}>Vanshujeet</Text>
          <Text style={styles.sessionDate}>10 Jul 2024</Text>
        </View>
        <TouchableOpacity style={styles.viewBtn}>
          <Text>View Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatAgainBtn}>
          <Text style={{ color: 'white' }}>Chat Again</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 ASTROLOGERS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Astrologers</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
      >
        {[
          { name: 'Astro Ashutosh', rate: '₹ 60/min' },
          { name: 'Astro Sanket', rate: '₹ 51/min' },
          { name: 'Tarot DrRashmi', rate: '₹ 120/min' },
        ].map((astro, i) => (
          <View key={i} style={styles.astroCard}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
              }}
              style={styles.astroAvatar}
            />
            <Text style={styles.astroName}>{astro.name}</Text>
            <Text style={styles.astroRate}>{astro.rate}</Text>
            <TouchableOpacity style={styles.chatBtnOutline}>
              <Text style={{ color: 'green', fontWeight: 'bold' }}>Chat</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainCantainer: { flex: 1, backgroundColor: 'white' },
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  addText: { color: '#0d1a3c', fontWeight: 'bold', marginLeft: 5 },
  translatorIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  translator: { width: 30, height: 30, tintColor: 'grey' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },
  searchIcon: { marginLeft: 10 },

  // 🔥 NEW STYLES
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  menuItem: { alignItems: 'center', width: '23%' },
  menuText: { fontSize: 12, marginTop: 5, textAlign: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    padding: 15,
    borderRadius: 12,
    margin: 10,
  },
  bannerText: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  chatBtn: {
    backgroundColor: '#fdd835',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 5,
  },
  chatBtnText: { fontWeight: 'bold', fontSize: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 20,
  },
  astrologerCard: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    width: 90,
  },
  astroName: { marginTop: 5, fontSize: 12 },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f0',
    padding: 15,
    borderRadius: 12,
    margin: 10,
  },
  offerText: { fontSize: 14, fontWeight: 'bold' },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  sessionBtn: {
    flex: 1,
    backgroundColor: '#fdd835',
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  sessionBtnText: { fontWeight: 'bold', fontSize: 12 },
  sidebargirls: { width: 25, height: 25 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 20,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
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
  offerCardBlack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 12,
    margin: 10,
  },
  offerTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  offerSubtitle: { color: 'white', fontSize: 12 },
  chatNowYellow: {
    backgroundColor: '#fdd835',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  viewAll: { fontSize: 12, color: 'grey' },

  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sessionAvatar: { width: 60, height: 60, borderRadius: 30 },
  sessionName: { fontWeight: 'bold', fontSize: 14 },
  sessionDate: { fontSize: 12, color: 'grey' },
  viewBtn: {
    borderWidth: 1,
    borderColor: '#fdd835',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
  },
  chatAgainBtn: {
    backgroundColor: '#fdd835',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  astroCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    width: 140,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  astroAvatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  // astroName: { fontWeight: "bold", fontSize: 14, textAlign: "center" },
  astroRate: { fontSize: 12, color: 'grey', marginBottom: 8 },
  chatBtnOutline: {
    borderWidth: 1,
    borderColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
});
