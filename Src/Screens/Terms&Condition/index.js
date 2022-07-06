import React, { Component } from 'react';
import {SafeAreaView, View, Text, Image, ImageBackground, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');

export default class TermsCondition extends Component {
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
		await axios.get("https://trademylist.com:8936/get_cms/Terms & Condition")
			.then(response => {
                console.log('errorA',response)
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
                    <Header navigation={this.props.navigation} Desc={"Terms & Condition"} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{color:"#818181",fontSize:16,textAlign:'left',alignSelf:'center',marginTop:10,paddingHorizontal:5}}>{this.state.MyData.page_desc}</Text>
                    </ScrollView>
                </View>
                </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        paddingBottom:10,
        paddingLeft:10,
        paddingRight:10
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: "#000",
        fontWeight: "bold",
    },
})