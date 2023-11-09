import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Cookies from 'js-cookie';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const MyItemsScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const userId = Cookies.get('user_id');
    const response = await fetch(`http://127.0.0.1:5000/myitems?user_id=${userId}`);
    const data = await response.json();
    setItems(data.items);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return styles.itemStatusAvailable;
      case 'Claimed':
        return styles.itemStatusClaimed;
      case 'Unavailable':
        return styles.itemStatusUnavailable;
      default:
        return null;
    }
  };

  const deleteItem = async (item) => {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      const response = await fetch('http://127.0.0.1:5000/myitems/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: item.Item_id }),
      });
      const result = await response.json();
      if (result.result) {
        alert("Item deleted successfully.");
        const updatedItems = items.filter((i) => i.Item_id !== item.Item_id);
        setItems(updatedItems);
      }
    }
  };

  const updateItem = (item) => {
    navigation.navigate('UpdateItemScreen', { item });
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <View style={[styles.itemContainer, statusColor]}>
        <TouchableOpacity onPress={() => deleteItem(item)} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateItem(item)} style={styles.updateButton}>
          <MaterialIcons name="update" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.itemImage}>
          {item.image_data && (
            <Image source={{ uri: `data:image/jpeg;base64,${item.image_data}` }} style={styles.image} />
          )}
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>Name: {item.name}</Text>
          <Text style={styles.itemInfo}>Details: {item.details}</Text>
          <Text style={styles.itemInfo}>Contact: {item.contact}</Text>
          <Text style={styles.itemInfo}>Condition: {item.condition_}</Text>
          <Text style={styles.itemInfo}>Quantity: {item.quantity}</Text>
          <Text style={styles.itemInfo}>Status: {item.status}</Text>
          <Text style={styles.itemInfo}>Visible to Others: {item.visibility === 'true' ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={30} color="#000" />
      </TouchableOpacity>
      {items.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.Item_id}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
      ) : (
        <Text style={styles.noItemsText}>No Items Found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  itemInfo: {
    fontSize: 16,
    marginVertical: 2,
    color: '#000',
  },
  itemVisibility: {
    fontSize: 16,
    marginTop: 2,
    color: '#555',
  },
  itemStatusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  itemStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemStatusAvailable: {
    backgroundColor: '#3CB371',
  },
  itemStatusClaimed: {
    backgroundColor: '#FFA500',
  },
  itemStatusUnavailable: {
    backgroundColor: '#DC143C',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  updateButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 1,
  },
  updateIcon: {
    width: 30,
    height: 30,
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
  },
  noItemsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#222529',
  },
});



export default MyItemsScreen;