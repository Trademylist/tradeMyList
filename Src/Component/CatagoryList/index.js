import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;


const CatagotyList = (props) => {
    return (
        <TouchableOpacity
        // onPress={() => props.navigation.navigate('catproductList',{"category_name":props.name,"process":props.process, "checkFilter": props.checkFilter, 'productList': props.productList})}
        onPress={() => props.onSelectCategory(props.name, props.process)}
        style={styles.Container}>
            <View style={{backgroundColor:"#fff",alignItems:'center',justifyContent:'center',height:45,width:45, borderRadius:Deviceheight/10, overflow: 'hidden', marginTop:2}}>
            <Image source={{uri: props.imagePath+props.image}} style={{height:"100%",width:'100%',resizeMode:"cover"}}/>
            </View>
            <Text style={{marginTop:5,color:"#000",fontSize:12,textAlign:'center',alignSelf:'center',fontWeight:'bold',backgroundColor:'#fff'}}>{props.name}</Text> 
        </TouchableOpacity>
    )  
}  


const styles = StyleSheet.create({
    Container: {
        // borderWidth: 1,
        alignItems: 'center',
       // height: Deviceheight / 9,
      // width: Devicewidth / 6,
       // alignSelf:'center',
        marginHorizontal:1,
        // justifyContent:'space-around',
        paddingRight:10,
        paddingLeft:10,
    
    },
})

export default CatagotyList;
