import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Linking} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import userService from '../../services/api/UserService';
import {SafeAreaView} from 'react-native-safe-area-context';

const Settings = ({navigation}) => {
  const [astroChat, setAstroChat] = useState(false);
  const [liveEvents, setLiveEvents] = useState(false);
  const [privacyToggle, setPrivacyToggle] = useState(false);
  const [language, setLanguage] = useState('en');

  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [chatAccess, setChatAccess] = useState(false);
  const [imageDownload, setImageDownload] = useState(false);
  const [screenshot, setScreenshot] = useState(false);
  const [callRecording, setCallRecording] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const {logout} = useAuth();

  useEffect(() => {
    setLoading(true);
    userService
      .getPreferences()
      .then(res => {
        const prefs = res.data;
        setAstroChat(!!prefs.normalNotification);
        setLiveEvents(!!prefs.liveEventsNotification);
        setPrivacyToggle(!!prefs.nameVisibleInReviews);
        setLanguage(prefs.appLanguage || 'en');
        setChatAccess(!!prefs.astrologerChatAccessAfterEnd);
        setImageDownload(!!prefs.downloadSharedImages);
        setScreenshot(!!prefs.restrictChatScreenshots);
        setCallRecording(!!prefs.accessCallRecording);
      })
      .catch(() => Alert.alert('Error', 'Failed to load preferences'))
      .finally(() => setLoading(false));
  }, []);

  const savePreference = async patch => {
    try {
      await userService.updatePreferences(patch);
    } catch {
      Alert.alert('Error', 'Failed to update preferences');
    }
  };

  const toggleAstroChat = val => {
    setAstroChat(val);
    savePreference({normalNotification: val});
  };
  const toggleLiveEvents = val => {
    setLiveEvents(val);
    savePreference({liveEventsNotification: val});
  };
  const togglePrivacyToggle = val => {
    setPrivacyToggle(val);
    savePreference({nameVisibleInReviews: val});
  };
  const toggleChatAccess = val => {
    setChatAccess(val);
    savePreference({astrologerChatAccessAfterEnd: val});
  };
  const toggleImageDownload = val => {
    setImageDownload(val);
    savePreference({downloadSharedImages: val});
  };
  const toggleScreenshot = val => {
    setScreenshot(val);
    savePreference({restrictChatScreenshots: val});
  };
  const toggleCallRecording = val => {
    setCallRecording(val);
    savePreference({accessCallRecording: val});
  };
  const changeLanguage = val => {
    setLanguage(val);
    savePreference({appLanguage: val});
  };

  const onLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
            navigation.reset({index: 0, routes: [{name: 'Login'}]});
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const onDeleteAccount = () => {
    Alert.alert('Delete Account', 'Are you sure? This action cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await userService.deleteAccount();
            await logout();
            navigation.reset({index: 0, routes: [{name: 'Login'}]});
          } catch {
            Alert.alert('Error', 'Failed to delete account');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/back.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Settings</Text>
        </View>

        <View style={styles.divider} />

        {/* Notifications Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Astromall Chat</Text>
            <Switch value={astroChat} onValueChange={toggleAstroChat} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Live Events</Text>
            <Switch value={liveEvents} onValueChange={toggleLiveEvents} />
          </View>
        </View>

        {/* Privacy Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacy</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Show name in reviews</Text>
            <Switch value={privacyToggle} onValueChange={togglePrivacyToggle} />
          </View>
        </View>

        {/* Language Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>App Language</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={language}
              onValueChange={changeLanguage}
              style={styles.picker}
              dropdownIconColor="#000">
              <Picker.Item label="English" value="en" />
              <Picker.Item label="हिंदी" value="hi" />
              <Picker.Item label="Français" value="fr" />
            </Picker>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => setPrivacyModalVisible(true)}>
          <Text style={styles.actionText}>Manage Your Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Notification')}>
          <Text style={styles.actionText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL('https://vaidiktalk.store/pages/terms-conditions')}>
          <Text style={styles.actionText}>Terms and Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL('https://vaidiktalk.store/pages/privacy-policy')}>
          <Text style={styles.actionText}>Privacy Policy</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutBtn, loggingOut && {opacity: 0.6}]} onPress={onLogout} disabled={loggingOut}>
          {loggingOut && <ActivityIndicator size="small" color="#333" style={{marginRight: 8}} />}
          <Text style={styles.logoutText}>{loggingOut ? 'Logging out...' : 'Logout'}</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteBtn} onPress={onDeleteAccount}>
          <Icon name="delete" size={20} color="red" />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>

        {/* Privacy Modal */}
        <Modal animationType="slide" transparent visible={privacyModalVisible} onRequestClose={() => setPrivacyModalVisible(false)}>
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Manage Your Privacy</Text>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Restrict chat access after session</Text>
                <Switch value={chatAccess} onValueChange={toggleChatAccess} />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Restrict image downloads</Text>
                <Switch value={imageDownload} onValueChange={toggleImageDownload} />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Restrict screenshots</Text>
                <Switch value={screenshot} onValueChange={toggleScreenshot} />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalText}>Restrict call recordings</Text>
                <Switch value={callRecording} onValueChange={toggleCallRecording} />
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setPrivacyModalVisible(false)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#f5f5f5'},
  container: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', height: 50, paddingHorizontal: 15},
  backIcon: {width: 20, height: 20},
  headerText: {fontSize: 18, fontWeight: '400', marginLeft: 20},
  divider: {height: 1, backgroundColor: '#ddd'},
  card: {backgroundColor: '#fff', borderRadius: 10, padding: 12, marginHorizontal: 10, marginTop: 8, borderWidth: 1, borderColor: '#e0e0e0'},
  cardTitle: {fontSize: 14, fontWeight: 'bold', marginBottom: 8},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4},
  label: {fontSize: 12, flex: 1, color: '#555'},
  pickerWrapper: {borderWidth: 1, borderColor: '#ddd', borderRadius: 6, overflow: 'hidden', marginTop: 6, backgroundColor: '#fafafa'},
  picker: {height: 45, color: '#000'},
  actionBtn: {backgroundColor: '#fff', padding: 12, borderRadius: 8, marginHorizontal: 10, marginTop: 6, borderWidth: 1, borderColor: '#e0e0e0'},
  actionText: {fontSize: 14, color: 'green', fontWeight: '600'},
  logoutBtn: {backgroundColor: '#fff', padding: 12, borderRadius: 8, marginHorizontal: 10, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e0e0e0'},
  logoutText: {fontSize: 14, color: '#333', fontWeight: '600'},
  deleteBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginHorizontal: 10, marginTop: 6, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0'},
  deleteText: {fontSize: 14, color: 'red', fontWeight: '600', marginLeft: 6},
  modalBg: {flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)'},
  modalContent: {backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20},
  modalTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 12},
  modalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8},
  modalText: {flex: 1, fontSize: 13, marginRight: 15, color: '#333'},
  closeBtn: {backgroundColor: '#e0e0e0', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'flex-end', marginTop: 15},
  closeBtnText: {fontSize: 14, fontWeight: '600'},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default Settings;
