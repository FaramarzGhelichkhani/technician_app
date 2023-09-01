import  React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView,Image, Dimensions} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import {FontAwesome5 } from '@expo/vector-icons';
import Appheader from './Header';
import ProfileScreen from './Profile';
import TransactionList from './Transactions';
import Oreders_Screen from './Orders';
import OrderForm from './Order_detail';
import { I18nManager } from 'react-native';


I18nManager.forceRTL(true);
const Tab = createMaterialBottomTabNavigator();
const Top_Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator();


const { width } = Dimensions.get('window');
const logoSize = Math.min(width * 0.2, 40);



function TopTab() {
  const navigation = useNavigation();

  return(
    <SafeAreaView style={{flex:1, padding:'0%', backgroundColor:"#003b63"}}>    
    <Appheader/>   
      
    <Top_Tab.Navigator 
    initialRouteName="سفارش های در حال انجام"
    screenOptions={{
      tabBarStyle:{ 
        backgroundColor: '#ffcc02'
      },
      tabBarIndicatorStyle: {
        backgroundColor: '#003b63',
      },
      tabBarLabelStyle: {
        textAlign: 'left', // Align tab label text from right to left
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
      },
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: '#003b63',
      
    }}
    > 
        <Top_Tab.Screen name="سفارش های پیشنهادی" component={Oreders_Screen} initialParams={{ url:'ORDERS_URL_RECOMMENDATIONS', useItemOne: false }} listeners={({ navigation, route }) => ({tabPress: () => {navigation.navigate(route.name);}})} />
        <Top_Tab.Screen name="سفارش های در حال انجام" component={Oreders_Screen} initialParams={{ url:'ORDERS_URL_ONGOING', useItemOne:true }} listeners={({ navigation, route }) => ({tabPress: () => {navigation.navigate(route.name);}})}/>
        <Top_Tab.Screen name="orders" component={Oreders_Screen} initialParams={{ url:'ORDERS_URL', useItemOne:true }}
         options={{
          tabBarLabel: 'سفارش ها',
        }}
        listeners={{
          tabPress: () => navigation.navigate('orders')
        }}
        />
      </Top_Tab.Navigator>
    </SafeAreaView> 
  );
}

 
function Tabs({route}) {
  const {setIsLoggedIn, refreshData} = route.params;

  return(
      <Tab.Navigator         
        initialRouteName="خانه"
          inactiveColor="#ffcc02"
          activeColor="red"
          barStyle={{ backgroundColor: '#003b63',paddingBottom: 50 
                      ,borderRadius: 20,marginHorizontal:0
                      , height:80, paddingHorizontal: 50}}
          screenOptions={{tabBarStyle: { backgroundColor: '003b63'}, tabStyle: {
          flexDirection: 'row-reverse'} ,  tabBarGap: 10,headerShown: true,tabBarLabelStyle: {
            textAlign: 'right', // Align tab label text from right to left
            fontSize: 16,
            fontWeight: 'bold',
            padding: 10,
          }
          }}            
          >

        <Tab.Screen  name="خانه" component={TopTab}  options={{
        tabBarIcon: ({focused}) => (
          <View style={{position:'absolute', top:'20%'}} >
          <FontAwesome5 name="home" size={20} color= {focused ? 'red': '#ffcc02'}> </FontAwesome5>
          </View>
        )}}
        tabBarOptions={{
        showLabel: false}}
        />
        

        <Tab.Screen  name="تراکنش ها" component={TransactionList} 
        options={{
        tabBarIcon: ({focused}) => (
          <View style={{position:'absolute', top:'20%'}} >
          <FontAwesome5 name="money-check-alt" size={20} color= {focused ? 'red': '#ffcc02'}> </FontAwesome5>
          </View>
        )}}
        />
        

      </Tab.Navigator>
      
  );
}


function MyStack({setIsLoggedIn}){
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    // Call an API or do some action that should refresh the data
    // Set refreshData to true to force a re-render of the Orders_Screen
    setRefreshData(true);
  }, []);

  useEffect(() => {
    // When refreshData changes, reset it to false
    // This will ensure that the useEffect in the Orders_Screen is only triggered once
    setRefreshData(false);
  }, [refreshData]);


    return (
    <NavigationContainer style={{paddingBottom:0}}>
    <Stack.Navigator initialRouteName="امداد موتور" barStyle={{ backgroundColor: '#ffcc02'}} 
    screenOptions={{headerTitle: '', }}
      >
      <Stack.Screen name="امداد موتور" component={Tabs} initialParams={{ setIsLoggedIn: setIsLoggedIn, refreshData:refreshData }}   options={{
          tabBarLabel: 'امداد موتور',
        }}
        />
      <Stack.Screen name="Header" component={Appheader} />       
      <Stack.Screen name="Profile" component={ProfileScreen} initialParams={{ setIsLoggedIn: setIsLoggedIn, refreshData:refreshData }} />
      {/* <Stack.Screen name="Report" component={Recomendedorders} /> */}
      <Stack.Screen name="order" component={OrderForm}/>
    </Stack.Navigator>
  </NavigationContainer>
 
  );
}


export default MyStack;



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#003b63',
    padding: '3%',
    marginBottom: '3%',
  },
  logoContainer: {
    // marginRight: 'auto',
    position: 'absolute',
    top: '3%',
    // marginLeft:200,
    // right: '3%',
  },
  logo: {
    resizeMode: 'contain',
    borderRadius: 10
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  headerText: {
    fontWeight: 'bold',
    marginLeft: '2%',
  },
  headerIcon: {
    marginLeft: '2%',
    fontWeight: 'bold',
    color: '#777777',
  },
  buttonItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
