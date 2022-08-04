import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, AsyncStorage, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RightIcon from 'react-native-vector-icons/Feather';

import * as RNIap from 'react-native-iap';

const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;



const ReactiveProductModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const { onPressClose, SetonPressClose } = props;
  const [Product, SetProduct] = useState([]);

  useEffect(() => {
    getSubDetails()
  },[])
  const getSubDetails = () => {
    
    const itemSkus = ['reactivate_product']
    RNIap.getProducts(itemSkus).then((sub_res) => {
      console.log(" get Subscriptions products", sub_res);
      SetProduct(sub_res)
    }).catch((error) => {
      //console.log(error.message);
    })
  }
  const purchaseProduct = () => {
   const Product_Id =Product[0].productId
    //console.log("my choose Product_id",Product[0].productId);
    RNIap.requestPurchase(Product_Id).then(purchase => {
      //console.log(JSON.stringify(purchase));
      props.reactiveProduct(props.ProductId)
    })
  }

 
  //console.log("my Product", Product);
  
  return (
    <View>
      {
        modalProps ?
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalProps}
            onRequestClose={() => {
              modalVisible(!modal)
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalBody}>
                <View style={{ backgroundColor: "#fff", elevation: 10, alignSelf: 'flex-start', width: Devicewidth, height: Deviceheight / 14, alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity style={{ marginBottom: 10, marginTop: 15, height: Deviceheight / 30, width: Devicewidth / 16, alignSelf: 'flex-start', alignItems: "center", justifyContent: "center", marginLeft: 10 }}
                  onPress={() => props.onPressClose()}
                >
                  <Image source={require('../../Assets/Cross.png')} style={{ width: "60%", height: "60%", resizeMode: 'contain' }}></Image>
                </TouchableOpacity>
                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 22, color: "#000", textAlign: "center", alignSelf: 'center', fontWeight: 'bold', marginLeft: 80 }}>Reactivate Product</Text>
                </View>



                <View style={{ height: Deviceheight / 5, width: Devicewidth / 1.1, alignItems: 'center', justifyContent: "center", alignSelf: "center", backgroundColor: "#ffd2b3" }}>
                  <Icon name="flash" size={50} style={styles.favoriteIcon} style={{ height: Deviceheight / 14, width: Devicewidth / 8, alignSelf: "center", }} color="#15b89b" />
                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 19, color: "#000", textAlign: "center", alignSelf: 'center', fontWeight: 'bold', marginTop: 10 }}>Save money on reactivation</Text>

                </View>

                {/* view for border only */}
                <View style={{ height: Deviceheight / 50, width: Devicewidth / 1.1, alignItems: 'center', justifyContent: "center", alignSelf: "center", borderBottomWidth: 1, borderBottomColor: "#dddddd" }}>
                </View>

                <View style={{ alignSelf: 'flex-start', width: Devicewidth, height: Deviceheight / 18, alignItems: "center", flexDirection: "row", justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 19, color: "#000", textAlign: "center", alignSelf: 'center', fontWeight: 'bold', marginLeft: 20 }}>Feature Listing</Text>
                  {/* <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: "#000", textAlign: "center", alignSelf: 'center', marginRight: 20, }}>See Exaple</Text> */}
                </View>

                <View style={{ alignSelf: 'flex-start', width: Devicewidth, height: Deviceheight / 18, alignItems: "center", flexDirection: "row", paddingLeft: 15, }}>
                  <RightIcon name="check" size={20} style={styles.favoriteIcon} color="#070707" />
                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: "#000", textAlign: "center", alignSelf: 'center', marginLeft: 10, }}>{Product[0].description}</Text>
                </View>

                <TouchableOpacity
                 onPress={() => purchaseProduct()}
                  style={{ width: Devicewidth / 1.1, borderRadius: 5, height: Deviceheight / 8, alignSelf: "center", justifyContent: 'center', alignItems: "center", marginTop: 10, backgroundColor: "#eeeeee" }}>
                  <View style={{ alignSelf: 'flex-start', width: Devicewidth / 1.1, height: Deviceheight / 18, alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "#dddddd", }}>
                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#000", textAlign: "center", alignSelf: 'center', fontWeight: 'bold', }}>Buy Reactivate product</Text>
                  </View>
                  <View style={{ alignSelf: 'flex-start', width: Devicewidth / 1.1, height: Deviceheight / 18, alignItems: "center", justifyContent: "center", }}>
                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#000", textAlign: "center", alignSelf: 'center', fontWeight: 'bold', }}>{Product[0].localizedPrice}</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </Modal>
          : null
      }
    </View>
  );
}


export default ReactiveProductModal;


const styles = StyleSheet.create({
  modalBody: {
    alignItems: 'center',
    width: Devicewidth,
    height: Deviceheight,
    backgroundColor: '#fff',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000000'

  },
})