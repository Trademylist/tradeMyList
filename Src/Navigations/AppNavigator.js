import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashNavigator from './SplashNavigator';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator'
import Loading from '../Screens/Loading/Loading';


const Stack = createStackNavigator();


export default class AppNavigator extends Component {
  constructor(props){
    super(props);
  }
    render() {
      return (
            <Stack.Navigator screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen name="splash" component={SplashNavigator} />
                <Stack.Screen name="auth" component={AuthNavigator} />
                <Stack.Screen name="home" component={HomeNavigator} /> 
              </Stack.Navigator>
        )
    }
}