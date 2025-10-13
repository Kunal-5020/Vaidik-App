// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import HeaderIcons from '../../component/HeaderIcons'; // Correct import

// const Call = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <HeaderIcons />
//     </View>
//   );
// };

// export default Call;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import HeaderIcons from '../../component/HeaderIcons';

const Call = ({ navigation }) => {
  const [astrologers, setAstrologers] = useState([]);
  const [connectAgain, setConnectAgain] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [filterVisible, setFilterVisible] = useState(false);

  const categories = [
    'Filter',
    'All',
    'New',
    'Love',
    'Education',
    'Career',
    'Marriage',
    'Health',
    'Wealth',
    'Legal',
    'Favorite',
  ];

  // Dummy Data
  useEffect(() => {
    setConnectAgain([
      {
        id: 1,
        name: 'Maaya',
        price: 12,
        image: 'https://i.pravatar.cc/100?img=1',
      },
      {
        id: 2,
        name: 'Ashish9',
        price: 16,
        image: 'https://i.pravatar.cc/100?img=2',
      },
    ]);

    setAstrologers([
      {
        id: 1,
        name: 'Dishank',
        type: 'Vedic',
        lang: 'English, Hindi',
        exp: '4 Years',
        price: 20,
        orders: 2384,
        rating: 5,
        category: 'Love',
        image: 'https://i.pravatar.cc/100?img=5',
      },
      {
        id: 2,
        name: 'Arjunesh',
        type: 'Vedic',
        lang: 'English, Hindi',
        exp: '3 Years',
        price: 18,
        oldPrice: 22,
        orders: 6948,
        rating: 5,
        category: 'Career',
        image: 'https://i.pravatar.cc/100?img=6',
      },
      {
        id: 3,
        name: 'Mehira',
        type: 'Tarot, Life Coach',
        lang: 'English, Hindi',
        exp: '9 Years',
        price: 19,
        orders: 3086,
        rating: 5,
        category: 'New',
        image: 'https://i.pravatar.cc/100?img=7',
      },
      {
        id: 4,
        name: 'Rohit',
        type: 'Vedic, Marriage',
        lang: 'Hindi',
        exp: '6 Years',
        price: 25,
        orders: 1200,
        rating: 5,
        category: 'Marriage',
        image: 'https://i.pravatar.cc/100?img=8',
      },
    ]);
  }, []);

  // Filter astrologers by tab
  const filteredAstrologers =
    activeTab === 'All'
      ? astrologers
      : astrologers.filter(a => a.category === activeTab);

  // Render astrologer card
  const renderAstrologer = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>{item.type}</Text>
        <Text style={styles.sub}>{item.lang}</Text>
        <Text style={styles.sub}>Exp- {item.exp}</Text>

        {/* Orders + rating */}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
        >
          <Text>{'⭐'.repeat(item.rating)}</Text>
          <Text style={styles.orders}> {item.orders} orders</Text>
        </View>

        {/* Price */}
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          {item.oldPrice && (
            <Text style={styles.oldPrice}>₹ {item.oldPrice}</Text>
          )}
          <Text style={styles.price}>₹ {item.price}/min</Text>
        </View>
      </View>
      {/* =====================green tick verified account==================== */}
      <View style={{ height: 15, width: 15, left: 50 }}>
        <Image
          source={require('../../assets/check.png')} // 👈 your blue tick image
          style={styles.tickIcon}
        />
      </View>

      {/* Chat button */}
      <TouchableOpacity style={styles.chatBtn}>
        <Text style={styles.chatText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <HeaderIcons />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddCash')}
          >
            <Ionicons name="cash" size={20} color="#0d1a3c" />
            <Text style={styles.addText}>Add Cash</Text>
            <Ionicons name="add-circle" size={20} color="#0d1a3c" />
          </TouchableOpacity>

          {/* Search Astro , product */}
          <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
            <Feather
              name="search"
              size={24}
              color="#888"
              style={styles.searchIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chatIconButton}
            onPress={() => navigation.navigate('Messenger')}
          >
            <Image
              source={require('../../assets/messenger.png')}
              style={styles.chatIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.lineOfheader}>
          {/* Connect Again */}
          <Text style={styles.sectionTitle}>Connect Again</Text>
          <View style={styles.line} />
        </View>
        <View
          style={{
            borderWidth: 0,
            width: '98%',
            left: 6,
            borderRadius: 24,
            backgroundColor: '#fff',
          }}
        >
          <FlatList
            horizontal
            data={connectAgain}
            renderItem={({ item }) => (
              <View style={styles.connectCard}>
                <Image source={{ uri: item.image }} style={styles.connectImg} />
                <Text style={styles.connectName}>{item.name}</Text>
                <Text style={styles.connectPrice}>₹ {item.price}/min</Text>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 15 }}
          />
        </View>
        <View style={styles.line2} />

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabRow}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.tabButton,
                activeTab === cat && styles.activeTabButton,
              ]}
              onPress={() =>
                cat === 'Filter' ? setFilterVisible(true) : setActiveTab(cat)
              }
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === cat && styles.activeTabText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Astrologer List */}
        <FlatList
          data={filteredAstrologers}
          renderItem={renderAstrologer}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}
            >
              Filter Options
            </Text>
            <Text>👉 Add your filter inputs here</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Call;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgb(245, 245, 245)', paddingTop: -1 },

  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  chatIconButton: { padding: 5 },
  chatIcon: { width: 22, height: 24, resizeMode: 'contain', right: 15 },
  searchIcon: { left: 20 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'grey',
    marginLeft: 13,
  },
  lineOfheader: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    bottom: 1,
  },
  connectCard: {
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 15,
    marginTop: 8,
  },
  connectImg: { width: 60, height: 60, borderRadius: 30, marginBottom: 5 },
  connectName: { fontSize: 13, fontWeight: '500' },
  connectPrice: { fontSize: 12, color: '#555' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    left: 60,
  },
  addText: { color: '#0d1a3c', fontWeight: 'bold', marginLeft: 5 },
  tabRow: { marginBottom: 15, flexGrow: 0, marginTop: 10 },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#fff',
    left: 6,
  },
  activeTabButton: {
    backgroundColor: '#000333',
    borderColor: '#ffd700',
  },
  tabText: { fontSize: 14, color: '#555' },
  activeTabText: { fontWeight: 'bold', color: 'white' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    width: '95%',
    left: 12,
  },
  line: {
    marginTop: -3,
    height: 1,
    width: '65%',
    backgroundColor: 'grey',
    left: 10,
  },
  line2: {
    // marginTop: -3,
    // height: 2,                // make height > 1 so borderRadius works
    // width: '95%',
    // backgroundColor: '#000011',
    // borderRadius: 50,         // large value = pill/curve shape
    // alignSelf: 'center',
    // marginBottom: 10,
  },
  tickIcon: {
    width: 18,
    height: 18,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  avatar: { width: 60, height: 60, borderRadius: 30 },
  name: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 13, color: '#555' },
  orders: { fontSize: 12, color: '#777' },
  oldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  price: { fontSize: 14, fontWeight: '600', color: '#222' },
  chatBtn: {
    backgroundColor: '#fff',
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  chatText: { color: 'green', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: '#d33',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
