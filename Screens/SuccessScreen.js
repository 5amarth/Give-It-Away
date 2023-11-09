import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Item Added Successfully!</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddItems')}>
            <Ionicons name="add-circle-outline" size={28} color="#fff" />
            <Text style={styles.buttonText}>Add Another Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home-outline" size={28} color="#fff" />
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
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
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0275d8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});

export default SuccessScreen;
