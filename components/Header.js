import * as React from 'react';
import { Text, View, StyleSheet, Image, Dimensions ,Pressable } from 'react-native';
import {FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const logoSize = Math.min(width * 0.2, 40);
const headerTextSize = Math.max(width * 0.04, 20);


 function Appheader() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image source={require('../assets/header_logo.png')} 
      style={[styles.logo, {width: logoSize, height: logoSize}]} />
    </View>
    <View style={styles.titleContainer}>
      <Text style={[styles.headerText, {fontSize: headerTextSize}]}>
      </Text>
    </View>
    <View style={styles.buttonContainer}>
      <Pressable style={styles.buttonItems} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.headerIcon}>
          <FontAwesome5 name="user" size={logoSize * 0.85} color='#003b63' />
        </Text>
      </Pressable>
    </View>
  </View>
  );
}


export default Appheader;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#003b63',
    padding: '3%',
    marginBottom: '1%',
    marginTop:'7%'
  },
  logoContainer: {
    position: 'absolute',
    top: '3%',
    right: '3%',
    left:'3%'
  },
  logo: {
    resizeMode: 'contain',
    borderRadius: 10
  },

  titleContainer: {
    // marginTop: '10%',
    marginLeft: 'auto',
    marginRight: 'auto', // updated style
  },
  headerText: {
    fontWeight: 'bold',
    marginRight: '2%',
  },
  buttonContainer: {
    position: 'absolute',
    top: '3%',
    left: '3%',
  },
  headerIcon: {
    fontWeight: 'bold',
    color: '#777777',
    backgroundColor:"#ffcc02",
    borderRadius:5,
    
  },
  buttonItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
