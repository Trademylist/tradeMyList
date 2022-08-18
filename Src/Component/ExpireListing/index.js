import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import MyReactiveProductModal from "../../Component/ReacrivateProductModal"


const MyProductListing = (props) => {

    const [ReactiveProductModal, SetReactiveProductModal] = useState(false)

    const OpenReactiveProductModal = () => {
        SetReactiveProductModal(true)
    }
    const closeReactiveProductModal = () => {
        SetReactiveProductModal(false)
    }
    return (
        <View style={styles.Container}>
            <MyReactiveProductModal
                modalProps={ReactiveProductModal}
                onPressClose={() => closeReactiveProductModal()}
                navigation={props.navigation}
                ProductId={props.ProductId}
                reactiveProduct={(ProductId)=>props.prodReactive(ProductId)}
            ></MyReactiveProductModal>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 5.5, width: Devicewidth / 3, marginBottom: 5, borderRadius: 5, }} 

            // onPress={() => props.navigation.navigate('productDetails', { "productId": props.ProductId })}
           
           >
                <Image source={{  uri: props.image == "" ? props.category == "Jobs" ? "https://trademylist.com:8936/jobs.jpg" : props.category == "Services" ? "https://trademylist.com:8936/services.jpg" : null : props.image  }} style={{ height: "100%", width: '100%', resizeMode: "contain", alignSelf: 'center' }} />
            </TouchableOpacity>

            <View style={{ width: Devicewidth / 2.2, alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5 }}>
                <Text style={{ fontFamily:"Roboto-Regular" , marginTop: 5, color: "#000", fontSize: 14, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold',marginLeft:5 }}>{(props.category != "Jobs" && props.category != "Freebies") ? props.currencyCode == "INR" ? "₹" : props.currencyCode == "USD" ? "$" : `${props.currencyCode}` : null}{props.inr}</Text>
                {/* <TouchableOpacity style={{
                    height: Deviceheight / 60,
                    width: Devicewidth / 28, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, backgroundColor: "#9e9e9e"
                }}>
                    <Image source={require("../../Assets/Pencil.png")} style={{ height: "100%", width: 
                    "100%", alignSelf: 'center' }}></Image>
                </TouchableOpacity> */}
            </View>

            <Text style={{ fontFamily:"Roboto-Regular", fontWeight: 'bold' , marginTop: 5, color: "#000", fontSize: 12, textAlign: 'left', alignSelf: 'center', width: Devicewidth / 2.2, paddingLeft: 10, paddingBottom: 7, }}>{props.desc}</Text>

            {/* <TouchableOpacity style={{
                height: Deviceheight / 30,
                width: Devicewidth / 36, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, position: 'absolute', right: 5, top: 5, backgroundColor: "#9e9e9e"
            }}>
                <Image source={require("../../Assets/dotb.png")} style={{ height: "100%", width: "100%", alignSelf: 'center' }}></Image>
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={{
                height: Deviceheight / 30,
                width: Devicewidth / 3, borderRadius: 20, alignItems: "center", justifyContent: "center", alignSelf: "center", backgroundColor: "#ff6700", flexDirection: "row"
            }}
                onPress={() => deleteProduct(props.ProductId)}
            >
                <Text style={{ fontFamily:"Roboto-Bold" , color: "#fff", fontSize: 13, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>Delete Listing</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={{
                height: Deviceheight / 25,
                width: Devicewidth / 2.4,marginTop:5, borderRadius: 20, alignItems: "center", justifyContent: "center", alignSelf: "center", borderColor: "#383ec1", borderWidth: 1
            }}
                // onPress = {() => reactivateProd(props.ProductId)}
                onPress={() => OpenReactiveProductModal()}
            >
                <Text style={{ fontFamily:"Roboto-Bold" , color: "#383ec1", fontSize: 13, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>Reactivate</Text>
            </TouchableOpacity>

        </View>
    )
}


const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        maxHeight: Deviceheight / 2.5,
        width: Devicewidth / 2.2,
        alignSelf: 'center',
        marginHorizontal: 1,
        padding: 5,
        justifyContent: 'space-around',
        backgroundColor: '#e6e6e6',
        elevation: 2,
        borderWidth: 2,
        borderColor: '#d6d4d4',
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 5
    },
})

export default MyProductListing;
