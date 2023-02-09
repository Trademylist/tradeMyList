import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    TextInput,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LoginModal from '../LoginModal';
const axios = require('axios');
import {connect} from 'react-redux';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Modal from "../SellModal"
import {useRoute} from '@react-navigation/native';



const Footer = (props) => {
    const Deviceheight = Dimensions.get('window').height;
    const [SellModal, SetSellModal] = useState(false)
    const [loginModal, SetLoginModal] = useState(false)
    const { navigation } = props
    const [category, SetCategory] = useState([])
    const [categoryImgLink, SetCategoryImgLink] = useState('')

    const route = useRoute();
    console.log(route.name);

    const closeModal = () => {
        SetSellModal(false)
    }

    const handelSell = async () => {
        const value = await AsyncStorage.getItem('UserData');
        if (value !== null) {
            SetSellModal(true)
        }
        else {
            SetLoginModal(true)
        }
    }

    useEffect(() => {
        getcategory(props.catdata)
    }, [props.catdata])

    const getcategory = async (data) => {
        await axios.get("https://trademylist.com:8936/app_user/category_list/" + data)
            .then(response => {
                SetCategory(response.data.data.category)
                SetCategoryImgLink(response.data.data.categoryImageUrl)
            })
            .catch(error => {
                //console.log(error.data)
            })
    }
    const getcheckList = async () => {
        try {
            const value = await AsyncStorage.getItem('UserData');
            if (value !== null) {
                navigation.navigate('myListing', { "process": '' })
            } else {
                SetSellModal(false)
                SetLoginModal(true)
            }
        } catch (e) {
            //console.log(e.data)
        }
    }
    const getchatter = async () => {
        try {
            const value = await AsyncStorage.getItem('UserData');
            if (value !== null) {
                navigation.navigate('chatter')
            } else {
                SetSellModal(false)
                SetLoginModal(true)
            }
        } catch (e) {
            //console.log(e.data)
        }
    }
    const getchecklog = async () => {
        if (SellModal) {
            SetSellModal(false)
        }
        SetLoginModal(true)
        const value = await AsyncStorage.getItem('UserData');
        try {
            if (value !== null) {
                setTimeout(() => {
                    navigation.navigate('productList');
                }, 2000)
            } else {
                SetLoginModal(true)
            }

        } catch (e) {
            // error reading value
        }
    }

    const closeloginModal = () => {
        SetLoginModal(false)
    }

    const redcLogin = () => {
        SetLoginModal(false)
        navigation.push('auth');
    }

    return (
        <SafeAreaView style={styles.Container}>
            <StatusBar backgroundColor="#000000" />
            <Modal
                modalProps={SellModal}
                onPressClose={() => closeModal()}
                categoryData={category}
                CatImgLink={categoryImgLink}
                ProdType={props.catdata}
                getFooter={getchecklog}
                navigation={props.navigation}
            ></Modal>

            <LoginModal
                modalProps={loginModal}
                onPressClose={closeloginModal}
                getlogin={redcLogin}
                navigation={props.navigation}
            ></LoginModal>

            <View style={styles.HeadrIconContainer}>
                <TouchableOpacity onPress={() => props.pageName == "productList" ? props.onShowAllProducts() : navigation.push('productList')}>
                {
                    route.name=='productList' ?
                     <View >
                        <View style={{
                        height: Deviceheight / 36,
                        width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center",
                        }}>
                            <Image source={require("../../Assets/homeselected.png")} style={{ height: "80%", width: "100%", }}></Image>
                        </View>
                        <Text style={{
                             fontSize: 12, color: "#eea631", fontWeight: 'bold', textAlign: "center", alignSelf: "center", marginBottom: 5
                        }}>Product</Text>
                     </View>
                    :
                    <View>
                        <View style={{
                        height: Deviceheight / 36,
                        width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center",
                        }}>
                            <Image source={require("../../Assets/HomeIcon.png")} style={{ height: "60%", width: "80%", }}></Image>
                        </View>
                        <Text style={{
                            fontSize: 12, color: "#464646", textAlign: "center", alignSelf: "center", marginBottom: 5
                        }}>Product</Text>
                    </View>
                }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.pageName == "commercialList" ? props.onShowAllProducts() : navigation.push('commercialList')}>
                {
                    route.name=='commercialList' ?
                    <View>
                        <View style={{
                            height: Deviceheight / 32,
                            width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center",
                        }}>
                            <Image source={require("../../Assets/tag.png")} style={{ height: "80%", width: "100%",  }}></Image>
                        </View>
                        <Text style={{
                            fontSize: 12, color: "#eea631", fontWeight: 'bold', textAlign: "center", alignSelf: "center", paddingBottom: 5
                        }}>Commercial</Text>
                    </View>
                    :
                    <View>
                        <View style={{
                            height: Deviceheight / 32,
                            width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center",
                        }}>
                            <Image source={require("../../Assets/Commercial.png")} style={{ height: "60%", width: "80%", }}></Image>
                        </View>
                        <Text style={{
                            fontSize: 12, color: "#464646", textAlign: "center", alignSelf: "center", paddingBottom: 5
                        }}>Commercial</Text>
                    </View>
                } 
                </TouchableOpacity>
                <View style={{ backgroundColor: '#fff', elevation: 2, borderRadius: 360, height: Deviceheight / 13, width: Devicewidth / 6.5, alignItems: 'center', justifyContent: 'center', top: -20, left:-2 }}>
                    <TouchableOpacity onPress={() => handelSell()} style={{ backgroundColor: '#ff6700', borderRadius: 360, height: 60, width: 60, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{
                          height: Deviceheight / 50, width: Devicewidth / 30, alignItems: "center", justifyContent: "center", alignSelf: "center",
                        }}>
                            <Image source={require("../../Assets/Camera.png")} style={{ height: "65%", width: "100%", }}></Image>
                        </View>
                        <Text style={{
                            fontSize: 12, color: "#ffffff", textAlign: "center", alignSelf: "center",
                        }}>Sell</Text>
                    </TouchableOpacity>
                </View>  
                <TouchableOpacity
                    onPress={() => getchatter()}
                    style={{
                        // borderWidth: 1
                    }}
                >
                    {
                    route.name=='chatter' ?
                    <View>
                    <View style={{
                        height: Deviceheight / 36,
                        width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center",
                    }}>
                    <Image source={require("../../Assets/chat.png")} style={{ height: "80%", width: "60%", }}></Image>
                    {
                    props.chatCounter > 0 &&
                    <View style={{
                        borderRadius: 10,
                        height: 10,
                        width: 10,
                        right: 1, top:-5,
                        position: 'absolute',
                        backgroundColor: 'red'
                    }}>
                    </View>
                    }

                    </View>
                    <Text style={{
                        fontSize: 12, color: "#eea631", fontWeight: 'bold', textAlign: "center", alignSelf: "center"
                    }}>Chatter</Text>
                    </View>
                    :
                    <View>
                    <View style={{
                        height: Deviceheight / 36,
                        width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center",
                    }}>
                        <Image source={require("../../Assets/Chatter.png")} style={{ height: "80%", width: "60%", }}></Image>
                        {
                        props.chatCounter > 0 &&
                        <View style={{
                            borderRadius: 10,
                            height: 10,
                            width: 10,
                            right: 1, top:-5,
                            position: 'absolute',
                            backgroundColor: 'red'
                        }}>

                        </View>
                    }

                    </View>
                    <Text style={{
                        fontSize: 12, color: "#555555", textAlign: "center", alignSelf: "center"
                    }}>Chatter</Text>
                    </View>
                    }


                </TouchableOpacity>
                <TouchableOpacity onPress={() => getcheckList()}>
                {
                    route.name=='myListing' ?
                    <View>
                    <View style={{
                        height: Deviceheight / 32,
                        width: Devicewidth / 20, alignItems: "center", justifyContent: "center", alignSelf: "center",
                    }}>
                        <Image source={require("../../Assets/pixels.png")} style={{ height: "50%", width: "70%", }}></Image>
                    </View>
                    <Text style={{
                        fontSize: 12, color: "#eea631", fontWeight: 'bold', textAlign: "center", alignSelf: "center", marginBottom: 5
                    }}>My Listing</Text>
                    </View>
                    :
                    <View>
                    <View style={{
                        height: Deviceheight / 32,
                        width: Devicewidth / 20, alignItems: "center", justifyContent: "center", alignSelf: "center",
                    }}>
                        <Image source={require("../../Assets/Listing.png")} style={{ height: "50%", width: "70%", }}></Image>
                    </View>
                    <Text style={{
                        fontSize: 12, color: "#464646", textAlign: "center", alignSelf: "center", marginBottom: 5
                    }}>My Listing</Text>
                    </View>
                }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    Container: {
        alignSelf: 'center',
        justifyContent: "center",
        width: Devicewidth,
        height: Deviceheight / 13,
        backgroundColor: "#fff",
        borderTopColor: '#f1f1f1',
        borderTopWidth: 1,
        elevation: 10,
    },
    HeadrIconContainer: {
        width: Devicewidth,
        height: Deviceheight / 13,
        justifyContent: 'space-around',
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: '#fff',
        borderTopColor: '#f1f1f1',
        borderTopWidth: 1,
    },
})

const mapDispatchToProps = dispatch => {
    return {
        onStoreCategoryList: (data) => dispatch({type: 'STORE_CATEGORY_LIST', payload: data})
    }
}

const mapStateToProps = state => {
    return {
        chatCounter: state.chatCounter
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Footer);
