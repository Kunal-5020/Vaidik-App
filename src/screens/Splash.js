import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { isAuthenticated, user, checkAuthStatus } = useAuth();

  useEffect(() => {
    const checkLoggedIn = async () => {
      await checkAuthStatus(); // refresh auth state from storage or API

      if (isAuthenticated && user) {
        navigation.reset({ index: 0, routes: [{ name: 'DrawerNavigation' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    };

    const timer = setTimeout(() => {
      checkLoggedIn();
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, user, checkAuthStatus]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Vaidik-logo.jpg')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 400,
    height: 400,
  },
});

export default SplashScreen;
