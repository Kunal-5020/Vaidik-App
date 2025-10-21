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
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
} from 'react-native-agora';
import livestreamService from '../../services/api/LivestreamService';
import socketService from '../../services/api/socket/socketService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const AGORA_APP_ID = '203397a168f8469bb8e672cd15eb3eb6'; // Replace with your actual App ID

const LiveStreamScreen = ({ navigation }) => {
  // Current stream being viewed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User info
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('User');
  
  // UI State
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  // Agora
  const engineRef = useRef(null);
  const [isJoined, setIsJoined] = useState(false);
  
  // Gift Animation
  const [activeGifts, setActiveGifts] = useState([]);
  const giftAnimValue = useRef(new Animated.Value(0)).current;
  
  // Refs
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  const [remoteUsers, setRemoteUsers] = useState(new Map()); // Store remote users
const [hostAgoraUid, setHostAgoraUid] = useState(null);

  // ==================== INITIALIZATION ====================

  useEffect(() => {
    initializeUser();
    return () => {
      cleanup();
    };
  }, []);

  const initializeUser = async () => {
    try {
      // Get user info from AsyncStorage
      const userIdStored = await AsyncStorage.getItem('userId');
      const userNameStored = await AsyncStorage.getItem('userName');
      
      setUserId(userIdStored);
      setUserName(userNameStored || 'User');
      
      // Fetch live streams
      fetchLiveStreams();
    } catch (error) {
      console.error('Init user error:', error);
      fetchLiveStreams();
    }
  };

  // ==================== FETCH LIVE STREAMS ====================

  const fetchLiveStreams = async () => {
    try {
      setLoading(true);
      const response = await livestreamService.getLiveStreams({ page: 1, limit: 10 });
      
      if (response.success && response.data.length > 0) {
        setStreams(response.data);
        // Auto-join first stream
        joinStream(response.data[0], 0);
      } else {
        Alert.alert('No Live Streams', 'No astrologers are live right now');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Fetch streams error:', error);
      Alert.alert('Error', 'Failed to load live streams');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // ==================== JOIN/LEAVE STREAM ====================

  const joinStream = async (stream, index) => {
  try {
    console.log('Joining stream:', stream.streamId);
    
    // Leave previous stream
    if (streams[currentIndex]) {
      await leaveCurrentStream();
    }

    // Join new stream (get Agora token)
    const joinResponse = await livestreamService.joinStream(stream.streamId);
    
    console.log('📝 Join response:', joinResponse.data);
    
    if (joinResponse.success) {
      // ✅ Get host's Agora UID from response
      const hostUid = joinResponse.data.hostAgoraUid || stream.hostAgoraUid || 0;
      
      console.log('📝 Host Agora UID:', hostUid);
      
      // Store host UID initially
      setHostAgoraUid(hostUid);
      
      // Initialize Agora with new token
      await initializeAgora(
        joinResponse.data.agoraChannelName,
        joinResponse.data.agoraToken,
        joinResponse.data.agoraUid
      );

      // Connect socket
      await connectSocket(stream.streamId);

      setCurrentIndex(index);
    }
  } catch (error) {
    console.error('Join stream error:', error);
    Alert.alert('Error', 'Failed to join stream: ' + error.message);
  }
};


  const leaveCurrentStream = async () => {
  try {
    const currentStream = streams[currentIndex];
    if (currentStream) {
      // ✅ Call API to leave stream
      await livestreamService.leaveStream(currentStream.streamId);
      
      // ✅ Emit leave event via socket
      socketService.leaveStream(currentStream.streamId, userId);
      
      // Disconnect Agora
      if (engineRef.current && isJoined) {
        await engineRef.current.leaveChannel();
      }

      setIsJoined(false);
      setChatMessages([]);
    }
  } catch (error) {
    console.error('Leave stream error:', error);
  }
};


  // ==================== AGORA ====================

  const initializeAgora = async (channelName, token, uid) => {
  try {
    console.log('🎥 Initializing Agora...');
    console.log('📝 Channel:', channelName);
    console.log('📝 Token:', token?.substring(0, 20) + '...');
    console.log('📝 UID:', uid);

    if (!engineRef.current) {
      const engine = createAgoraRtcEngine();
      engineRef.current = engine;

      engine.initialize({
        appId: AGORA_APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      // ✅ Register event handlers for remote users
      engine.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          console.log('✅ Joined Agora channel successfully');
          console.log('📝 Connection:', connection);
          setIsJoined(true);
        },
        
        // ✅ CRITICAL: Subscribe to remote user (host)
        onUserJoined: (connection, remoteUid, elapsed) => {
          console.log('👤 Remote user (host) joined:', remoteUid);
          setHostAgoraUid(remoteUid); // Store host UID
          setRemoteUsers(prev => new Map(prev).set(remoteUid, { uid: remoteUid }));
        },
        
        // ✅ Handle remote user leaving
        onUserOffline: (connection, remoteUid, reason) => {
          console.log('👋 Remote user left:', remoteUid, 'reason:', reason);
          setRemoteUsers(prev => {
            const newMap = new Map(prev);
            newMap.delete(remoteUid);
            return newMap;
          });
          if (remoteUid === hostAgoraUid) {
            setHostAgoraUid(null);
          }
        },
        
        onError: (err, msg) => {
          console.error('❌ Agora error:', err, msg);
        },
      });

      engine.enableVideo();
      engine.enableAudio();
    }

    // ✅ Set as audience (viewer)
    engineRef.current.setClientRole(ClientRoleType.ClientRoleAudience);

    // ✅ Join channel
    const result = await engineRef.current.joinChannel(token, channelName, uid, {
      clientRoleType: ClientRoleType.ClientRoleAudience,
    });

    console.log('✅ Agora initialized, join result:', result);
  } catch (error) {
    console.error('❌ Agora init error:', error);
    Alert.alert('Agora Error', 'Failed to initialize video: ' + error.message);
  }
};


  // ==================== SOCKET ====================

  const connectSocket = async (streamId) => {
  try {
    console.log('🔌 Connecting to socket for stream:', streamId);
    
    // ✅ Initialize stream socket (if not already initialized)
    if (!socketService.isStreamConnected()) {
      await socketService.initializeStreamSocket();
    }
    
    // ✅ Join stream room
    socketService.joinStream(streamId, userId, userName, 'viewer');
    
    // ✅ Listen to events
    socketService.onNewComment(handleNewComment);
    socketService.onNewLike(handleNewLike);
    socketService.onNewGift(handleNewGift);
    socketService.onViewerJoined(handleViewerJoined);
    socketService.onViewerCountUpdated(handleViewerCountUpdate);
    socketService.onCallAcceptedInStream(handleCallAccepted);
    socketService.onCallRejectedInStream(handleCallRejected);
    
    console.log('✅ Socket connected and listeners set up');
  } catch (error) {
    console.error('❌ Socket connection error:', error);
  }
};

  // ==================== SOCKET EVENT HANDLERS ====================

  const handleNewComment = (data) => {
    console.log('💬 New comment:', data);
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'comment',
      userName: data.userName,
      message: data.comment,
      timestamp: data.timestamp,
    }]);
  };

  const handleNewLike = (data) => {
    console.log('❤️ New like:', data);
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'like',
      userName: data.userName,
      timestamp: data.timestamp,
    }]);
  };

  const handleNewGift = (data) => {
    console.log('🎁 New gift:', data);
    
    // Add to chat
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'gift',
      userName: data.userName,
      giftName: data.giftName,
      amount: data.amount,
      timestamp: data.timestamp,
    }]);

    // Show animation
    showGiftAnimation(data);
  };

  const handleViewerJoined = (data) => {
    console.log('👋 Viewer joined:', data);
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'join',
      userName: data.userName,
      timestamp: data.timestamp,
    }]);
  };

  const handleViewerCountUpdate = (data) => {
    console.log('👥 Viewer count updated:', data.count);
    setStreams(prev => prev.map((s, i) => 
      i === currentIndex ? { ...s, viewerCount: data.count } : s
    ));
  };

  const handleCallAccepted = (data) => {
    console.log('✅ Call accepted:', data);
    Alert.alert('Call Accepted!', 'The astrologer accepted your call request');
  };

  const handleCallRejected = (data) => {
    console.log('❌ Call rejected:', data);
    Alert.alert('Call Rejected', 'The astrologer declined your call request');
  };

  // ==================== GIFT ANIMATION ====================

  const showGiftAnimation = (giftData) => {
    const giftId = Date.now().toString() + Math.random();
    setActiveGifts(prev => [...prev, { ...giftData, id: giftId }]);

    Animated.sequence([
      Animated.timing(giftAnimValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(giftAnimValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveGifts(prev => prev.filter(g => g.id !== giftId));
    });
  };

  // ==================== CLEANUP ====================

  const cleanup = async () => {
  try {
    await leaveCurrentStream();
    
    // ✅ Remove all stream listeners
    socketService.removeStreamListeners();
    
    // ✅ Disconnect stream socket
    socketService.disconnectStream();
    
    // Release Agora
    if (engineRef.current) {
      engineRef.current.release();
      engineRef.current = null;
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};


  // ==================== INTERACTIONS ====================

const handleSendMessage = () => {
  if (!message.trim()) return;
  
  // ✅ Use the correct method with all parameters
  socketService.sendStreamComment(
    streams[currentIndex].streamId,
    userId,
    userName,
    message.trim(),
    null // userAvatar (optional)
  );
  
  setMessage('');
};

  const handleSendGift = async (giftType, giftName, amount) => {
  try {
    // Send via API first
    await livestreamService.sendGift(streams[currentIndex].streamId, {
      giftType,
      amount,
    });
    
    // ✅ Send via socket with all parameters
    socketService.sendStreamGift(
      streams[currentIndex].streamId,
      userId,
      userName,
      giftType,
      giftName,
      amount
    );
    
    Alert.alert('Gift Sent!', `You sent ${giftName} (₹${amount})`);
  } catch (error) {
    Alert.alert('Error', error.response?.data?.message || 'Failed to send gift');
  }
};


  const handleLike = () => {
  // ✅ Include userName parameter
  socketService.sendStreamLike(
    streams[currentIndex].streamId,
    userId,
    userName
  );
};


  const handleCallRequest = async () => {
    try {
      await livestreamService.requestCall(streams[currentIndex].streamId, {
        callType: 'video',
        callMode: 'public',
      });
      Alert.alert('Request Sent', 'Waiting for astrologer to accept your call');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to request call');
    }
  };

  const handleToggleFollow = async () => {
    try {
      const response = await livestreamService.toggleFollow(streams[currentIndex].streamId);
      setIsFollowing(response.isFollowing);
      Alert.alert('Success', response.isFollowing ? 'Now following!' : 'Unfollowed');
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  // ==================== NAVIGATION ====================

  const handleSwitchStream = (stream, index) => {
    joinStream(stream, index);
    setLeaveModalVisible(false);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleLeave = async () => {
    await leaveCurrentStream();
    setLeaveModalVisible(false);
    navigation.goBack();
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / height);
    
    if (index !== currentIndex && index >= 0 && index < streams.length) {
      joinStream(streams[index], index);
    }
  };

  const handleOpenChat = () => {
    setChatOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  // ==================== RENDER ====================

  if (loading || streams.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#f6b900" />
        <Text style={styles.loadingText}>Loading live streams...</Text>
      </View>
    );
  }

  const currentStream = streams[currentIndex];

  return (
    <View style={styles.container}>
      {/* Vertical Scrollable Streams */}
      <FlatList
        ref={flatListRef}
        data={streams}
        keyExtractor={(item) => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={({ item, index }) => (
  <View style={styles.streamContainer}>
    {/* Show video only if joined and on current index */}
    {isJoined && index === currentIndex ? (
      <>
        {/* Show remote video if host is present */}
        {hostAgoraUid ? (
          <RtcSurfaceView
            style={styles.video}
            canvas={{
              uid: hostAgoraUid, // ✅ Use host's UID
              renderMode: 1, // Fit mode
            }}
            zOrderMediaOverlay={false}
          />
        ) : (
          // Host not joined yet
          <View style={styles.videoPlaceholder}>
            <ActivityIndicator size="large" color="#f6b900" />
            <Text style={styles.videoText}>Waiting for host...</Text>
          </View>
        )}
      </>
    ) : (
      // Stream loading or not current
      <View style={styles.videoPlaceholder}>
        <ActivityIndicator size="large" color="#f6b900" />
        <Text style={styles.videoText}>
          {index === currentIndex ? 'Connecting...' : 'Scroll to view'}
        </Text>
      </View>
    )}
  </View>
)}

      />

      {/* Overlay UI (on top of video) */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.leftProfile}>
            <Image 
              source={{ uri: currentStream?.hostId?.profilePicture || 'https://via.placeholder.com/40' }} 
              style={styles.avatar} 
            />
            <Text style={styles.name}>{currentStream?.hostId?.name}</Text>
          </View>

          <TouchableOpacity style={styles.followBtn} onPress={handleToggleFollow}>
            <Text style={styles.followText}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>

          <View style={styles.viewerBox}>
            <Image
              source={require('../../assets/view.png')}
              style={styles.closeIcon}
            />
            <Text style={styles.viewerText}>{currentStream?.viewerCount || 0}</Text>
          </View>

          <TouchableOpacity>
            <Image source={require('../../assets/share.png')} style={styles.closeIcon} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setLeaveModalVisible(true)}>
            <Image source={require('../../assets/cross.png')} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        {/* Right-side Actions */}
        <View style={styles.rightButtons}>
          <TouchableOpacity style={styles.sideBtn} onPress={handleLike}>
            <Text style={styles.sideIcon}>❤️</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn} onPress={() => handleSendGift('rose', 'Rose', 50)}>
            <Text style={styles.sideIcon}>🎁</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn} onPress={handleCallRequest}>
            <Text style={styles.sideIcon}>📞</Text>
            <Text style={styles.priceText}>₹{currentStream?.callSettings?.videoCallPrice || 100}/min</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideBtn}>
            <Text style={styles.sideIcon}>↗️</Text>
          </TouchableOpacity>
        </View>

        {/* Gift Animations */}
        {activeGifts.map((gift) => (
          <Animated.View
            key={gift.id}
            style={[
              styles.giftAnimation,
              {
                opacity: giftAnimValue,
                transform: [{
                  translateY: giftAnimValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, -100],
                  }),
                }],
              },
            ]}
          >
            <Text style={styles.giftEmoji}>🎁</Text>
            <Text style={styles.giftText}>{gift.userName}</Text>
            <Text style={styles.giftAmount}>₹{gift.amount}</Text>
          </Animated.View>
        ))}

        {/* Chat Messages Overlay */}
        <ScrollView 
          style={styles.chatMessagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.slice(-8).map((msg) => (
            <View key={msg.id} style={styles.chatMessage}>
              {msg.type === 'comment' && (
                <>
                  <Text style={styles.chatUser}>{msg.userName}: </Text>
                  <Text style={styles.chatText}>{msg.message}</Text>
                </>
              )}
              {msg.type === 'join' && (
                <Text style={styles.chatSystem}>👋 {msg.userName} joined</Text>
              )}
              {msg.type === 'like' && (
                <Text style={styles.chatSystem}>❤️ {msg.userName} liked</Text>
              )}
              {msg.type === 'gift' && (
                <Text style={styles.chatGift}>
                  🎁 {msg.userName} sent {msg.giftName} (₹{msg.amount})
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Chat Button */}
        {!chatOpen && (
          <TouchableOpacity
            style={styles.chatBubble}
            onPress={handleOpenChat}
          >
            <Text style={{ fontSize: 20 }}>💬</Text>
          </TouchableOpacity>
        )}

        {/* Chat Bar */}
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
              onBlur={() => setChatOpen(false)}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>➤</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </View>

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
              Switch to another astrologer or leave?
            </Text>

            <FlatList
              data={streams.filter((_, i) => i !== currentIndex).slice(0, 3)}
              keyExtractor={item => item._id}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.astroCard}
                  onPress={() => handleSwitchStream(item, streams.indexOf(item))}
                >
                  <Image
                    source={{ uri: item.hostId?.profilePicture }}
                    style={styles.astroImg}
                  />
                  <Text style={styles.astroName}>{item.hostId?.name}</Text>
                  <Text style={styles.astroViewers}>👁️ {item.viewerCount}</Text>
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
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },

  streamContainer: {
    width,
    height,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  videoText: { 
    color: '#fff', 
    fontSize: 14, 
    marginTop: 10,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  // Chat messages overlay
  chatMessagesContainer: {
    position: 'absolute',
    bottom: 100,
    left: 12,
    right: 12,
    maxHeight: 200,
  },
  chatMessage: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  chatUser: {
    color: '#f6b900',
    fontSize: 13,
    fontWeight: '700',
  },
  chatText: {
    color: '#fff',
    fontSize: 13,
  },
  chatSystem: {
    color: '#9ca3af',
    fontSize: 12,
    fontStyle: 'italic',
  },
  chatGift: {
    color: '#f6b900',
    fontSize: 13,
    fontWeight: '600',
  },

  // Gift Animation
  giftAnimation: {
    position: 'absolute',
    right: 16,
    top: height * 0.3,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  giftEmoji: {
    fontSize: 48,
  },
  giftText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  giftAmount: {
    color: '#f6b900',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },

  // Top Bar
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
  closeIcon: { width: 22, height: 22, tintColor: '#fff', marginLeft: 10 },

  // Right Actions
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

  // Chat
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

  // Modal
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
  astroViewers: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
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
