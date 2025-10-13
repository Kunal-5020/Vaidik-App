import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {SafeAreaView} from 'react-native-safe-area-context';

const amounts = [
  { id: 1, value: 50, bonus: '100% Extra' },
  { id: 2, value: 100, bonus: '100% Extra' },
  { id: 3, value: 200, bonus: '100% Extra' },
  { id: 4, value: 500, bonus: '100% Extra', popular: true },
  { id: 5, value: 1000, bonus: '10% Extra' },
  { id: 6, value: 2000, bonus: '10% Extra' },
  { id: 7, value: 3000, bonus: '10% Extra' },
  { id: 8, value: 4000, bonus: '12% Extra' },
  { id: 9, value: 8000, bonus: '12% Extra' },
  { id: 10, value: 15000, bonus: '15% Extra' },
  { id: 11, value: 20000, bonus: '15% Extra' },
  { id: 12, value: 50000, bonus: '20% Extra' },
  { id: 13, value: 100000, bonus: '20% Extra' },
];

const AddMoneyScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');

  const handleProceed = () => {
    if (!amount || amount.trim() === '') {
      Alert.alert('Validation', 'Please enter the amount');
      return;
    }
    navigation.navigate('PaymentInfo', { amount: Number(amount) });
  };

  const renderCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PaymentInfo', { amount: item.value })}
      >
        {item.popular && (
          <View style={styles.popularTag}>
            <Text style={styles.popularText}>★ Most Popular</Text>
          </View>
        )}
        <Text style={styles.amount}>{item.value}</Text>
        <Text style={styles.bonus}>{item.bonus}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add money to wallet</Text>
        <View style={styles.walletBox}>
          <Feather name="credit-card" size={18} color="#000" />
          <Text style={styles.walletText}> ₹119 </Text>
        </View>
      </View>

      <View style={styles.line} />

      {/* Input + Proceed button */}
      <View style={styles.phoneContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount in INR"
          placeholderTextColor="grey"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.buttonProceed} onPress={handleProceed}>
          <Text style={styles.buttonProceedText}>Proceed</Text>
        </TouchableOpacity>
      </View>

      {/* Amount Grid */}
      <FlatList
        data={amounts}
        renderItem={renderCard}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
    </SafeAreaView>
  );
};

export default AddMoneyScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, backgroundColor: 'rgb(245, 245, 245)', padding: 15 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 30,
    flex: 1,
  },
  walletBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  walletText: { fontSize: 13, fontWeight: '600' },

  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  amount: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  bonus: { fontSize: 13, color: 'green', fontWeight: '500' },

  popularTag: {
    position: 'absolute',
    top: -7,
    left: 0,
    backgroundColor: '#ff7043',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  popularText: { fontSize: 10, color: '#fff', fontWeight: '600' },

  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '95%',
    marginBottom: 15,
    backgroundColor: 'white',
    marginTop: 16,
    marginLeft: 14,
  },
  buttonProceed: {
    backgroundColor: '#f8d900',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonProceedText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginLeft: 15,
    marginTop: 5,
    tintColor: 'grey',
  },
  line: {
    marginTop: 1,
    height: 1,
    width: '110%',
    backgroundColor: '#ccc',
    right: 10,
  },
});

