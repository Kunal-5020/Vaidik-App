// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Dimensions,
// } from 'react-native';
// import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// const initialLayout = { width: Dimensions.get('window').width };

// const ChatSupport = ({ navigation }) => {
//   const tickets = [
//     {
//       id: '1',
//       message:
//         'Your ticket is being closed due to inactivity. Hope we resolved your query. Have a great ...',
//       date: '29 Sep 25, 07:20 PM',
//       status: 'Closed',
//       count: 1,
//     },
//     {
//       id: '2',
//       message:
//         'Your ticket is being closed due to inactivity. Hope we resolved your query. Have a great ...',
//       date: '28 Sep 25, 01:40 PM',
//       status: 'Closed',
//       count: 1,
//     },
//   ];

//   const renderTicket = ({ item }) => (
//     <View style={styles.ticketCard}>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.ticketMsg}>{item.message}</Text>
//         <Text style={styles.ticketDate}>{item.date}</Text>
//       </View>
//       <View style={styles.rightBox}>
//         <Text style={styles.ticketStatus}>{item.status}</Text>
//         <View style={styles.ticketCount}>
//           <Text style={{ color: '#fff', fontSize: 12 }}>{item.count}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   /** ===== Scenes (Screens for each tab) ===== */
//   const CustomerRoute = () => (
//     <View style={{ flex: 1 }}>
//       {/* Delete button only here */}
//       <TouchableOpacity style={styles.deleteBtn}>
//         <Text style={styles.deleteText}>Delete all tickets</Text>
//       </TouchableOpacity>

//       {tickets.length > 0 ? (
//         <FlatList
//           data={tickets}
//           keyExtractor={item => item.id}
//           renderItem={renderTicket}
//           contentContainerStyle={{ paddingBottom: 80 }}
//         />
//       ) : (
//         <View style={styles.emptyBox}>
//           <Text style={styles.emptyText}>You have not had any tickets yet</Text>
//         </View>
//       )}

//       {/* Bottom Button */}
//       <TouchableOpacity style={styles.bottomBtn}>
//         <Text style={styles.bottomBtnText}>Chat with Customer Support</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const AssistantRoute = () => (
//     <View style={{ flex: 1 }}>
//       {/* No content at all, just bottom button */}
//       <TouchableOpacity style={styles.bottomBtn}>
//         <Text style={styles.bottomBtnText}>Chat with Astrologer Assistant</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const [index, setIndex] = useState(0);
//   const [routes] = useState([
//     { key: 'customer', title: 'Customer Support' },
//     { key: 'assistant', title: "Astrologer's Assistant" },
//   ]);

//   const renderScene = SceneMap({
//     customer: CustomerRoute,
//     assistant: AssistantRoute,
//   });

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image
//             source={require('../assets/back.png')}
//             style={styles.leftIcon}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Support Chat</Text>
//       </View>

//       <View style={{ height: 2, backgroundColor: '#eee' }} />

//       {/* Tab View */}
//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         onIndexChange={setIndex}
//         initialLayout={initialLayout}
//         renderTabBar={props => (
//           <TabBar
//             {...props}
//             indicatorStyle={{ backgroundColor: '#000333', height: 2 }}
//             style={{ backgroundColor: '#fff' }}
//             activeColor="#000333"
//             inactiveColor="#555"
//             labelStyle={{ fontSize: 14, fontWeight: '600' }}
//           />
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'lightgrey' },

//   header: {
//     marginTop: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 18,
//     backgroundColor: '#fff',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '300',
//     marginLeft: 35,
//     color: '#000',
//   },
//   leftIcon: { width: 20, height: 20, tintColor: '#000', left: 8 },

//   deleteBtn: {
//     margin: 12,
//     backgroundColor: '#f8d7da',
//     paddingVertical: 10,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   deleteText: { color: '#c82333', fontWeight: '600' },

