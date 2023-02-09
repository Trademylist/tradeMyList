import React, { Component } from 'react';
import {SafeAreaView, View, Text, Image, ScrollView, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
export default class Help extends Component {
    constructor(props) {
        super(props)
        this.state = {
            MyData: '',
            PressSigning: false,
            PressTipsForBuySell: false,
            PressEditingMyProfile: false,
            PressNotificationSettings: false,
            PressShareProductLink: false,
            PressMyListing: false,
            PressSellerTools: false,
            PressBuyingFeature: false,
            PressPaymentTransaction: false,
            PressChatting: false,
            PressRattingsReview: false,
        }
    }
    state = this.state;
    async componentDidMount() {
        this.getData()
    }
    getData = async () => {
        const { email, password } = this.state;
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        await axios.get("https://trademylist.com:8936/get_cms/Help")
            .then(response => {
                //console.log(response)
                if (response.data.success === true) {
                    try {

                        // //console.log("help data",response.data)
                        this.setState({
                            MyData: response.data.data[0]
                        })

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
            <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Desc={"Help"} />

                    
                        <TouchableOpacity
                         onPress={() => this.props.navigation.navigate('submitRequest',{OptionChoose:''})} 
                         style={{ width: Devicewidth / 1.06, height: Deviceheight / 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 20, marginTop: 25 }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontSize: 14, textAlign: 'center' }}>WRITE TO US</Text>
                        </TouchableOpacity>
                         
                        <WebView style={{margin:20,}} source={{ uri: 'http://trademylist.com/mob_help.html' }} />
                         
                         
                        
                        
                         

 
                </View>

                </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingLeft: 10,
        paddingRight: 10
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: "#000",
        fontWeight: "bold",
    },
    SingleOptionMainContainer: {
        width: Devicewidth / 1.06,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: 'center',
        elevation: 3,
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingTop: 10,
        marginTop: 10,
        paddingBottom: 20
    },
    OptionContainer: {
        width: Devicewidth / 1.2,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: 'space-between',
        flexDirection: "row"
    },
    OptionName: {
        fontSize: 20,
        // fontWeight: "bold",
        fontFamily:"Roboto-Regular",
        textAlign: "left",
        color: "#000"
    },
    OptionDescription: {
        color: "#818181",
        fontSize: 16,
        textAlign: 'left',
        alignSelf: 'center',
        marginTop: 10,
        width: Devicewidth / 1.2,
    },
})