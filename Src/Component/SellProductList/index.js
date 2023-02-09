import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;


const SellProductList = (props) => {
   const getAdd = async () => {
        props.getNotify()
    }

    return (
        <TouchableOpacity onPress={() =>props.handelProduct(props.name)} style={{backgroundColor:'#ffffff',width:Devicewidth/3.5,alignItems:'center',justifyContent:'center',}}>
        <View style={styles.Container}>
            <View style={{backgroundColor:"#fff",alignItems:'center',justifyContent:'center',height:60,width:60,borderRadius:360,marginTop:0}} onPress={getAdd}>
            <Image source={{uri: props.imagePath+props.image}} style={{height:"100%",width:'100%',borderRadius:360}}/>
            </View>
            <Text style={{marginTop:0,color:"#000",fontSize:10,textAlign:'center',alignSelf:'center',fontWeight:'bold', paddingTop:10, paddingBottom:10}}>{props.name}</Text>
        </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
      //  height: Deviceheight / 10,
       // width: Devicewidth / 6,
        alignSelf:'center',
        marginHorizontal:1,
        justifyContent:'space-around',
        backgroundColor: '#fff',
    },
})

export default SellProductList;
