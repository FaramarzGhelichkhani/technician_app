import React, { useState, useEffect } from 'react';
import LoginScreen from './components/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyStack from './components/Tabs';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';




// import OrderForm from './components/Order_detail';
// import ProductForm from './components/Dynamic_data';

// import { View, Text } from 'react-native'
// import React from 'react';

// const App = () => {
//   return (
//     <OrderForm id={5}/> 
//   )
// }


 const App =  () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // storeLoginState(false);
  
  

    useEffect(() => {
      const checkLoginStatus = async () => {
          const value = await AsyncStorage.getItem('LoginState');
          if (value !== null) {
            setIsLoggedIn(JSON.parse(value));
          }
     
      };
      checkLoginStatus();
    },[])


  if (isLoggedIn) {
    return <MyStack     setIsLoggedIn={setIsLoggedIn}/>
  } else {
    return <LoginScreen setIsLoggedIn={setIsLoggedIn} />;
  }
};

export default App;
