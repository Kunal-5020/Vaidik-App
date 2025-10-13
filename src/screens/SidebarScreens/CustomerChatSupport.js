import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const CustomerChatSupport = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={18} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Support</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Recent Orders Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Issue with Recent Orders?</Text>
              <TouchableOpacity>
                <Text style={styles.link}>View all</Text>
              </TouchableOpacity>
            </View>

            {/* Order Card */}
            <View style={styles.card}>
              <FontAwesome5 name="comments" size={20} color="#555" />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>Chat with Astrologer</Text>
                <Text style={styles.cardText}>12:50 PM | 20 Sep 25</Text>
                <Text style={styles.cardText}>Price = ₹ 0 Duration: 2 min</Text>
                <Text style={styles.completed}>✔ Completed</Text>
              </View>
            </View>

            <View style={styles.card}>
              <FontAwesome5 name="comments" size={20} color="#555" />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>Chat with Astrologer</Text>
                <Text style={styles.cardText}>07:26 PM | 23 Mar 25</Text>
                <Text style={styles.cardText}>Price = ₹ 0 Duration: 2 min</Text>
                <Text style={styles.completed}>✔ Completed</Text>
              </View>
            </View>
          </View>

          {/* Recent Tickets */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Tickets</Text>
              <TouchableOpacity>
                <Text style={styles.link}>View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ticketCard}>
              <Text style={styles.ticketText}>
                Your ticket is being closed due to inact...
              </Text>
              <View style={styles.ticketStatus}>
                <Text style={styles.ticketDate}>28-Sep-25</Text>
                <Text style={styles.ticketClosed}>CLOSED</Text>
              </View>
            </View>
          </View>

          {/* Chat With Us */}
          <View style={styles.chatBox}>
            <Text style={styles.chatText}>
              Can’t find what you’re looking for?
            </Text>
            <TouchableOpacity style={styles.chatButton}>
              <FontAwesome5 name="comments" size={18} color="#000" />
              <Text style={styles.chatButtonText}>Chat With Us</Text>
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FAQ’s</Text>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqText}>Where can I find my wallet ?</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqText}>
                How to connect with an Astrologer?
              </Text>
              <FontAwesome5 name="chevron-right" size={14} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqText}>How can I recharge my wallet?</Text>
              <FontAwesome5 name="chevron-right" size={14} color="#888" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: "#f6b900",
    fontWeight: "500",
  },
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardDetails: {
    marginLeft: 10,
  },
  cardTitle: {
    fontWeight: "600",
  },
  cardText: {
    fontSize: 13,
    color: "#555",
  },
  completed: {
    fontSize: 12,
    color: "green",
    marginTop: 4,
  },
  ticketCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
  },
  ticketText: {
    fontSize: 14,
    marginBottom: 6,
  },
  ticketStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ticketDate: {
    fontSize: 12,
    color: "#666",
  },
  ticketClosed: {
    fontSize: 12,
    color: "green",
    fontWeight: "600",
  },
  chatBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  chatText: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "500",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6b900",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  chatButtonText: {
    marginLeft: 8,
    fontWeight: "600",
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  faqText: {
    fontSize: 14,
    color: "#333",
  },
});

export default CustomerChatSupport;
