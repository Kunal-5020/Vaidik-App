import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ProfileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#000033',
    fontWeight: '500',
  },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  leftIcon: {
    width: 20,
    height: 20,
    tintColor: '#000033',
  },
  headText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000033',
    flex: 1,
  },
  line: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },

  // ScrollView Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Avatar Section - FIXED BORDER
  avatarSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    position: 'relative',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#000033',
    padding: 4, // ✅ Padding creates space between border and image
    backgroundColor: '#fff',
    // ✅ Shadow for depth
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 56, // ✅ Slightly smaller radius for proper fit
    resizeMode: 'cover',
  },
  avatarUploadContainer: {
    position: 'absolute',
    bottom: 0,
    right: (width / 2) - 70, // ✅ Properly centered
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#000033',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarUpload: {
    width: 18,
    height: 18,
    tintColor: '#f39c12',
  },
  phoneNumber: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },

  // Form Container
  formContainer: {
    paddingHorizontal: 20,
  },

  // Form Field Styles
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#000033',
  },
  required: {
    color: '#e74c3c',
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#000033',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 20,
    fontSize: 15,
    color: '#333',
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  underlineInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#000033',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 20,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#333',
  },

  // Radio Button Styles
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioOptions: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radio: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#000033',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000033',
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },

  // Submit Button Styles - IMPROVED
  submitButtonContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    backgroundColor: '#000033',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#d0d0d0',
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ProfileStyles;
