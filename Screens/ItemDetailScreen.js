import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;

  let imageSource = null;

  if (item.image_data) {
    // Item has base64 encoded image data
    imageSource = { uri: `data:image/jpeg;base64,${item.image_data}` };
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.content}>
        {imageSource && <Image source={imageSource} style={styles.itemImage} />}
        <View style={styles.itemDetailsContainer}>
          <View style={styles.itemDetailsRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.itemInfo}>{item.name}</Text>
          </View>
          <View style={styles.itemDetailsRow}>
            <Text style={styles.detailLabel}>Quantity:</Text>
            <Text style={styles.itemInfo}>{item.quantity}</Text>
          </View>
          <View style={styles.itemDetailsRow}>
            <Text style={styles.detailLabel}>Condition:</Text>
            <Text style={styles.itemInfo}>{item.condition_}</Text>
          </View>
          <View style={styles.itemDetailsRow}>
            <Text style={styles.detailLabel}>Details:</Text>
            <Text style={styles.itemInfo}>{item.details}</Text>
          </View>
          <View style={styles.contactContainer}>
            <FontAwesome name="phone" size={20} style={styles.contactIcon} />
            <Text style={styles.contactText}>{item.contact}</Text>
          </View>
          <View style={styles.itemDetailsRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.itemInfo}>{item.status}</Text>
          </View>
          <View style={styles.itemDetailsBorder}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: '#3076F1',
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
  itemImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  itemDetailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F2F2F2'
  },
  itemDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 10,
    width: 100,
  },
  itemInfo: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  itemInfoIcon: {
    fontSize: 20,
    color: '#444',
    marginRight: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  contactIcon: {
    fontSize: 20,
    color: '#444',
    marginRight: 10,
  },
  contactIconFallback: {
    fontSize: 20,
    color: '#444',
    marginRight: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
    padding: 5,
    textAlign: 'center',
    width: 20,
    height: 20
  },
  contactText: {
    fontSize: 16,
    color: '#444',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemCondition: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
});



export default ItemDetailScreen;