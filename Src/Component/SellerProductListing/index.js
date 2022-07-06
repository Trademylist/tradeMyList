import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EditIcon from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const axios = require('axios');

const SellerProductListing = (props) => {
    return (
        <View style={styles.Container}>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 5, width: Devicewidth / 2.5, marginBottom: 5, borderRadius: 5, }} onPress={() => props.navigation.navigate('productDetails', { "productId": props.ProductId,"process":props.process })}>
                <Image source={{ uri: props.image == "" ? props.category == "Jobs" ? "https://trademylist.com:8936/jobs.jpg" : props.category == "Services" ? "https://trademylist.com:8936/services.jpg" : null : props.image }} style={{ height: "100%", width: '100%', resizeMode: "contain", alignSelf: 'center' }} />
            </TouchableOpacity>
            
            <View style={{ width: Devicewidth / 2.2, alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 10 }}>
                {
                props.category == "Freebies" ?
                <Text style={{ fontFamily:"Roboto-Bold" , marginTop: 5, color: "#000", fontSize: 14, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>{"Free"}</Text>
                :
                <Text style={{ fontFamily:"Roboto-Bold" , marginTop: 5, color: "#000", fontSize: 14, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>{(props.category != "Jobs" && props.category != "Freebies" && props.category != "Services") && (props.currency == "INR" ? "₹" : "$")} {props.inr}</Text>
                }
            </View>
            <Text style={{ fontFamily:"Roboto-Bold" , marginTop: 10, color: "#000", fontSize: 12, textAlign: 'left', alignSelf: 'center', width: Devicewidth / 2.2, paddingLeft: 10 }}>{props.desc}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        height: Deviceheight / 3.8,
        width: Devicewidth / 2.2,
        alignSelf: 'center',
        marginHorizontal: 1,
        padding: 5,
        justifyContent: 'space-around',
        backgroundColor: '#e6e6e6',
        // elevation: 2,
        borderWidth: 3,
        borderColor: '#d6d4d4',
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 5,
    },
})

export default SellerProductListing;