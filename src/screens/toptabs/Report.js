// screens/TabThreeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Report = () => (
  <View style={[styles.scene, { backgroundColor: '#fff' }]}>
    <Text style={styles.text}>You have not created any reports yet!</Text>
  </View>
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    // color: '#fff',
    fontSize: 15,
    padding: 20,
    textAlign: 'center',
  },
});

export default Report;
