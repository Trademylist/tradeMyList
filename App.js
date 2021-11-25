import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Src/Navigations/AppNavigator';
import messaging from '@react-native-firebase/messaging';
import Linking from './Src/Linking'
import AsyncStorage from '@react-native-community/async-storage';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from './Src/store/reducer';

const store = createStore(reducer);

const App = () => {
  
  useEffect(() => {
    requestUserPermission()
  }, [])

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

  const requestUserPermission = async ()=> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      //console.log('Authorization status:', authStatus);
      getToken()
    }
  }
   
  const getToken=async()=> {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();
  
    // Get the token
    const token = await messaging().getToken();
    // SetFCMToken(token)
    //console.log('Firebase fcm token:', token);
  
    CallNotification()
  }
  
  const CallNotification=()=>{
    
    //console.log('in CallNotification:')
    messaging().onNotificationOpenedApp(remoteMessage => {
      //console.log('in open messaging res:',remoteMessage);
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });
  
    // Check whether an initial notification is available
    messaging().getInitialNotification(remoteMessage => {
      // .then(remoteMessage => {
        
    //console.log('in messaging res:',remoteMessage);
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }
  return (
    <Provider store={store}>
      <NavigationContainer linking={Linking}>
        <Navigator/>
      </NavigationContainer>
    </Provider>
  );
};



export default App;