import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RootTabNavigation from './RootTabNavigation';
import CustomDrawerContent from '../component/CustomDrawerContent';
import {SafeAreaView} from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
// import AppNavigation from './AppNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="RootTabs" component={RootTabNavigation} />
      {/* <Drawer.Screen name="AppNavigation" component={AppNavigation} /> */}
    </Drawer.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#f5f5f5'}
});

export default DrawerNavigation;
