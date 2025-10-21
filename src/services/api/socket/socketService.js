// src/services/socket/socketService.js
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Socket URL - Update this to match your backend
const SOCKET_URL = 'http://192.168.1.10:3001';

console.log('🌍 Socket URL:', SOCKET_URL);

/**
 * Socket Service
 * Manages WebSocket connections for real-time features
 * Namespaces: /chat, /call, /stream
 */
class SocketService {
  constructor() {
    this.chatSocket = null;
    this.callSocket = null;
    this.streamSocket = null;
  }

  // ============================================
  // CHAT NAMESPACE (/chat)
  // ============================================
  // ... (keep all your existing chat methods)

  // ============================================
  // CALL NAMESPACE (/call)
  // ============================================
  // ... (keep all your existing call methods)

  // ============================================
  // STREAM NAMESPACE (/stream)
  // ============================================

  /**
   * Initialize stream socket connection
   * Namespace: /stream
   */
  async initializeStreamSocket() {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No access token found for stream socket');
      }

      console.log('📡 Initializing stream socket...');

      this.streamSocket = io(`${SOCKET_URL}/stream`, {
        auth: { token },
        transports: ['websocket', 'polling'], // ✅ Support both transports
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 10000, // ✅ Add timeout
      });

      this.streamSocket.on('connect', () => {
        console.log('✅ Stream socket connected:', this.streamSocket.id);
      });

      this.streamSocket.on('disconnect', (reason) => {
        console.log('❌ Stream socket disconnected:', reason);
      });

      this.streamSocket.on('connect_error', (error) => {
        console.error('❌ Stream socket connection error:', error.message);
      });

      this.streamSocket.on('error', (error) => {
        console.error('❌ Stream socket error:', error);
      });

      // ✅ NEW: Listen for stream joined confirmation
      this.streamSocket.on('stream_joined', (data) => {
        console.log('✅ Stream joined confirmed:', data);
      });

