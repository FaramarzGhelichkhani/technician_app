import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, SafeAreaView, StyleSheet , TouchableOpacity, Pressable, LogBox} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { removepassword, storeLoginState } from './Async';
import { Fetch_data } from './API';
import PN from "persian-number";


LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);


const ProfileScreen = ({navigation, route}) => {
    const [totall_order_number, settotallorder] = useState(0);
    const [done_order_number, setdoneorder] = useState(0)   ;
    const [total_recip, setrecip] = useState('');
    const [total_credit, setcredit] = useState('');
    const [grade, setgrade] = useState(4);
    const [full_name, setname] = useState('');
    const [phone, setphone] = useState('');
    const {setIsLoggedIn, refreshData} = route.params;


    // Function to retrieve data from AsyncStorage
  const retrieveData = async () => {
    try {
      const totallOrderNumber = await AsyncStorage.getItem('totall_order_number');
      const doneOrderNumber = await AsyncStorage.getItem('done_order_number');
      const totalRecip = await AsyncStorage.getItem('total_recip');
      const totalCredit = await AsyncStorage.getItem('total_credit');
      const gradeValue = await AsyncStorage.getItem('grade');
      const fullName = await AsyncStorage.getItem('full_name');
      const phoneNumber = await AsyncStorage.getItem('phone');

      if (totallOrderNumber !== null) {
        settotallorder(parseInt(totallOrderNumber));
      }
      if (doneOrderNumber !== null) {
        setdoneorder(parseInt(doneOrderNumber));
      }
      if (totalRecip !== null) {
        setrecip(totalRecip);
      }
      if (totalCredit !== null) {
        setcredit(totalCredit);
      }
      if (gradeValue !== null) {
        setgrade(parseInt(gradeValue));
      }
      if (fullName !== null) {
        setname(fullName);
      }
      if (phoneNumber !== null) {
        setphone(phoneNumber);
      }
    } catch (error) {
      console.log('Error retrieving data:', error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);
    
    useEffect(()=>{
      const handlegetdata = async ()=>{
      const data = await Fetch_data('ORDERS_STATS');
      const userdata = await Fetch_data('USER_INFO');

      if(data.success=== true){
      settotallorder(data.data.total_number_of_order);
      setdoneorder(data.data.number_of_done_order) ;
      setcredit(data.data.total_credit);
      setgrade(data.data.avg_grade);
      setrecip(data.data.total_recip);
      }
      if(userdata.success=== true){
        setname(userdata.data.full_name);
        setphone(userdata.data.phone) 
        }
    }
    handlegetdata(); 

    const storeData = async () => {
      try {
        await AsyncStorage.setItem('totall_order_number', totall_order_number.toString());
        await AsyncStorage.setItem('done_order_number', done_order_number.toString());
        await AsyncStorage.setItem('total_recip', total_recip.toString());
        await AsyncStorage.setItem('total_credit', total_credit.toString());
        await AsyncStorage.setItem('grade', grade.toString());
        await AsyncStorage.setItem('full_name', full_name.toString());
        await AsyncStorage.setItem('phone', phone.toString());
      } catch (error) {
        console.log('Error storing data:', error);
      }
    };

    storeData();
    }, [refreshData])

    const handleLogout = () => {
    setIsLoggedIn(false);
    removepassword();
    storeLoginState(false);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row-reverse', marginTop: 100}}>
          <Avatar.Image 
            source={
              require('../assets/avatar.png')
            }
            size={80}
          />
          <View style={{marginLeft: 20, flex:1,flexDirection:"column"}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>{full_name}</Title>
            <Caption style={styles.caption}>{PN.convertEnToPe(phone)}</Caption>
            { !isNaN(total_credit) && (
              <View style={{marginTop:10, flexDirection:"row",alignItems:"flex-end"}}>
                <Text> اعتبار:</Text>
                <Text style={{color: total_credit >= 0 ? 'green':'red',fontSize:16 }} > {PN.convertEnToPe(PN.sliceNumber(total_credit))} </Text>
                <Text style={{color:"grey",fontSize:10}}> تومان</Text>
            </View>
            )
              }
          </View>
        </View>
      </View>



      <View style={styles.infoBoxWrapper}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title>{PN.convertEnToPe(PN.sliceNumber(totall_order_number))}</Title>
            <Caption>تعداد سفارش های ارجاع شده</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title>{PN.convertEnToPe(PN.sliceNumber(done_order_number))}</Title>
            <Caption>تعداد سفارش های موفق</Caption>
          </View>
      </View>
      <View style={{...styles.infoBoxWrapper,marginTop:0}}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title>{PN.convertEnToPe(PN.sliceNumber(total_recip))}</Title>
            <Caption style={{fontSize:10}}> تومان</Caption>
            <Caption>جمع دریافتی از مشتری ها (اجرت وخرجکرد)</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title>{PN.convertEnToPe(grade)}</Title>
            <Caption>امتیاز عملکرد</Caption>
          </View>
      </View>

  <View style={styles.menuWrapper}>
          <View style={styles.menuItem}>
            {/* <Icon name="credit-card" color="#FF6347" size={25}/> */}
            <TouchableOpacity style={styles.buttonItems} onPress={handleLogout}>
            {/* <Icon name="chart-bar" color="#FF6347" size={25}/> */}
              <Text style={styles.menuItemText}>خروج</Text>
          </TouchableOpacity> 
          </View>
          {/*<Pressable style={styles.buttonItems} onPress={() => navigation.navigate('Report') }>
              <Icon name="chart-bar" color="#FF6347" size={25}/> 
              <Text style={styles.menuItemText}>گزارش</Text>
          </Pressable>           
          <TouchableOpacity style={styles.buttonItems} onPress={handleLogout}>
            <Icon name="chart-bar" color="#FF6347" size={25}/>
              <Text style={styles.menuItemText}>خروج</Text>
          </TouchableOpacity> */}
  </View>  


    </SafeAreaView>
  );
};


export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"column"
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // flexDirection:"row-reverse"
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    marginTop: 50,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 50,
    // flexDirection:"",
    // flex:1
  },
  menuItem: {
    flexDirection: 'row',
    flwx:1,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    flex:1,
    // textAlign: 'right',
    marginRight: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 36,
    fontWeight: 'bold',
  },
   buttonItems:{
    flexDirection: 'row-reverse',
    color: '#777777', 
    flex:1,
    textAlign: 'right',
    marginRight: 5,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: 'bold',
    }
});