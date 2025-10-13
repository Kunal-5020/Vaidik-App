import React from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/tab/Home';
import Call from '../screens/tab/Call';
import Live from '../screens/tab/Live';
import Remedies from '../screens/tab/Remedies';
import Chat from '../screens/tab/Chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import HeaderIcons from '../component/HeaderIcons';

const Tab = createBottomTabNavigator();

const RootTabNavigation = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000033',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          } else if (route.name === 'Chat') {
            iconName = 'chatbubble-ellipses-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Live') {
            return (
              <Image
                source={require('../assets/live.png')} // your custom image path
                style={{ width: size, height: size, tintColor: color }}
                resizeMode="contain"
              />
            );
          } else if (route.name === 'Call') {
            iconName = 'call-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Remedies') {
            iconName = 'medkit-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }

          return null;
        },
      })}
    >
      {/* 🔁 Reordered as requested */}
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} />

      {/* 🔴 Live as Button */}
      <Tab.Screen
        name="Live"
        component={View} // dummy placeholder
        options={{
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => navigation.navigate('LiveStreamScreen')}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/live.png')}
                style={{ width: 30, height: 30, tintColor: 'grey', top: 10 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen name="Call" component={Call} />
      <Tab.Screen name="Remedies" component={Remedies} />
    </Tab.Navigator>
  );
};

export default RootTabNavigation;
