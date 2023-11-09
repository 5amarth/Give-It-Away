import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import AddItems from './Screens/AddItems';
import Items from './Screens/Items';
import SuccessScreen from './Screens/SuccessScreen';
import ErrorScreen from './Screens/ErrorScreen';
import ItemDetailScreen from './Screens/ItemDetailScreen';
import MyItemsScreen from './Screens/MyItemsScreen'; 
import UpdateItemDetails from './Screens/UpdateItemScreen';
import SuccessUpdateScreen from './Screens/SuccessUpdateScreen';
import ErrorUpdateScreen from './Screens/ErrorUpdateScreen';
import Cookies from 'js-cookie';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('user_id'));

  const onLogin = () => {
    setIsLoggedIn(true);
  };

  const onLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }} initialParams={{ onLogout }} />
          <Stack.Screen name="AddItems" component={AddItems} options={{ headerShown: false }} />
          <Stack.Screen name="Items" component={Items} options={{ headerShown: false }} />
          <Stack.Screen name="Success" component={SuccessScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Error" component={ErrorScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MyItemsScreen" component={MyItemsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UpdateItemScreen" component={UpdateItemDetails} options = {{headerShown: false }} />
          <Stack.Screen name="SuccessUpdateScreen" component={SuccessUpdateScreen} options = {{headerShown: false }} />
          <Stack.Screen name="ErrorUpdateScreen" component={ErrorUpdateScreen} options = {{headerShown: false }} />

        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} initialParams={{ onLogin }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} initialParams={{ onLogin }}/>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;





