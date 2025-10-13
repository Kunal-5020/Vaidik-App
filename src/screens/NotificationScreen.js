import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {SafeAreaView} from 'react-native-safe-area-context';

const initialNotifications = [
  {
    id: "1",
    title: "Kundli kehti hai:",
    message: "agla saal aapki love story ka turning point hai.",
    date: "27 Sep 2025",
  },
  {
    id: "2",
    title: "Kya iss Navratri",
    message: "aapke liye dhan ka vardaan hai?",
    date: "24 Sep 2025",
  },
  {
    id: "3",
    title: "Is Navratri, kya planets ki",
    message: "position aapke crush ko soulmate mein badal degi?",
    date: "22 Sep 2025",
  },
  {
    id: "4",
    title: "100% cashback on First Recharge!",
    message: "offer expires in 30 minutes ⚡",
    date: "20 Sep 2025",
  },
  {
    id: "5",
    title: "Our Happy customers😍",
    message: "",
    date: "20 Sep 2025",
  },
  {
    id: "6",
    title: "100% cashback on First Recharge!",
    message: "offer expires in 30 minutes ⚡",
    date: "20 Sep 2025",
  },
];

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  // delete one notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // delete all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          {item.message ? (
            <Text style={styles.message}>{item.message}</Text>
          ) : null}
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteNotification(item.id)}>
          <Icon name="delete" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={clearAll}>
          <Icon name="delete" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No Notifications</Text>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#f5f5f5'},
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 12,
    padding: 12,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: "gray",
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});

export default NotificationScreen;