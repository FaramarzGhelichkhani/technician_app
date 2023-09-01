import React, { useState, useEffect } from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { TextInput, View, Text, TouchableOpacity, StyleSheet,SafeAreaView, Linking, TouchableHighlight, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { order_detail, order_product_detail, Fetch_data, update_order, update_order_product } from './API';
import ProductForm from './Dynamic_data';
import { useNavigation } from '@react-navigation/native';
import { I18nManager } from 'react-native';
import PN from "persian-number";

I18nManager.forceRTL(true);



const OrderForm = ({route}) => {
  const [editable, setedit] = useState(true); 
  const [location, setlocation] = useState('');
  const [date, setdate] = useState('');
  const [orderid, setid] = useState(null);
  const [fullname, setfullname] = useState('');
  const [phone,setphone] = useState('');
  const [selectedStatus, setSelectedStatus] = useState([]);
  
  const [selectedWage, setSelectedWage] = useState(0);
  const [selectedExpanse, setSelectedExpanse] = useState(0);
  
  const [selectedServices, setSelectedServices] = useState([]);
  const [SelectedServicesId,setSelectedServicesId]=useState([]);
  
  const [selectedmotors, setSelectedMotors] = useState([]);
  const [SelectedMotorsId,setSelectedMotorsId]=useState([]);
  
  const [showwage,setshow_wage] = useState(false);
  // const [showproduct,setshow] = useState(false);
  // const [insertedproductdata, setproducts] = useState([{ product : null, number: null, price: null }]);
  
  const [servicesItme, setservicesItem] = useState([]);
  const [motorsItme, setmotorsItem] = useState([]);

  const NO_PRODUCT_PRIMARY_KEY  = 3;
  const {id} = route.params;
//
const navigation = useNavigation();
  

  useEffect(()=>{
    // inital varible
    const initiate = async ()=>{
      const data = await order_detail(id);
      
      // 
      if(data.success){
        setSelectedStatus([data.data.status]);
        setSelectedServices(data.data.services_list);
        setSelectedMotors(data.data.motors_list);
        const wage = data.data.wage !== null ? data.data.wage : 0;
        const expanse = data.data.expanse !== null ? data.data.expanse : 0;
        setSelectedWage(wage);
        setSelectedExpanse(expanse);
        setid(data.data.id);
        setlocation(data.data.address);
        setfullname(data.data.customer_full_name);
        setdate(data.data.time);
        setphone(data.data.customer_phone)
      
        // initial editable
        if(data.data.status !== 'در حال انجام')
        {
          setedit(false)
        }
        // services
        const service_list_data = await  Fetch_data('SERVICES_LIST');
        if(service_list_data.success === true){
          setservicesItem(service_list_data.data);

          const selectedServiceIds = data.data.services_list.map((selectedService) => {
          const service = service_list_data.data.find((service) => service.name === selectedService);
          return  service.id 
        });
        setSelectedServicesId(selectedServiceIds);
        }
        else{
          setservicesItem([]);
        }    
        // motors
        const motor_list_data = await  Fetch_data('MOTORS_LIST');
        if (service_list_data.success === true){
          setmotorsItem(motor_list_data.data);
          
          const selectedMotorsIds = data.data.motors_list.map((selectedmotor) => {
            const motor = motor_list_data.data.find((motor) => motor.name === selectedmotor);
            return  motor.id 
          });
          setSelectedMotorsId(selectedMotorsIds);

        }
        else {
          setmotorsItem([]);
        }
  }
  else{
    console.log(data.message);
  }
  // const productdata = await order_product_detail(id);
  // productdata.success === true && productdata.data.length > 0 ? setproducts(productdata.data): null;
  } 
  initiate();


},[])

const options = {
  status:[
    {
  name: 'وضعیت',
    id: 0,
    children:  [
    { name: 'در حال انجام', id: 'in_progress' },
    { name: 'کنسل', id: 'canceled' },
    { name: 'انجام شد', id: 'done' },
    // { name: 'در آستانه کنسلی', id: 'pending_cancel' },
],
}
],
motors:[{name: 'موتور', id: 1,children: motorsItme ,}],
services: [{name: 'سرویس',id: 2,children: servicesItme,},]
};



const validation = () =>{
  let errorMessage = '';

    if (!selectedStatus || selectedStatus.length === 0 || selectedStatus[0]=== 'در حال انجام' ) {
      errorMessage += 'وضعیت سفارش را مشخص کنید.\n';
    }

    if (selectedStatus[0]=== 'انجام شد' && ( !Number.isInteger(selectedWage) || selectedWage < 10000 ) ) {
      errorMessage += 'مبلغ اجرت را وارد نمایید.\n';
    }

    if ( selectedStatus[0]=== 'انجام شد' && (!Number.isInteger(selectedExpanse) ) ){
      errorMessage += 'مبلغ خرجکرد را وارد نمایید.\n';
    }

    // if (SelectedServicesId.length === 0) {
    //   errorMessage += 'Please select at least one service.\n';
    // }

    // if (SelectedMotorsId.length === 0) {
    //   errorMessage += 'Please select at least one motor.\n';
    // }
    
    // const isProductDataValid = insertedproductdata.every(product => {
    //   return  (product.product && product.number && product.price && !isNaN(product.price)) ||
    //             ( product.product === NO_PRODUCT_PRIMARY_KEY && product.price === null && product.number === null )  ;
    // });
    // if (!isProductDataValid) {
    //   errorMessage += 'Please enter product data.\n';
    // }
  return errorMessage;  
}

const handleDataSubmit = () => {
  // status validation
  if (selectedStatus[0] === 'کنسل'){
    setSelectedWage(0)
    setSelectedExpanse(0)
    // setproducts([{ product : NO_PRODUCT_PRIMARY_KEY, number: null, price: null }])
  }
  const validated = validation();

  if (validated){
    Alert.alert('خطا', validated,
    [{ text: 'باشه', onPress: () => {null} }],
    );
  }else{
  const Datatoupdate = {
    status:selectedStatus[0],  
    wage: selectedWage,
    services_list: SelectedServicesId,
    motors_list: SelectedMotorsId,
  }
  
  update_order(id,Datatoupdate);
  // update_order_product(id,insertedproductdata);
  
    navigation.goBack();
  // setedit(false)
}
}

const getTotalPrice = () => {
  let totalPrice = 0;
  for (let i = 0; i < insertedproductdata.length; i++) {
    if (insertedproductdata[i].product && insertedproductdata[i].price && !isNaN(insertedproductdata[i].price)) {
      totalPrice += Number(insertedproductdata[i].price);
    }
  }
  const formatedtotalprice = String(totalPrice).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formatedtotalprice;
}


  function handleMotorsChange(selectedItems) {
    setSelectedMotors(selectedItems);
    const motorsid = selectedItems.map((selectedmotor) => {
      const motor = options.motors[0].children.find((motor) => motor.name === selectedmotor);
      return  motor.id 
    });
    setSelectedMotorsId(motorsid);
  }

function handleServicesChange(selectedItems){
  setSelectedServices(selectedItems);
    const selectedServiceIds = selectedItems.map((selectedService) => {
      const service = options.services[0].children.find((service) => service.name === selectedService);
      return  service.id 
    });
    setSelectedServicesId(selectedServiceIds);
}

  const formatWage = (value) => {
    if (!value) {
      return 0;
    }
    const formattedValue = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue;
  };

  const parseWage = (value) => {
    const envalue = PN.convertPeToEn(value);
    const parsedValue = envalue.replace(/,/g, '');
    return parseInt(parsedValue);
  };


const handleCallPress = () => {
  const url = `tel:${phone}`;
  Linking.openURL(url);
};

// const showProduct = ()=>{
//   setshow(!showproduct);
// }


  return (

<SafeAreaView style={{flex:1, padding:'0%', backgroundColor:"#003b63"}}>

<View style={styles.container} >
<ScrollView>

  <View style={{ flexDirection: 'row', marginBottom: 10 }}>
      <Icon name="list-alt" size={24} color="#ffcc02" />
      <Text style={{textAlign:"right", marginTop:2, fontSize:16}}>  {PN.convertEnToPe(orderid)} </Text>
  </View>

  <View style={{ flexDirection: 'row', marginBottom: 10 }}>
    <Icon name="date-range" size={24} color="green" />
    <Text style={{textAlign:"right", marginTop:2, fontSize:16}}>  {PN.convertEnToPe(date)} </Text>
  </View>

  
<View style={{}}>

<View style={{ flexDirection: 'row', marginTop:20}}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <Text style={{  fontWeight:"bold", textAlign:"right" }}> آدرس:  </Text>  
      <Text style={{ marginRight: 10 }}>{location}</Text> 
   </View> 
</View> 

<View style={{ flexDirection: 'row', marginTop:20}}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <Text style={{  fontWeight:"bold", textAlign:"right" }}> نام مشتری:  </Text>  
      <Text style={{ marginRight: 10 }}>{fullname}</Text> 
   </View> 
</View> 
  
  <View style={{ flexDirection: 'row', marginTop:20}}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <Text style={{  fontWeight:"bold", textAlign:"right" }}> شماره تماس مشتری:   </Text>  
      <Text style={{ marginRight: 10 }}>{PN.convertEnToPe(phone)}</Text>
      <TouchableOpacity onPress={handleCallPress}>
        <Icon name="call" size={24} color="#007AFF" />
      </TouchableOpacity> 
   </View> 
</View> 


<View style={{ marginTop:10,marginBottom:10, borderBottomWidth: 1,width: '100%'}}>
</View>
{/* #################### status */}

<SectionedMultiSelect
  items={options.status}
  IconRenderer={Icon}
  uniqueKey="name"
  single={true}
  subKey="children"
  selectText="انتخاب وضعیت"
  selectedText="مورد انتخاب شده."
  showDropDowns={false}
  hideSearch={true}
  readOnlyHeadings={true}
  onSelectedItemsChange={(selectedItems) => setSelectedStatus(selectedItems)}
  selectedItems={selectedStatus}
  searchPlaceholderText="جستجوی وضعیت"
  showCancelButton={true}
  confirmText="تایید"
  hideSelect={editable === false}
  showChips={editable}
 
  styles={{
    ...styles.multiSelectContainer,
    selectToggle: styles.multiSelectToggle,
    selectToggleText: styles.multiSelectText,
    chipContainer: styles.multiSelectChipContainer,
    chipText: styles.multiSelectChipText,
    selectedItem: styles.multiSelectSelectedItem,
    itemText: styles.multiSelectItemText,
    subItemText: styles.multiSelectSubItemText,
    searchTextInput: styles.multiSelectSearchInput,
    button: styles.multiSelectConfirmButton,
  }}
  colors={{
    primary: '#007AFF',
  }}
  itemRenderer={({ item, isSelected, onToggleItem }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon
        name={isSelected ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={isSelected ? '#007AFF' : '#757575'}
        onPress={onToggleItem}
      />
      <Text style={{ marginLeft: 20 }}>{item.name}</Text>
    </View>

  )}
/>

{/* <RNPickerSelect
  onValueChange={handleStatusChange}
  items={status}
  value={selectedStatus}
  disabled={selectedStatus !== ['in_progress']}
  style={styles.picker
}
  placeholder={{label: 'وضعیت سفارش',value: null}}
/> */}

{editable === false && (
        <View style={styles.badgesContainer}>
            <View
              style={{...styles.badge,
              backgroundColor : selectedStatus === 'انجام شد' ? 'green' : 'red'
          }}
            >
              <Text style={styles.badgeText}>{selectedStatus}</Text>
            </View>
        </View>
      )}


{/* #################### services */}

{/* <SectionedMultiSelect
  items={options.services}
  IconRenderer={Icon}
  uniqueKey="name"
  subKey="children"
  selectText="انتخاب سرویس"
  selectedText="مورد انتخاب شده."
  showDropDowns={true}
  readOnlyHeadings={true}
  onSelectedItemsChange={handleServicesChange}
  selectedItems={selectedServices}
  searchPlaceholderText="جستجوی خدمات"
  showCancelButton={true}
  confirmText="تایید"
  hideSelect={editable === false}
  showChips={editable === true}
 
  styles={{
    ...styles.multiSelectContainer,
    selectToggle: styles.multiSelectToggle,
    selectToggleText: styles.multiSelectText,
    chipContainer: styles.multiSelectChipContainer,
    chipText: styles.multiSelectChipText,
    selectedItem: styles.multiSelectSelectedItem,
    itemText: styles.multiSelectItemText,
    subItemText: styles.multiSelectSubItemText,
    searchTextInput: styles.multiSelectSearchInput,
    button: styles.multiSelectConfirmButton,
  }}
  colors={{
    primary: '#007AFF',
  }}
  itemRenderer={({ item, isSelected, onToggleItem }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon
        name={isSelected ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={isSelected ? '#007AFF' : '#757575'}
        onPress={onToggleItem}
      />
      <Text style={{ marginLeft: 20 }}>{item.name}</Text>
    </View>

  )}
/> */}

{true && (
        <View style={styles.badgesContainer}>
          {selectedServices.map((item) => (
            <View
              key={item}
              style={{...styles.badge,backgroundColor:'#ffcc02'}}
            >
              <Text style={styles.badgeText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

{/* #################### motors */}

{/* <SectionedMultiSelect
  items={options.motors}
  IconRenderer={Icon}
  uniqueKey="name"
  subKey="children"
  selectText="انتخاب موتور"
  selectedText="موتور انتخاب شده."
  showDropDowns={true}
  readOnlyHeadings={true}
  onSelectedItemsChange={handleMotorsChange}
  selectedItems={selectedmotors}
  searchPlaceholderText="جستجوی موتور"
  showCancelButton={true}
  confirmText="تایید"
  hideSelect={editable === false}
  showChips={editable === true}
 
  styles={{
    ...styles.multiSelectContainer,
    selectToggle: styles.multiSelectToggle,
    selectToggleText: styles.multiSelectText,
    chipContainer: styles.multiSelectChipContainer,
    chipText: styles.multiSelectChipText,
    selectedItem: styles.multiSelectSelectedItem,
    itemText: styles.multiSelectItemText,
    subItemText: styles.multiSelectSubItemText,
    searchTextInput: styles.multiSelectSearchInput,
    button: styles.multiSelectConfirmButton,
  }}
  colors={{
    primary: '#007AFF',
  }}
  itemRenderer={({ item, isSelected, onToggleItem }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon
        name={isSelected ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={isSelected ? '#007AFF' : '#757575'}
        onPress={onToggleItem}
      />
      <Text style={{ marginLeft: 20 }}>{item.name}</Text>
    </View>

  )}
/> */}

{true && (
        <View style={styles.badgesContainer}>
          {selectedmotors.map((item) => (
            <View
              key={item}
              style={{...styles.badge,backgroundColor:'#4682b4'}}
            >
              <Text style={styles.badgeText}>{item}</Text>
            </View>
          ))}
        </View>
      )}


<TouchableHighlight style={{ marginTop:10,marginBottom:10, borderBottomWidth: 1, borderTopColor: 'gray',width: '100%',
          }} onPress={()=> {setshow_wage(!showwage)}}>
<Text style={{fontWeight:"bold"}}>  اجرت و خرجکرد </Text>
</TouchableHighlight>

{showwage && (
  <TextInput
  onChangeText={(value) => {
    const parsedValue = parseWage(value);
    setSelectedWage(parsedValue);
  }}
  value={PN.convertEnToPe(PN.sliceNumber(selectedWage))}
  keyboardType="numeric"
  editable={editable}
  placeholder='اجرت'
  style={styles.input}
/>
)
}
{showwage && (
  <TextInput
  onChangeText={(value) => {
    const parsedValue = parseWage(value);
    setSelectedExpanse(parsedValue);
  }}
  value={PN.convertEnToPe(PN.sliceNumber(selectedExpanse))}
  keyboardType="numeric"
  editable={editable}
  placeholder='خرجکرد'
  style={styles.input}
/>
)
}


{/* <TouchableHighlight style={{marginTop:10,marginBottom:10, borderBottomWidth: 1,width: '100%',}} onPress={showProduct}>
<Text  style={{fontWeight:"bold"}}>قطعات ^</Text>
</TouchableHighlight>

{showproduct && (
  <ProductForm  products={insertedproductdata} setProducts={setproducts} editable={editable}/>
)} */}

{true &&(
  <View style={styles.summarycontainer}>
  <Text style={{fontSize:16, marginTop:20}}> اجرت دریافتی <Text style={styles.bold}>{PN.convertEnToPe(PN.sliceNumber(selectedWage))}</Text>  تومان.</Text>
  <Text style={{fontSize:16, marginTop:10}}>هزینه دریافتی بابت قطعات <Text style={styles.bold}>{PN.convertEnToPe(PN.sliceNumber(selectedExpanse))}</Text>  تومان.</Text>
</View>
)
}
{editable && (
<View style={styles.buttonContainer}>
  <TouchableOpacity onPress={handleDataSubmit}  >
    <Text style={styles.buttonText}>ارسال اطلاعات</Text>
  </TouchableOpacity>
</View>)
}




  </View>
  </ScrollView>
</View>
</SafeAreaView>
  );

};

export default OrderForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: '10%',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width:"100%",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlign:"center",
    fontSize:18
  },
  multiSelectContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  multiSelectToggle: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop:20,
    marginBottom: 10,
    width:"100%",
  },
  multiSelectText: {
    fontSize: 16,
    textAlign:"center"
  },
  multiSelectChipContainer: {
    backgroundColor: '#ffcc02',
  },
  multiSelectChipText: {
    color: 'black',
    fontSize: 14,
  },
  multiSelectSelectedItem: {
    backgroundColor: '#ffcc02',
  },
  multiSelectItemText: {
    fontSize: 16,
  },
  multiSelectSubItemText: {
    fontSize: 14,
  },
  multiSelectSearchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  multiSelectConfirmButton: {
    backgroundColor: '#007AFF',
  },
  badgesContainer: {
    // flexDirection: "row",
    flexWrap: 'wrap',
    marginTop: 16,
    // alignItems:"center"
  },
  badge: {
    backgroundColor: '#e8e8e8',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    textAlign:"right"
  },
  badgeText: {
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: '#003b63',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summarycontainer: {
    borderTopWidth:1,
    width: '100%',
    marginTop:30,
    marginBottom:30,
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'flex-start',
  },
  bold: {
    fontWeight: 'bold',
    fontSize:18
  },
});