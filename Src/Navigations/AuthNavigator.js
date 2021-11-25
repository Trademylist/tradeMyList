import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../Screens/Login';
import Registration from '../Screens/Registration';
import ForgotPass from '../Screens/ForgotPassword';

const Stack = createStackNavigator();


export default class AuthNavigator extends Component {  

    render() {
        return (
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen
                // options={{headerTitle: '', headerShown: true, headerTintColor: '#fff', headerStyle: {backgroundColor: '#151515'}}}
                name="login" component={Login} initialRouteName="login"/>
                <Stack.Screen name="registration" component={Registration} />
                <Stack.Screen name="forgotpass" component={ForgotPass} />
            </Stack.Navigator>
        );
    }
}