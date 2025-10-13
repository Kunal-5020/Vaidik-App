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
];

const AvatarPicker = ({ visible, onClose, onSelect, selectedId }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Change Profile Pic</Text>
          <Text style={styles.subtitle}>Select from Library</Text>

          <FlatList
            data={avatars}
            keyExtractor={item => item.id}
            numColumns={4}
            contentContainerStyle={{ alignItems: 'center' }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.avatarContainer,
                  selectedId === item.id && styles.selectedAvatar
                ]}
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
              >
                <Image source={item.img} style={styles.avatar} />
                {selectedId === item.id && (
                  <View style={styles.checkMark}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Cancel</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000033',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  avatarContainer: {
    alignItems: 'center',
    margin: 10,
    position: 'relative',
  },
  selectedAvatar: {
    borderWidth: 3,
    borderColor: '#f39c12',
    borderRadius: 35,
    padding: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  checkMark: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#f39c12',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
