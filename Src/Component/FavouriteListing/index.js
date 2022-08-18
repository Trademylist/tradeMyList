import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;


const FavouriteListing = (props) => {
    
    const getunLike = (prodId) => {
        props.unLike(prodId)
    }
    const handelPress=()=>{
        //console.log("my product id",props.ProductId)
        //console.log("my process",props.process)
        // props.navigation.navigate('productDetails',{"productId":props.ProductId,"process":props.process})
        props.navigation.navigate('productDetails', { "productId": props.ProductId, "process": props.process })
    }
    return (
        <View style={styles.Container}>
            <TouchableOpacity style={{alignItems:'center',justifyContent:'center',height:Deviceheight/5.5,width:Devicewidth/3,marginBottom:5,borderRadius:5,}} onPress={() => handelPress()}>
            <Image source={{uri: props.image}}  style={{height:"100%",width:'100%',resizeMode:"contain",alignSelf:'center'}}/>
            </TouchableOpacity>
            <TouchableOpacity  style={{
          height: Deviceheight / 24,
          width: Devicewidth / 12, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20,borderRadius:360,position:'absolute',right:2,top:2,backgroundColor:'#fff',elevation:5}} onPress={() => getunLike(props.ProductId)}>
          <FontAwesomeIcon name="heart" size={16} style={{ height: "52%", width: "60%",marginLeft:5 }}  color="#fb7700" />
        </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        maxHeight: Deviceheight / 4.8,
        width: Devicewidth / 2.2,
        alignSelf:'center',
        marginHorizontal:1,
        padding:5,
        justifyContent:'space-around',
        backgroundColor: '#e6e6e6',
        elevation:2,
        borderWidth:2,
        borderColor:'#d6d4d4',
        borderRadius:5,
        marginHorizontal:5,
        marginVertical:5
    },
})

export default FavouriteListing;