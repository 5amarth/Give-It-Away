import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Cookies from 'js-cookie';

const RegisterScreen = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contact, setContact] = useState('');

  const { onLogin } = route.params;

  const handleRegister = async () => {
    try {
      const isContactValid = /^\d+$/.test(contact); // Check if contact is only made up of integers
      const isContactLengthValid = contact.length === 10; // Check if contact has a length of 10

      if (!isContactValid) {
        setErrorMessage('Contact should only be integers');
        return;
      }

      if (!isContactLengthValid) {
        setErrorMessage('Contact should be exactly 10 characters long');
        return;
      }

      const isUsernameValid = username.length >= 3 && username.length <= 12; // Check if username length is between 3 and 12 characters
      const isPasswordValid = password.length >= 3 && password.length <= 12; // Check if password length is between 3 and 12 characters

      if (!isUsernameValid) {
        setErrorMessage('Username should be between 3 and 12 characters');
        return;
      }

      if (!isPasswordValid) {
        setErrorMessage('Password should be between 3 and 12 characters');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, contact })
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 201) {
        // Set user id in cookie
        Cookies.set('user_id', data.user_id);
        Cookies.set('username', data.username);
        onLogin();
        navigation.navigate('Home');
      } else {
        setErrorMessage('Error registering user');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error registering user');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact"
        value={contact}
        onChangeText={setContact}
        keyboardType='numeric'
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EE4B2B',
    marginBottom: 40
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  link: {
    color: '#007AFF',
    marginTop: 20
  },
  errorMessage: {
    color: '#ff0000',
    marginBottom: 10
  }
});

export default RegisterScreen;