      return this.streamSocket;
    } catch (error) {
      console.error('❌ Failed to initialize stream socket:', error);
      throw error;
    }
  }

  /**
   * Join a live stream
   * Event: join_stream
   * 
   * @param {string} streamId - Stream ID
   * @param {string} userId - Current user ID
   * @param {string} userName - User name (✅ NEW)
   * @param {string} role - User role: 'viewer' or 'host' (✅ NEW)
   */
  joinStream(streamId, userId, userName = 'User', role = 'viewer') {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    console.log('📺 Joining stream:', streamId, 'as', role);

    this.streamSocket.emit('join_stream', {
      streamId,
      userId,
      userName, // ✅ Include userName
      role,     // ✅ Include role
    });
  }

  /**
   * Send comment in stream
   * Event: send_comment
   * 
   * @param {string} streamId - Stream ID
   * @param {string} userId - Current user ID
   * @param {string} userName - User name
   * @param {string} comment - Comment text
   * @param {string} userAvatar - User avatar URL (✅ NEW - optional)
   */
  sendStreamComment(streamId, userId, userName, comment, userAvatar = null) {
    if (!this.streamSocket) {
      console.warn('⚠️ Stream socket not initialized, cannot send comment');
      return;
    }

    console.log('💬 Sending comment:', comment);

    this.streamSocket.emit('send_comment', {
      streamId,
      userId,
      userName,
      userAvatar, // ✅ Include avatar
      comment,
      timestamp: new Date().toISOString(), // ✅ Add timestamp
    });
  }

  /**
   * Send like in stream
   * Event: send_like
   * 
   * @param {string} streamId - Stream ID
   * @param {string} userId - Current user ID
   * @param {string} userName - User name (✅ NEW)
   */
  sendStreamLike(streamId, userId, userName = 'User') {
    if (!this.streamSocket) {
      console.warn('⚠️ Stream socket not initialized, cannot send like');
      return;
    }

    console.log('❤️ Sending like');

    this.streamSocket.emit('send_like', {
      streamId,
      userId,
      userName, // ✅ Include userName
      timestamp: new Date().toISOString(), // ✅ Add timestamp
    });
  }

  /**
   * Send gift in stream
   * Event: send_gift
   * 
   * @param {string} streamId - Stream ID
   * @param {string} userId - Current user ID
   * @param {string} userName - User name
   * @param {string} giftType - Gift type (e.g., 'rose', 'diamond')
   * @param {string} giftName - Gift display name (✅ NEW)
   * @param {number} amount - Gift amount
   */
  sendStreamGift(streamId, userId, userName, giftType, giftName, amount) {
    if (!this.streamSocket) {
      console.warn('⚠️ Stream socket not initialized, cannot send gift');
      return;
    }

    console.log('🎁 Sending gift:', giftType, amount);

    this.streamSocket.emit('send_gift', {
      streamId,
      userId,
      userName,
      giftType,
      giftName,  // ✅ Add gift name
      amount,
      timestamp: new Date().toISOString(), // ✅ Add timestamp
    });
  }

  /**
   * Listen for new comments
   * Event: new_comment
   * 
   * @param {Function} callback - Callback function(data)
   * data: { userId, userName, userAvatar, comment, timestamp }
   */
  onNewComment(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('new_comment', (data) => {
      console.log('💬 New comment:', data.comment);
      callback(data);
    });
  }

  /**
   * Listen for new likes
   * Event: new_like
   * 
   * @param {Function} callback - Callback function(data)
   * data: { userId, userName, timestamp }
   */
  onNewLike(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('new_like', (data) => {
      console.log('❤️ New like received');
      callback(data);
    });
  }

  /**
   * Listen for new gifts
   * Event: new_gift
   * 
   * @param {Function} callback - Callback function(data)
   * data: { userId, userName, giftType, giftName, amount, timestamp }
   */
  onNewGift(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('new_gift', (data) => {
      console.log('🎁 New gift:', data.giftType, data.amount);
      callback(data);
    });
  }

  /**
   * ✅ NEW: Listen for viewer joined
   * Event: viewer_joined
   * 
   * @param {Function} callback - Callback function(data)
   * data: { userId, userName, timestamp }
   */
  onViewerJoined(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('viewer_joined', (data) => {
      console.log('👋 Viewer joined:', data.userName);
      callback(data);
    });
  }

  /**
   * ✅ NEW: Listen for viewer left
   * Event: viewer_left
   * 
   * @param {Function} callback - Callback function(data)
   * data: { userId, userName, timestamp }
   */
  onViewerLeft(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('viewer_left', (data) => {
      console.log('👋 Viewer left:', data.userName);
      callback(data);
    });
  }

  /**
   * Listen for viewer count updates
   * Event: viewer_count_updated
   * 
   * @param {Function} callback - Callback function(data)
   * data: { count, streamId }
   */
  onViewerCountUpdated(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('viewer_count_updated', (data) => {
      console.log('👥 Viewers:', data.count);
      callback(data);
    });
  }

  /**
   * ✅ NEW: Listen for call accepted event
   * Event: call_accepted
   * 
   * @param {Function} callback - Callback function(data)
   * data: { userId, userName, callType, callMode }
   */
  onCallAcceptedInStream(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('call_accepted', (data) => {
      console.log('✅ Call accepted in stream:', data);
      callback(data);
    });
  }

  /**
   * ✅ NEW: Listen for call rejected event
   * Event: call_rejected
   * 
   * @param {Function} callback - Callback function(data)
   * data: { userId, reason }
   */
  onCallRejectedInStream(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('call_rejected', (data) => {
      console.log('❌ Call rejected in stream:', data);
      callback(data);
    });
  }

  /**
   * ✅ NEW: Listen for host mic toggle
   * Event: host_mic_toggled
   * 
   * @param {Function} callback - Callback function(data)
   * data: { streamId, enabled }
   */
  onHostMicToggled(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('host_mic_toggled', (data) => {
      console.log('🎤 Host mic toggled:', data.enabled);
      callback(data);
    });
  }

  /**
   * ✅ NEW: Listen for host camera toggle
   * Event: host_camera_toggled
   * 
   * @param {Function} callback - Callback function(data)
   * data: { streamId, enabled }
   */
  onHostCameraToggled(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('host_camera_toggled', (data) => {
      console.log('📹 Host camera toggled:', data.enabled);
      callback(data);
    });
  }

  /**
   * ✅ NEW: Listen for stream state changes
   * Event: stream_state_changed
   * 
   * @param {Function} callback - Callback function(data)
   * data: { streamId, state }
   */
  onStreamStateChanged(callback) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.on('stream_state_changed', (data) => {
      console.log('📊 Stream state changed:', data.state);
      callback(data);
    });
  }

  /**
   * ✅ NEW: Leave stream room
   * Event: leave_stream
   * 
   * @param {string} streamId - Stream ID
   * @param {string} userId - Current user ID
   */
  leaveStream(streamId, userId) {
    if (!this.streamSocket) {
      console.warn('⚠️ Stream socket not initialized');
      return;
    }

    console.log('👋 Leaving stream:', streamId);

    this.streamSocket.emit('leave_stream', {
      streamId,
      userId,
    });
  }

  /**
   * Disconnect stream socket
   */
  disconnectStream() {
    if (this.streamSocket) {
      this.streamSocket.disconnect();
      this.streamSocket = null;
      console.log('✅ Stream socket disconnected');
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Disconnect all sockets
   */
  disconnectAll() {
    this.disconnectChat();
    this.disconnectCall();
    this.disconnectStream();
    console.log('✅ All sockets disconnected');
  }

  /**
   * Check if chat socket is connected
   */
  isChatConnected() {
    return this.chatSocket?.connected || false;
  }

  /**
   * Check if call socket is connected
   */
  isCallConnected() {
    return this.callSocket?.connected || false;
  }

  /**
   * Check if stream socket is connected
   */
  isStreamConnected() {
    return this.streamSocket?.connected || false;
  }

  /**
   * Get connection status for all sockets
   */
  getConnectionStatus() {
    return {
      chat: this.isChatConnected(),
      call: this.isCallConnected(),
      stream: this.isStreamConnected(),
    };
  }

  /**
   * ✅ NEW: Remove all stream event listeners
   */
  removeStreamListeners() {
    if (this.streamSocket) {
      this.streamSocket.removeAllListeners('new_comment');
      this.streamSocket.removeAllListeners('new_like');
      this.streamSocket.removeAllListeners('new_gift');
      this.streamSocket.removeAllListeners('viewer_joined');
      this.streamSocket.removeAllListeners('viewer_left');
      this.streamSocket.removeAllListeners('viewer_count_updated');
      this.streamSocket.removeAllListeners('call_accepted');
      this.streamSocket.removeAllListeners('call_rejected');
      this.streamSocket.removeAllListeners('host_mic_toggled');
      this.streamSocket.removeAllListeners('host_camera_toggled');
      this.streamSocket.removeAllListeners('stream_state_changed');
      console.log('✅ Stream listeners removed');
    }
  }
}

export default new SocketService();
