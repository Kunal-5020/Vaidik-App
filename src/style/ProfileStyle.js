import { StyleSheet } from 'react-native';

const ProfileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    // backgroundColor: 'white',
    backgroundColor: 'rgb(245, 245, 245)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    // Adjusting padding to simulate the top bar in your first screenshot
    paddingHorizontal: 20,
  },
  backArrow: {
    fontSize: 28,
    marginRight: 10,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20, // Padding for content
    paddingBottom: 20,
  },

  // --- Radio Button Styles ---
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    paddingTop: 5,
  },
  radioOptions: {
    flexDirection: 'row',
    marginTop: -2,
    // paddingVertical: -3,
    marginHorizontal: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#000333',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000333',
  },
  radioLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },

  // --- Submit Button Styles (FIXED) ---
  submitButtonContainer: {
    // This container is responsible for holding the button and being lifted by the KAV
    backgroundColor: '#fff',
    padding: 0,
    // Removed border top to prevent overlap issues
  },
  submitButton: {
    width: '100%',
    // Margin is applied here to give the button space from the edges
    backgroundColor: '#000033',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginHorizontal: 1,
    marginVertical: 14, // Gives vertical padding inside the container
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  //   =====================
  label: {
    marginBottom: 5,
    fontSize: 18,
    fontWeight: '400',
    color: '#000033',
  },
  required: {
    color: 'grey',
  },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#333',
    paddingVertical: 4,
    marginBottom: 10,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  radioText: {
    marginLeft: 6,
    fontSize: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  underlineInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#333',
    paddingVertical: 8,
    marginBottom: 20,
    justifyContent: 'center',
  },
  submitContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 750,
    backgroundColor: '#000033',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  submitBtn: {
    backgroundColor: '#000033',
    paddingVertical: 14,
    borderRadius: 1,
    alignItems: 'center',
    width: '100%',
    height: 50,
  },

  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginLeft: 25,
    marginTop: 5,
    // tintColor: 'white',
  },
  avatarContainer: {
    marginTop: 20,
    width: 130,
    padding: 10,
    marginHorizontal: 110,
    height: 130,
    borderWidth: 2,
    borderColor: '#000033',
    borderRadius: 62,
    // backgroundColor:'yellow'
  },

  profileAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55, // Make the image circular
    resizeMode: 'cover',
    // marginHorizontal:110
  },
  headText: {
    fontSize: 19,
    fontWeight: '400',
    marginBottom: 10,
    marginLeft: 65,
    // color: 'white',
  },
  line: {
    marginTop: -3,
    height: 1,
    width: '110%',
    backgroundColor: '#ccc',
    right: 12,
  },
  headerCantainer: {
    flexDirection: 'row',
    // marginTop:10,
    // backgroundColor: '#000333',
    padding: 10,
    width: '110%',
    right: 16,
  },
  AvatarUpload: {
    width: 22,
    height: 22,
    tintColor: 'orange',
    padding: 2,
    margin: 2,
  },
  AvatarUploadContainer: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    left: 210,
    top: -35,
    borderWidth: 2,
    borderColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneNumber: {
    left: 110,
    marginVertical: -8,
    fontSize: 16,
    fontWeight: '500',
    color: 'grey',
  },
});

export default ProfileStyles;