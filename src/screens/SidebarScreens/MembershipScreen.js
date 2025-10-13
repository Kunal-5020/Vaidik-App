import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';

const { width } = Dimensions.get('window');

const MembershipScreen = ({ navigation }) => {
  const [expanded, setExpanded] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const membership = {
    id: '1',
    title: 'Loyal Club Membership',
    benefits: [
      'Get flat 10% off on the price of your favourite astrologer',
      'Talk to astrologer for long hours at a discounted price',
      'Get priority in waitlist',
      'Exclusive festival offers and seasonal coupons',
      'Special loyalty rewards every month',
    ],
    price: '499',
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headText}>Buy Membership</Text>
      </View>

      <View style={styles.line} />

      {/* Membership Card */}
      <View style={styles.card}>
        {/* Star + Title in Row */}
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.star}>★</Text>
          </View>
          <Text style={styles.cardTitle}>{membership.title}</Text>
        </View>

        {/* Benefits */}
        {(expanded ? membership.benefits : membership.benefits.slice(0, 2)).map(
          (benefit, index) => (
            <Text key={index} style={styles.listItem}>
              ✔ {benefit}
            </Text>
          ),
        )}

        {/* Toggle button */}
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.detailsLink}>
            {expanded ? 'Less Details' : 'More Details'}
          </Text>
        </TouchableOpacity>

        {/* Buy Now */}
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => navigation.navigate('BuyMembership', { membership })}
        >
          <Text style={styles.buyBtnText}>BUY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MembershipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginLeft: 20,
    tintColor: '#000',
  },
  headText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 30,
    color: '#000',
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f6b900',
    padding: 16,
    width: width * 0.9, // ✅ responsive card width
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9966',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  star: { fontSize: 20, color: '#fff' },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flexShrink: 1, // ✅ text won't overflow
  },
  listItem: { fontSize: 14, color: '#333', marginVertical: 2 },
  detailsLink: {
    color: '#3366cc',
    textDecorationLine: 'underline',
    marginTop: 8,
    marginBottom: 12,
  },
  buyBtn: {
    backgroundColor: '#f6b900',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyBtnText: { color: '#000', fontWeight: '600', fontSize: 15 },
});
