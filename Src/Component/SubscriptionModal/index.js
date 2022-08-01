import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, Platform, Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');

const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;



const SubscribeModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const [subscription, SetSubscription] = useState([]);
  const [Subscription_Id, SetSubscription_Id] = useState('');
  const [SubChoice, SetSubChoice] = useState('');

  useEffect(() => {
    console.warn('submodal=====>>>>>')
    getSubDetails()
  }, [])

  const getSubDetails = () => {
    if(subscription.length == 0){
      //const itemSkus = ['sub1day', 'sub1week', 'sub1month']
      const itemSkus = ['com.TradeReact.daily', 'com.TradeReact.weekly','com.TradeReact.monthly']
      RNIap.getSubscriptions(itemSkus).then((sub_res) => {
        console.warn(" get Subscriptions", sub_res);
       // Alert.alert('Subscription',sub_res)
        SetSubscription(sub_res)
      }).catch((error) => {
        console.log('errorA',error);
       // Alert.alert('IAP Error',error)
      })
    }
  }

  const purchaseSubscription = () => {
    let Subscription_Id
    //console.log("my sub choose", SubChoice);
    if (SubChoice === "one") {
      Subscription_Id = subscription[0].productId
    }
    else if (SubChoice === 'two') {
      //console.warn('sub',subscription[1].description)
      Subscription_Id = subscription[2].productId
    }
    else if (SubChoice === 'three') {
     // console.warn('sub',subscription[2].price)
      Subscription_Id = subscription[1].productId
    }
    else {
      null
    }
    //console.log("my choose id", Subscription_Id);
    RNIap.requestSubscription(Subscription_Id).then(purchase => {
      //console.log(JSON.stringify(purchase));
      sentDetails()
    })
  }

  const sentDetails = async () => {
    let days = ''
    if (SubChoice == "one") {
      days = 1
    }
    else if (SubChoice == 'two') {
      days = 2
    }
    else if (SubChoice == 'three') {
      days = 3
    }
    else {
      null
    }

    const object = {
      product_id: props.Product_Id,
      no_of_day: days
    }
    const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
    //console.log("value", value);
    {
      props.Process == "general" ?
      await axios.post("https://trademylist.com:8936/app_seller/boost", object, {
        headers: {
          'x-access-token': value.token,
        }
      })
        .then(response => {
          // //console.log(response)
          if (response.data.success === true) {
            try {

              //console.log("my seb res from database", response.data)
              alert("Subscription Updated Successfully")

            } catch (e) {
              // saving error

            }
          }
        })
        .catch(error => {
          //console.log(error.data)
        })
      :
      await axios.post("https://trademylist.com:8936/app_seller/commercial_boost", object, {
        headers: {
          'x-access-token': value.token,
        }
      })
        .then(response => {
          // //console.log(response)
          if (response.data.success === true) {
            try {

              //console.log("my seb res from database", response.data)
              alert("Subscription Updated Successfully")

            } catch (e) {
              // saving error

            }
          }
        })
        .catch(error => {
          //console.log(error.data)
        })
    }
  }

  // console.log("affsd", props.Product_Id, subscription.length);
  return (
    <View>
      {
        modalProps ?
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalProps}
            onRequestClose={() => {
              props.onPressCloseSub()
            }}>

                <View style={styles.modalContainer}>
                <View style={styles.modalBody}>
                  <TouchableOpacity style={{ marginBottom: 10, marginTop: 40, height: Deviceheight / 30, width: Devicewidth / 16, alignSelf: 'flex-start', alignItems: "center", justifyContent: "center", marginLeft: 10 }}
                    onPress={() => props.onPressCloseSub()}
                  >
                    <Image source={require('../../Assets/Cross.png')} style={{ width: "60%", height: "60%", resizeMode: 'contain' }}></Image>
                  </TouchableOpacity>
                  {
                  subscription.length > 0 &&
                    <>
                      <View style={{ height: Deviceheight / 2.2, width: Devicewidth / 1.01, alignItems: 'center', justifyContent: "center", alignSelf: "center" }}>
                    <Image source={require('../../Assets/subscribe.png')} style={{ width: "100%", height: "100%", resizeMode: 'contain' }}></Image>
                  </View>



                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 26, color: "#000", textAlign: "center", alignSelf: 'center', fontWeight: 'bold', marginTop: 10 }}>Attract 10 X more buyers</Text>
                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#000", textAlign: "center", alignSelf: 'center', marginTop: 10, width: Devicewidth / 1.5, height: Deviceheight / 16, }}>Feature your listing at the top of all listings at a discounted rate</Text>



                  <View style={{ width: Devicewidth, height: Deviceheight / 6, alignSelf: "center", alignItems: "center", justifyContent: "space-around", flexDirection: "row", marginTop: 10 }}>

                    {SubChoice != "one" ?
                      <TouchableOpacity onPress={() => SetSubChoice('one')} style={styles.subscriptionBox}>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#4e00b5", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Daily</Text>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#0000FF", textAlign: "center", alignSelf: 'center', fontWeight: "bold", marginTop: 10 }}>{subscription[0].currency == 'INR' ? '₹' : '$'} {subscription[0].price}</Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={styles.subscriptionSelectedBox}>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#4e00b5", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Daily</Text>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#0000FF", textAlign: "center", alignSelf: 'center', fontWeight: "bold", marginTop: 10 }}>{subscription[0].currency == 'INR' ? '₹' : '$'} {subscription[0].price}</Text>
                      </TouchableOpacity>
                    }

                   {SubChoice != "two" ?
                      <TouchableOpacity onPress={() => SetSubChoice('two')} style={styles.subscriptionBox}>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#4e00b5", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Weekly</Text>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#0000FF", textAlign: "center", alignSelf: 'center', fontWeight: "bold", marginTop: 10 }}>{subscription[2].currency == 'INR' ? '₹' : '$'} {subscription[2].price}</Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={styles.subscriptionSelectedBox}>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#4e00b5", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Weekly</Text>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#0000FF", textAlign: "center", alignSelf: 'center', fontWeight: "bold", marginTop: 10 }}>{subscription[2].currency == 'INR' ? '₹' : '$'} {subscription[2].price}</Text>
                      </TouchableOpacity>
                    }
 
                    {SubChoice != "three" ?
                      <TouchableOpacity onPress={() => SetSubChoice('three')} style={styles.subscriptionBox}>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#4e00b5", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Monthly</Text>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#0000FF", textAlign: "center", alignSelf: 'center', fontWeight: "bold", marginTop: 10 }}>{subscription[1].currency == 'INR' ? '₹' : '$'} {subscription[1].price}</Text>
                        <View style={{ backgroundColor: '#4e00b5', width: Devicewidth / 4.5, height: Deviceheight / 30, borderRadius: 50, alignItems: "center", justifyContent: "center", position: 'absolute', top: -10 }}>
                          <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#fff", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Best Value</Text>
                        </View>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={styles.subscriptionSelectedBox}>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#4e00b5", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Monthly</Text>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 18, color: "#0000FF", textAlign: "center", alignSelf: 'center', fontWeight: "bold", marginTop: 10 }}>{subscription[1].currency == 'INR' ? '₹' : '$'} {subscription[1].price}</Text>
                        <View style={{ backgroundColor: '#4e00b5', width: Devicewidth / 4.5, height: Deviceheight / 30, borderRadius: 50, alignItems: "center", justifyContent: "center", position: 'absolute', top: -10 }}>
                          <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#fff", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Best Value</Text>
                        </View>
                      </TouchableOpacity>
                    }
                  </View>

                  <TouchableOpacity
                    onPress={purchaseSubscription}
                    style={{ backgroundColor: '#fb7700', width: Devicewidth / 2, height: Deviceheight / 14, borderRadius: 50, alignSelf: "center", alignItems: "center", justifyContent: "center", marginTop: 30 }}>
                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 24, color: "#fff", textAlign: "center", alignSelf: 'center', fontWeight: "bold", }}>Feature Now</Text>
                  </TouchableOpacity>
                    </>
                  }

                </View>
              </View>
          </Modal>
          : null
      }
    </View>
  );
}


export default SubscribeModal;


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
    backgroundColor: ' rgba(0,0,0,0.8)'
  },
  subscriptionBox: {
    backgroundColor: '#ffd2b3',
    width: Devicewidth / 3.5,
    height: Deviceheight / 8,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  subscriptionSelectedBox: {
    backgroundColor: '#ffd2b3',
    width: Devicewidth / 3.5,
    height: Deviceheight / 8,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "grey",
    borderWidth: 1
  },
})
