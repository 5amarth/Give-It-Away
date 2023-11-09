import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Picker } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Cookies from 'js-cookie';
import Icon from 'react-native-vector-icons/Feather';

const AddItem = () => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [quantity, setQuantity] = useState('');
  const [condition_, setCondition_] = useState('');
  const [image, setImage] = useState(null);
  const [visibility, setVisibility] = useState(true);
  const navigation = useNavigation();
  const [user_id, setUser_id] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userId = Cookies.get('user_id');
    if (userId) {
      setUser_id(userId);
    }
  }, []);

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleGoBack = () => {
    navigation.navigate('Home');
  };

  const handleSubmit = async () => {
    if (!name || !details || !quantity || !condition_ || !image || !user_id) {
      setErrorMessage('Please fill out all fields and select an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.substr(0, 35));
      formData.append('details', details.substr(0, 150));
      formData.append('quantity', parseInt(quantity));
      formData.append('condition_', condition_);
      formData.append('visibility', visibility);
      formData.append('user_id', user_id);

      const response = await fetch(image);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
        formData.append('image', base64);
        fetch('http://127.0.0.1:5000/additem', {
          method: 'POST',
          body: formData,
        }).then(response => {
          if (response.status === 201) {
            response.json().then(data => {
              if (data.message === 'Item added successfully') {
                navigation.navigate('Success');
              } else {
                navigation.navigate('Error', {
                  message: 'Failed to add item',
                });
              }
            });
          } else {
            navigation.navigate('Error', {
              message: 'Failed to add item',
            });
          }
        }).catch(error => {
          console.error(error);
          navigation.navigate('Error', {
            message: 'Failed to add item',
          });
        });
      };
      reader.readAsDataURL(blob);

    } catch (err) {
      console.error(err);
      navigation.navigate('Error', {
        message: 'Failed to add item',
      });
    }
  };

 

  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
        <Icon name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>Add Item</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => {
          if (text.length <= 35) {
            setName(text);
          }
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Details"
        value={details}
        onChangeText={text => {
          if (text.length <= 150) {
            setDetails(text);
          }
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={text => {
          if (text === '' || /^[0-9]+$/.test(text)) {
            setQuantity(text);
          }
        }}
        keyboardType="numeric"
      />
      <Picker
        style={styles.input}
        selectedValue={condition_}
        onValueChange={text => setCondition_(text)}>
        <Picker.Item label="Old" value="Old" />
        <Picker.Item label="New" value="New" />
        <Picker.Item label="Lightly Damaged" value="Lightly Damaged" />
        <Picker.Item label="Heavily Damaged" value="Heavily Damaged" />
      </Picker>
  
      <TouchableOpacity
        style={styles.photoButton}
        onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.photoPreview} />}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setVisibility(!visibility)}>
          {visibility ? <View style={styles.checkedBox} /> : null}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>Visible to others</Text>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
  photoButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  photoPreview: {
    height: 200,
    width: 200,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: '#2196F3',
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#ff0000',
    marginBottom: 10
  },
  goBackButton: {
    position: 'absolute',
    left: 20,
    top: 40,
  },  
});
  
    
  



export default AddItem;