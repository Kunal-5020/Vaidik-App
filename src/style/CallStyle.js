import { StyleSheet } from 'react-native';

const ChatStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgb(245, 245, 245)', paddingTop: -1 },

  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    top: 5,
  },
  chatIconButton: { padding: 5 },
  chatIcon: { width: 22, height: 24, resizeMode: 'contain', right: 15 },
  searchIcon: { left: 20 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'grey',
    marginLeft: 13,
  },
  lineOfheader: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    bottom: 1,
  },
  connectCard: {
    alignItems: 'center',
    marginRight: 15,
    marginLeft: 15,
    marginTop: 8,
  },
  connectImg: { width: 60, height: 60, borderRadius: 30, marginBottom: 5 },
  connectName: { fontSize: 13, fontWeight: '500' },
  connectPrice: { fontSize: 12, color: '#555' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    left: 60,
    borderWidth: 1,
  },
  addText: { color: '#0d1a3c', fontWeight: 'bold', marginLeft: 5 },
  tabRow: { marginBottom: 15, flexGrow: 0, marginTop: 10 },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#fff',
    left: 6,
  },
  activeTabButton: {
    backgroundColor: '#000333',
    borderColor: '#ffd700',
  },
  tabText: { fontSize: 14, color: '#555' },
  activeTabText: { fontWeight: 'bold', color: 'white' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    width: '95%',
    left: 12,
  },
  line: {
    marginTop: -3,
    height: 1,
    width: '65%',
    backgroundColor: 'grey',
    left: 10,
  },
  line2: {
    // marginTop: -3,
    // height: 2,                // make height > 1 so borderRadius works
    // width: '95%',
    // backgroundColor: '#000011',
    // borderRadius: 50,         // large value = pill/curve shape
    // alignSelf: 'center',
    // marginBottom: 10,
  },
  tickIcon: {
    width: 18,
    height: 18,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  avatar: { width: 60, height: 60, borderRadius: 30 },
  name: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 13, color: '#555' },
  orders: { fontSize: 12, color: '#777' },
  oldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  price: { fontSize: 14, fontWeight: '600', color: '#222' },
  chatBtn: {
    backgroundColor: '#fff',
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  chatText: { color: 'green', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: '#d33',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default ChatStyle;