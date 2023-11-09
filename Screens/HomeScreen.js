import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Cookies from 'js-cookie';

const HomeScreen = ({ navigation, route}) => {

  const { onLogout } = route.params;

  // Get the username from the cookies
  const username = Cookies.get('username');

  const handleLogout = () => {
    Cookies.remove('user_id');
    Cookies.remove('username')
    onLogout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Give It Away</Text>
      </View>
      <Text style={styles.welcomeText}>Welcome {username}</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#2E7D32' }]} onPress={() => navigation.navigate('AddItems')}>
        <MaterialCommunityIcons name="plus-circle" size={30} color="#fff" />
        <Text style={styles.buttonText}>Add Items</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#1B5E20' }]} onPress={() => navigation.navigate('MyItemsScreen')}>
        <MaterialCommunityIcons name="format-list-bulleted" size={30} color="#fff" />
        <Text style={styles.buttonText}>My Items</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#008CBA' }]} onPress={() => navigation.navigate('Items')}>
        <MaterialCommunityIcons name="format-list-bulleted" size={30} color="#fff" />
        <Text style={styles.buttonText}>Others' Items</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#B71C1C' }]} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={30} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    backgroundColor: '#222',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});

export default HomeScreen;
