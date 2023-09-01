import React, { useEffect, useState } from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {FontAwesome5 } from '@expo/vector-icons';

export default function Api(){
const [users,setUsers] = useState([]);

useEffect(()=>{
	fetchData()
},[]);
	
const fetchData = () => {
	fetch("http://192.168.1.137:8000/transactions/")
	.then(response =>  response.json() )
	.then(jsonResponse => setUsers(jsonResponse))
	.catch(error => console.log(error))
};

const renderUser = ({item}) => {
	return (
     <View style={styles.listItem}>
        <View style={{margin:10,borderWidth:0,padding:10}}> 
            <Text style={{textAlign: 'left',color:"black",fontSize:16,fontWeight:"bold"}}>
             {item.id}
            </Text>
            <View style={{flexDirection:'row-reverse'}}>
                <Text style={{color:"black", textAlign: 'right', fontSize:16,fontWeight:"bold" }}> زمان :</Text>
                <Text style={{color:"black",marginRight:60}}>  {item.created_date}</Text>
            </View>
            <View style={{flexDirection:'row-reverse'}}>
                <Text style={{color:"black", textAlign: 'right', fontSize:16,fontWeight:"bold" }}> مبلغ :</Text>
                <Text style={{color:"black",marginRight:60}}>  {item.amount}</Text>
            </View>
            <View style={{flexDirection:'row-reverse',marginBottom:1}}>
                <TouchableOpacity style={{height:50,width:50, justifyContent: 'flex-end' }}>
                    <Text style={{color:"green",textAlign: 'right',fontSize:16,fontWeight:"bold",marginTop:20}}>واریز</Text>
                </TouchableOpacity>
                <Text style={{left:200, marginTop:25}}>
                    <FontAwesome5 name="check-square" size={20} color= 'red'> </FontAwesome5>
                </Text>
            </View>
        </View>
    </View>   

	)
}
return (
    <View style={styles.container}>
	<FlatList  
		data={users}
		renderItem={renderUser}
		keyExtractor={(item,index) => index.toString()}
		/>
	</View>
)
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      marginTop:60,
      padding:0,
      
    },
    listItem:{
      margin:10,
      padding:10,
      backgroundColor:"#FFF",
      width:"80%",
      flex:1,
      alignSelf:"center",
      flex:1,
      borderRadius:50,
      justifyContent: 'flex-end'

    },
    headerIcon:{
        left:10,
        marginBottom:0,}
  });