import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  name_input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginLeft:10,
    textAlign:"right",
    width: '90%'// 2*(width - 70) / 3,
  },
  number_input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    // marginLeft:20,
    marginRight: 20,
    textAlign:"right",
    width: (width - 70) / 6,
  },
  price_input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    textAlign:"right",
    width: (width - 70) / 6,
  },
  addButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    width: width - 40,
  },
  addButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#007AFF',
  },
  removeButton: {
    marginLeft:20,
    marginRight:3,
  }
});

import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Fetch_data } from './API';

const ProductForm = ({ products, setProducts, editable }) => {
  const [productsItem, setProductsItem] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const productListData = await Fetch_data('PRODUCTS_LIST');
      productListData.success === true
        ? setProductsItem(productListData.data)
        : setProductsItem([]);
    };
    getProducts();
  }, []);

  const addProduct = () => {
    const isLastProductValid =
      products.length === 1 && editable ||
      (products[products.length - 1].product &&
        Number.isInteger(Number(products[products.length - 1].number)) &&
        editable &&
        !isNaN(Number(parseFloat(String(products[products.length - 1].price).replace(',', '')))));

    const isNewProductNeeded = !products.some(
      (product) => product.product === null || product.number === '' || product.price === ''
    );

    if (isLastProductValid && isNewProductNeeded) {
      setProducts([...products, { product: null, number: '', price: '' }]);
    }
  };

  const removeProduct = (index) => {
    if (products.length === 1 && editable) {
      setProducts([{ product: null, number: null, price: null }]);
    }
    if (products.length > 1 && editable) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };
 


  return (
    <View style={styles.container}>
      {products.map((product, index) => (
        <View key={index} style={styles.productContainer}>
          <SectionedMultiSelect
            items={[{ id: 'products', name: 'قطعه', children: productsItem }]}
            IconRenderer={Icon}
            single={false}
            uniqueKey="id"
            subKey="children"
            selectText="قطعه"
            selectedText="قطعه"
            showDropDowns={false}
            readOnlyHeadings={true}
            onSelectedItemsChange={(selectedItems) =>
              updateProduct(index, 'product', selectedItems[0])
            }
            selectedItems={product.product ? [product.product] : []}
            showCancelButton={false}
            showRemoveAll={false}
            styles={{
              container: styles.name_input,
              selectedItem: styles.selectedItem,
            }}
            hideSelect={!editable}
          />
          <TextInput
            style={styles.number_input}
            placeholder="تعداد"
            value={String(product.number).replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChangeText={(text) => {
              const numericPrice = parseInt(text.replace(',', ''),10);
              if (/^\d*$/.test(numericPrice)) {
                updateProduct(index, 'number', numericPrice);
              }
            }}
            keyboardType="numeric"
            editable={editable}
          />
          <TextInput
            style={styles.price_input}
            placeholder="قیمت"
            value={String(product.price).replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            keyboardType="numeric"
            onChangeText={(text) => {
              const numericPrice = parseFloat(text.replace(',', ''));
              updateProduct(index, 'price', numericPrice);
            }}
            editable={editable}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeProduct(index)}
          >
            <Icon name="close" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addProduct}>
        <Icon name="add-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.addButtonText}>افزودن قطعه </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductForm;
