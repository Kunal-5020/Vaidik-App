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
  PermissionsAndroid, // ✅ ADD THIS
} from 'react-native';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
} from 'react-native-agora';
import livestreamService from '../../services/api/LivestreamService';
import { streamSocketService } from '../../services/api/socket/streamSocketService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';


const { width, height } = Dimensions.get('window');
const AGORA_APP_ID = '203397a168f8469bb8e672cd15eb3eb6';


const LiveStreamScreen = ({ navigation }) => {
  const { user: authUser, isAuthenticated, fetchUserProfile } = useAuth();
  
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('User');
  const [userInitialized, setUserInitialized] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [activeGifts, setActiveGifts] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState(new Map());
  const [hostAgoraUid, setHostAgoraUid] = useState(null);
  const [hasRequestedCall, setHasRequestedCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callData, setCallData] = useState(null);
  const [waitingForCall, setWaitingForCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false); // ✅ ADD THIS


  // Refs
  const engineRef = useRef(null);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const giftAnimValue = useRef(new Animated.Value(0)).current;


  // ==================== 🆕 ANDROID PERMISSIONS ====================
  
  /**
   * Request camera and microphone permissions for Android
   * This is CRITICAL for video/audio calls to work
   */
  const requestCameraAndAudioPermission = async () => {
    if (Platform.OS !== 'android') {
      setPermissionsGranted(true);
      return true;
    }

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      const cameraGranted = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;
      const audioGranted = granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED;

      if (cameraGranted && audioGranted) {
        console.log('✅ Camera and Microphone permissions granted');
        setPermissionsGranted(true);
        return true;
      } else {
        console.log('❌ Camera/Microphone permissions denied');
        Alert.alert(
          'Permissions Required',
          'Camera and Microphone access is required for video calls. Please enable them in Settings.',
          [{ text: 'OK' }]
        );
        setPermissionsGranted(false);
        return false;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      setPermissionsGranted(false);
      return false;
    }
  };


  // ==================== INITIALIZATION ====================


  useEffect(() => {
    initializeUser();
    return () => cleanup();
  }, []);


  useEffect(() => {
    if (userInitialized && userId) {
      // ✅ Request permissions before fetching streams
      requestCameraAndAudioPermission().then((granted) => {
        if (granted) {
          fetchLiveStreams();
        } else {
          Alert.alert('Error', 'Permissions required to watch livestreams');
          navigation.goBack();
        }
      });
    }
  }, [userInitialized, userId]);


  const initializeUser = async () => {
    try {
      let id = authUser?._id;
      let name = authUser?.name || 'User';
      
      if (!id && isAuthenticated) {
        const profile = await fetchUserProfile();
        if (profile) {
          id = profile._id || profile.id;
          name = profile.name || 'User';
        }
      }
      
      if (!id) {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const storedUser = JSON.parse(userString);
          id = storedUser._id || storedUser.id;
          name = storedUser.name || 'User';
        }
      }
      
      if (!id) {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);
          id = payload._id || payload.userId || payload.sub || payload.id;
          name = payload.name || payload.userName || name;
        }
      }
      
      if (!id) {
        Alert.alert('Login Required', 'Please login to watch livestreams', [
          { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
          { text: 'Cancel', onPress: () => navigation.goBack(), style: 'cancel' },
        ]);
        return;
      }
      
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userName', name);
      setUserId(id);
      setUserName(name);
      setUserInitialized(true);
    } catch (error) {
      console.error('Init user error:', error);
      Alert.alert('Error', 'Failed to initialize user');
      navigation.goBack();
    }
  };


  // ==================== FETCH STREAMS ====================


  const fetchLiveStreams = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await livestreamService.getLiveStreams({ page: 1, limit: 10 });
      
      if (response.success && response.data.length > 0) {
        setStreams(response.data);
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
    if (!userId) return;
    
    try {
      if (streams[currentIndex] && currentIndex !== index) {
        await leaveCurrentStream();
      }


      const joinResponse = await livestreamService.joinStream(stream.streamId);
      
      if (joinResponse.success) {
        const hostUid = joinResponse.data.hostAgoraUid || stream.hostAgoraUid || 0;
        setHostAgoraUid(hostUid);
        
        if (joinResponse.data.streamInfo?.currentCall) {
          setCurrentCall(joinResponse.data.streamInfo.currentCall);
        }
        
        await initializeAgora(
          joinResponse.data.agoraChannelName,
          joinResponse.data.agoraToken,
          joinResponse.data.agoraUid
        );


        await connectSocket(stream.streamId);
        setCurrentIndex(index);
      }
    } catch (error) {
      console.error('Join stream error:', error);
      Alert.alert('Error', 'Failed to join stream');
    }
  };


  const leaveCurrentStream = async () => {
    try {
      const currentStream = streams[currentIndex];
      if (currentStream) {
        await livestreamService.leaveStream(currentStream.streamId);
        
        if (streamSocketService.socket) {
          streamSocketService.socket.emit('leave_stream', { 
            streamId: currentStream.streamId, 
            userId 
          });
        }
        
        if (engineRef.current && isJoined) {
          await engineRef.current.leaveChannel();
        }


        setIsJoined(false);
        setChatMessages([]);
        setCurrentCall(null);
      }
    } catch (error) {
      console.error('Leave stream error:', error);
    }
  };


  // ==================== 🔧 FIXED AGORA INITIALIZATION ====================


  const initializeAgora = async (channelName, token, uid) => {
    try {
      if (!engineRef.current) {
        const engine = createAgoraRtcEngine();
        engineRef.current = engine;


        engine.initialize({
          appId: AGORA_APP_ID,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });


        engine.registerEventHandler({
          onJoinChannelSuccess: () => {
            console.log('✅ Joined channel as audience');
            setIsJoined(true);
          },
          onUserJoined: (connection, remoteUid) => {
            console.log('👤 Remote user joined:', remoteUid);
            setHostAgoraUid(remoteUid);
            setRemoteUsers(prev => new Map(prev).set(remoteUid, { uid: remoteUid }));
          },
          onUserOffline: (connection, remoteUid) => {
            console.log('👋 Remote user left:', remoteUid);
            setRemoteUsers(prev => {
              const newMap = new Map(prev);
              newMap.delete(remoteUid);
              return newMap;
            });
            if (remoteUid === hostAgoraUid) {
              setHostAgoraUid(null);
            }
          },
          onError: (err, msg) => console.error('Agora error:', err, msg),
        });

        // ✅ Enable video and audio for viewer mode
        engine.enableVideo();
        engine.enableAudio();
      }


      engineRef.current.setClientRole(ClientRoleType.ClientRoleAudience);
      await engineRef.current.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleAudience,
      });
    } catch (error) {
      console.error('Agora init error:', error);
      Alert.alert('Error', 'Failed to initialize video');
    }
  };


  // ==================== SOCKET ====================


  const connectSocket = async (streamId) => {
    if (!userId) return;
    
    try {
      console.log('🔌 Viewer connecting socket:', { streamId, userId, userName });


      await streamSocketService.connect(streamId, userId, userName, false);
      
      console.log('✅ Socket connected');


      // Register all listeners
      streamSocketService.onNewComment(handleNewComment);
      streamSocketService.onNewLike(handleNewLike);
      streamSocketService.onNewGift(handleNewGift);
      streamSocketService.onViewerJoined(handleViewerJoined);
      streamSocketService.onViewerCountUpdated(handleViewerCountUpdate);
      
      streamSocketService.onCallStarted((data) => {
        console.log('📞 CALL STARTED:', data);
        setCurrentCall({
          userId: data.userId,
          userName: data.userName,
          callType: data.callType,
          callMode: data.callMode,
          callerAgoraUid: data.callerAgoraUid,
        });
        
        if (data.userId === userId || data.userId.toString() === userId.toString()) {
          handleCallStarted(data);
        }
      });
      
      streamSocketService.onCallFinished((data) => {
        console.log('📞 CALL FINISHED:', data);
        setCurrentCall(null);
        if (callAccepted && callData) leaveCall();
      });
      
      streamSocketService.onCallRequestRejected((data) => {
        console.log('❌ CALL REJECTED:', data);
        if (data.userId === userId || data.userId.toString() === userId.toString()) {
          setWaitingForCall(false);
          setHasRequestedCall(false);
          setCallAccepted(false);
          setCallData(null);
          Alert.alert('Call Rejected', data.reason || 'The astrologer declined your request');
        }
      });


      streamSocketService.on('stream_ended', (data) => {
        Alert.alert('Stream Ended', `The livestream has ended: ${data.reason}`, [
          { text: 'OK', onPress: () => { cleanup(); navigation.goBack(); }}
        ]);
      });


      console.log('✅ All listeners registered');
    } catch (error) {
      console.error('❌ Socket connection error:', error);
    }
  };


  // ==================== 🔧 FIXED CALL HANDLING ====================


  const handleCallRequest = async () => {
    // ✅ Check permissions first
    if (!permissionsGranted) {
      const granted = await requestCameraAndAudioPermission();
      if (!granted) {
        Alert.alert('Permissions Required', 'Camera and microphone access required for calls');
        return;
      }
    }

    try {
      setWaitingForCall(true);
      setHasRequestedCall(true);
      
      const response = await livestreamService.requestCall(streams[currentIndex].streamId, {
        callType: 'video',
        callMode: 'public',
      });
      
      if (response.success) {
        Alert.alert('Call Requested', 'Waiting for astrologer to accept...');
      }
    } catch (error) {
      console.error('Request call error:', error);
      setWaitingForCall(false);
      setHasRequestedCall(false);
      Alert.alert('Error', error.response?.data?.message || 'Failed to request call');
    }
  };


  const handleCallStarted = async (data) => {
    if (data.userId !== userId) return;
    
    setWaitingForCall(false);
    setCallAccepted(true);
    setCallData(data);
    await joinCallAsViewer(data);
  };


  /**
   * ✅ FIXED: Properly enable camera and microphone when joining call
   */
  const joinCallAsViewer = async (callData) => {
    try {
      console.log('📞 Joining call as broadcaster...', callData);

      // ✅ Step 1: Leave current channel
      if (isJoined && engineRef.current) {
        console.log('⏸️ Leaving viewer channel...');
        await engineRef.current.leaveChannel();
        setIsJoined(false);
      }


      // ✅ Step 2: Recreate engine if needed
      if (!engineRef.current) {
        const engine = createAgoraRtcEngine();
        engineRef.current = engine;

        engine.initialize({
          appId: callData.appId || AGORA_APP_ID,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });

        engine.registerEventHandler({
          onJoinChannelSuccess: () => {
            console.log('✅ Joined call channel as broadcaster');
            setIsJoined(true);
            Alert.alert('Call Started', 'You are now in the call!');
          },
          onUserJoined: (connection, remoteUid) => {
            console.log('👤 Host joined call:', remoteUid);
            setHostAgoraUid(remoteUid);
          },
          onUserOffline: (connection, remoteUid) => {
            console.log('👋 Host left call:', remoteUid);
            if (remoteUid === callData.hostUid) {
              Alert.alert('Call Ended', 'The astrologer left the call');
              leaveCall();
            }
          },
          onError: (err, msg) => console.error('Call Agora error:', err, msg),
        });
      }


      // ✅ Step 3: Enable video and audio BEFORE changing role
      console.log('🎥 Enabling video and audio...');
      await engineRef.current.enableVideo();
      await engineRef.current.enableAudio();


      // ✅ Step 4: Start camera preview for video calls
      if (callData.callType === 'video') {
        console.log('📹 Starting camera preview...');
        await engineRef.current.startPreview();
      }


      // ✅ Step 5: Switch to broadcaster role
      console.log('🎤 Setting client role to BROADCASTER...');
      await engineRef.current.setClientRole(ClientRoleType.ClientRoleBroadcaster);


      // ✅ Step 6: Join channel as broadcaster
      console.log('🚀 Joining call channel...');
      await engineRef.current.joinChannel(
        callData.token, 
        callData.channelName, 
        callData.uid, 
        {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          publishCameraTrack: callData.callType === 'video',
          publishMicrophoneTrack: true,
        }
      );

      console.log('✅ Successfully joined call as broadcaster');
    } catch (error) {
      console.error('❌ Join call error:', error);
      Alert.alert('Error', `Failed to join call: ${error.message}`);
      
      // Rollback
      setCallAccepted(false);
      setCallData(null);
      
      // Try to rejoin as viewer
      const currentStream = streams[currentIndex];
      if (currentStream) {
        setTimeout(() => joinStream(currentStream, currentIndex), 1000);
      }
    }
  };


  const leaveCall = async () => {
    try {
      console.log('📴 Leaving call...');
      
      // ✅ Stop camera preview
      if (engineRef.current && callData?.callType === 'video') {
        await engineRef.current.stopPreview();
      }

      setCallAccepted(false);
      setCallData(null);
      setHasRequestedCall(false);
      setIsMuted(false);
      setIsCameraOff(false);
      
      // ✅ Rejoin as viewer
      const currentStream = streams[currentIndex];
      if (currentStream) {
        await joinStream(currentStream, currentIndex);
      }
    } catch (error) {
      console.error('Leave call error:', error);
    }
  };


  const cancelCallRequest = async () => {
    try {
      console.log('🔴 Canceling call request...');
      
      try {
        await livestreamService.cancelCallRequest(streams[currentIndex].streamId);
        console.log('✅ Call request cancelled via API');
      } catch (error) {
        console.warn('⚠️ API cancel failed (might be already accepted):', error.message);
      }


      setWaitingForCall(false);
      setHasRequestedCall(false);
      
      if (callAccepted && callData) {
        await leaveCall();
      }


      Alert.alert('Success', 'Call request cancelled');
    } catch (error) {
      console.error('❌ Cancel error:', error);
      Alert.alert('Error', 'Failed to cancel request');
    }
  };


  // ==================== ✅ FIXED MUTE/CAMERA CONTROLS ====================


  const toggleMute = () => {
    if (!engineRef.current) return;
    
    const newMuteState = !isMuted;
    engineRef.current.muteLocalAudioStream(newMuteState);
    setIsMuted(newMuteState);
    console.log(newMuteState ? '🔇 Muted' : '🔊 Unmuted');
  };


  const toggleCamera = () => {
    if (!engineRef.current || callData?.callType !== 'video') return;
    
    const newCameraState = !isCameraOff;
    engineRef.current.muteLocalVideoStream(newCameraState);
    setIsCameraOff(newCameraState);
    console.log(newCameraState ? '📷 Camera off' : '📹 Camera on');
  };


  // ==================== EVENT HANDLERS ====================


  const handleNewComment = (data) => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'comment',
      userName: data.userName,
      message: data.comment,
      timestamp: data.timestamp,
    }]);
  };


  const handleNewLike = (data) => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'like',
      userName: data.userName,
      timestamp: data.timestamp,
    }]);
  };


  const handleNewGift = (data) => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'gift',
      userName: data.userName,
      giftName: data.giftName,
      amount: data.amount,
      timestamp: data.timestamp,
    }]);
    showGiftAnimation(data);
  };


  const handleViewerJoined = (data) => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type: 'join',
      userName: data.userName,
      timestamp: data.timestamp,
    }]);
  };


  const handleViewerCountUpdate = (data) => {
    setStreams(prev => prev.map((s, i) => 
      i === currentIndex ? { ...s, viewerCount: data.count } : s
    ));
  };


  const showGiftAnimation = (giftData) => {
    const giftId = Date.now().toString() + Math.random();
    setActiveGifts(prev => [...prev, { ...giftData, id: giftId }]);


    Animated.sequence([
      Animated.timing(giftAnimValue, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(giftAnimValue, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => setActiveGifts(prev => prev.filter(g => g.id !== giftId)));
  };


  // ==================== INTERACTIONS ====================


  const handleSendMessage = () => {
    if (!message.trim()) return;
    streamSocketService.sendComment(streams[currentIndex].streamId, userId, userName, null, message.trim());
    setMessage('');
  };


  const handleSendGift = async (giftType, giftName, amount) => {
    try {
      await livestreamService.sendGift(streams[currentIndex].streamId, { giftType, amount });
      streamSocketService.sendGift(streams[currentIndex].streamId, userId, userName, null, giftType, giftName, amount);
      Alert.alert('Gift Sent!', `You sent ${giftName} (₹${amount})`);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send gift');
    }
  };


  const handleLike = () => {
    streamSocketService.sendLike(streams[currentIndex].streamId, userId, userName);
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


  // ==================== CLEANUP ====================


  const cleanup = async () => {
    try {
      await leaveCurrentStream();
      streamSocketService.disconnect();
      
      if (engineRef.current) {
        // ✅ Stop preview before destroying
        await engineRef.current.stopPreview();
        engineRef.current.release();
        engineRef.current = null;
      }
    } catch (error) {
      console.error('Cleanup error:', error);
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
    setTimeout(() => inputRef.current?.focus(), 200);
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
            {isJoined && index === currentIndex ? (
              <>
                {currentCall && currentCall.callType === 'video' ? (
                  <View style={styles.splitScreenContainer}>
                    {/* Host Video (Top Half) */}
                    <View style={styles.remoteVideoHalf}>
                      {hostAgoraUid ? (
                        <RtcSurfaceView style={styles.halfVideo} canvas={{ uid: hostAgoraUid, renderMode: 1 }} />
                      ) : (
                        <View style={styles.videoPlaceholder}>
                          <ActivityIndicator size="large" color="#f6b900" />
                        </View>
                      )}
                      <View style={styles.videoNameTag}>
                        <Text style={styles.videoNameText}>{currentStream?.hostId?.name || 'Host'}</Text>
                      </View>
                    </View>

                    {/* Caller Video (Bottom Half) */}
                    <View style={styles.localVideoHalf}>
                      {callAccepted && callData ? (
                        <RtcSurfaceView 
                          style={styles.halfVideo} 
                          canvas={{ uid: 0 }} 
                          zOrderMediaOverlay={true} 
                        />
                      ) : currentCall.callerAgoraUid ? (
                        <RtcSurfaceView style={styles.halfVideo} canvas={{ uid: currentCall.callerAgoraUid, renderMode: 1 }} />
                      ) : (
                        <View style={styles.videoPlaceholder}>
                          <ActivityIndicator size="large" color="#f6b900" />
                        </View>
                      )}
                      <View style={styles.videoNameTag}>
                        <Text style={styles.videoNameText}>
                          {callAccepted && callData ? `You (${userName})` : currentCall.userName}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <>
                    {hostAgoraUid ? (
                      <RtcSurfaceView style={styles.video} canvas={{ uid: hostAgoraUid, renderMode: 1 }} />
                    ) : (
                      <View style={styles.videoPlaceholder}>
                        <ActivityIndicator size="large" color="#f6b900" />
                        <Text style={styles.videoText}>Waiting for host...</Text>
                      </View>
                    )}
                  </>
                )}
              </>
            ) : (
              <View style={styles.videoPlaceholder}>
                <ActivityIndicator size="large" color="#f6b900" />
                <Text style={styles.videoText}>{index === currentIndex ? 'Connecting...' : 'Scroll to view'}</Text>
              </View>
            )}
          </View>
        )}
      />


      {/* Overlay UI */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.leftProfile}>
            <Image source={{ uri: currentStream?.hostId?.profilePicture || 'https://via.placeholder.com/40' }} style={styles.avatar} />
            <Text style={styles.name}>{currentStream?.hostId?.name}</Text>
          </View>
          <TouchableOpacity style={styles.followBtn} onPress={handleToggleFollow}>
            <Text style={styles.followText}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
          <View style={styles.viewerBox}>
            <Image source={require('../../assets/view.png')} style={styles.closeIcon} />
            <Text style={styles.viewerText}>{currentStream?.viewerCount || 0}</Text>
          </View>
          <TouchableOpacity><Image source={require('../../assets/share.png')} style={styles.closeIcon} /></TouchableOpacity>
          <TouchableOpacity onPress={() => setLeaveModalVisible(true)}><Image source={require('../../assets/cross.png')} style={styles.closeIcon} /></TouchableOpacity>
        </View>


        {/* ✅ FIXED: Call Controls */}
        {callAccepted && callData && (
          <View style={styles.callControlsOverlay}>
            <View style={styles.callIndicatorBadge}>
              <View style={styles.recordingDot} />
              <Text style={styles.callBadgeText}>{callData.callType === 'video' ? '📹 Video Call' : '📞 Voice Call'}</Text>
            </View>
            <View style={styles.callControlsRow}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
                <Text style={{ fontSize: 24 }}>{isMuted ? '🔇' : '🔊'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.endCallBtn} 
                onPress={() => Alert.alert(
                  'End Call', 
                  'Are you sure you want to end the call?', 
                  [
                    { text: 'Cancel', style: 'cancel' }, 
                    { text: 'End', style: 'destructive', onPress: leaveCall }
                  ]
                )}
              >
                <Text style={{ fontSize: 24 }}>📞</Text>
                <Text style={styles.endCallText}>End Call</Text>
              </TouchableOpacity>
              {callData.callType === 'video' && (
                <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
                  <Text style={{ fontSize: 24 }}>{isCameraOff ? '📷' : '📹'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}


        {/* Waiting indicator */}
        {waitingForCall && !callAccepted && (
          <View style={styles.waitingOverlay}>
            <View style={styles.waitingBox}>
              <ActivityIndicator size="large" color="#f6b900" />
              <Text style={styles.waitingText}>Waiting for astrologer...</Text>
              <TouchableOpacity style={styles.cancelWaitingButton} onPress={cancelCallRequest}>
                <Text style={styles.cancelWaitingText}>Cancel Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}


        {/* Right Actions */}
        <View style={styles.rightButtons}>
          <TouchableOpacity style={styles.sideBtn} onPress={handleLike}><Text style={styles.sideIcon}>❤️</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sideBtn} onPress={() => handleSendGift('rose', 'Rose', 50)}><Text style={styles.sideIcon}>🎁</Text></TouchableOpacity>
          <TouchableOpacity style={styles.sideBtn} onPress={handleCallRequest}>
            <Text style={styles.sideIcon}>📞</Text>
            <Text style={styles.priceText}>₹{currentStream?.callSettings?.videoCallPrice || 100}/min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideBtn}><Text style={styles.sideIcon}>↗️</Text></TouchableOpacity>
        </View>


        {/* Gift Animations */}
        {activeGifts.map((gift) => (
          <Animated.View key={gift.id} style={[styles.giftAnimation, { opacity: giftAnimValue, transform: [{ translateY: giftAnimValue.interpolate({ inputRange: [0, 1], outputRange: [100, -100] }) }] }]}>
            <Text style={styles.giftEmoji}>🎁</Text>
            <Text style={styles.giftText}>{gift.userName}</Text>
            <Text style={styles.giftAmount}>₹{gift.amount}</Text>
          </Animated.View>
        ))}


        {/* Chat Messages */}
        <ScrollView style={styles.chatMessagesContainer} showsVerticalScrollIndicator={false}>
          {chatMessages.slice(-8).map((msg) => (
            <View key={msg.id} style={styles.chatMessage}>
              {msg.type === 'comment' && (<><Text style={styles.chatUser}>{msg.userName}: </Text><Text style={styles.chatText}>{msg.message}</Text></>)}
              {msg.type === 'join' && (<Text style={styles.chatSystem}>👋 {msg.userName} joined</Text>)}
              {msg.type === 'like' && (<Text style={styles.chatSystem}>❤️ {msg.userName} liked</Text>)}
              {msg.type === 'gift' && (<Text style={styles.chatGift}>🎁 {msg.userName} sent {msg.giftName} (₹{msg.amount})</Text>)}
            </View>
          ))}
        </ScrollView>


        {/* Chat Button */}
        {!chatOpen && (<TouchableOpacity style={styles.chatBubble} onPress={handleOpenChat}><Text style={{ fontSize: 20 }}>💬</Text></TouchableOpacity>)}


        {/* Chat Input */}
        {chatOpen && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatBar}>
            <TextInput ref={inputRef} style={styles.chatInput} placeholder="Type a message..." placeholderTextColor="#888" value={message} onChangeText={setMessage} onBlur={() => setChatOpen(false)} />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}><Text style={{ color: '#fff', fontWeight: '600' }}>➤</Text></TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </View>


      {/* Leave Modal */}
      <Modal visible={leaveModalVisible} animationType="slide" transparent onRequestClose={() => setLeaveModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Switch to another astrologer or leave?</Text>
            <FlatList data={streams.filter((_, i) => i !== currentIndex).slice(0, 3)} keyExtractor={item => item._id} horizontal renderItem={({ item }) => (
              <TouchableOpacity style={styles.astroCard} onPress={() => handleSwitchStream(item, streams.indexOf(item))}>
                <Image source={{ uri: item.hostId?.profilePicture }} style={styles.astroImg} />
                <Text style={styles.astroName}>{item.hostId?.name}</Text>
                <Text style={styles.astroViewers}>👁️ {item.viewerCount}</Text>
              </TouchableOpacity>
            )} contentContainerStyle={{ paddingVertical: 10 }} />
            <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}><Text style={styles.leaveText}>Leave</Text></TouchableOpacity>
            <Pressable onPress={() => setLeaveModalVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default LiveStreamScreen;


// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loadingText: { color: '#fff', marginTop: 10, fontSize: 14 },
  streamContainer: { width, height },
  video: { width: '100%', height: '100%' },
  videoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  videoText: { color: '#fff', fontSize: 14, marginTop: 10 },
  overlay: { ...StyleSheet.absoluteFillObject },
  splitScreenContainer: { flex: 1, flexDirection: 'column' },
  remoteVideoHalf: { flex: 1, backgroundColor: '#000', borderBottomWidth: 2, borderBottomColor: '#f6b900', position: 'relative' },
  localVideoHalf: { flex: 1, backgroundColor: '#1a1a1a', position: 'relative' },
  halfVideo: { width: '100%', height: '100%' },
  videoNameTag: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  videoNameText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  chatMessagesContainer: { position: 'absolute', bottom: 100, left: 12, right: 12, maxHeight: 200 },
  chatMessage: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-start', maxWidth: '80%' },
  chatUser: { color: '#f6b900', fontSize: 13, fontWeight: '700' },
  chatText: { color: '#fff', fontSize: 13 },
  chatSystem: { color: '#9ca3af', fontSize: 12, fontStyle: 'italic' },
  chatGift: { color: '#f6b900', fontSize: 13, fontWeight: '600' },
  giftAnimation: { position: 'absolute', right: 16, top: height * 0.3, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  giftEmoji: { fontSize: 48 },
  giftText: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 4 },
  giftAmount: { color: '#f6b900', fontSize: 16, fontWeight: '700', marginTop: 2 },
  topBar: { position: 'absolute', top: 30, left: 10, right: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leftProfile: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 35, height: 35, borderRadius: 18 },
  name: { color: '#fff', marginLeft: 6, fontSize: 14, fontWeight: '600' },
  followBtn: { marginLeft: 10, backgroundColor: '#f6b900', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  followText: { fontSize: 12, fontWeight: '600', color: '#000' },
  viewerBox: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  viewerText: { color: '#fff', marginLeft: 4, fontSize: 12 },
  closeIcon: { width: 22, height: 22, tintColor: '#fff', marginLeft: 10 },
  rightButtons: { position: 'absolute', bottom: 120, right: 15, alignItems: 'center' },
  sideBtn: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30, padding: 12, alignItems: 'center', marginVertical: 8 },
  sideIcon: { fontSize: 22, color: '#fff' },
  priceText: { fontSize: 10, color: '#fff', marginTop: 3 },
  callControlsOverlay: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center', zIndex: 101 },
  callIndicatorBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.9)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 20 },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginRight: 8 },
  callBadgeText: { color: '#fff', fontSize: 14, fontWeight: '700', marginLeft: 4 },
  callControlsRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  controlButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#f6b900' },
  endCallBtn: { flexDirection: 'column', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 28, minWidth: 100 },
  endCallText: { color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 4 },
  waitingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 99 },
  waitingBox: { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', minWidth: 250 },
  waitingText: { fontSize: 16, fontWeight: '600', color: '#000', marginTop: 16, marginBottom: 24 },
  cancelWaitingButton: { backgroundColor: '#ef4444', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  cancelWaitingText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  chatBubble: { position: 'absolute', bottom: 30, left: 20, backgroundColor: '#fff', borderRadius: 20, padding: 10 },
  chatBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', padding: 8, position: 'absolute', bottom: 0, left: 0, right: 0 },
  chatInput: { flex: 1, color: '#fff', padding: 8, borderRadius: 6, backgroundColor: '#333', marginRight: 8 },
  sendBtn: { backgroundColor: '#f6b900', padding: 10, borderRadius: 6 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  astroCard: { alignItems: 'center', marginHorizontal: 10 },
  astroImg: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#f6b900' },
  astroName: { marginTop: 5, fontSize: 13, fontWeight: '500' },
  astroViewers: { fontSize: 11, color: '#666', marginTop: 2 },
  leaveBtn: { backgroundColor: '#f6b900', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginVertical: 12 },
  leaveText: { fontSize: 15, fontWeight: '600', color: '#000' },
  cancelText: { textAlign: 'center', color: '#3366cc', fontSize: 14, marginTop: 6 },
});
