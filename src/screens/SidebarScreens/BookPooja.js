import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BookPooja = ({ navigation }) => {
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
        <Text style={styles.headText}>Book Pooja</Text>
        <TouchableOpacity>
          <FontAwesome5 name="search" size={23} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />
    </View>
  );
};

export default BookPooja;

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
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    fontWeight: 'bold',
    // marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 150,
  },
});
