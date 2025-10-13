import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Language = ({
  defaultLanguage = 'ENG',
  availableLanguages = [
    { code: 'ENG', name: 'English' },
    { code: 'हिंदी', name: 'Hindi' },
    { code: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
    { code: 'मराठी', name: 'Marathi' },
    { code: 'తెలుగు', name: 'Telugu' },
    { code: 'ಕನ್ನಡ', name: 'Kannada' },
    { code: 'বাংলা', name: 'Bengali' },
  ],
  onApply = () => {},
}) => {
  const [selectedLang, setSelectedLang] = useState(defaultLanguage);

  const handleApply = () => {
    onApply(selectedLang);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Choose your app language</Text>

      <View style={styles.langGrid}>
        {availableLanguages.map(item => (
          <TouchableOpacity
            key={item.code}
            style={[
              styles.langBox,
              selectedLang === item.code && styles.selectedBox,
            ]}
            onPress={() => setSelectedLang(item.code)}
          >
            <Text
              style={[
                styles.langText,
                selectedLang === item.code && styles.selectedText,
              ]}
            >
              {item.code}
            </Text>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footerText}>
        *Malayalam, Tamil, Gujarati and Odia are coming soon!
      </Text>

      <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
        <Text style={{ color: '#000', fontWeight: 'bold' }}>APPLY</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  langBox: {
    width: '28%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedBox: {
    borderColor: '#FFD700',
    backgroundColor: '#FFF8DC',
  },
  langText: {
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#FFD700',
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
  },
  applyBtn: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
});

export default Language;
