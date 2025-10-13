import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

// ================= Banner Data =================
const bannerData = [
  {
    id: '1',
    text: 'Rudraksha Consultation now at ₹99/- only!',
    image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7',
  },
  {
    id: '2',
    text: 'Special Horoscope Reading at ₹199/-',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
  },
  {
    id: '3',
    text: 'Navratri Puja Bookings Open!',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc',
  },
];

// ================= Categories =================
const CategoriesData = [
  { id: '1', title: 'Bracelets', img: require('../assets/rudraksha.png') }, // ✅ local
  {
    id: '2',
    title: 'Rudraksha',
    img: 'https://img.icons8.com/color/96/acorn.png',
  },
  {
    id: '3',
    title: 'Pendants',
    img: 'https://img.icons8.com/ios-filled/100/necklace.png',
  },
  {
    id: '4',
    title: 'Gemstone',
    img: 'https://img.icons8.com/color/96/diamond.png',
  },
  {
    id: '5',
    title: 'Vatras Murti',
    img: 'https://img.icons8.com/color/96/statue.png',
  },
  {
    id: '6',
    title: 'Zodiac Collection',
    img: 'https://img.icons8.com/color/96/zodiac.png',
  },
  {
    id: '7',
    title: 'Divine Frames',
    img: 'https://img.icons8.com/color/96/picture.png',
  },
  {
    id: '8',
    title: 'Karungali Wear',
    img: 'https://img.icons8.com/color/96/t-shirt.png',
  },
  {
    id: '9',
    title: 'Evil Eye',
    img: 'https://img.icons8.com/color/96/evil-eye.png',
  },
];

// ================= Products =================
const productData = [
  {
    id: '1',
    title: 'VIP E-Pooja',
    sub: 'STARTS AT INR 1100',
    img: require('../assets/rudra.png'),
  }, // ✅ local
  { id: '9', title: 'Bracelets', img: require('../assets/goddess-durga.png') },
  {
    id: '2',
    title: 'Navratri Special',
    sub: 'BLESSINGS FOR YOU',
    img: 'https://img.icons8.com/color/96/goddess-durga.png',
  },
  {
    id: '3',
    title: 'Spell',
    sub: 'STARTS AT INR 1100',
    img: 'https://img.icons8.com/color/96/magic-book.png',
  },
  {
    id: '4',
    title: 'Gemstone',
    sub: 'EMI AVAILABLE !!!',
    img: 'https://img.icons8.com/color/96/diamond.png',
  },
  {
    id: '5',
    title: 'VIP E-Pooja',
    sub: 'STARTS AT INR 1100',
    img: 'https://img.icons8.com/color/96/fire-element.png',
  },
  {
    id: '6',
    title: 'Navratri Special',
    sub: 'BLESSINGS FOR YOU',
    img: 'https://img.icons8.com/ios-filled/100/necklace.png',
  },
  {
    id: '7',
    title: 'Spell',
    sub: 'STARTS AT INR 1100',
    img: 'https://img.icons8.com/color/96/magic-book.png',
  },
  {
    id: '8',
    title: 'Gemstone',
    sub: 'EMI AVAILABLE !!!',
    img: 'https://img.icons8.com/color/96/diamond.png',
  },
];

// ================= Screen =================
const AstroRemedyScreen = ({ navigation }) => {
  return (
   
    <FlatList
      data={productData}
      keyExtractor={item => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ padding: 10 }}
      ListHeaderComponent={
        <>
          <View style={styles.headerRight}>
            <Text>Astrologers</Text>
            {/* Orders Button */}
            <TouchableOpacity style={styles.headerBtn}>
              <Image
                source={require('../assets/order.png')}
                style={styles.icon}
              />
              <Text style={styles.orders}>Orders</Text>
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity style={styles.headerIconOnly}>
              <Image
                source={require('../assets/search.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          {/* Banner Carousel */}
          <Carousel
            loop
            width={width}
            height={180}
            autoPlay
            data={bannerData}
            scrollAnimationDuration={1500}
            renderItem={({ item }) => (
              <View style={styles.bannerCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.bannerImage}
                />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerText}>{item.text}</Text>
                  <TouchableOpacity style={styles.bannerBtn}>
                    <Text style={styles.bannerBtnText}>Check Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* Store Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Astrotalk Store</Text>
            <TouchableOpacity>
              <Text style={styles.visitStore}>Visit Store</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={CategoriesData}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryBox}>
                <Image
                  source={
                    typeof item.img === 'string' ? { uri: item.img } : item.img
                  }
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation?.navigate('ProductDetails', { item })}
        >
          <Image
            source={typeof item.img === 'string' ? { uri: item.img } : item.img}
            style={styles.cardImage}
          />
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>{item.sub}</Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default AstroRemedyScreen;

// ================= Styles =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgb(245, 245, 245)' },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
    backgroundColor: '#fff',
  },

  headerIconOnly: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    padding: 8,
    marginLeft: 10,
    backgroundColor: '#fff',
  },

  orders: {
    fontSize: 14,
    color: '#444',
    marginLeft: 6,
    fontWeight: '500',
  },

  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  // Banner
  bannerCard: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 10,
  },
  bannerImage: { width: '100%', height: 180 },
  bannerOverlay: { position: 'absolute', top: 20, left: 15 },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bannerBtnText: { fontWeight: 'bold' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15,
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  visitStore: { fontSize: 14, color: '#FF9800' },
  categoryBox: { alignItems: 'center', marginRight: 20 },
  categoryImage: { width: 60, height: 60, marginBottom: 6 },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    width: 80,
  },
  card: {
    width: '48%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    position: 'relative',
  },
  cardImage: { width: '100%', height: '100%', position: 'absolute' },
  ribbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(220,0,0,0.8)',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  ribbonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardBottom: { position: 'absolute', bottom: 10, left: 10 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
});
