import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigation from './src/AppNavigator/AppNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Toptab from './src/screens/ToptabExample';
// import Ecommerce from './src/screens/Ecommerce';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <AppNavigation />
      {/* <Toptab /> */}
      {/* <Ecommerce /> */}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
