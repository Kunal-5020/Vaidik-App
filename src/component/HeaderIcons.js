import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderIcons = () => {
  const navigation = useNavigation();

  return (
    <View>
      {/* Profile Image */}
      <Image
        source={require('../assets/profile.png')}
        resizeMode="contain"
        style={styles.profileIcon}
      />

      {/* Menu Icon with gray background */}
      <TouchableOpacity
        style={styles.menuIconContainer}
        onPress={() => navigation.openDrawer()}
      >
        <Image
          source={require('../assets/menu.png')}
          resizeMode="contain"
          style={styles.menuIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderIcons;

const styles = StyleSheet.create({
  menuIconContainer: {
    position: 'absolute',
    top: 30,
    left: 55,
    zIndex: 10,
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  menuIcon: {
    width: 15,
    height: 15,
  },
  profileIcon: {
    width: 50,
    height: 50,
    marginLeft: 20,
  },
});
