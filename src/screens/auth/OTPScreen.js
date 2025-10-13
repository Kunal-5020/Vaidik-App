// src/screens/auth/OTPScreen.js
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import OTPStyle from '../../style/OTPStyles';
import { useAuth } from '../../context/AuthContext';

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // ✅ ADDED: Track verification state
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const hasVerified = useRef(false); // ✅ ADDED: Prevent double submission

  const styles = OTPStyle;

  // Get params from navigation
  const { phoneNumber, countryCode, fullPhoneNumber } = route.params || {};
  const { verifyOtp, sendOtp, loading, error, clearError } = useAuth();

  // Memoize values
  const cleanCountryCode = useMemo(() => countryCode?.replace('+', '') || '91', [countryCode]);
  const displayPhoneNumber = useMemo(
    () => fullPhoneNumber || `+${cleanCountryCode}${phoneNumber || ''}`,
    [fullPhoneNumber, cleanCountryCode, phoneNumber]
  );
  const isOtpComplete = useMemo(() => otp.join('').length === 6, [otp]);

  // Cleanup timer on unmount
  useEffect(() => {
    console.log('📱 OTP Screen loaded for:', displayPhoneNumber);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [displayPhoneNumber]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  // Listen for context errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {
          text: 'OK',
          onPress: () => clearError(),
        },
      ]);
    }
  }, [error, clearError]);

  /**
   * Handle OTP input change (optimized)
   */
  const handleChange = useCallback((text, index) => {
    // Only allow numeric input
    if (text && !/^\d$/.test(text)) {
      return;
    }

    // Only allow single digit
    const digit = text.charAt(0);

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = digit;
      return newOtp;
    });

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (digit && index === 5) {
      // Auto-dismiss keyboard when last digit is entered
      Keyboard.dismiss();
    }
  }, []);

  /**
   * Handle backspace (optimized)
   */
  const handleKeyPress = useCallback((e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[index] = '';
          return newOtp;
        });
      }
    }
  }, [otp]);

  /**
   * Resend OTP (optimized)
   */
  const handleResend = useCallback(async () => {
    try {
      setResendLoading(true);
      clearError();

      console.log('📞 Resending OTP to:', phoneNumber);

      await sendOtp(phoneNumber, cleanCountryCode);

      // Reset timer and OTP inputs
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      hasVerified.current = false; // ✅ ADDED: Reset verification flag
      
      // Focus first input after short delay
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number.');
      console.log('✅ OTP resent successfully');
    } catch (error) {
      console.error('❌ Resend OTP error:', error);
      Alert.alert('Resend Failed', error.message || 'Could not resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  }, [phoneNumber, cleanCountryCode, sendOtp, clearError]);

  /**
   * Navigate based on user profile status
   */
  const navigateUser = useCallback((user, isNewUser) => {
    console.log('📊 User status:', {
      isNewUser,
      hasName: !!user.name,
      hasEmail: !!user.email,
      hasGender: !!user.gender,
      isProfileComplete: user.isProfileComplete,
    });

    // Check if profile is complete
    const isProfileComplete = user.isProfileComplete;

    if (isNewUser || !isProfileComplete) {
      console.log('➡️ Navigating to Details (profile incomplete)');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Details' }],
      });
    } else {
      console.log('➡️ Navigating to DrawerNavigation (profile complete)');
      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigation' }],
      });
    }
  }, [navigation]);

  /**
   * Verify OTP (with double-submission prevention)
   */
  const handleVerify = useCallback(async () => {
    const enteredOtp = otp.join('');

    // Validation
    if (enteredOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a complete 6-digit OTP');
      return;
    }

    // ✅ ADDED: Prevent double submission
    if (isVerifying || hasVerified.current) {
      console.log('⚠️ Already verifying, skipping duplicate request');
      return;
    }

    try {
      setIsVerifying(true); // ✅ Set verifying state
      hasVerified.current = true; // ✅ Mark as verified

      clearError();
      Keyboard.dismiss();
      
      console.log('🔐 Verifying OTP:', enteredOtp, cleanCountryCode, phoneNumber);
      console.log('🔐 Timestamp:', new Date().toISOString());

      const result = await verifyOtp(phoneNumber, cleanCountryCode, enteredOtp);

      if (result.success) {
        console.log('✅ OTP verification successful');

        const { user, isNewUser } = result.data;
        navigateUser(user, isNewUser);
      } else {
        throw new Error(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      
      // ✅ Reset verification state on error
      hasVerified.current = false;
      
      Alert.alert(
        'Verification Failed',
        error.message || 'OTP verification failed. Please try again.'
      );
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setIsVerifying(false); // ✅ Clear verifying state
    }
  }, [otp, phoneNumber, cleanCountryCode, verifyOtp, clearError, navigateUser, isVerifying]);

  /**
   * Auto-verify when OTP is complete (with debounce and double-submission check)
   */
  useEffect(() => {
    if (isOtpComplete && !loading && !isVerifying && !hasVerified.current) {
      // ✅ ADDED: Small delay to prevent race conditions
      const timeout = setTimeout(() => {
        console.log('🔄 Auto-verifying OTP...');
        handleVerify();
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isOtpComplete, loading, isVerifying, handleVerify]);

  /**
   * Reset hasVerified when OTP changes (allows re-verification after error)
   */
  useEffect(() => {
    if (otp.join('').length < 6) {
      hasVerified.current = false;
    }
  }, [otp]);

  /**
   * Handle back navigation (optimized)
   */
  const handleBack = useCallback(() => {
    Alert.alert(
      'Cancel Verification',
      'Are you sure you want to go back? You will need to request OTP again.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Go Back', onPress: () => navigation.goBack() },
      ]
    );
  }, [navigation]);

  return (
    <View style={styles.Cantainer}>
      {/* Header */}
      <View style={styles.headContiner}>
        <TouchableOpacity onPress={handleBack} disabled={loading || isVerifying}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.VerfiyText}>Verify Phone</Text>
      </View>

      <View style={styles.lineStyle} />

      {/* OTP Content */}
      <View style={styles.setnMessaheStore}>
        <Text style={styles.sentMessageSyle}>
          OTP sent to{' '}
          <Text style={styles.highlightNumber}>{displayPhoneNumber}</Text>
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.boxInput,
                digit && styles.boxInputFilled,
              ]}
              ref={(ref) => (inputRefs.current[index] = ref)}
              editable={!loading && !resendLoading && !isVerifying} // ✅ ADDED: Disable during verification
              selectTextOnFocus
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOtpComplete || loading || resendLoading || isVerifying) && { opacity: 0.6 }, // ✅ ADDED: isVerifying
          ]}
          onPress={handleVerify}
          disabled={!isOtpComplete || loading || resendLoading || isVerifying} // ✅ ADDED: isVerifying
          activeOpacity={0.8}
        >
          {(loading || isVerifying) ? ( // ✅ ADDED: isVerifying check
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator
                size="small"
                color="black"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.verifyButtonText}>Verifying...</Text>
            </View>
          ) : (
            <Text style={styles.verifyButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {/* Timer / Resend Button */}
        {timer > 0 ? (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Didn't receive OTP? Resend available in{' '}
              <Text style={styles.timerHighlight}>{timer}s</Text>
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleResend}
            style={styles.resendButton}
            disabled={resendLoading || loading || isVerifying} // ✅ ADDED: isVerifying
            activeOpacity={0.8}
          >
            {resendLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator
                  size="small"
                  color="#FF6B35"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.resendText}>Sending...</Text>
              </View>
            ) : (
              <Text style={styles.resendText}>Resend OTP</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Having trouble? Make sure you entered the correct phone number.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(OTPScreen);
