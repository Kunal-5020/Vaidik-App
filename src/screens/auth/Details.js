// src/screens/auth/Details.js
import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DetailsStyle from '../../style/DetailsStyle';
import DatePicker from 'react-native-date-picker';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { userService } from '../../services/api/UserService';
import AuthService from '../../services/AuthService';

const Details = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    location: '',
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [timeOpen, setTimeOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const { user, refreshUser } = useAuth();
  const navigation = useNavigation();

  const styles = DetailsStyle;

  /**
   * Handle next step or submit
   * Backend: PATCH /users/profile
   * Fields: {
   *   name, gender, dateOfBirth (YYYY-MM-DD),
   *   timeOfBirth (HH:MM), placeOfBirth
   * }
   */
  const handleNext = async () => {
    const currentKey = Object.keys(formData)[currentStep - 1];

    // Validate current field
    if (!formData[currentKey]) {
      Alert.alert('Required', 'Please fill in this field to proceed.');
      return;
    }

    // Move to next step or submit
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  /**
   * Submit profile data to backend
   */
  const handleSubmit = async () => {
    // Check authentication
    const authStatus = await AuthService.checkAuthStatus();

    if (!authStatus.isAuthenticated) {
      Alert.alert('Error', 'You need to login first');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare profile data for backend
      const updateData = {
        name: formData.name.trim(),
        gender: formData.gender.toLowerCase(), // Backend expects lowercase
        dateOfBirth: formData.birthDate ? formatDateToISO(formData.birthDate) : undefined,
        timeOfBirth: formData.birthTime ? formatTimeTo24Hour(formData.birthTime) : undefined,
        placeOfBirth: formData.location.trim() || undefined,
      };

      console.log('📝 Updating profile with:', updateData);

      // Call userService to update profile
      const result = await userService.updateProfile(updateData);

      if (result.success) {
        console.log('✅ Profile updated successfully:', result.data);

        // Update local user data
        await refreshUser(); // Refresh user from backend

        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerNavigation' }],
        });
      } else {
        throw new Error(result.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('❌ Profile setup error:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile. Please try again.';

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Convert DD-MM-YYYY to ISO format YYYY-MM-DD
   * Backend expects: "1990-05-15"
   */
  const formatDateToISO = (ddmmyyyy) => {
    const [dd, mm, yyyy] = ddmmyyyy.split('-');
    return `${yyyy}-${mm}-${dd}`;
  };

  /**
   * Convert 12-hour time to 24-hour format
   * Backend expects: "14:30" (HH:MM in 24-hour format)
   */
  const formatTimeTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier.toUpperCase() === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  /**
   * Handle gender selection and auto-proceed
   */
  const handleGenderSelect = (gender) => {
    setFormData({ ...formData, gender });
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
    }, 300);
  };

  /**
   * Render progress dots
   */
  const renderDots = () => {
    const steps = [
      { id: 1, icon: 'user' }, // Name
      { id: 2, icon: 'venus-mars' }, // Gender
      { id: 3, icon: 'calendar-alt' }, // Birth Date
      { id: 4, icon: 'clock' }, // Birth Time
      { id: 5, icon: 'map-marker-alt' }, // Birth Place
    ];

    return steps.map((step) => {
      const isActive = step.id === currentStep;
      const isCompleted = step.id < currentStep;

      return (
        <View
          key={step.id}
          style={[styles.dot, (isActive || isCompleted) && styles.activeDot]}
        >
          {(isActive || isCompleted) && (
            <FontAwesome5
              name={step.icon}
              size={8}
              color={isActive ? '#000' : '#fff'}
              style={styles.dotIcon}
            />
          )}
        </View>
      );
    });
  };

  /**
   * Render current step card
   */
  const renderCard = () => {
    switch (currentStep) {
      // Step 1: Name
      case 1:
        return (
          <View key="name" style={styles.card}>
            <Text style={styles.greet}>Hey there! </Text>
            <Text style={styles.question}>What is your name?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#888"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                returnKeyType="next"
                onSubmitEditing={handleNext}
                autoFocus={true}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      // Step 2: Gender
      case 2:
        return (
          <View key="gender" style={styles.card}>
            <Text style={styles.question}>What is your gender?</Text>
            <View style={styles.genderContainer}>
              {/* Male */}
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'Male' && styles.selectedGender,
                ]}
                onPress={() => handleGenderSelect('Male')}
              >
                <Image
                  source={require('../../assets/male.png')}
                  style={[
                    styles.genderImage,
                    formData.gender === 'Male' && styles.selectedImage,
                  ]}
                />
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === 'Male' && styles.selectedGenderText,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              {/* Female */}
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'Female' && styles.selectedGender,
                ]}
                onPress={() => handleGenderSelect('Female')}
              >
                <Image
                  source={require('../../assets/female.png')}
                  style={[
                    styles.genderImage,
                    formData.gender === 'Female' && styles.selectedImage,
                  ]}
                />
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === 'Female' && styles.selectedGenderText,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      // Step 3: Birth Date
      case 3:
        return (
          <View key="dob" style={styles.card}>
            <Text style={styles.question}>Enter your birth date</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="DD-MM-YYYY"
                placeholderTextColor="#888"
                value={formData.birthDate}
                editable={false}
              />
              <TouchableOpacity onPress={() => setOpen(true)}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color="#888"
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            <DatePicker
              modal
              mode="date"
              open={open}
              date={date}
              maximumDate={new Date()}
              onConfirm={(selectedDate) => {
                setOpen(false);
                setDate(selectedDate);
                const formatted = `${String(selectedDate.getDate()).padStart(
                  2,
                  '0'
                )}-${String(selectedDate.getMonth() + 1).padStart(
                  2,
                  '0'
                )}-${selectedDate.getFullYear()}`;
                setFormData({ ...formData, birthDate: formatted });
              }}
              onCancel={() => setOpen(false)}
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      // Step 4: Birth Time
      case 4:
        return (
          <View key="time" style={styles.card}>
            <Text style={styles.question}>Enter your birth time</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="HH:MM AM/PM"
                placeholderTextColor="#888"
                value={formData.birthTime}
                editable={false}
              />
              <TouchableOpacity onPress={() => setTimeOpen(true)}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color="#888"
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Time Picker */}
            <DatePicker
              modal
              mode="time"
              open={timeOpen}
              date={time}
              onConfirm={(selectedTime) => {
                setTimeOpen(false);
                setTime(selectedTime);

                let hours = selectedTime.getHours();
                const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                const formatted = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

                setFormData({ ...formData, birthTime: formatted });
              }}
              onCancel={() => setTimeOpen(false)}
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );

      // Step 5: Birth Place
      case 5:
        return (
          <View key="location" style={styles.card}>
            <Text style={styles.question}>Where were you born?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your birth place"
                placeholderTextColor="#888"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                returnKeyType="done"
                onSubmitEditing={handleNext}
                autoFocus={true}
              />
              <Feather
                name="search"
                size={24}
                color="#888"
                style={styles.searchIcon}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleNext}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.buttonText}>Saving...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Start Chat with Astrologer</Text>
              )}
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      Alert.alert(
        'Cancel Profile Setup',
        'Are you sure you want to go back? Your progress will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Go Back',
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} disabled={loading}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.topHeaderTitle}>Enter Your Details</Text>
        <View style={{ width: 24 + 20 }} />
      </View>

      {/* Progress Dots */}
      <View style={styles.dots}>{renderDots()}</View>

      {/* Content */}
      <View style={styles.content}>{renderCard()}</View>
    </KeyboardAvoidingView>
  );
};

export default Details;
