import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ErrorUpdateScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="close-circle-outline" size={80} color="#FF4136" />
        <Text style={styles.text}>Error occurred in updating the item!</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => navigation.navigate('MyItemsScreen')}>
          <AntDesign name="arrowleft" size={30} color="#fff" />
          <Text style={styles.buttonText}>Try Again?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={35} color="#fff" />
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  text: {
    color: '#fff',
    fontSize: 28,
    marginTop: 20,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 15,
    height: 80,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  addButton: {
    backgroundColor: '#0074D9',
  },
  homeButton: {
    backgroundColor: '#B10DC9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
  },
});

export default ErrorUpdateScreen;
