import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;


const NotificationListing = (props) => {

    return (
        <View style={styles.Container}>
            <View style={{width:Devicewidth/1.5,alignItems:'flex-start',alignSelf:"flex-start",paddingHorizontal:5,}}>
            <Text style={{marginTop:5,color:"#000",fontSize:16,textAlign:'left',alignSelf:'flex-start',fontWeight:'bold',}}>{props.name}</Text>
            <Text style={{marginTop:2,color:"#9e9e9e",fontSize:12,textAlign:'left',alignSelf:'flex-start',fontWeight:'bold',}}>{props.desc}</Text>
            </View>
            <TouchableOpacity  style={{
          height: Deviceheight / 42,width: Devicewidth / 24, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20,position:'absolute',right:20,top:10,backgroundColor:'green'
        }} onPress={() => props.notifyseen(props.notifiyId)}>
          <Image source={require("../../Assets/Delete.png")} style={{ height: "100%", width: "100%" }}></Image>
        </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    Container: {
        alignItems: 'flex-start',
        // height: Deviceheight / 12,
        paddingVertical:10,
        width: Devicewidth/1.02 ,
        alignSelf:'flex-end',
        padding:5,
        flexDirection:'row',
        backgroundColor: '#ffffff',
        borderBottomWidth:1,
        borderBottomColor:'#e6e6e6',
    },
})

export default NotificationListing;
