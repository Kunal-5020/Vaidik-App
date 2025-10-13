// screens/TabTwoScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Remedies = () => (
  <View style={[styles.scene, { backgroundColor: '#fff' }]}>
    <Text style={styles.text}>you do not have any remedy suggestion from Astro yet!</Text>
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

export default Remedies;
