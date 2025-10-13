import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const RedeemGiftScreen = ({ navigation }) => {
  const [giftCode, setGiftCode] = useState('');
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.cantainer}>
      <View style={styles.headerCantainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headText}>Redeem Gift</Text>
      </View>

      <View style={styles.line} />

      {/* gift card body of content  start from here  */}
      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter Gift Card Code"
          placeholderTextColor="grey"
          keyboardType="phone-pad"
          value={giftCode}
          onChangeText={setGiftCode}
        />
      </View>
      <TouchableOpacity style={styles.GiftButton}>
        <Text style={styles.GiftButtonText}>Redeem Gift Card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RedeemGiftScreen;

const styles = StyleSheet.create({
  cantainer: {
    flex: 1,
    marginTop: 20,
  },
  headerCantainer: {
    flexDirection: 'row',
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginLeft: 20,
    marginTop: 5,
  },
  headText: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 15,
    marginLeft: 45,
  },
  line: {
    marginTop: 1,
    height: 1,
    width: '%',
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 150,
  },
  input: {
    width: '90%',
    height: 50,
    marginTop: 40,
    fontSize: 16,
    paddingVertical: 12,
    fontWeight: 'bold',
    marginLeft: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  GiftButton: {
    backgroundColor: '#FFD700',
    width: '90%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    // elevation: 3, // Android shadow
    // shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    // shadowRadius: 3,
    marginLeft: 20,
  },

  GiftButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
