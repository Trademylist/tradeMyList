import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../Screens/Splash';


const Stack = createStackNavigator();


export default class SplashNavigator extends Component {
    render() {
        return (
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="spalsh" component={Splash} initialRouteName="spalsh" />
            </Stack.Navigator>


        )
    }
}