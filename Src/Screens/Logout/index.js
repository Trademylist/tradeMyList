import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';


const logout =(props)=>{
    AsyncStorage.removeItem("UserData").then(()=>{
      props.navigation.push("login")
    })
 }

 export default logout; 