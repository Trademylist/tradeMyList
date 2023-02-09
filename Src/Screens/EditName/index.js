import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
const axios = require('axios');

export default class EditName extends Component {
    constructor(props) {
        super(props)
        this.state = {
            UserInfo: '',
            NewName: '',
        }
    }
    state = this.state;
    componentDidMount() {
        this.getStateFromPath()
    }

    getStateFromPath = async () => {
        //console.log("in fnc")
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
                            UserInfo: response.data.data
                        })

                    })
            } else {
                // error reading value
            }
        } catch (e) {
            // error reading value
        }
    }
    getData = async () => {
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        const object = {
            username: this.state.NewName,
        }
        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {

                this.getStateFromPath()
                // alert("Name Updated Successfully")
                this.props.navigation.navigate("menu")

            })
            .catch(error => {
                //console.log(error.data)
            })
    }
    render() {
        return (
            <>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Desc={"Change name"} />
                    <View style={styles.textInputContainer}>
                        <Icon name='user-alt' style={{ fontSize: 20, alignSelf: "center" }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={this.state.UserInfo.username}
                            textColor='#000'
                            fontWeight={'bold'}
                            fontSize={15}
                            selectTextOnFocus={true}
                            spellCheck={false}
                            keyboardType='default'
                            onChangeText={(val) => this.setState({
                                NewName: val
                            })}
                            value={this.state.NewName}
                        />
                    </View>
                    {this.state.NewName == "" ?
                        <TouchableOpacity style={{ width: Devicewidth / 1.2, height: Deviceheight / 22, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#a1a3e0", borderRadius: 20, marginTop: 30 }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Save</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={this.getData} style={{ width: Devicewidth / 1.2, height: Deviceheight / 22, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 20, marginTop: 30 }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Save</Text>
                        </TouchableOpacity>
                    }
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    textInputContainer: {
        flexDirection: "row",
        alignSelf: 'center',
        justifyContent: "space-around",
        height: Deviceheight / 20,
        width: Devicewidth / 1.13,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dddbdc',
        // backgroundColor:'green'
    },
    textInput: {
        color: "#000",
        alignSelf: 'center',
        textAlign: 'left',
        fontSize: 15,
        height: Deviceheight / 20,
        width: Devicewidth / 1.3,
        // backgroundColor:'pink'
    },
})