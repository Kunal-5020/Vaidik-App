import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const RewardScreen = ({ navigation }) => {
  const handleExplore = () => {
    navigation.navigate('DrawerNavigation', {
      screen: 'RootTabs',
      params: { screen: 'Chat' },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.skipWrapper}>
          <TouchableOpacity onPress={handleExplore}>
            <Text style={styles.skipText}>Explore more</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/Vaidik-talk.png')}
            style={styles.logo}
          />
          <Text style={styles.vaidik}>Vaidik</Text>
          <Text style={styles.talk}> talk</Text>
        </View>
      </View>

      <View style={styles.messageBox}>
        <Text style={styles.message}>
          Congratulations you got a{' '}
          <Text style={styles.highlight}>Free Chat!</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Details')}
      >
        <Text style={styles.buttonText}>Start Free Chat</Text>
      </TouchableOpacity>
    </View>
  );
};
export default RewardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'hsla(253, 93%, 10%, 1.00)',
    backgroundColor: '#000033',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '120%',
    height: 234,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 16,
    marginVertical: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skipWrapper: {
    alignSelf: 'flex-end', // Align to right of parent
    alignItems: 'center', // Center line under text
    marginTop: 1, // Space from top or other content
    marginRight: 15, // Optional: space from right edge
  },
  skipText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: '400',
    marginTop: -8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 5,
    marginLeft: 42,
  },
  vaidik: {
    fontSize: 38,
    fontWeight: '700',
    color: '#1E2A38',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 12,
  },
  talk: {
    fontSize: 38,
    fontWeight: '400',
    color: '#000',
    marginLeft: 8,
    marginTop: 12,
  },
  messageBox: {
    backgroundColor: 'hsla(253, 93%, 10%, 1.00)',
    marginVertical: 60,
    padding: 20,
    borderRadius: 10,
  },
  message: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 95,
    width: '98%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  truecallerIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
