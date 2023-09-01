// import React from 'react';

import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Fetch_data, accept_order } from './API';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { I18nManager } from 'react-native';
import PN from "persian-number";


I18nManager.forceRTL(true);

const handleacceptance = async  (id, phonnumber,setfresh) =>{
  console.log(`id: ${id}`)
  const result =  await accept_order(id);
  console.log(result)
  if(result.success === true && result.data.success === 'Order accepted successfully') {
          Alert.alert(
            'سفارش با موفقیت پذیرفته شد!','s',
            [
              { text: 'باشه', onPress: () => {console.log('تایید شد'); setfresh(true)} },
              {
                text: 'تماس با مشتری',
                onPress: () => {Linking.openURL(`tel:${phonnumber}`);setfresh(true)},
                style: 'cancel',
              },
            ],
            {
              textDirection: 'rtl',
              titleStyle: { textAlign: 'right', writingDirection: 'rtl' },
              messageStyle: { textAlign: 'right', writingDirection: 'rtl' },
            }
          );
  }
  else{
    Alert.alert("error")
  }
}


const serviceImages = {
  'پنچری': require("../assets/services/panchari.png" ),
  'باطری': require('../assets/services/باطری.png'),
  'تعویض تسمه':  require('../assets/services/tasme2.jpeg'),
  'سوییچ و مغزی':require('../assets/services/maghzi.webp'),
  'روشن نمی شود':require('../assets/services/wontstart.jpg'),
  'دنده': require('../assets/services/gear.jpg'),  
  'زنجیر':require('../assets/services/zanjir.png'), 
  'چراغ':require('../assets/services/light.webp'), 
  'default': require('../assets/services/generally.png')
}


const statusColors = {
  'کنسل': 'red',
  'انجام شد': 'green',
  'default': 'orange',
};

function ItemOne({item}){
  const navigation = useNavigation();
  // console.log(String(serviceImages[item.services_list[0]]));
  const statusColor = statusColors[item.status] || statusColors['default'];
  return (
    <View style={styles.listItem}>
      <View style={styles.imageContainer}>
        {/* <Image style={styles.image} source={serviceImages[item.services_list[0]]
        || serviceImages['default']} /> */}
         <TouchableOpacity onPress={()=> Linking.openURL(`tel:${item.customer_phone}`)}>
           <Icon name="call" size={24} color="#007AFF" />
          </TouchableOpacity> 
      </View>

      
      
      <View style={styles.contnentItem}>
        
        <Text style={styles.locationText}>{item.address}</Text>
        <Text style={styles.servicesText}>{item.services_list.join(', ')}</Text>
        <Text style={styles.motorsText}>{item.motors_list.join(', ')}</Text>
        <Text style={{...styles.statusText,  color: statusColor}}>{item.status}</Text>
        <View style={{borderTopWidth:0, flexDirection: 'row', flex: 1 }}>
          <Icon name="date-range" size={24} color="green" style={{marginRight:5}} />
          <Text style={styles.dateText}>{PN.convertEnToPe(item.time)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('order',{id:item.id})}>
        <Text style={styles.buttonText}>جزییات</Text>
      </TouchableOpacity>

  </View>
    );
  
}


function ItemTwo({item,setfresh}){
  return (
    <View style={styles.listItem}>
      <View style={styles.imageContainer}>
      <Image style={styles.image} source={serviceImages[item.services_list[0]]
        || serviceImages['default']} />
      </View>
      <View style={styles.contnentItem}>
        <Text style={styles.locationText}>{item.address}</Text>
        <Text style={styles.servicesText}>{item.services_list.join(', ')}</Text>
        <Text style={styles.motorsText}>{item.motors_list.join(', ')}</Text>
        <Text style={styles.statusText}></Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={()=> handleacceptance(item.id,item.customer_phone,setfresh)}>
        <Text style={styles.buttonText}>قبول سفارش</Text>
      </TouchableOpacity>
  </View>
    );  
}
//////
export default function OrdersScreenWrapper(props) {
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const [fresh_accept,setfresh]=useState(false);

  async function loadData() {
    const url = props.route.params.url; // Get the url prop
    const data = await Fetch_data(url); 
    if (data.success) {
      setData(data.data);
      setfresh(false);
    } else {
      console.log(data.message);
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  useEffect(() => {
    if(fresh_accept){
      loadData();
    }
  }, [fresh_accept]);

  const useItemOne = props.route.params.useItemOne;

  return (
    <OrdersScreen
      data={data}
      useItemOne={useItemOne}
      setfresh={setfresh}
    />
  );
}

class OrdersScreen extends React.PureComponent {
  render() {
    const { data, useItemOne,setfresh } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          style={{flex:1}}
          data={data}
          renderItem={({ item }) =>
            useItemOne ? <ItemOne item={item} /> : <ItemTwo item={item} setfresh={setfresh} />
          }
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'snow',
    marginTop: 0
  },
  listItem: {
    margin: 10,
    padding: 16,
    backgroundColor: '#FFF',
    width: '90%',
    flex: 1,
    alignSelf: "center",
    flexDirection: 'row-reverse',
    borderRadius: 20,
    borderWidth:1,
    position: 'relative'
  },
  contnentItem :{
    // margin:10,
    // padding:16,
    // marginTop: 10,
    // marginBottom: 12,
    // backgroundColor:"#FFF",
    width:"100%",
    flex:1,
    // alignSelf:"center",
    // flexDirection:"c/",
    // borderRadius:50,
    // borderColor: '#ccc',
    // justifyContent: 'flex-end',
    alignItems: "flex-start",
    // position: 'relative',
  }
  ,
  locationText: {
    direction:"rtl",
    marginRight:20,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  dateText:{direction:"rtl",
  fontSize:16,
  marginRight:20,
  fontWeight: 'bold',
  textAlign: 'right'},
  servicesText: {
    marginRight:20,
    textAlign: 'right'
  },
  statusText: {
    marginRight:20,
    textAlign: 'right',
    // color:"orange"
  },
  motorsText: {
    marginRight:20,
    textAlign: 'right'
  },
  statusCircle: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'yellow',
    borderRadius: 50,
    width: 20,
    height: 20
  },
  button: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 50
  },
  buttonText: {
    marginLeft:20,
    color: 'blue'
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    marginLeft:15,
    // marginTop:20
  },
  image: {
    width: '100%',
    height: '100%'
  },
});