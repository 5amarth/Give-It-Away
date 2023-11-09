import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Picker, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const UpdateItemDetails = ({ route }) => {
  const { item } = route.params;
  const [visibleToOthers, setVisibleToOthers] = useState(item.visibility);
  const [name, setName] = useState(item.name);
  const [details, setDetails] = useState(item.details);
  const [contact, setContact] = useState(item.contact);
  const [condition, setCondition] = useState(item.condition_);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [status, setStatus] = useState(item.status);
  const [imageData, setImageData] = useState(`data:image/jpeg;base64,${item.image_data}`);
  const navigation = useNavigation();
  const [item_id, setItem_id] = useState(item.Item_id);
  const [imageChanged, setImageChanged] = useState(false);


  const handleImageChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const imageResult = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
     });

    if (imageResult.canceled) {
      return;
    }

    setImageData(imageResult.uri);
    setImageChanged(true); 
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('visibility', visibleToOthers);
    formData.append('name', name);
    formData.append('details', details);
    formData.append('contact', contact);
    formData.append('condition', condition);
    formData.append('quantity', quantity);
    formData.append('status', status);
    formData.append('item_id', item_id);

    if (imageChanged) {
      const response = await fetch(imageData);
      const blob = await response.blob();
    
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
        formData.append('image', base64);
      };
    
      // Wrap the FileReader in a Promise that resolves when the reader.onload event is fired
      await new Promise(resolve => {
        reader.onload = () => {
          const base64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
          formData.append('image', base64);
          resolve();
        };
        reader.readAsDataURL(blob);
      });
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/myitems/update?item_id=${item_id}`, {
        method: 'PUT',
        body: formData,
      });
    
      if (!response.ok) {
        console.error('Failed to update item');
        navigation.navigate('ErrorUpdateScreen');
        return;
      }
    
      navigation.navigate('SuccessUpdateScreen');
    } catch (error) {
      console.error(error);
      navigation.navigate('ErrorUpdateScreen');
    }
  };



return (
  <View style={styles.container}>
    <Image source={{ uri: imageData }} style={styles.image} resizeMode="contain" />
    <View style={styles.button}>
      <Button title="Change Image" onPress={handleImageChange} />
    </View>
    <View style={styles.infoContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Details:</Text>
        <TextInput style={styles.input} value={details} onChangeText={setDetails} multiline={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Contact:</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Condition:</Text>
        <Picker
          selectedValue={condition}
          onValueChange={(value) => setCondition(value)}
          style={styles.picker}
        >
          <Picker.Item label="New" value="New" />
          <Picker.Item label="Old" value="Old" />
          <Picker.Item label="Lightly Damaged" value="Lightly Damaged" />
          <Picker.Item label="Heavily Damaged" value="Heavily Damaged" />
        </Picker>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Quantity:</Text>
        <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Picker
          selectedValue={status}
          onValueChange={(value) => setStatus(value)}
          style={styles.picker}
        >
          <Picker.Item label="Available" value="Available" />
          <Picker.Item label="Claimed" value="Claimed" />
          <Picker.Item label="Unavailable" value="Unavailable" />
        </Picker>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Visible to Others:</Text>
        <Picker
          selectedValue={visibleToOthers}
          onValueChange={(value) => setVisibleToOthers(value)}
          style={styles.picker}
        >
          <Picker.Item label="Yes" value={true} />
          <Picker.Item label="No" value={false} />
        </Picker>
      </View>
    </View>
    <View style={styles.button}>
      <Button title="Update" onPress={handleSubmit} />
    </View>
  </View>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '80%',
    height: 200,
    borderRadius: 10,
  },
  button: {
    marginLeft: 10,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 150,
  },  
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 2,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  picker: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  pickerItem: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});



export default UpdateItemDetails;