import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Cookies from 'js-cookie';
import Icon from 'react-native-vector-icons/AntDesign';

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const userIdFromCookies = Cookies.get('user_id');
    setUserId(userIdFromCookies);
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/items?keyword=${searchTerm}&user_id=${userId}`);
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => {
    let imageSource = null;
  
    if (item.image_data) {
      imageSource = { uri: `data:image/jpeg;base64,${item.image_data}` };
    }
  
    let backgroundColor = '#fff';
    if (item.status === 'Available') {
      backgroundColor = '#3CB371';
    } else if (item.status === 'Claimed') {
      backgroundColor = '#FFA500';
    } else if (item.status === 'Unavailable') {
      backgroundColor = '#DC143C';
    }
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ItemDetailScreen', { item })}>
        <View style={[styles.itemContainer, { backgroundColor }]}>
          {imageSource && <Image source={imageSource} style={styles.itemImage} />}
          <View style={styles.itemDetailsContainer}>
            <Text style={[styles.itemDetailsLabel, styles.itemName]}>{item.name}</Text>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemDetailsLabel, styles.itemDetailsBold]}>Quantity:</Text>
              <Text style={styles.itemDetails}>{item.quantity}</Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemDetailsLabel, styles.itemDetailsBold]}>Condition:</Text>
              <Text style={styles.itemDetails}>{item.condition_}</Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemDetailsLabel, styles.itemDetailsBold]}>Contact:</Text>
              <Text style={styles.itemDetails}>{item.contact}</Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemDetailsLabel, styles.itemDetailsBold]}>Status:</Text>
              <Text style={[styles.itemDetails, styles.itemStatus]}>{item.status}</Text>
            </View>
            <View style={styles.itemDetailsRow}>
              <Text style={[styles.itemDetailsLabel, styles.itemDetailsBold]}>Posted By:</Text>
              <Text style={styles.itemDetails}>{item.username}</Text>
            </View>
            <Text style={[styles.itemDetailsLabel, styles.itemDescription]}>Details: </Text>
            <Text style={styles.itemDetails}>{item.details}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrowleft" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for items"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.item_id}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No items found</Text>
        </View>
      )}
    </View>
  );
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    padding: 8,
  },
  itemImage: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  itemDetailsContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  itemDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemDetailsLabel: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  itemQuantity: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemCondition: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemContact: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  itemUsername: {
    fontSize: 14,
    marginBottom: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
  },
  
});





export default SearchScreen;

