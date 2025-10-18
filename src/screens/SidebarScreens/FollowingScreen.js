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
import {SafeAreaView} from 'react-native-safe-area-context';

const FollowingScreen = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={styles.cantainer}>
      <View style={styles.headerCantainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headText}>Fallowing</Text>
      </View>

      <View style={styles.line} />
    </View>
    </SafeAreaView>
  );
};

export default FollowingScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#f5f5f5'},
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
