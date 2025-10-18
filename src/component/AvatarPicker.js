import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';

const avatars = [
  { id: '0', name: 'Default', img: require('../assets/avatar/avatar1.jpg') },
  { id: '1', name: 'Aries', img: require('../assets/avatar/avatar1.jpg') },
  { id: '2', name: 'Taurus', img: require('../assets/avatar/avatar2.jpg') },
  { id: '3', name: 'Gemini', img: require('../assets/avatar/avatar3.jpg') },
  { id: '4', name: 'Cancer', img: require('../assets/avatar/avatar1.jpg') },
  { id: '5', name: 'Leo', img: require('../assets/avatar/avatar2.jpg') },
  { id: '6', name: 'Virgo', img: require('../assets/avatar/avatar3.jpg') },
  { id: '7', name: 'Libra', img: require('../assets/avatar/avatar1.jpg') },
];

const AvatarPicker = ({ visible, onClose, onSelect, selectedId }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Change Profile Picture</Text>
          <Text style={styles.subtitle}>Select from our collection</Text>

          <FlatList
            data={avatars}
            keyExtractor={item => item.id}
            numColumns={4}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.avatarWrapper}
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.avatarContainer,
                    selectedId === item.id && styles.selectedAvatarContainer
                  ]}
                >
                  <Image source={item.img} style={styles.avatar} />
                </View>
                {selectedId === item.id && (
                  <View style={styles.checkMark}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
                <Text 
                  style={[
                    styles.name,
                    selectedId === item.id && styles.selectedName
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AvatarPicker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxHeight: '75%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000033',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 10,
  },
  avatarWrapper: {
    alignItems: 'center',
    margin: 6,
    width: 70,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 2, // ✅ Creates space between border and image
    backgroundColor: '#fff',
  },
  selectedAvatarContainer: {
    borderWidth: 3,
    borderColor: '#f39c12',
    elevation: 4,
    shadowColor: '#f39c12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28, // ✅ Slightly smaller to fit inside padding
    resizeMode: 'cover',
  },
  checkMark: {
    position: 'absolute',
    top: -4,
    right: 3,
    backgroundColor: '#f39c12',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
  },
  checkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    marginTop: 6,
    fontSize: 11,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  selectedName: {
    color: '#f39c12',
    fontWeight: '700',
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#000033',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'center',
    elevation: 2,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
