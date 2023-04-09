import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Image, Text, StyleSheet } from 'react-native';

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://your-backend-api-url/items?keyword=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.image_path }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.details}</Text>
          <Text style={styles.itemContact}>{item.contact}</Text>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <Text style={styles.itemStatus}>{item.status}</Text>
          <Text style={styles.itemCondition}>{item.condition_}</Text>
          <Text style={styles.itemUsername}>{item.username}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for items"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.item_id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemContact: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemCondition: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemUsername: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default SearchScreen;
