import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import OTPStyle from '../../style/OTPStyles';
import { useAuth } from '../../context/AuthContext';

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  const styles = OTPStyle;

  const { phoneNumber, countryCode, otp: devOtp } = route.params || {};
  const { verifyOtp, sendOtp, loading, clearError } = useAuth();

  // Timer countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // If devOtp is present (for development/debug/test), pre-fill it
  useEffect(() => {
    if (devOtp && devOtp.length === 6) {
      setOtp(devOtp.split(''));
    }
  }, [devOtp]);

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleResend = async () => {
    try {
      clearError();
      setTimer(30);
      await sendOtp(phoneNumber, countryCode);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
    } catch (error) {
      Alert.alert('Resend Failed', error.message);
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a complete 6-digit OTP');
      return;
    }

    try {
      clearError();
      const result = await verifyOtp(phoneNumber, countryCode, enteredOtp);

      if (result.success) {
        // Depending on your backend, use isNewUser or profile completion
        const user = result.data.user;
        const needDetails =
          !user?.name ||
          !user?.gender ||
          !user?.dateOfBirth ||
          !user?.timeOfBirth ||
          !user?.placeOfBirth;

        if (needDetails) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Details' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'DrawerNavigation' }],
          });
        }
      } else {
        Alert.alert('Verification Failed', result.message || 'Could not verify OTP');
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'OTP verification failed');
    }
  };

  return (
    <View style={styles.Cantainer}>
      <View style={styles.headContiner}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.VerfiyText}>Verify Phone</Text>
      </View>

      <View style={styles.lineStyle}></View>
      <View style={styles.setnMessaheStore}>
        <Text style={styles.sentMessageSyle}>
          OTP sent to <Text style={styles.highlightNumber}>+{countryCode || '91'}-{phoneNumber || '9810559439'}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              style={styles.boxInput}
              ref={ref => (inputRefs.current[index] = ref)}
              editable={!loading}
              returnKeyType="done"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            (otp.join('').length !== 6 || loading) && { opacity: 0.6 }
          ]}
          onPress={handleVerify}
          disabled={otp.join('').length !== 6 || loading}
        >
          {loading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="black" style={{ marginRight: 8 }} />
              <Text style={styles.verifyButtonText}>Verifying...</Text>
            </View>
          ) : (
            <Text style={styles.verifyButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {timer > 0 ? (
          <Text style={styles.timerText}>Resend OTP available in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OTPScreen;
