import React, { useState } from 'react';
import {View,Text,TextInput,Button,Switch,StyleSheet,Picker,Image,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AddItems = () => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [quantity, setQuantity] = useState('');
  const [contact, setContact] = useState('');
  const [condition, setCondition] = useState('New');
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = 'http://127.0.0.1:5000/additem';

  const handleAddItem = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('details', details);
      formData.append('contact', contact);
      formData.append('quantity', quantity);
      formData.append('condition_', condition);
      formData.append('image', image);
      formData.append('visibility', visibility);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const responseJson = await response.json();
      console.log(responseJson);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleImageSelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log(result)
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Item Details"
        onChangeText={(text) => setDetails(text)}
      />
       <TextInput
        style={styles.input}
        placeholder="Contact Information"
        onChangeText={(text) => setContact(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Item Quantity"
        keyboardType="numeric"
        onChangeText={(text) => setQuantity(text)}
      />
      <Picker
        selectedValue={condition}
        onValueChange={(value) => setCondition(value)}
      >
        <Picker.Item label="New" value="New" />
        <Picker.Item label="Like New" value="Like New" />
        <Picker.Item label="Good" value="Good" />
        <Picker.Item label="Fair" value="Fair" />
        <Picker.Item label="Poor" value="Poor" />
      </Picker>
      <Button title="Select Image" onPress={handleImageSelect} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Switch
        style={styles.switch}
        value={visibility}
        onValueChange={(value) => setVisibility(value)}
      />
      <Text>Visible to Others?</Text>
      <Button
        title="Add Item"
        onPress={handleAddItem}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  switch: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default AddItems