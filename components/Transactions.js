import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused } from '@react-navigation/native';
import Appheader from './Header';
import { Fetch_data } from './API';
import 'intl';
import 'intl/locale-data/jsonp/en'; 
import PN from "persian-number";

const styles = StyleSheet.create({
  container: {
    marginTop: '10 %',
    flex: 1,
    padding: '2%',
    backgroundColor: '#FFF',
  },
  itemContainer: {
  margin:10,
  padding:16,
  marginTop: 10,
  marginBottom: 12,
  backgroundColor:"#FFF",
  width:"100%",
  flex:1,
  // alignSelf:"center",
  flexDirection:"row-reverse",
  borderRadius:50,
  borderColor: '#ccc',
  justifyContent: 'flex-end',
  position: 'relative',
  },
  itemTextContainer: {
    // flex: 1,
    marginLeft: 16,
    flexDirection:"column",
    alignItems:"flex-start"
  }, 
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  itemText_money: {
    fontSize: 16,
    right:60,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  subItemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
  },
  descriptionText: {
    marginTop:10,
    marginLeft:0,
    marginRight:0,
    fontSize: 14,
    fontWeight:"bold",
    color: 'green',
  },
  icon: {
    marginTop:15,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#003b63',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,     
    left: '10%',
  },
});

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const isFocused = useIsFocused();

  useEffect( () => {
    const get_data = async  () =>{ 
      const data = await Fetch_data('TRANSACTION_LIST');      
      if(data.success){
        setTransactions(data.data); 
      }else{
        console.log(data.message);
      }
    };
    if(isFocused){
    get_data();  
    }
  }
  ,[isFocused]);

  const x = {s:1,d:3}
  const renderItem = ({ item,a }) => (
   <View style={styles.itemContainer}>
      <View style={styles.icon}>
        <Icon name="payment" size={32} color="#ffcc02" />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemText}>  {PN.convertEnToPe(item.time)}</Text>
        {/* <Text style={styles.subItemText}>User: {item.user}</Text> */}
        <Text style={styles.subItemText}> تومان        
          <Text style={styles.itemText_money}> 
                 {PN.convertEnToPe(PN.sliceNumber(item.amount))}
          </Text>
        </Text>
        <Text style={styles.descriptionText}>واریز</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex:1, padding:'0%', backgroundColor:"#003b63"}}>
    <View style={styles.container}>
      {/* <Appheader/> */}
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={{ flex: 1 }}
      />
    </View>
   </SafeAreaView>
  );
};

export default TransactionList;
