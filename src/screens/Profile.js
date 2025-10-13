import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api/UserService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AvatarPicker from '../component/AvatarPicker';
import PofileStyle from '../style/ProfileStyle';

const Profile = () => {
  const { user, isAuthenticated, fetchUserProfile } = useAuth();
  const navigation = useNavigation();

  // State variables
  const [name, setName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [pincode, setPincode] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [cityStateCountry, setCityStateCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState('0');
  const [pickerVisible, setPickerVisible] = useState(false);

  // Track original values
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // ✅ ADDED: Track if profile has been loaded to prevent re-loading
  const hasLoadedProfile = useRef(false);

  const styles = PofileStyle;

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to view your profile',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.replace('Login'),
          },
        ],
        { cancelable: false }
      );
    }
  }, [isAuthenticated, navigation]);

  // ✅ FIXED: Only fetch user profile once when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadUserProfile = async () => {
        if (isAuthenticated && !hasLoadedProfile.current) {
          console.log('📡 Fetching user profile...');
          setLoading(true);
          try {
            await fetchUserProfile();
            hasLoadedProfile.current = true; // ✅ Mark as loaded
            console.log('✅ User profile loaded');
          } catch (error) {
            console.error('❌ Failed to fetch profile:', error);
          } finally {
            setLoading(false);
          }
        }
      };
      loadUserProfile();

      // ✅ ADDED: Reset flag when screen loses focus
      return () => {
        hasLoadedProfile.current = false;
      };
    }, [isAuthenticated]) // ✅ REMOVED: fetchUserProfile from dependencies
  );

  // ✅ FIXED: Load user data only once when user is available
  useEffect(() => {
    if (user && isAuthenticated && !dataLoaded) {
      console.log('📝 Loading user data into form...');
      
      const userData = {
        name: user.name || '',
        gender: user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Male',
        dob: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
        time: new Date(),
        placeOfBirth: user.placeOfBirth || '',
        address: user.currentAddress || '',
        cityStateCountry: [user.city, user.state, user.country].filter(Boolean).join(', '),
        pincode: user.pincode || '',
        avatarId: user.profileImage || '0',
      };

      if (user.timeOfBirth) {
        const [hours, minutes] = user.timeOfBirth.split(':');
        const timeDate = new Date();
        timeDate.setHours(parseInt(hours), parseInt(minutes));
        userData.time = timeDate;
      }

      // Set form values
      setName(userData.name);
      setGender(userData.gender);
      setDob(userData.dob);
      setTime(userData.time);
      setPlaceOfBirth(userData.placeOfBirth);
      setAddress(userData.address);
      setCityStateCountry(userData.cityStateCountry);
      setPincode(userData.pincode);
      setSelectedAvatarId(userData.avatarId);

      // Store original data
      setOriginalData(userData);
      setDataLoaded(true);

      console.log('✅ Form data loaded');
    }
  }, [user, isAuthenticated, dataLoaded]); // ✅ ADDED: dataLoaded to prevent re-loading

  // Detect changes
  useEffect(() => {
    if (!dataLoaded) return;

    const currentData = {
      name: name.trim(),
      gender,
      dob: dob.toISOString().split('T')[0],
      time: formatTimeToHHMM(time),
      placeOfBirth: placeOfBirth.trim(),
      address: address.trim(),
      cityStateCountry: cityStateCountry.trim(),
      pincode: pincode.trim(),
      avatarId: selectedAvatarId,
    };

    const originalFormatted = {
      name: originalData.name?.trim() || '',
      gender: originalData.gender || 'Male',
      dob: originalData.dob?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      time: formatTimeToHHMM(originalData.time || new Date()),
      placeOfBirth: originalData.placeOfBirth?.trim() || '',
      address: originalData.address?.trim() || '',
      cityStateCountry: originalData.cityStateCountry?.trim() || '',
      pincode: originalData.pincode?.trim() || '',
      avatarId: originalData.avatarId || '0',
    };

    const changed = JSON.stringify(currentData) !== JSON.stringify(originalFormatted);
    setHasChanges(changed);
  }, [name, gender, dob, time, placeOfBirth, address, cityStateCountry, pincode, selectedAvatarId, dataLoaded, originalData]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatTimeToHHMM = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const parseCityStateCountry = (combinedString) => {
    const parts = combinedString.split(',').map(s => s.trim());
    return {
      city: parts[0] || '',
      state: parts[1] || '',
      country: parts[2] || '',
    };
  };

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatarId(avatarId);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 50) {
      Alert.alert('Validation Error', 'Name must be between 2 and 50 characters');
      return;
    }

    if (!placeOfBirth.trim()) {
      Alert.alert('Validation Error', 'Place of birth is required');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Validation Error', 'Current address is required');
      return;
    }

    if (!cityStateCountry.trim()) {
      Alert.alert('Validation Error', 'City, State, Country is required');
      return;
    }

    if (!pincode.trim() || !/^[1-9][0-9]{5}$/.test(pincode)) {
      Alert.alert('Validation Error', 'Please enter a valid 6-digit Indian pincode');
      return;
    }

    setLoading(true);

    const location = parseCityStateCountry(cityStateCountry);

    const updateData = {
      name: name.trim(),
      gender: gender.toLowerCase(),
      dateOfBirth: dob.toISOString().split('T')[0],
      timeOfBirth: formatTimeToHHMM(time),
      placeOfBirth: placeOfBirth.trim(),
      currentAddress: address.trim(),
      city: location.city,
      state: location.state,
      country: location.country,
      pincode: pincode.trim(),
      profileImage: selectedAvatarId,
    };

    console.log('📝 Updating profile with:', updateData);

    try {
      const response = await userService.updateProfile(updateData);

      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // ✅ FIXED: Reload user data after successful update
              setDataLoaded(false);
              hasLoadedProfile.current = false;
              fetchUserProfile?.();
              setHasChanges(false);
              navigation.goBack();
            },
          },
        ]);
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth or loading user data
  if (!isAuthenticated || !dataLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#000033" />
          <Text style={{ marginTop: 10, color: '#000033' }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.headerCantainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/back.png')}
              style={styles.leftIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headText}>Profile</Text>
        </View>

        <View style={styles.line} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={selectedAvatarId === '0' ? require('../assets/Avatar.jpg') : { uri: selectedAvatarId }}
              style={styles.profileAvatar}
            />
          </View>

          <View style={styles.AvatarUploadContainer}>
            <TouchableOpacity onPress={() => setPickerVisible(true)}>
              <Image
                source={require('../assets/upload.png')}
                style={styles.AvatarUpload}
              />
            </TouchableOpacity>
          </View>

          <AvatarPicker
            visible={pickerVisible}
            onClose={() => setPickerVisible(false)}
            onSelect={handleAvatarSelect}
            selectedId={selectedAvatarId}
          />

          <Text style={styles.phoneNumber}>
            {user?.phoneNumber || '+91-0000000000'}
          </Text>

          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <View style={styles.radioContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.radioOptions}>
              {['Male', 'Female'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => setGender(option)}
                >
                  <View
                    style={[
                      styles.radio,
                      gender === option && styles.radioSelected,
                    ]}
                  >
                    {gender === option && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.label}>
            Date of Birth <Text style={styles.required}></Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.underlineInput}
          >
            <Text style={styles.dateText}>{dob.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.label}>
            Time of Birth <Text style={styles.required}></Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.underlineInput}
          >
            <Text style={styles.dateText}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.label}>
            Place of Birth <Text style={styles.required}></Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter place of birth"
            value={placeOfBirth}
            onChangeText={setPlaceOfBirth}
          />

          <Text style={styles.label}>
            Current Address <Text style={styles.required}></Text>
          </Text>
          <TextInput
            style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
            placeholder="Enter Flat/House No., Street, Area"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <Text style={styles.label}>
            City, State, Country <Text style={styles.required}></Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Town/City, State, Country"
            value={cityStateCountry}
            onChangeText={setCityStateCountry}
          />

          <Text style={styles.label}>
            Pincode <Text style={styles.required}></Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pincode"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
            maxLength={6}
          />
        </ScrollView>

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!hasChanges || loading) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!hasChanges || loading}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.submitButtonText}>SAVING...</Text>
              </View>
            ) : (
              <Text style={[styles.submitButtonText, !hasChanges && { color: '#999' }]}>SUBMIT</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
