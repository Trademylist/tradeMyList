import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');

export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            NewPass:'',
            CurrentPass:'',
            ConfNewPass:""
        }
    }
    state = this.state;

     getData=async()=>{
        const object ={
            current_password:this.state.CurrentPass,
            password:this.state.NewPass,
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        //console.log("value",value);
        
		await axios.post("https://trademylist.com:8936/app_seller/change_password",object,{headers: {
            'x-access-token': value.token,
        }
        })
			.then(response => {
                //console.log(response)
				if (response.data.success === true) {
					try {

                //console.log(response.data)
                       alert("Passowrd Change Successfully")
                        
					} catch (e) {
						// saving error

                    }
            }
			})
			.catch(error => {
				//console.log(error.data)
            })
    }
    render() {
        return (
            <View style={styles.Container}>
                <Header navigation={this.props.navigation} Desc={"Change password"} />
                <TextInput
                    style={styles.textInput}
                    placeholder='Current password'
                    textColor='#808080'
                    fontSize={15}
                    selectTextOnFocus={true}
                    spellCheck={false}
                    keyboardType='default' 
                    onChangeText={(val) => this.setState({
                        CurrentPass: val
                    })}
                    value={this.state.CurrentPass}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='New password'
                    textColor='#808080'
                    fontSize={15}
                    selectTextOnFocus={true}
                    spellCheck={false}
                    keyboardType='default' 
                    onChangeText={(val) => this.setState({
                        NewPass: val
                    })}
                    value={this.state.NewPass}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='Confirm new password'
                    textColor='#808080'
                    fontSize={15}
                    selectTextOnFocus={true}
                    spellCheck={false}
                    keyboardType='default'
                    onChangeText={(val) => this.setState({
                        ConfNewPass: val
                    })}
                    value={this.state.ConfNewPass}
                />
                 {this.state.CurrentPass == "" || this.state.NewPass=='' || this.state.ConfNewPass==""?
                <View style={{ width: Devicewidth / 1.2, height: Deviceheight / 22, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#a1a3e0", borderRadius: 20, marginTop: 15 }}>
                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Change</Text>
                </View>
                :
                <TouchableOpacity onPress={this.getData} style={{ width: Devicewidth / 1.2, height: Deviceheight / 22, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 20, marginTop: 15 }}>
                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Change</Text>
                </TouchableOpacity>
    }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    textInput: {
        marginLeft: 15,
        textAlign: 'left',
        fontSize: 15,
        height: Deviceheight / 20,
        width: Devicewidth / 1.13,
        marginTop: 5
    },
})