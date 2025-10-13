import { StyleSheet, Dimensions } from 'react-native';
import React from 'react';
const { width } = Dimensions.get('window');

const DetailsStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000033',
    padding: 20,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  headerLeft: {
    alignItems: 'center',
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    // backgroundColor: 'hsla(253, 93%, 10%, 1.00)',
    backgroundColor: '#000033',
    borderRadius: 15,
    padding: 20,
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginTop: 30,
  },
  question: {
    fontSize: 24,
    fontWeight: 'normal',
    color: 'white',
    marginBottom: 30,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  genderButton: {
    alignItems: 'center',
    backgroundColor: '#1a3360',
    borderRadius: 10,
    padding: 20,
  },
  selectedGender: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  genderText: {
    color: '#fff',
    marginTop: 5,
  },
  selectedGenderText: {
    color: '#000',
  },
  // ================render dots icons=====================
  dots: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 8,
    justifyContent: 'flex-start', // left align
    alignItems: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // activeDot: {
  //   backgroundColor: '#ffc107',
  // },
  dotIcon: {
    alignSelf: 'center',
  },
  greet: {
    fontSize: 24,
    fontWeight: '500',
    color: 'white',
  },
  genderImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
    tintColor: '#fff', // makes image white by default (optional)
  },
  selectedImage: {
    tintColor: '#000', // changes to black when selected
  },
});

export default DetailsStyle;