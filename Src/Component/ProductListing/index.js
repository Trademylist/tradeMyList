import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, Alert, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EditIcon from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
import MySubscriptionModal from "../SubscriptionModal"
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const axios = require('axios');
import { useFocusEffect } from '@react-navigation/native';

const ProductListing = (props) => {
    const [likesProduct, SetLikesProduct] = useState([])
    // const [SubscriptionModal, SetSubscriptionModal] = useState(false)
    useEffect(() => {
        //console.log("my required id's", props.LoggedUserId, props.ProductUserId)
    }, [props.process])

    // useFocusEffect(
    //     React.useCallback(() => {
    //         const backAction = () => {
    //             Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //                 {
    //                 text: "Cancel",
    //                 onPress: () => null,
    //                 style: "cancel"
    //                 },
    //                 { text: "YES", onPress: () => BackHandler.exitApp() }
    //             ]);
    //             return true;
    //             };
            
    //         const backHandler = BackHandler.addEventListener(
    //             "hardwareBackPress",
    //             backAction
    //         );
    //     }, [])
    // );

    const AddFavProduct = async (Prodid) => {
        try {
            const value = await AsyncStorage.getItem('UserData');
            console.log('hellooo',Prodid);
            if (value !== null) {
                let URL;
                if (props.process === 'general') {
                    URL = 'https://trademylist.com:8936/app_seller/likes'
                } else {
                    URL = 'https://trademylist.com:8936/app_seller/commercial_likes'
                }
                props.getLike(Prodid, URL)
            } else {
                props.onPressOpen();
            }
        } catch (e) {
            //console.log(e.data)
        }

    }

    const RemoveFavProduct = async (ProdId) => {
        try {
            const value = await AsyncStorage.getItem('UserData');
            
            if (value !== null) {
                let URL;
                if (props.process === 'general') {
                    URL = 'https://trademylist.com:8936/app_seller/dislikes'
                } else {
                    URL = 'https://trademylist.com:8936/app_seller/commercial_dislikes'
                }
                props.unLike(ProdId, URL)
            } else {
                props.onPressOpen();
            }
        } catch (e) {
            //console.log(e.data)
        }
    }

    const getDate = (date) => {
        const event = new Date();
        const isoStringTime = event.toISOString()
        const UploadedTime = date;
        const start = new Date(UploadedTime).getTime();
        const end = new Date(isoStringTime).getTime();
        const milliseconds = Math.abs(end - start).toString()
        const seconds = parseInt(milliseconds / 1000);
        const minutes = parseInt(seconds / 60);
        const hours = parseInt(minutes / 60);
        const days = parseInt(hours / 24);
        const mnth = parseInt(days / 30);
        // const time = days + ":" + hours % 24 + ":" + minutes % 60 + ":" + seconds % 60;
        ////console.log(time)
        let time;
        if (days > 0) {
            time = days + " days"
        } else if (hours > 0) {
            time = hours + " hours"
        } else if (mnth > 0) {
            time = mnth + " Month"
        } else {
            time = minutes + " Minutes"
        }
        return (
            time
        )
    }
    const OpenSubscriptionModal = () => {
        props.onPressOpenSub(props.ProductId, props.process);      
    }
    //console.log(props.image != "");
    return (
        <TouchableOpacity onPress={() => props.navigation.navigate('productDetails', { "productId": props.ProductId, "process": props.process })} style={styles.Container}>
            {/* <MySubscriptionModal
                modalProps={SubscriptionModal}
                onPressClose={() => closeSubscriptionModal()}
                navigation={props.navigation}
                Product_Id={props.ProductId}
                Process={props.process}
            ></MySubscriptionModal> */}
            <View style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 5, width: Devicewidth / 2.5, marginBottom: 5, borderRadius: 5, }}>
                <Image source={{ uri: props.image == "" ? props.category == "Jobs" ? "https://trademylist.com:8936/jobs.jpg" : props.category == "Services" ? "https://trademylist.com:8936/services.jpg" : null : props.image }} style={{ height: Deviceheight/5, width: Devicewidth/2.5, resizeMode:'contain',  alignSelf: 'center' }} />
            </View>
            {props.likesProduct != null ?
                props.LoggedUserId == props.ProductUserId ?
                props.Boost==0?
                    <TouchableOpacity onPress={() => OpenSubscriptionModal()} style={{
                        height: Deviceheight / 10,
                        width: Devicewidth / 5, alignItems: "center", justifyContent: "center", alignSelf: "center",position: 'absolute', right: -2, top: -2,
                    }}>
                        <Image source={require("../../Assets/sell_faster.png")} style={{ height: "100%", width: '100%', resizeMode: "contain", alignSelf: 'center' }} />
                    </TouchableOpacity>
                    :
                    null
                    :
                    <TouchableOpacity style={{
                        height: Deviceheight / 30,
                        width: Devicewidth / 15, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, position: 'absolute', right: 2, top: 2, backgroundColor: '#fff', elevation: 5
                    }}
                        onPress={() => props.likesProduct.indexOf(props.ProductId) !== -1 ? RemoveFavProduct(props.ProductId) : AddFavProduct(props.ProductId)}>
                         

                        {
                            props.likesProduct.indexOf(props.ProductId) !== -1 ?

                                <FontAwesomeIcon name="heart" size={13} color="#fb7700" />
                                : <FontAwesomeIcon name="heart" size={13} color="#ccc" />
                        }
                    </TouchableOpacity>
                :
                null
            }
            <View style={{ width: '100%', paddingTop:10, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap',}}>
                {
                    props.category == "Freebies" ?
                    <Text style={{ fontFamily:"Roboto-Bold" , color: "#333", fontSize: 12, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', marginRight: 10 }}>{"Free"}</Text>
                    :
                    <Text style={{ fontFamily:"Roboto-Bold" , color: "#333", fontSize: 12, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', marginRight: 10 }}>{(props.category != "Jobs" && props.category != "Freebies" && props.category != "Services") && (props.currency == "INR" ? "₹ " : props.currency == "USD" ? "$ " : `${props.currency} `)} {(props.category != "Jobs" && props.category != "Freebies" && props.category != "Services") && props.inr}</Text>
                }
                {/* {
                    props.inr &&
                    
                } */}
                <Text style={{ fontFamily:"Roboto-Bold" , color: "#333", fontSize: 12, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', }}>{getDate(props.date)} ago </Text>
            </View>
            <Text style={{ fontFamily:"Roboto-Bold", marginTop: 8, color: "#333", fontSize: 12, textAlign: 'left', alignSelf: 'center', width: Devicewidth / 2.2, paddingLeft: 13,}}>{props.desc}</Text>
            
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        // height: Deviceheight / 3.8,
        maxHeight:Deviceheight / 3.4,
        width: Devicewidth / 2.2,
        alignSelf: 'center',
        padding: 10,
        justifyContent: 'space-around',
        backgroundColor: '#ededed',
        // elevation: 2,
        borderWidth: 1,
        borderColor: '#dedede',
        borderRadius: 5,
        marginHorizontal: 5,
    },
})

export default ProductListing;
