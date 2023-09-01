import React, { useState, useEffect } from 'react';
import { Alert,View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, SafeAreaView, Image } from 'react-native';
import { getLoginData, storeLoginData, storeLoginState } from './Async';
import { validate_credentials } from './API';

const LoginScreen =  ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
      const getLogindata = async () => {
        const data = await getLoginData();
        if (data !== null) {
          setUsername(data.username);
        }
      };
  
      getLogindata();
    }, []);

    const validateLogin = (phoneNumber, password) => {
        const phoneRegex = /^\d{11}$/; 
        if (!phoneRegex.test(phoneNumber)) {
          return { success: false, message: 'Please enter a valid phone number' };
        }
        

        // Validate password
        if (password.length < 3) {
          return { success: false, message: 'Password must be at least 6 characters long' };
        }
      
        // Login successful
        return { success: true };
      }
      
      const handleLogin = async() => {
        try {
          // Validate login data
          const validation = validateLogin(username, password);
          if (!validation.success) {
            throw new Error(validation.message);
          }
      
          // Attempt to log in
          const phone = '+98' + username.substring(1);
          const serverResponse = await validate_credentials(phone, password);
          if (!serverResponse.success) {
            throw new Error(serverResponse.message);
          }
      
          // Log in successful
          storeLoginState(true);
          storeLoginData({ 'username': username, 'password':password ,'token' : serverResponse.token });
          setIsLoggedIn(true);
      
        } catch (error) {
          // Log in failed
          console.error(error);
          Alert.alert('Error', error.message);
        }
      };
      
  

    return (
      <SafeAreaView style={{flex:1, padding:'7%', backgroundColor:"#003b63"}}>

        <View style={styles.container}>
          <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/Login_Logo.png')} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="شماره تلفن"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="رمز"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>ورود</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>

      );
    };
    
    
    const { width, height } = Dimensions.get('window');
    const isAndroid = Platform.OS === 'android';
    const isSmallScreen = width < 375 || height < 667;
    
    const styles = StyleSheet.create({
      container: {
        marginTop:'10%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: isSmallScreen ? 20 : 40,
        backgroundColor: '#ffffff',
      },
      logo: {
        width: isSmallScreen ? 150 : 200,
        height: isSmallScreen ? 150 : 200,
        resizeMode: 'contain',
      },
      input: {
        width: '100%',
        marginBottom: isSmallScreen ? 10 : 20,
        fontSize: isSmallScreen ? 14 : 18,
        paddingLeft: isSmallScreen ? 10 : 20,
        borderRadius: isSmallScreen ? 5 : 10,
        borderWidth: isAndroid ? 0.5 : 1,
        borderColor: isAndroid ? '#d6d7da' : '#ffffff',
        backgroundColor: isAndroid ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
      },
      button: {
        width: '100%',
        height: isSmallScreen ? 40 : 50,
        marginTop: isSmallScreen ? 10 : 20,
        borderRadius: isSmallScreen ? 5 : 10,
        backgroundColor: '#003b63',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        fontSize: isSmallScreen ? 14 : 18,
        fontWeight: 'bold',
        color: '#ffffff',
      },
      link: {
        marginTop: isSmallScreen ? 10 : 20,
        fontSize: isSmallScreen ? 12 : 16,
        color: '#007bff',
      },
      errorText: {
        fontSize: isSmallScreen ? 12 : 16,
        color: 'red',
      },

  imageContainer: {
    width: '100%',
    height: '6%',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    marginLeft:15,
    marginBottom:'10%'
  },
  image: {
    width: '100%',
    height: '100%'
  },
    });
    
    
    
    export default LoginScreen;