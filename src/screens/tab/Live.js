import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Pressable,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LiveStreamScreen = ({ navigation }) => {
  const [currentAstro, setCurrentAstro] = useState(null);
  const [liveAstros, setLiveAstros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');

  const inputRef = useRef(null);

  // Dummy API
  useEffect(() => {
    const fetchAstros = async () => {
      try {
        const res = await fetch('https://dummyjson.com/users?limit=5');
        const data = await res.json();
        const mapped = data.users.map(u => ({
          id: u.id.toString(),
          name: u.firstName,
          profile: u.image,
          viewers: Math.floor(Math.random() * 50) + 1 + 'k',
          isLive: true,
        }));
        setLiveAstros(mapped);
        setCurrentAstro(mapped[0]); // first astro live now
      } catch (e) {
        console.log('Error fetching live astros', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAstros();
  }, []);

  const handleSwitchAstro = astro => {
    setCurrentAstro(astro);
    setLeaveModalVisible(false);
  };

  // const handleLeave = () => {
  //   setLeaveModalVisible(false);
  //   navigation.navigate('RootTab', { screen: 'Home' }); // back to home
  // };
  const handleLeave = () => {
    navigation.navigate('DrawerNavigation', {
      screen: 'RootTabs',
      params: { screen: 'Chat' },
    });
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    console.log('Send message:', message);
    setMessage('');
  };

  if (loading || !currentAstro) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#f6b900" />
      </View>
    );
  }

  const handleOpenChat = () => {
    setChatOpen(true);
    setTimeout(() => {
      inputRef.current?.focus(); // auto focus input when chat opens
    }, 200);
  };
  return (
    <View style={styles.container}>
      {/* Fake video background */}
      <View style={styles.videoBackground}>
        <Text style={styles.videoText}>
          [ Live Video of {currentAstro.name} ]
        </Text>
      </View>

      {/* Top Bar Overlay */}
      <View style={styles.topBar}>
        <View style={styles.leftProfile}>
          <Image source={{ uri: currentAstro.profile }} style={styles.avatar} />
          <Text style={styles.name}>{currentAstro.name}</Text>
        </View>

        <TouchableOpacity style={styles.followBtn}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>

        <View style={styles.viewerBox}>
          <Image
            source={require('../../assets/view.png')}
            style={styles.closeIcon}
          />
          <Text style={styles.viewerText}>{currentAstro.viewers}</Text>
        </View>

        <TouchableOpacity>
          <Image
            source={require('../../assets/share.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setLeaveModalVisible(true)}>
          <Image
            source={require('../../assets/cross.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Right-side vertical action buttons */}
      <View style={styles.rightButtons}>
        <TouchableOpacity style={styles.sideBtn}>
          <Text style={styles.sideIcon}>🎁</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideBtn}>
          <Text style={styles.sideIcon}>📞</Text>
          <Text style={styles.priceText}>₹27/min</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideBtn}>
          <Text style={styles.sideIcon}>↗️</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom-left chat bubble */}
      {!chatOpen && (
        <TouchableOpacity
          style={styles.chatBubble}
          // onPress={() => setChatOpen(true)}
          onPress={handleOpenChat}
        >
          <Text style={{ fontSize: 20 }}>💬</Text>
        </TouchableOpacity>
      )}

      {/* Chat bar */}
      {chatOpen && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatBar}
        >
          <TextInput
            ref={inputRef}
            style={styles.chatInput}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>➤</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}

      {/* Leave Modal */}
      <Modal
        visible={leaveModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setLeaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Do you want to connect to another astrologer or leave?
            </Text>

            <FlatList
              data={liveAstros.filter(a => a.id !== currentAstro.id)}
              keyExtractor={item => item.id}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.astroCard}
                  onPress={() => handleSwitchAstro(item)}
                >
                  <Image
                    source={{ uri: item.profile }}
                    style={styles.astroImg}
                  />
                  <Text style={styles.astroName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingVertical: 10 }}
            />

            <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
              <Text style={styles.leaveText}>Leave</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setLeaveModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LiveStreamScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  videoBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  videoText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  topBar: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftProfile: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 35, height: 35, borderRadius: 18 },
  name: { color: '#fff', marginLeft: 6, fontSize: 14, fontWeight: '600' },

  followBtn: {
    marginLeft: 10,
    backgroundColor: '#f6b900',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  followText: { fontSize: 12, fontWeight: '600', color: '#000' },

  viewerBox: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  viewerText: { color: '#fff', marginLeft: 4, fontSize: 12 },

  iconText: { color: '#fff', fontSize: 18, marginHorizontal: 6 },
  closeIcon: { width: 22, height: 22, tintColor: '#fff', marginLeft: 10 },

  rightButtons: {
    position: 'absolute',
    bottom: 120,
    right: 15,
    alignItems: 'center',
  },
  sideBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  sideIcon: { fontSize: 22, color: '#fff' },
  priceText: { fontSize: 10, color: '#fff', marginTop: 3 },

  chatBubble: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
  },

  chatBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  chatInput: {
    flex: 1,
    color: '#fff',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#333',
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#f6b900',
    padding: 10,
    borderRadius: 6,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12 },

  astroCard: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  astroImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f6b900',
  },
  astroName: { marginTop: 5, fontSize: 13, fontWeight: '500' },

  leaveBtn: {
    backgroundColor: '#f6b900',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 12,
  },
  leaveText: { fontSize: 15, fontWeight: '600', color: '#000' },

  cancelText: {
    textAlign: 'center',
    color: '#3366cc',
    fontSize: 14,
    marginTop: 6,
  },
});
