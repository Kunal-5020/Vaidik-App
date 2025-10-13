import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

const SearchScreen = ({ navigation }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus input when screen opens
    const showKeyboard = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(showKeyboard);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
      {/* Search Bar with Back Button */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="arrow-left"
            size={22}
            color="#000"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          placeholder="Search astrologers, astromall products"
          placeholderTextColor="#888"
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={e => console.log('Searching:', e.nativeEvent.text)}
        />
      </View>

      {/* Top Services */}
      <Text style={styles.sectionTitle}>Top Services</Text>
      <View style={styles.servicesRow}>
        <View style={[styles.serviceTag, { backgroundColor: '#EAF2FF' }]}>
          <TouchableOpacity>
            <Text style={styles.serviceText}>📞 Call</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.serviceTag, { backgroundColor: '#FCEAFF' }]}>
          <TouchableOpacity>
            <Text style={styles.serviceText}>💬 Chat</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.serviceTag, { backgroundColor: '#FFF9E5' }]}>
          <TouchableOpacity>
            <Text style={styles.serviceText}>📡 Live</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.serviceTag, { backgroundColor: '#E7FFF5' }]}>
          <TouchableOpacity>
            <Text style={styles.serviceText}>🛍️ AstroMall</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Links */}
      <Text style={styles.sectionTitle}>Quick Link</Text>
      <View style={styles.quickRow}>
        {/* Wallet */}
        <TouchableOpacity style={styles.quickCard}>
          <MaterialCommunityIcons
            name="wallet-outline"
            size={28}
            color="pink"
          />
          <Text style={styles.quickText}>Wallet</Text>
        </TouchableOpacity>

        {/* Support */}
        <TouchableOpacity style={styles.quickCard}>
          <Feather name="headphones" size={28} color="skyblue" />
          <Text style={styles.quickText}>Support</Text>
        </TouchableOpacity>

        {/* Orders */}
        <TouchableOpacity style={styles.quickCard}>
          <Feather name="shopping-bag" size={28} color="green" />
          <Text style={styles.quickText}>Orders</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity style={styles.quickCard}>
          <Feather name="user" size={28} color="blue" />
          <Text style={styles.quickText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#f5f5f5'},
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fb',
    borderRadius: 25,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#000' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginVertical: 12 },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  serviceTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  serviceText: { fontWeight: '500', color: '#333' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quickCard: {
    width: '22%',
    height: 80,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
