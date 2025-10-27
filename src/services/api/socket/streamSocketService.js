// src/services/socket/streamSocketService.js
import io from 'socket.io-client';
import { storageService } from '../../storage/storage.service';
import { STORAGE_KEYS } from '../../../config/constants';

class StreamSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.streamId = null;
    this.listeners = new Map();
  }

  /**
   * Connect to stream namespace
   */
  async connect(streamId, userId, userName, isHost = false) {
    try {
      const accessToken = await storageService.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      if (this.socket) {
        this.disconnect();
      }

      console.log('====================================');
      console.log('🔌 Creating socket connection...');
      console.log('URL: http://192.168.1.10:3001/stream');
      console.log('User ID:', userId);
      console.log('User Name:', userName);
      console.log('Is Host:', isHost);
      console.log('====================================');

      return new Promise((resolve, reject) => {
        this.socket = io('http://192.168.1.10:3001/stream', {
          transports: ['websocket'],
          query: { userId, userName },
          auth: { token: accessToken },
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        this.streamId = streamId;

        const timeout = setTimeout(() => {
          console.error('❌ Socket connection timeout after 10 seconds');
          reject(new Error('Socket connection timeout'));
        }, 10000);

        this.socket.on('connect', () => {
          clearTimeout(timeout);
          
          console.log('====================================');
          console.log('✅ SOCKET CONNECTED');
          console.log('Socket ID:', this.socket.id);
          console.log('====================================');
          
          this.connected = true;
          
          // Join stream room
          this.socket.emit('join_stream', { streamId, userId, userName, isHost });
          console.log('✅ Emitted join_stream event as', isHost ? 'HOST' : 'VIEWER');
          
          // Debug all incoming events
          this.socket.onAny((eventName, ...args) => {
            console.log('🔔 INCOMING:', eventName, args);
          });
          
          resolve(true);
        });

        this.socket.on('disconnect', () => {
          console.log('❌ Socket disconnected');
          this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          console.error('❌ SOCKET CONNECTION ERROR:', error.message);
          reject(error);
        });

        this.socket.on('error', (error) => {
          console.error('❌ SOCKET ERROR EVENT:', error);
        });
      });
    } catch (error) {
      console.error('❌ Socket connection setup failed:', error.message);
      throw error;
    }
  }

  /**
   * Disconnect from socket
   */
  disconnect() {
    if (this.socket) {
      if (this.streamId) {
        this.socket.emit('leave_stream', { streamId: this.streamId });
      }
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.streamId = null;
      this.listeners.clear();
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected && this.socket !== null;
  }

  // ==================== EVENT EMITTERS ====================

  sendComment(streamId, userId, userName, userAvatar, comment) {
    if (!this.socket) return;
    this.socket.emit('send_comment', { streamId, userId, userName, userAvatar, comment });
  }

  sendLike(streamId, userId, userName) {
    if (!this.socket) return;
    this.socket.emit('send_like', { streamId, userId, userName });
  }

  sendGift(streamId, userId, userName, userAvatar, giftType, giftName, amount) {
    if (!this.socket) return;
    this.socket.emit('send_gift', { streamId, userId, userName, userAvatar, giftType, giftName, amount });
  }

  notifyCallAccepted(streamId, userId, userName, callType, callMode) {
    if (!this.socket) return;
    console.log('📞 Notifying call accepted:', { streamId, userId, userName, callType, callMode });
    this.socket.emit('call_accepted', { streamId, userId, userName, callType, callMode });
  }

  notifyCallRejected(streamId, userId) {
    if (!this.socket) return;
    console.log('❌ Notifying call rejected:', { streamId, userId });
    this.socket.emit('call_rejected', { streamId, userId });
  }

  notifyCallEnded(streamId, duration, charge) {
    if (!this.socket) return;
    console.log('📞 Notifying call ended:', { streamId, duration, charge });
    this.socket.emit('call_ended', { streamId, duration, charge });
  }

  notifyHostMicToggled(streamId, enabled) {
    if (!this.socket) return;
    this.socket.emit('host_mic_toggled', { streamId, enabled });
  }

  notifyHostCameraToggled(streamId, enabled) {
    if (!this.socket) return;
    this.socket.emit('host_camera_toggled', { streamId, enabled });
  }

  // ==================== EVENT LISTENERS ====================

  on(eventName, callback) {
    if (!this.socket) return;
    this.socket.on(eventName, callback);
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);
  }

  off(eventName, callback) {
    if (!this.socket) return;
    this.socket.off(eventName, callback);
    if (this.listeners.has(eventName)) {
      const callbacks = this.listeners.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  removeAllListeners(eventName) {
    if (!this.socket) return;
    this.socket.removeAllListeners(eventName);
    this.listeners.delete(eventName);
  }

  // Convenience methods
  onNewComment(callback) { this.on('new_comment', callback); }
  onNewLike(callback) { this.on('new_like', callback); }
  onNewGift(callback) { this.on('new_gift', callback); }
  onViewerJoined(callback) { this.on('viewer_joined', callback); }
  onViewerLeft(callback) { this.on('viewer_left', callback); }
  onViewerCountUpdated(callback) { this.on('viewer_count_updated', callback); }
  
  onCallRequestReceived(callback) {
    if (!this.socket) {
      console.error('❌ Socket not initialized');
      return;
    }
    console.log('📞 Setting up call request listener');
    this.socket.on('call_request_received', (data) => {
      console.log('📞 call_request_received EVENT:', data);
      callback(data);
    });
  }

  onCallStarted(callback) {
    if (!this.socket) return;
    console.log('🎧 Setting up onCallStarted listener');
    this.socket.on('call_started', (data) => {
      console.log('📞 Call started event:', data);
      callback(data);
    });
  }

  onCallFinished(callback) {
    if (!this.socket) return;
    console.log('🎧 Setting up onCallFinished listener');
    this.socket.on('call_finished', (data) => {
      console.log('📞 Call finished event:', data);
      callback(data);
    });
    this.socket.on('call_ended', (data) => {
      console.log('📞 Call ended event:', data);
      callback(data);
    });
  }

  onCallRequestRejected(callback) {
    if (!this.socket) return;
    console.log('🎧 Setting up onCallRequestRejected listener');
    this.socket.on('call_request_rejected', (data) => {
      console.log('❌ Call rejected event:', data);
      callback(data);
    });
  }
}

export const streamSocketService = new StreamSocketService();
export default streamSocketService;
