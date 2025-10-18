// src/screens/ChatSupport.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import supportService from '../services/api/SupportService';

const initialLayout = { width: Dimensions.get('window').width };

const ChatSupport = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'customer', title: 'Customer Support' },
    { key: 'assistant', title: "Astrologer's Assistant" },
  ]);

  // Load tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  // Load tickets from backend
  const loadTickets = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await supportService.getTickets({
        page: 1,
        limit: 50,
        type: 'customer-support', // Filter by type
      });

      if (response.success) {
        const formattedTickets = response.data.tickets.map(ticket => ({
          id: ticket._id,
          message: ticket.subject || ticket.messages?.[0]?.message || 'No message',
          date: new Date(ticket.createdAt).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          status: ticket.status === 'closed' ? 'Closed' : 'Open',
          count: ticket.unreadCount || 1,
          ticketId: ticket._id,
        }));

        setTickets(formattedTickets);
      }
    } catch (error) {
      console.error('Load tickets error:', error);
      Alert.alert('Error', 'Failed to load tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle delete all tickets
  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Tickets',
      'Are you sure you want to delete all tickets? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await supportService.deleteAllTickets();
              setTickets([]);
              Alert.alert('Success', 'All tickets deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete tickets');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  // Handle close ticket
  const handleCloseTicket = async (ticketId) => {
    try {
      await supportService.closeTicket(ticketId);
      
      // Update local state
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: 'Closed' } : ticket
        )
      );

      Alert.alert('Success', 'Ticket closed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to close ticket');
    }
  };

  // Handle delete single ticket
  const handleDeleteTicket = async (ticketId) => {
    Alert.alert(
      'Delete Ticket',
      'Are you sure you want to delete this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await supportService.deleteTicket(ticketId);
              setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
              Alert.alert('Success', 'Ticket deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete ticket');
            }
          },
        },
      ]
    );
  };

  // Navigate to ticket details/chat
  const handleTicketPress = (ticket) => {
    navigation.navigate('SupportChat', {
      ticketId: ticket.ticketId,
      ticketSubject: ticket.message,
    });
  };

  // Navigate to create new ticket
  const handleCreateTicket = (type) => {
    navigation.navigate('CreateSupportTicket', {
      type: type === 'customer' ? 'customer-support' : 'astrologer-assistant',
    });
  };

  // Render ticket card
  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => handleTicketPress(item)}
      onLongPress={() => handleDeleteTicket(item.id)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.ticketMsg} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.ticketDate}>{item.date}</Text>
      </View>

      <View style={styles.rightBox}>
        <TouchableOpacity
          onPress={() => {
            if (item.status === 'Open') {
              handleCloseTicket(item.id);
            }
          }}
        >
          <Text
            style={[
              styles.ticketStatus,
              { color: item.status === 'Closed' ? '#f44336' : '#4CAF50' },
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
        {item.count > 0 && (
          <View style={styles.ticketCount}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{item.count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Customer Support Tab
  const CustomerRoute = () => (
    <View style={{ flex: 1 }}>
      {tickets.length > 0 && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAll}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#c82333" />
          ) : (
            <Text style={styles.deleteText}>Delete all tickets</Text>
          )}
        </TouchableOpacity>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#000333" style={{ marginTop: 50 }} />
      ) : tickets.length > 0 ? (
        <FlatList
          data={tickets}
          keyExtractor={item => item.id}
          renderItem={renderTicket}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadTickets(true)} />
          }
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>You have not had any tickets yet</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.bottomBtn}
        onPress={() => handleCreateTicket('customer')}
      >
        <Text style={styles.bottomBtnText}>Chat with Customer Support</Text>
      </TouchableOpacity>
    </View>
  );

  // Astrologer Assistant Tab
  const AssistantRoute = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No assistant tickets yet</Text>
      </View>

      <TouchableOpacity
        style={styles.bottomBtn}
        onPress={() => handleCreateTicket('assistant')}
      >
        <Text style={styles.bottomBtnText}>Chat with Astrologer Assistant</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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

        <View style={{ height: 1, backgroundColor: '#eee' }} />

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
              indicatorStyle={{ backgroundColor: '#000333', height: 3 }}
              style={{ backgroundColor: '#fff' }}
              activeColor="#000333"
              inactiveColor="#777"
              labelStyle={{ fontSize: 13, fontWeight: '600', textTransform: 'none' }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    color: '#000',
  },
  leftIcon: { width: 20, height: 20, tintColor: '#000' },

  deleteBtn: {
    margin: 12,
    backgroundColor: '#ffebee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f8d7da',
  },
  deleteText: { color: '#c82333', fontWeight: '600', fontSize: 14 },

  ticketCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ticketMsg: { fontSize: 14, color: '#333', fontWeight: '500', lineHeight: 20 },
  ticketDate: { fontSize: 11, color: '#999', marginTop: 6 },
  rightBox: { alignItems: 'flex-end', justifyContent: 'space-between', marginLeft: 10 },
  ticketStatus: { fontWeight: '600', fontSize: 13, marginBottom: 6 },
  ticketCount: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  bottomBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000333',
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  bottomBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
});

export default ChatSupport;
