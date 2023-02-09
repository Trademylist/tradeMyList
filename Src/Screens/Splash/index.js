import React, { Component } from 'react';
import { View, Text, Image,Dimensions,Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import {connect} from 'react-redux';
import { PERMISSIONS, request } from "react-native-permissions";
import Geolocation from 'react-native-geolocation-service';
import { STORE_SLIDER_DISTANCE, UPDATE_CHAT_COUNTER } from '../../store/actions';
import firestore from '@react-native-firebase/firestore';
import { chatList } from '../../helperFunctions/chatList';


//const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';
// const API_KEY = 'AIzaSyCZ9kuVUyhZxeFR3cPnebauMlffVOhoM1Y'
const API_KEY = 'AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4'
// const API_KEY = 'AIzaSyCMDLepAKckVIr8TWkM5Mq5SawWH0B6Bfw'
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const ref = firestore().collection('Trade_Message');

class Splash extends Component {
  async componentDidMount() {
    try {
      this.fetchLocation()
    } catch(e) {
      console.log('ess', e);
    }
  }

  fetchLocation = async() => {
    const locationStored = JSON.parse(await AsyncStorage.getItem('UserLocation'));
    const slider = JSON.parse(await AsyncStorage.getItem('MapSliderValue'));
    if(locationStored){
      this.fetchAddressFromLocal(locationStored, slider);
    } else {
      this.fetchAddressFromApi();
    }
  }

  fetchAddressFromApi = () => {
    request(
      Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      })
    ).then(res => {
        if (res == "granted") { 
            Geolocation.getCurrentPosition( 
                (info) => {
                     
                    const latitude = info.coords.latitude
                    const longitude = info.coords.longitude;
                    console.log('errorA',latitude,longitude)
                    axios
                    .request({
                        method: 'post',
                        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
                    })
                    .then(async response => {
                      const wholeAddress = response.data.results[0].formatted_address;
                      const addresses = response.data.results[0].address_components;
                      let address = '';
                      let country = '';
                      for (let i = 0; i < addresses.length; i++) {
                        const element = addresses[i];
                        if(element.types.includes("country") && country == ''){
                          country = element.long_name;
                        }
                        if(element.types.includes("locality")){
                          address = element.long_name;
                        } else if(element.types.includes("administrative_area_level_1") && address == ''){
                          address = element.long_name;
                        } else if(element.types.includes("country") && address == ''){
                          address = element.long_name;
                        }
                      }
                      let locationData = {
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        latitudeDelta: 6,
                        longitudeDelta: 6,
                        wholeAddress: wholeAddress,
                        country: country,
                        address
                      };
                      await AsyncStorage.setItem('UserLocation', JSON.stringify(locationData))
                      this.props.onUpdateLocation(locationData);
                      const value = JSON.parse(await AsyncStorage.getItem('UserData'));
                      if(value){
                        this.getChat2();
                      }
                      this.props.navigation.replace('home');
                    })
                    .catch(err => {
                        console.log(err.response)
                    })
                },
                error => console.log('ssss',error),
                {
                    enableHighAccuracy: true,
                    timeout: 2000,
                    maximumAge: 3600000
                }
            )
        } else {
            console.log("Location is not enabled");
        }
    });
  }

  getChat2 = async () => {
    let val = await chatList(this.props.onChatCounterUpdate);
    // console.log('fdfsdfd', val);
    // this.props.onChatCounterUpdate(val);
  }

  // getChat = async () => {
  //   try {
  //       const value = JSON.parse(await AsyncStorage.getItem('UserData'));
  //       const currentUserId = value.userid;
  //       ref.where('receiver_id', '==', currentUserId).onSnapshot(querySnapshot => {
  //           this.getAllChatData(currentUserId);
  //       });
  //   } catch (e) {
  //       // error reading value
  //   }
  // }

  // getAllChatData = async (currentUserId) => {
  //     const value = JSON.parse(await AsyncStorage.getItem('UserData'));
  //     if(value){
  //       let receivedQuery = await ref.where('receiver_id', '==', currentUserId).get();
  //       let headerChats = [];
  //       let newHeaders = [];
  //       let all = [];
  //       let unreadMessageCount = 0;
  //       receivedQuery.docs.map(doc => {
  //         all.push(doc.data())
  //       })
  //       all = [...all].sort((a,b) => b.created - a.created);
  //       for (let i = 0; i < all.length; i++) {
  //           let product_id = all[i].product_id;
  //           if(newHeaders.length == 0){
  //               newHeaders.push({product_id: all[i].product_id, data: [all[i]]});
  //           } else {
  //               let found = false;
  //               for (let j = 0; j < newHeaders.length; j++) {
  //                   const headerElement = newHeaders[j];
  //                   if(headerElement.product_id == product_id){
  //                       found = true;
  //                       let unique = true;
  //                       for (let k = 0; k < headerElement.data.length; k++) {
  //                           const element = headerElement.data[k];
  //                           let idToBeCheckedIn = (currentUserId == element.sender_id) ? element.receiver_id: element.sender_id;
  //                           let idToBeCheckedOut = (currentUserId == all[i].sender_id) ? all[i].receiver_id: all[i].sender_id;
  //                           if(idToBeCheckedOut == idToBeCheckedIn){
  //                               unique = false;
  //                               break;
  //                           }
  //                       }
  //                       if(unique){
  //                           newHeaders[j].data.push(all[i]);
  //                           break;
  //                       }
  //                   }
  //               }
  //               if(!found){
  //                   newHeaders.push({product_id: all[i].product_id, data: [all[i]]});
  //               }
  //           }
  //       }
  //       for (let i = 0; i < newHeaders.length; i++) {
  //           let main = newHeaders[i];
  //           for (let j = 0; j < main.data.length; j++) {
  //               let sub = main.data[j];
  //               headerChats.push(sub);
  //               if(!sub.seen){
  //                 ++unreadMessageCount;
  //               }
  //           }
  //       }
  //       if(unreadMessageCount > 0){
  //         this.props.onChatCounterUpdate(unreadMessageCount);
  //       }
  //     }  else {
  //       this.props.onChatCounterUpdate(0);
  //     }
  // }


  fetchAddressFromLocal = async (locationStored, slider) => {
    try {
      const {latitude, longitude, country, address, wholeAddress} = locationStored;
      let locationData = {
        latitude: latitude,
        longitude: longitude,
        country: country,
        address: address,
        wholeAddress: wholeAddress,
      }
      this.props.onUpdateLocation(locationData);
      this.props.onSliderUpdate(slider);
      const value = JSON.parse(await AsyncStorage.getItem('UserData'));
      if(value){
        this.getChat2();
      }
      this.props.navigation.replace('home');
    } catch (error) {
      console.log('failed to get address');
    }
  }

  render(){
    return(
      <>
        <View style={styles.Container}>
          <View style={{height:Deviceheight/8,width:Devicewidth/1.2,alignItems:'center',justifyContent:'center',alignSelf:'center'}}>
          <Image source={require('../../Assets/logo.png')} style={{height:'100%',width:'100%',resizeMode:'contain'}}/>
          </View>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
      SplashBackground: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        alignItems: "center"
      },
      LogoParrent:{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center'
      },
      Icon: {
        height:75,
        width:320
        },
    textparrent:{
        flex: 1, 
        position: 'absolute',
        bottom:50
    },
    loadtext:{
        fontSize:24,
        color:'#000'
    }
    
})

const mapDispatchToProps = dispatch => {
  return {
      onUpdateLocation: (val) => dispatch({type: 'LOCATION_SELECTED', payload: val}),
      onSliderUpdate: (val) => dispatch({type: STORE_SLIDER_DISTANCE, payload: val}),
      onChatCounterUpdate: (val) => dispatch({type: UPDATE_CHAT_COUNTER, payload: val}),
  }
}

const mapStateToProps = state => {
  return {
      savedLocation: state.savedLocation,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);