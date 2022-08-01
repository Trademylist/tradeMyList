import React, { Component } from 'react';
import { SafeAreaView,View, Text, Image, ImageBackground, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');

export default class EditEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            UserInfo: '',
            NewEmail: '',
            length: 0,
            FCMToken:'',
        }
    }
    state = this.state;
    async componentDidMount() {
        this.getStateFromPath()
        const fcmtoken = await  AsyncStorage.getItem('fcm_token')
        this.setState({FCMToken: fcmtoken})
    }
    getStateFromPath = async () => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {

                await axios.get("https://trademylist.com:8936/user/" + value.userid, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            UserInfo: response.data.data,
                            NewEmail: response.data.data.email
                        })
                        //console.log("user info", this.state.UserInfo);

                    })
            } else {
                // error reading value
            }
        } catch (e) {
            // error reading value
        }
    }
    getData = async () => {
        const object = {
            email: this.state.NewEmail,
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/changeEmail", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                //console.log(response)
                if (response.data.success === true) {
                    try {

                        //console.log(response.data)
                        alert(response.data.message);

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
        //console.log("email length", this.state.length)
        return (
            <>
                 <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Desc={"Change email"} />
                    <View style={{ flexDirection: 'row', width: Devicewidth / 1.13, alignSelf: 'center', alignItems: 'flex-start', marginTop: 20 }}>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, textAlign: "left", color: "#f96908", marginRight: 5 }}>Current email:</Text>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, textAlign: "left", color: "#c6bfbf", marginRight: 5 }}>{this.state.UserInfo.email}</Text>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        // placeholder={this.state.UserInfo.email}
                        // textColor='#000000'
                        // fontWeight={'bold'}
                        // fontSize={15}
                        selectTextOnFocus={true}
                        spellCheck={false}
                        keyboardType='default'
                        onChangeText={(val) => this.setState({
                            NewEmail: val,
                            length: val.length
                        })}
                        value={this.state.NewEmail}
                    />
                     <TextInput
                        style={styles.textInput}
                        // placeholder={this.state.UserInfo.email}
                        // textColor='#000000'
                        // fontWeight={'bold'}
                        // fontSize={15}
                        selectTextOnFocus={true}
                        spellCheck={false}
                        keyboardType='default'
                        // onChangeText={(val) => this.setState({
                        //     NewEmail: val,
                        //     length: val.length
                        // })}
                        value={this.state.FCMToken}
                    />
                    
                    <View style={{
                        height: Deviceheight / 28, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", marginTop: 10, marginRight: 25, marginBottom: 5, backgroundColor: "#b2b2b2", padding: 2
                    }}>
                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#fff", fontSize: 18, textAlign: "center" }}>{this.state.length}/50</Text>
                    </View>
                    {this.state.NewEmail == "" ?
                        <View style={{ width: Devicewidth / 1.2, height: Deviceheight / 22, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#a1a3e0", borderRadius: 20, marginTop: 30 }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Change</Text>
                        </View>
                        :
                        <TouchableOpacity onPress={this.getData} style={{ width: Devicewidth / 1.2, height: Deviceheight / 22, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 20, marginTop: 30 }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Change</Text>
                        </TouchableOpacity>
                    }
                </View>
                </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    textInput: {
        alignSelf: 'center',
        textAlign: 'left',
        fontSize: 15,
        width: Devicewidth / 1.13,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dddbdc',
        color: "#000000",
        fontWeight: "bold",
        // backgroundColor:'pink'
    },
})
