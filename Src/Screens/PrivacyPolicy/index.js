import React, { Component } from 'react';
import {SafeAreaView, View, Text, Image, ImageBackground, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
import { WebView } from 'react-native-webview';
const axios = require('axios');

export default class PrivacyPolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            MyData:''
        }
    }
    state = this.state;
    async componentDidMount() {
        this.getData()
    }
     getData=async()=>{
        const { email, password } = this.state;
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
		await axios.get("https://trademylist.com:8936/get_cms/Privacy Policy")
			.then(response => {
                //console.log(response)
				if (response.data.success === true) {
					try {

                //console.log(response.data)
                       this.setState({
                        MyData:response.data.data[0]
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
                <Header navigation={this.props.navigation} Desc={"Privacy Policy"} />

                    
                        {/* <TouchableOpacity
                         onPress={() => this.props.navigation.navigate('submitRequest',{OptionChoose:''})} 
                         style={{ width: Devicewidth / 1.06, height: Deviceheight / 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 20, marginTop: 25 }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontSize: 14, textAlign: 'center' }}>WRITE TO US</Text>
                        </TouchableOpacity> */}
                         
                        <WebView style={{margin:20,}} source={{ uri: 'https://www.trademylist.com/privacy' }} />
                         
                         
                        
                        
                         

 
                </View>

                </SafeAreaView>
            </>
            
            // <SafeAreaView style={{ flex: 1 }}>
            //     <View style={styles.Container}>
            //         <Header navigation={this.props.navigation} Desc={"Privacy Policy"} />
            //         <WebView style={{margin:20,}} source={{ uri: 'https://www.trademylist.com/privacy' }} />
            //         {/* <ScrollView showsVerticalScrollIndicator={false} >
            //         {/* <Text style={{color:"#818181",fontSize:16,textAlign:'left',alignSelf:'center',marginTop:10,paddingHorizontal:5}}>{this.state.MyData.page_desc}</Text> */}
            //         {/* </ScrollView>  */}
            //     </View>
            //     </SafeAreaView>
            
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
})