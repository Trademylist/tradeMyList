import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import MySubscriptionModal from "../../Component/SubscriptionModal"
import MyImageZoomeModal from "../../Component/ImageZoomeModal"
import MyDeleteProductModal from "../../Component/DeleteProductConfermationModal"
const MyProductListing = (props) => {

    // const [SubscriptionModal, SetSubscriptionModal] = useState(false)
    const [ImageZoomeModal, SetImageZoomeModal] = useState(false)
    const [DeleteProductConfermationModal, SetDeleteProductConfermationModal] = useState(false)

    const markedSold = async (prodId) => {
        let URL;
        if (props.process === 'general') {
            URL = 'https://trademylist.com:8936/app_seller/product_sold'
        } else {
            URL = 'https://trademylist.com:8936/app_seller/freebies_sold'
        }
        // //console.log(prodId)
        props.getmarkedSold(prodId, URL, props.process)
    }


    const OpenSubscriptionModal = () => {
        props.onPressOpenSub(props.ProductId, props.process);  
        //console.log("calling sub");
        // SetSubscriptionModal(true)
    }
    // const closeSubscriptionModal = () => {
    //     SetSubscriptionModal(false)
    // }
    const OpenImageZoomeModal = () => {
        SetImageZoomeModal(true)
    }
    const closeImageZoomeModal = () => {
        SetImageZoomeModal(false)
    }

    const pageNavigate = (prodId) => {
        if (props.process === 'general') {
            props.navigation.navigate('listingDetails', { "productId": prodId })
        } else {
            props.navigation.navigate('commerciallistingDetails', { "productId": prodId })
        }
    }
    const DeleteProductModal = () => {
        SetDeleteProductConfermationModal(true)
    }
    const DeleteProduct = () => {
        //console.log("my delete product id", props.ProductId)
        let prodId = props.ProductId
        //console.log("my delete proId", prodId)
        props.DeleteMyProduct( prodId,props.process)
        SetDeleteProductConfermationModal(false)
    }
    const CloseDeleteProductModal = () => {
        SetDeleteProductConfermationModal(false)
    }
    return (
        <View style={styles.Container}>
            {/* <MySubscriptionModal
                modalProps={SubscriptionModal}
                onPressClose={() => closeSubscriptionModal()}
                navigation={props.navigation}
                Product_Id={props.ProductId}
                Process={props.process}
            ></MySubscriptionModal> */}
            <MyImageZoomeModal
                modalProps={ImageZoomeModal}
                onPressClose={() => closeImageZoomeModal()}
                MyImage={ props.image == "" ? props.category == "Jobs" ? "https://trademylist.com:8936/jobs.jpg" : props.category == "Services" ? "https://trademylist.com:8936/services.jpg" : null : props.image}
                navigation={props.navigation}
            ></MyImageZoomeModal>
            <MyDeleteProductModal
                modalProps={DeleteProductConfermationModal}
                onPressClose={() => CloseDeleteProductModal()}
                DeleteProduct={() => DeleteProduct()}
                navigation={props.navigation}
            />
            <TouchableOpacity onPress={() => OpenImageZoomeModal()} style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 5.5, width: Devicewidth / 3, marginBottom: 5, borderRadius: 5, }}
            //  onPress={() => props.navigation.navigate('productDetails', { "productId": props.ProductId })}
            >
                <Image source={{  uri: props.image == "" ? props.category == "Jobs" ? "https://trademylist.com:8936/jobs.jpg" : props.category == "Services" ? "https://trademylist.com:8936/services.jpg" : null : props.image  }} style={{ height: "100%", width: '100%', resizeMode: "contain", alignSelf: 'center' }} />
            </TouchableOpacity>

            <View style={{ width: Devicewidth / 2.2, alignSelf: 'center', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5 }}>
                {
                    props.category == "Freebies" ?
                    <Text style={{ fontFamily:"Roboto-Regular" , marginTop: 5, color: "#000", fontSize: 15, textAlign: 'center', alignSelf: 'center',marginLeft:5}}>{"Free"}</Text>
                    :
                    <Text style={{ fontFamily:"Roboto-Regular" , marginTop: 5, color: "#000", fontSize: 15, textAlign: 'center', alignSelf: 'center',marginLeft:5}}>{(props.category != "Jobs" && props.category != "Freebies" && props.category != "Services") && (props.currencyCode == "INR" ? "₹ " : props.currencyCode == "USD" ? "$ " : `${props.currencyCode} `)} {props.inr}</Text>
                }
                <TouchableOpacity style={{
                    height: Deviceheight / 60,
                    width: Devicewidth / 28, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, backgroundColor: "#9e9e9e"
                }} onPress={() => pageNavigate(props.ProductId)}>
                    <Image source={require("../../Assets/Pencil.png")} style={{ height: "100%", width: "100%", alignSelf: 'center' }}></Image>
                </TouchableOpacity>
            </View>

            <Text style={{ fontFamily:"Roboto-Regular", fontWeight: 'bold' , marginTop: 5, color: "#000", fontSize: 14, textAlign: 'left', alignSelf: 'center', width: Devicewidth / 2.2, paddingLeft: 10, paddingBottom: 7 }}>{props.desc}</Text>

            <TouchableOpacity style={{
                height: Deviceheight / 30,
                width: Devicewidth / 36, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, position: 'absolute', right: 5, top: 5, backgroundColor: "#9e9e9e"
            }} onPress={() => DeleteProductModal()}>
                <Image source={require("../../Assets/dotb.png")} style={{ height: "100%", width: "100%", alignSelf: 'center' }}></Image>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => OpenSubscriptionModal()}
                style={{
                    height: Deviceheight / 25,
                    width: Devicewidth / 2.4, borderRadius: 20, alignItems: "center", justifyContent: "center", alignSelf: "center", backgroundColor: "#ff6700", flexDirection: "row", marginBottom: 3,marginTop:10
                }}>
                <View style={{
                    height: Deviceheight / 70,
                    width: Devicewidth / 40, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 10, backgroundColor: "#9e9e9e"
                }}>
                    <Image source={require("../../Assets/Flash.png")} style={{ height: "100%", width: "100%", alignSelf: 'center' }}></Image>
                </View>
                <Text style={{ fontFamily:"Roboto-Bold" , color: "#fff", fontSize: 13, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>Sell Faster</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                height: Deviceheight / 25,
                width: Devicewidth / 2.4, borderRadius: 20, alignItems: "center", justifyContent: "center", alignSelf: "center", borderColor: "#383ec1", borderWidth: 1, marginTop: 5
            }}
                onPress={() => markedSold(props.ProductId)}
            >
                <Text style={{ fontFamily:"Roboto-Bold" , color: "#383ec1", fontSize: 13, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>Mark as sold</Text>
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
