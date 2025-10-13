import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Orders from '../screens/toptabs/Orders';
import Wallet from '../screens/toptabs/Wallet';
import Rdemedies from '../screens/toptabs/Remedies';
import Report from '../screens/toptabs/Report';
import { TabView, TabBar } from 'react-native-tab-view';
import {SafeAreaView} from 'react-native-safe-area-context';

const OrderHistory = ({ navigation }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Wallet' },
    { key: 'second', title: 'Orders' },
    { key: 'third', title: 'Remedies' },
    { key: 'fourth', title: 'Reports' },
  ]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <Wallet />;
      case 'second':
        return <Orders />;
      case 'third':
        return <Rdemedies />;
      case 'fourth':
        return <Report />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={styles.cantainer}>
      <View style={styles.headerCantainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headText}>Order History</Text>
        <TouchableOpacity>
          <FontAwesome5 name="search" size={23} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />
      {/* top tab */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={true}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'blue' }}
            style={{ backgroundColor: '#fff' }}
            labelStyle={{ fontWeight: 'bold' }}
            activeColor="black"
            inactiveColor="grey"
          />
        )}
      />
    </View>
    </SafeAreaView>
  );
};

export default OrderHistory;

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
