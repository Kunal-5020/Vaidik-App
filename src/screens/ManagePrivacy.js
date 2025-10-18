// src/screens/ManagePrivacy.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import userService from '../services/api/UserService';

const ManagePrivacy = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [chatAccess, setChatAccess] = useState(false);
  const [imageDownload, setImageDownload] = useState(false);
  const [screenshot, setScreenshot] = useState(false);
  const [callRecording, setCallRecording] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  // Load privacy settings from backend
  const loadPreferences = async () => {
    setLoading(true);
    try {
      const response = await userService.getPreferences();
      const data = response.data;

      console.log('📋 Loaded privacy data:', data);

      // ✅ Map from nested structure (matching Settings.js pattern)
      setChatAccess(data.privacy?.restrictions?.astrologerChatAccessAfterEnd === true);
      setImageDownload(data.privacy?.restrictions?.downloadSharedImages === true);
      setScreenshot(data.privacy?.restrictions?.restrictChatScreenshots === true);
      setCallRecording(data.privacy?.restrictions?.accessCallRecording === true);

      console.log('✅ Privacy values set');
    } catch (error) {
      console.error('❌ Failed to load preferences:', error);
      Alert.alert('Error', 'Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  // Save preference to backend
  const savePreference = async (patch) => {
    try {
      console.log('💾 Saving privacy preference:', patch);
      const response = await userService.updatePreferences(patch);
      console.log('✅ Saved successfully:', response.data);
    } catch (error) {
      console.error('❌ Failed to update preference:', error);
      Alert.alert('Error', 'Failed to update privacy setting');
    }
  };

  // Toggle handlers (matching Settings.js pattern)
  const toggleChatAccess = (val) => {
    setChatAccess(val);
    savePreference({
          astrologerChatAccessAfterEnd: val,
    });
  };

  const toggleImageDownload = (val) => {
    setImageDownload(val);
    savePreference({
          downloadSharedImages: val,
    });
  };

  const toggleScreenshot = (val) => {
    setScreenshot(val);
    savePreference({
          restrictChatScreenshots: val,
    });
  };

  const toggleCallRecording = (val) => {
    setCallRecording(val);
    savePreference({
          accessCallRecording: val,
    });
  };

  // Reusable component for each row
  const SettingRow = ({ title, subtitle, value, onToggle }) => {
    return (
      <View style={styles.settingRow}>
        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <Switch
          trackColor={{ false: '#d3d3d3', true: '#81b0ff' }}
          thumbColor={value ? '#007AFF' : '#f4f3f4'}
          ios_backgroundColor="#d3d3d3"
          onValueChange={onToggle}
          value={value}
          disabled={loading}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/left.png')}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headText}>Manage my privacy</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/left.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headText}>Manage my privacy</Text>
      </View>

      <View style={styles.line} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.listContainer}
      >
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Control what astrologers can access during and after your consultations
          </Text>
        </View>

        <SettingRow
          title="Chat Access After Session"
          subtitle="Allow astrologers to access chat history after the session ends"
          value={chatAccess}
          onToggle={toggleChatAccess}
        />
        
        <SettingRow
          title="Image Download Permission"
          subtitle="Allow astrologers to download images you share during chat"
          value={imageDownload}
          onToggle={toggleImageDownload}
        />
        
        <SettingRow
          title="Restrict Screenshots"
          subtitle="Prevent astrologers from taking screenshots of your chat"
          value={screenshot}
          onToggle={toggleScreenshot}
        />
        
        <SettingRow
          title="Call Recording Access"
          subtitle="Allow astrologers to access your call recordings"
          value={callRecording}
          onToggle={toggleCallRecording}
        />

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManagePrivacy;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(245, 245, 245)',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    height: 50,
  },
  leftIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  headText: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 20,
    color: '#000',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textContainer: {
    flex: 1,
    paddingRight: 15,
  },
  settingTitle: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  bottomSpace: {
    height: 40,
  },
});
