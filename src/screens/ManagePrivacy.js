import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Switch, 
} from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ManagePrivacy = ({ navigation }) => {
  // State to manage the toggle switches for each privacy setting
  const [privacySettings, setPrivacySettings] = useState({
    chatAccess: false,
    downloadAccess: false,
    screenshots: false,
    callAccess: false,
  });

  const handleToggle = settingKey => {
    setPrivacySettings(prevSettings => ({
      ...prevSettings,
      [settingKey]: !prevSettings[settingKey],
    }));
  };

  // Dummy function for back navigation
  const handleBack = () => {
    console.log('Go back to previous screen');
    // In a real app, this would use navigation.goBack()
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

    // Reusable component for each row
  const SettingRow = ({ title, subtitle, settingKey }) => {
    return (
      <View style={styles.settingRow}>
        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#ffc107' }} // Yellow color for 'ON'
          thumbColor={privacySettings[settingKey] ? '#fff' : '#fff'}
          onValueChange={() => handleToggle(settingKey)}
          value={privacySettings[settingKey]}
        />
      </View>
    );
  };
  return (
    <View style={styles.cantainer}>
      <View style={styles.headerCantainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            source={require('../assets/left.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headText}>Manage my privacy</Text>
      </View>

      <View style={styles.line} />

            {/* Settings List */}
      <View style={styles.listContainer}>
        <SettingRow
          title="Chat Access"
          subtitle="Astrologers can access your chat after the chat ends"
          settingKey="chatAccess"
        />
        <SettingRow
          title="Download Access"
          subtitle="Astrologers can download the images you shared"
          settingKey="downloadAccess"
        />
        <SettingRow
          title="Screenshots"
          subtitle="Astrologers can access your chat after the call ends"
          settingKey="screenshots"
        />
        <SettingRow
          title="Call Access"
          subtitle="Astrologers can access your call recordings"
          settingKey="callAccess"
        />
      </View>
    </View>
  );
};

export default ManagePrivacy;

const styles = StyleSheet.create({
  cantainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'rgb(245, 245, 245)',
  },
  headerCantainer: {
    flexDirection: 'row',
  },
  leftIcon: {
    width: 25,
    height: 25,
    marginLeft: 20,
    // marginTop: 5,
  },
  headText: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 15,
    marginLeft: 45,
  },
  line: {
    marginTop: 1,
    height: 1,
    width: '%',
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    fontWeight: 'bold',
    // marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 150,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  textContainer: {
    flex: 1,
    paddingRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#888',
  },
});

