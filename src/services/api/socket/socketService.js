// src/services/socket/socketService.js
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Socket URL - Update this to match your backend
const SOCKET_URL = 'http://192.168.31.204:3001';

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

  /**
   * Initialize chat socket connection
   * Namespace: /chat
   * Authentication: JWT token in auth header
   */
  async initializeChatSocket() {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No access token found for chat socket');
      }

      console.log('📡 Initializing chat socket...');

      this.chatSocket = io(`${SOCKET_URL}/chat`, {
        auth: {
          token, // JWT token for authentication
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      // Connection events
      this.chatSocket.on('connect', () => {
        console.log('✅ Chat socket connected:', this.chatSocket.id);
      });

      this.chatSocket.on('disconnect', (reason) => {
        console.log('❌ Chat socket disconnected:', reason);
      });

      this.chatSocket.on('connect_error', (error) => {
        console.error('❌ Chat socket connection error:', error.message);
      });

      this.chatSocket.on('error', (error) => {
        console.error('❌ Chat socket error:', error);
      });

      return this.chatSocket;
    } catch (error) {
      console.error('❌ Failed to initialize chat socket:', error);
      throw error;
    }
  }

  /**
   * Join a chat session
   * Event: join_session
   * 
   * @param {string} sessionId - Chat session ID (e.g., 'CHAT_20251008_ABC123')
   * @param {string} userId - Current user ID
   * @param {string} role - User role ('user' or 'astrologer')
   */
  joinChatSession(sessionId, userId, role = 'user') {
    if (!this.chatSocket) {
      console.error('❌ Chat socket not initialized');
      return;
    }

    console.log('📡 Joining chat session:', sessionId);

    this.chatSocket.emit('join_session', {
      sessionId,
      userId,
      role,
    });
  }

  /**
   * Send a message in chat
   * Event: send_message
   * 
   * @param {Object} messageData - Message data
   * @param {string} messageData.sessionId - Chat session ID
   * @param {string} messageData.senderId - Sender user ID
   * @param {string} messageData.senderModel - 'User' or 'Astrologer'
   * @param {string} messageData.receiverId - Receiver ID
   * @param {string} messageData.receiverModel - 'User' or 'Astrologer'
   * @param {string} messageData.type - Message type: 'text' | 'image' | 'audio'
   * @param {string} messageData.content - Message content
   */
  sendMessage(messageData) {
    if (!this.chatSocket) {
      console.error('❌ Chat socket not initialized');
      return;
    }

    console.log('📤 Sending message:', messageData.type);

    this.chatSocket.emit('send_message', {
      sessionId: messageData.sessionId,
      senderId: messageData.senderId,
      senderModel: messageData.senderModel || 'User',
      receiverId: messageData.receiverId,
      receiverModel: messageData.receiverModel || 'Astrologer',
      type: messageData.type || 'text',
      content: messageData.content,
    });
  }

  /**
   * Send typing indicator
   * Event: typing
   * 
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - Current user ID
   * @param {boolean} isTyping - Typing status
   */
  sendTypingStatus(sessionId, userId, isTyping) {
    if (!this.chatSocket) {
      console.error('❌ Chat socket not initialized');
      return;
    }

    this.chatSocket.emit('typing', {
      sessionId,
      userId,
      isTyping,
    });
  }

  /**
   * Mark messages as read
   * Event: mark_read
   * 
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - Current user ID
   * @param {Array<string>} messageIds - Array of message IDs to mark as read
   */
  markMessagesRead(sessionId, userId, messageIds) {
    if (!this.chatSocket) {
      console.error('❌ Chat socket not initialized');
      return;
    }

    console.log('📬 Marking messages as read:', messageIds.length);

    this.chatSocket.emit('mark_read', {
      sessionId,
      userId,
      messageIds,
    });
  }

  /**
   * Listen for new messages
   * Event: new_message
   * 
   * @param {Function} callback - Callback function(data)
   * data: { messageId, senderId, senderModel, type, content, sentAt, isRead }
   */
  onNewMessage(callback) {
    if (!this.chatSocket) {
      console.error('❌ Chat socket not initialized');
      return;
    }

    this.chatSocket.on('new_message', (data) => {
      console.log('📨 New message received:', data.messageId);
      callback(data);
    });
  }

  /**
   * Listen for typing status
   * Event: user_typing
   * 
   * @param {Function} callback - Callback function(data)
   * data: { userId, userName, isTyping }
   */
  onUserTyping(callback) {
    if (!this.chatSocket) {
      console.error('❌ Chat socket not initialized');
      return;
    }

    this.chatSocket.on('user_typing', (data) => {
      console.log('✍️ User typing:', data.userName, data.isTyping);
      callback(data);
    });
  }

  /**
   * Listen for messages read event
   * Event: messages_read
   * 
   * @param {Function} callback - Callback function(data)
   * data: { messageIds, userId }
   */
  onMessagesRead(callback) {
    if (!this.chatSocket) {
      console.error('❌ Chat socket not initialized');
      return;
    }

    this.chatSocket.on('messages_read', (data) => {
      console.log('📬 Messages read:', data.messageIds.length);
      callback(data);
    });
  }

  /**
   * Disconnect chat socket
   */
  disconnectChat() {
    if (this.chatSocket) {
      this.chatSocket.disconnect();
      this.chatSocket = null;
      console.log('✅ Chat socket disconnected');
    }
  }

  // ============================================
  // CALL NAMESPACE (/call)
  // ============================================

  /**
   * Initialize call socket connection
   * Namespace: /call
   */
  async initializeCallSocket() {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        throw new Error('No access token found for call socket');
      }

      console.log('📡 Initializing call socket...');

      this.callSocket = io(`${SOCKET_URL}/call`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.callSocket.on('connect', () => {
        console.log('✅ Call socket connected:', this.callSocket.id);
      });

      this.callSocket.on('disconnect', (reason) => {
        console.log('❌ Call socket disconnected:', reason);
      });

      this.callSocket.on('error', (error) => {
        console.error('❌ Call socket error:', error);
      });

      return this.callSocket;
    } catch (error) {
      console.error('❌ Failed to initialize call socket:', error);
      throw error;
    }
  }

  /**
   * Join call room
   * Event: join_room
   * 
   * @param {string} sessionId - Call session ID
   * @param {string} userId - Current user ID
   * @param {string} role - User role ('user' or 'astrologer')
   */
  joinCallRoom(sessionId, userId, role = 'user') {
    if (!this.callSocket) {
      console.error('❌ Call socket not initialized');
      return;
    }

    console.log('📞 Joining call room:', sessionId);

    this.callSocket.emit('join_room', {
      sessionId,
      userId,
      role,
    });
  }

  /**
   * Send network quality update
   * Event: network_quality
   * 
   * @param {string} sessionId - Call session ID
   * @param {string} userId - Current user ID
   * @param {number} quality - Network quality (1-5)
   */
  sendNetworkQuality(sessionId, userId, quality) {
    if (!this.callSocket) {
      console.error('❌ Call socket not initialized');
      return;
    }

    this.callSocket.emit('network_quality', {
      sessionId,
      userId,
      quality,
    });
  }

  /**
   * Listen for incoming call
   * Event: incoming_call
   * 
   * @param {Function} callback - Callback function(data)
   * data: { sessionId, callerId, callerName, callerProfilePicture, callType }
   */
  onIncomingCall(callback) {
    if (!this.callSocket) {
      console.error('❌ Call socket not initialized');
      return;
    }

    this.callSocket.on('incoming_call', (data) => {
      console.log('📞 Incoming call from:', data.callerName);
      callback(data);
    });
  }

  /**
   * Listen for call accepted
   * Event: call_accepted
   * 
   * @param {Function} callback - Callback function(data)
   */
  onCallAccepted(callback) {
    if (!this.callSocket) {
      console.error('❌ Call socket not initialized');
      return;
    }

    this.callSocket.on('call_accepted', (data) => {
      console.log('✅ Call accepted');
      callback(data);
    });
  }

  /**
   * Listen for call ended
   * Event: call_ended
   * 
   * @param {Function} callback - Callback function(data)
   * data: { sessionId, duration, totalAmount, reason }
   */
  onCallEnded(callback) {
    if (!this.callSocket) {
      console.error('❌ Call socket not initialized');
      return;
    }

    this.callSocket.on('call_ended', (data) => {
      console.log('📞 Call ended. Duration:', data.duration, 'seconds');
      callback(data);
    });
  }

  /**
   * Disconnect call socket
   */
  disconnectCall() {
    if (this.callSocket) {
      this.callSocket.disconnect();
      this.callSocket = null;
      console.log('✅ Call socket disconnected');
    }
  }

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
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.streamSocket.on('connect', () => {
        console.log('✅ Stream socket connected:', this.streamSocket.id);
      });

      this.streamSocket.on('disconnect', (reason) => {
        console.log('❌ Stream socket disconnected:', reason);
      });

      this.streamSocket.on('error', (error) => {
        console.error('❌ Stream socket error:', error);
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
   */
  joinStream(streamId, userId) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    console.log('📺 Joining stream:', streamId);

    this.streamSocket.emit('join_stream', {
      streamId,
      userId,
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
   */
  sendStreamComment(streamId, userId, userName, comment) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    console.log('💬 Sending comment:', comment);

    this.streamSocket.emit('send_comment', {
      streamId,
      userId,
      userName,
      comment,
    });
  }

  /**
   * Send like in stream
   * Event: send_like
   * 
   * @param {string} streamId - Stream ID
   * @param {string} userId - Current user ID
   */
  sendStreamLike(streamId, userId) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    this.streamSocket.emit('send_like', {
      streamId,
      userId,
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
   * @param {number} amount - Gift amount
   */
  sendStreamGift(streamId, userId, userName, giftType, amount) {
    if (!this.streamSocket) {
      console.error('❌ Stream socket not initialized');
      return;
    }

    console.log('🎁 Sending gift:', giftType, amount);

    this.streamSocket.emit('send_gift', {
      streamId,
      userId,
      userName,
      giftType,
      amount,
    });
  }

  /**
   * Listen for new comments
   * Event: new_comment
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
   * Listen for viewer count updates
   * Event: viewer_count_updated
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
}

export default new SocketService();
