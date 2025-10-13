import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const BuyMembershipScreen = ({ navigation }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dummy data (replace with API response)
  const members = [
    {
      id: '1',
      name: 'Dishalli',
      skills: 'Tarot, Psychic, Numerology',
      languages: 'Hindi, English',
      exp: '4 Years',
      price: 28,
      orders: 5546,
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      name: 'Irya',
      skills: 'Tarot',
      languages: 'Hindi, English',
      exp: '1 Years',
      price: 23,
      orders: 4739,
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: '3',
      name: 'Anuga',
      skills: 'Tarot',
      languages: 'English, Hindi',
      exp: '2 Years',
      price: 20,
      orders: 1759,
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
  ];

  const handleBuyClick = member => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const renderMember = ({ item }) => (
    <View style={styles.card}>
      {/* Profile Image */}
      <Image source={{ uri: item.image }} style={styles.avatar} />

      {/* Details */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subText}>{item.skills}</Text>
        <Text style={styles.subText}>{item.languages}</Text>
        <Text style={styles.subText}>Exp: {item.exp}</Text>

        {/* Rating + Orders */}
        <View style={styles.row}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.orders}>{item.orders} orders</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>₹ {item.price}/min</Text>
      </View>

      {/* Membership Buy Button */}
      <TouchableOpacity
        style={styles.buyBadge}
        onPress={() => handleBuyClick(item)}
      >
        <Text style={styles.buyBadgeText}>Loyal Club @ ₹99</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buy Membership</Text>
        <TouchableOpacity>
          <Image
            source={require('../../assets/search.png')}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* List of Members */}
      <FlatList
        data={members}
        keyExtractor={item => item.id}
        renderItem={renderMember}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Bottom Popup Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Loyal Club Membership for {selectedMember?.name}
            </Text>
            <Text style={styles.modalText}>
              - Get flat 10% off on astrologer price{'\n'}
              - Talk longer at discounted rate{'\n'}
              - Priority in waitlist{'\n'}
              - Special loyalty rewards
            </Text>

            <TouchableOpacity
              style={styles.modalBuyBtn}
              onPress={() => {
                setShowModal(false);
                alert('Membership purchased successfully!');
              }}
            >
              <Text style={styles.modalBuyBtnText}>BUY @ ₹99</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BuyMembershipScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 2,
  },
  backIcon: { width: 20, height: 20, tintColor: '#000' },
  searchIcon: { width: 20, height: 20, tintColor: '#000', marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: '500', color: '#000' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#f6b900' },
  name: { fontSize: 16, fontWeight: '600', color: '#000' },
  subText: { fontSize: 13, color: '#555', marginTop: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  stars: { color: '#f6b900', fontSize: 14 },
  orders: { fontSize: 12, color: '#777', marginLeft: 6 },
  price: { fontSize: 14, fontWeight: '600', marginTop: 4 },

  buyBadge: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#00b36b',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  buyBadgeText: { fontSize: 12, color: '#00b36b', fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    minHeight: height * 0.35,
  },
  modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  modalText: { fontSize: 14, color: '#444', marginBottom: 20 },
  modalBuyBtn: {
    backgroundColor: '#f6b900',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalBuyBtnText: { fontSize: 15, fontWeight: '600', color: '#000' },
  modalCloseBtn: { alignItems: 'center', padding: 8 },
  modalCloseText: { color: '#666', fontSize: 14 },
});
