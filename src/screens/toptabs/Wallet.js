import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

const WalletScreen = () => {
  const [activeTab, setActiveTab] = useState("transactions");

  // Dummy Data
  const transactions = [
    {
      id: "1",
      title: "Chat with Astrologer for 2 minutes",
      date: "20 Sep 25, 12:53 PM",
      txnId: "#CHAT_NEW282726048",
      amount: "+₹0",
      type: "credit",
    },
    {
      id: "2",
      title: "Bonus Money",
      date: "28 May 25, 08:19 PM",
      txnId: "#AM-1748443790873",
      amount: "+₹50",
      type: "credit",
    },
    {
      id: "3",
      title: "Chat with Astrologer for 2 minutes",
      date: "23 Mar 25, 07:28 PM",
      txnId: "#CHAT_NEW226917581",
      amount: "+₹0",
      type: "credit",
    },
    {
      id: "4",
      title: "Birthday gift",
      date: "08 Sep 24, 09:43 AM",
      txnId: "#AM-1725768799643",
      amount: "+₹50",
      type: "credit",
    },
    {
      id: "5",
      title: "Chat with Vanshujeet for 2 minutes",
      date: "10 Jul 24, 07:14 PM",
      txnId: "#CHAT_NEW102026075",
      amount: "+₹0",
      type: "credit",
    },
    {
      id: "6",
      title: "Bonus AT-Money from chat with Maaya",
      date: "08 Sep 23, 09:50 PM",
      txnId: "#CB_1MIN_CHAT-44866110",
      amount: "+₹7",
      type: "credit",
    },
    {
      id: "7",
      title: "Chat with Maaya for 6 minutes",
      date: "08 Sep 23, 09:50 PM",
      txnId: "#CHAT_NEW44866110",
      amount: "-₹42",
      type: "debit",
    },
  ];

  const renderTransaction = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardTxn}>{item.txnId}</Text>
      </View>
      <Text
        style={[
          styles.amount,
          item.type === "credit" ? styles.credit : styles.debit,
        ]}
      >
        {item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Balance Section */}
      <View style={styles.balanceBox}>
        <View>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₹ 119</Text>
        </View>
        <TouchableOpacity style={styles.rechargeBtn}>
          <Text style={styles.rechargeText}>Recharge</Text>
        </TouchableOpacity>
      </View>

      {/* Inner Tabs */}
      <View style={styles.innerTabs}>
        <TouchableOpacity
          style={[
            styles.innerTab,
            activeTab === "transactions" && styles.activeInnerTab,
          ]}
          onPress={() => setActiveTab("transactions")}
        >
          <Text
            style={[
              styles.innerTabText,
              activeTab === "transactions" && styles.activeInnerTabText,
            ]}
          >
            Wallet Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.innerTab,
            activeTab === "logs" && styles.activeInnerTab,
          ]}
          onPress={() => setActiveTab("logs")}
        >
          <Text
            style={[
              styles.innerTabText,
              activeTab === "logs" && styles.activeInnerTabText,
            ]}
          >
            Payment Logs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      {activeTab === "transactions" ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.emptyBox}>
          <Text style={{ color: "#777" }}>No payment logs available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  balanceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  balanceLabel: { fontSize: 14, color: "#555" },
  balanceValue: { fontSize: 22, fontWeight: "700", marginTop: 4 },
  rechargeBtn: {
    backgroundColor: "#000333",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  rechargeText: { fontWeight: "600",color:"#fff" },

  innerTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  innerTab: {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth:1,
    borderColor:"grey"
  },
  activeInnerTab: {
    backgroundColor: "#000333",
  },
  innerTabText: { fontSize: 13, color: "grey", fontWeight: "500" },
  activeInnerTabText: { color: "#fff", fontWeight: "600" },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  cardDate: { fontSize: 12, color: "#777" },
  cardTxn: { fontSize: 11, color: "#aaa", marginTop: 2 },
  amount: { fontSize: 14, fontWeight: "600", alignSelf: "center" },
  credit: { color: "green" },
  debit: { color: "red" },

  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default WalletScreen;