//   ticketCard: {
//     backgroundColor: '#fff',
//     marginHorizontal: 12,
//     marginBottom: 10,
//     borderRadius: 10,
//     padding: 12,
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   ticketMsg: { fontSize: 14, color: '#333', fontWeight: '500' },
//   ticketDate: { fontSize: 12, color: '#777', marginTop: 4 },
//   rightBox: { alignItems: 'flex-end', justifyContent: 'space-between' },
//   ticketStatus: { color: 'red', fontWeight: '600', marginBottom: 6 },
//   ticketCount: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: 'red',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   bottomBtn: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#000333',
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   bottomBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },

//   emptyBox: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyText: {
//     fontSize: 15,
//     color: '#777',
//   },
// });

// export default ChatSupport;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };

const ChatSupport = ({ navigation }) => {
  // ✅ keep tickets in state
  const [tickets, setTickets] = useState([
    {
      id: '1',
      message:
        'Your ticket is being closed due to inactivity. Hope we resolved your query. Have a great ...',
      date: '29 Sep 25, 07:20 PM',
      status: 'Open',
      count: 1,
    },
    {
      id: '2',
      message:
        'Your ticket is being closed due to inactivity. Hope we resolved your query. Have a great ...',
      date: '28 Sep 25, 01:40 PM',
      status: 'Closed',
      count: 1,
    },
  ]);

  // ✅ handle delete all
  const handleDeleteAll = () => {
    setTickets([]);
  };

  // ✅ handle close ticket
  const handleCloseTicket = id => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === id ? { ...ticket, status: 'Closed' } : ticket,
      ),
    );
  };

  const renderTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.ticketMsg}>{item.message}</Text>
        <Text style={styles.ticketDate}>{item.date}</Text>
      </View>

      <View style={styles.rightBox}>
        <TouchableOpacity onPress={() => handleCloseTicket(item.id)}>
          <Text
            style={[
              styles.ticketStatus,
              { color: item.status === 'Closed' ? 'red' : 'green' },
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
        <View style={styles.ticketCount}>
          <Text style={{ color: '#fff', fontSize: 12 }}>{item.count}</Text>
        </View>
      </View>
    </View>
  );

  /** ===== Scenes ===== */
  const CustomerRoute = () => (
    <View style={{ flex: 1 }}>
      {/* Delete button only here */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAll}>
        <Text style={styles.deleteText}>Delete all tickets</Text>
      </TouchableOpacity>

      {tickets.length > 0 ? (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id}
          renderItem={renderTicket}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>You have not had any tickets yet</Text>
        </View>
      )}

      {/* Bottom Button */}
      <TouchableOpacity style={styles.bottomBtn}>
        <Text style={styles.bottomBtnText}>Chat with Customer Support</Text>
      </TouchableOpacity>
    </View>
  );

  const AssistantRoute = () => (
    <View style={{ flex: 1 }}>
      {/* Empty State */}
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No assistant tickets yet</Text>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.bottomBtn}>
        <Text style={styles.bottomBtnText}>Chat with Astrologer Assistant</Text>
      </TouchableOpacity>
    </View>
  );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'customer', title: 'Customer Support' },
    { key: 'assistant', title: "Astrologer's Assistant" },
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Chat</Text>
      </View>

      <View style={{ height: 2, backgroundColor: '#eee' }} />

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'customer':
              return <CustomerRoute />;
            case 'assistant':
              return <AssistantRoute />;
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#000333', height: 2 }}
            style={{ backgroundColor: '#fff' }}
            activeColor="#000333"
            inactiveColor="#555"
            labelStyle={{ fontSize: 14, fontWeight: '600' }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'lightgrey' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 35,
    color: '#000',
  },
  leftIcon: { width: 20, height: 20, tintColor: '#000', left: 8 },

  deleteBtn: {
    margin: 12,
    backgroundColor: '#f8d7da',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: { color: '#c82333', fontWeight: '600' },

  ticketCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eee',
  },
  ticketMsg: { fontSize: 14, color: '#333', fontWeight: '500' },
  ticketDate: { fontSize: 12, color: '#777', marginTop: 4 },
  rightBox: { alignItems: 'flex-end', justifyContent: 'space-between' },
  ticketStatus: { fontWeight: '600', marginBottom: 6 },
  ticketCount: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000333',
    paddingVertical: 14,
    alignItems: 'center',
  },
  bottomBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 15,
    color: '#777',
  },
});

export default ChatSupport;
