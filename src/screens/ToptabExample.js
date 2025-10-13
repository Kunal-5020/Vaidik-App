// import * as React from 'react';
// import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
// import { TabView, TabBar } from 'react-native-tab-view';
// import PagerView from 'react-native-pager-view';

// const FirstRoute = () => (
//   <View style={[styles.scene, { backgroundColor: '#2196f3' }]}>
//     <Text style={styles.text}>Swipe or Click to change tabs</Text>
//   </View>
// );

// const SecondRoute = () => (
//   <View style={[styles.scene, { backgroundColor: '#4caf50' }]}>
//     <Text style={styles.text}>This is Tab 2</Text>
//   </View>
// );

// const ThirdRoute = () => (
//   <View style={[styles.scene, { backgroundColor: '#f44336' }]}>
//     <Text style={styles.text}>This is Tab 3</Text>
//   </View>
// );

// export default function App() {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = React.useState(0);
//   const [routes] = React.useState([
//     { key: 'first', title: 'Tab One' },
//     { key: 'second', title: 'Tab Two' },
//     { key: 'third', title: 'Tab Three' },
//   ]);

//   const renderScene = ({ route }) => {
//     switch (route.key) {
//       case 'first':
//         return <FirstRoute />;
//       case 'second':
//         return <SecondRoute />;
//       case 'third':
//         return <ThirdRoute />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//       swipeEnabled={true}
//       renderTabBar={props => (
//         <TabBar
//           {...props}
//           indicatorStyle={{ backgroundColor: '#fff' }}
//           style={{ backgroundColor: '#000' }}
//           labelStyle={{ color: '#fff', fontWeight: 'bold' }}
//         />
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   scene: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     color: '#fff',
//     fontSize: 20,
//     padding: 20,
//     textAlign: 'center',
//   },
// });

import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  Alert,
} from 'react-native';

const KeyboardAvoidingComponent = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.header}>Header</Text>
          <TextInput placeholder="Username" style={styles.textInput} />
          <TextInput placeholder="Username" style={styles.textInput} />
          <TextInput placeholder="Username" style={styles.textInput} />
          <TextInput placeholder="Username" style={styles.textInput} />
          <TextInput placeholder="Username" style={styles.textInput} />
          <TextInput placeholder="Username" style={styles.textInput} />
          
          <View style={styles.btnContainer}>
            <Button title="Submit" onPress={() => Alert.alert('helo')} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: -10,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});

export default KeyboardAvoidingComponent;
