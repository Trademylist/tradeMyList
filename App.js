import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Src/Navigations/AppNavigator';
import Linking from './Src/Linking'
import AsyncStorage from '@react-native-community/async-storage';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from './Src/store/reducer';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from './Src/Common/firebase/PushController';
import {fcmService} from './Src/Common/firebase/FcmService';
import { Alert,Platform } from 'react-native';

const store = createStore(reducer);

const App = () => {
  
  useEffect(() => {
    //requestUserPermission()
    ConfigureFirebase()
  }, [])
  const ConfigureFirebase = async() =>{

    // console.log(firebase.apps.length, 'firebase')
     const androidCredentials = {
       apiKey: "AIzaSyD2Vz9LytM7uuvx5zf9HSKwi6-_RY5dNhs",
       authDomain: "trade-adfcf.firebaseapp.com",
       projectId: "trade-adfcf",
       databaseURL:'',
       storageBucket: "trade-adfcf.appspot.com",
       messagingSenderId: "1093260793182",
       appId: "1:1093260793182:android:e6404a5a694bb7e7fb2bcf",
       measurementId: "G-4HJYCX122T"
     };
     
     // Your secondary Firebase project credentials for iOS...
     const iosCredentials = {
       clientId: '1093260793182-lfhsk45esfqbr6cuogds4sqnanp6mda6.apps.googleusercontent.com',
       appId: '1:1093260793182:ios:b3c7b5fce3917424fb2bcf',
       apiKey: 'AIzaSyB7CFCU46JYlTzuiwFJCwT-yxBUQY51x74',
       databaseURL: '',
       storageBucket: 'trade-adfcf.appspot.com',
       messagingSenderId: '1093260793182',
       projectId: '1093260793182',
     };
     
     // Select the relevant credentials
     const credentials = Platform.select({
       android: androidCredentials,
       ios: iosCredentials,
     });
      
      if (!firebase.apps.length) 
      {
     
     firebase.initializeApp(credentials);
        
   }
     
   fcmService.registerAppWithFCM();
   fcmService.register(onRegister, onNotification, onOpenNotification);
   localNotificationService.configure(onOpenNotification);
  
   function onRegister(token) {
     console.log('App onRegister1', token);
     //Alert.alert('FcmToken',token,)
     //Alert.alert('Alert Title', token, [ {text: 'Copy message', onPress: () => CopyAlertMessage(token), style: 'cancel'}, ], { cancelable: true});
     //AsyncStorage.setItem('fcm_token', token);
 
   }
 
   function onNotification(notify) {
     console.log('App onNotification', notify);
     const options = {
       soundName: 'default',
       playSound: true,
     };
     localNotificationService.showNotification(
       0,
       notify.title,
       notify.body,
       notify,
       options,
     );
   }
 
   function onOpenNotification(notify) {
     console.log('App on open notification', notify);
     //alert('Open Notification'+notify.body )
    
   }
 
    //isReadyRef.current = false;
    requestUserPermission()
   }
   const CopyAlertMessage =(val) =>{
    Clipboard.setString(val)
   }
   const requestUserPermission = async() => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      // if (enabled) {
      //   console.log('Authorization status:', authStatus);
      //   const fcmToken = await firebase.messaging().getToken();  
      //   if (fcmToken) {
      //   // user has a device token set it into store
      //   console.warn('fcmiOS', fcmToken)
      //   await AsyncStorage.setItem('fcm_token', fcmToken);;  
      // }
      // else{
      //   NotificationService.error(constant.error, 'Could not get the FCM token');
      // }

        messaging()
          .getToken()
          .then(fcmToken => {
            if (fcmToken) {
              console.warn('fcmiOS tok=====', fcmToken);
              AsyncStorage.setItem('fcm_token', fcmToken)
              
            } else {
              console.warn('have tok=====', 'Not registered');
            }
          })
          .catch(error => {
            console.warn('have tok=====', 'Error occured');
          });
      }
    }
  
  // const requestUserPermission = async ()=> {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  //   if (enabled) {
  //     console.log('Authorization status====>>:', authStatus);
  //     getToken()
  //   }
  // }
   
  // const getToken=async()=> {
  //   // Register the device with FCM
  //   await messaging().registerDeviceForRemoteMessages();
  
  //   // Get the token
  //   const token = await messaging().getToken();
  //   // SetFCMToken(token)
  //   console.log('Firebase fcm token====>>:', token);
  
  //   CallNotification()
  // }
  
  // const CallNotification=()=>{
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //   });
  
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
        
  //       if (remoteMessage) {
  //       }
  //     });
  // }

  // const requestUserPermission = async ()=> {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  //   if (enabled) {
  //     //console.log('Authorization status:', authStatus);
  //     getToken()
  //   }
  // }
   
  // const getToken=async()=> {
  //   // Register the device with FCM
  //   await messaging().registerDeviceForRemoteMessages();
  
  //   // Get the token
  //   const token = await messaging().getToken();
  //   // SetFCMToken(token)
  //   //console.log('Firebase fcm token:', token);
  
  //   CallNotification()
  // }
  
  // const CallNotification=()=>{
    
  //   //console.log('in CallNotification:')
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     //console.log('in open messaging res:',remoteMessage);
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage.notification,
  //     );
  //     // navigation.navigate(remoteMessage.data.type);
  //   });
  
  //   // Check whether an initial notification is available
  //   messaging().getInitialNotification(remoteMessage => {
  //     // .then(remoteMessage => {
        
  //   //console.log('in messaging res:',remoteMessage);
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit state:',
  //           remoteMessage.notification,
  //         );
  //         // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
  //       }
  //     });
  // }
  return (
    <Provider store={store}>
      <NavigationContainer linking={Linking}>
        <Navigator/>
      </NavigationContainer>
    </Provider>
  );
};



export default App;