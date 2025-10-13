// screens/TabOneScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

// Dummy Data
const orders = [
  {
    id: '1',
    name: 'Astrologer',
    message: 'Aane wale 6 mahine mein kuch badlav dik...',
    date: '20 Sep 2025',
    // avatar: require('./assets/astrologer.png'), // replace with your astrologer icon
  },
  {
    id: '2',
    name: 'Astrologer',
    message: 'Ek baar recharge karke chat time badha lij...',
    date: '23 Mar 2025',
    // avatar: require('./assets/astrologer.png'),
  },
  {
    id: '3',
    name: 'Vanshujeet',
    message: 'last December tak',
    date: '10 Jul 2024',
    // avatar: require('./assets/vanshujeet.png'), // replace with real image
  },
  {
    id: '4',
    name: 'Maaya',
    message: 'aapki taraf se jawab na aane Ke Karan ha...',
    date: '08 Sep 2023',
    // avatar: require('./assets/maaya.png'),
  },
];
const Orders = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.orderDetails}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
};

const styles = StyleSheet.create({
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  orderDetails: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  message: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
});

export default Orders;
