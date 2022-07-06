import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, ScrollView, FlatList, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import { getApicall, postApiCall } from "../../ApiRequest/index";
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import Header from "../../Component/Header"
import Footer from "../../Component/Footer"
import CatagoryList from "../../Component/CatagoryList"
import ProductListing from "../../Component/ProductListing"
import MapModal from '../../Component/MapModal';
import Loading from '../Loading/Loading';


const axios = require('axios');
Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");
const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';

export default class CatProductList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ProductLoder: true,
            category: [],
            categoryImgLink: '',
            locationNow: '',
            country: '',
            latitude: '',
            longitude: '',
            ProductList: [],
            likesProduct: [],
            mapVisible: false
        }
    }
    state = this.state;
    async componentDidMount() {
        this.setState({
            ProductLoder: true
        })
        const categoryname = this.props.route.params.category_name;
        const process = this.props.route.params.process;
        let URL;
        let LikesUrl;
        if (process === 'general') {
            URL = 'https://trademylist.com:8936/app_user/category_list/product'
            LikesUrl = 'https://trademylist.com:8936/app_seller/likelist'
        } else {
            URL = 'https://trademylist.com:8936/app_user/category_list/freebies'
            LikesUrl = 'https://trademylist.com:8936/app_seller/commercial_likelist'
        }
        this.getCatList(URL)
        this.locationFinder(this.props.route.params.category_name)
        this.getAllLikes(LikesUrl)
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.route.params.category_name !== this.props.route.params.category_name) {
            this.locationFinder(this.props.route.params.category_name)
        }
    }

    getAllLikes = async (LikesUrl) => {
        var likesList = [];
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                axios.get(LikesUrl, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        if (response.data.data.product.length > 0) {
                            response.data.data.product.map((prodData, prodIndex) => {
                                likesList.push(prodData._id) 
                            })
                        }
                        this.setState({
                            likesProduct: likesList
                        })
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
            }

        } catch (e) {
            // error reading value
        }
    }
    productLike = async (prodId, URL) => {
        let LikesUrl;
        const process = this.props.route.params.process;
        if (process === 'general') {
            LikesUrl = 'https://trademylist.com:8936/app_seller/likelist'
        } else {
            LikesUrl = 'https://trademylist.com:8936/app_seller/commercial_likelist'
        }
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                const object = {
                    "product_id": prodId,
                }
                // console.warn(object)
                axios.post(URL, object, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.getAllLikes(LikesUrl)
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
            } else {
                // alert('login Modal')
            }

        } catch (e) {
            // error reading value
        }
    }

    productUnlike = async (prodId, URL) => {
        let LikesUrl;
        const process = this.props.route.params.process;
        if (process === 'general') {
            LikesUrl = 'https://trademylist.com:8936/app_seller/likelist'
        } else {
            LikesUrl = 'https://trademylist.com:8936/app_seller/commercial_likelist'
        }
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))

            if (value !== null) {
                const object = {
                    "product_id": prodId,
                }
                axios.post(URL, object, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        // console.warn(response.data)
                        this.getAllLikes(LikesUrl)

                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
            } else {
                // alert('login Modal')
            }

        } catch (e) {
            // error reading value
        }
    }

    locationFinder = async(catName) => {
        const UserLocation = await JSON.parse(await AsyncStorage.getItem('UserLocation'))
        //console.log("my location object", UserLocation);
        if (UserLocation !== null) {
            const latitude = UserLocation.latitude
            const longitude = UserLocation.longitude
            //console.log("my location lat", latitude);
            //console.log("my location lng", longitude);
            this.getcountryLocation(latitude, longitude, catName)
        }
        else {
            Geolocation.getCurrentPosition(
                info => {
                    const { coords } = info
                    const latitude = coords.latitude
                    const longitude = coords.longitude
                    this.getcountryLocation(latitude, longitude, catName)
                },
                error => console.log(error),
                {
                    enableHighAccuracy: false,
                    timeout: 2000,
                    maximumAge: 3600000
                }
            )
        }
    }

    getcountryLocation = async (latitude, longitude, catName) => {
        axios
            .request({
                method: 'post',
                url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
            })
            .then(response => {
                const totallength = response.data.results.length;
                const getcontrylist = totallength - 2
                var country = response.data.results[getcontrylist].formatted_address;
                var location = response.data.results[0].address_components[2].long_name;
                this.setState({
                    locationNow: location,
                    country: country,
                    latitude: latitude,
                    longitude: longitude
                })
                this.getlocationProduct(latitude, longitude, country, catName)
            })
            .catch(err => {
                //console.log(err.data)
            })
    }
    getlocationProduct = async (latitude, longitude, country, catName) => {
        const object = {
            "category": catName,
            "country": country
        }
        // console.warn(object)
        await axios.post("https://trademylist.com:8936/app_user/productByCategory", object)
            .then(response => {
                this.setState({
                    ProductList: response.data.data.product,
                    ProductLoder: false
                })
            })
            .catch(error => {
                this.setState({
                    ProductLoder: false
                })
                //console.log(error.data)
            })

    }
    getCatList = async (URL) => {
        await axios.get(URL)
            .then(response => {
                //console.log(response.data)
                if (response.data.success) {
                    this.setState({
                        category: response.data.data.category,
                        categoryImgLink: response.data.data.categoryImageUrl
                    })
                }
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    //console.log(error.response.data);
                    //console.log(error.response.status);
                    //console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    //console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    //console.log('Error', error.message);
                }
                //console.log('error data' + error.data)
            })

    }

    handelMap = () => {
        this.setState({
            mapVisible: true
        })
    }

    checkFilter = async (distance, sortBy, lat, lng, selectedProdCategory, fromInr, toInr) => {
        this.setState({
            ProductLoder: true
        })
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))

            if (value !== null) {
                const object = {
                    "latitude": lat,
                    "longitude": lng,
                    "category": selectedProdCategory,
                    "distance": distance,
                    "no_of_day": 30,
                    "price": [{ "lower": fromInr, "upper": toInr }],
                    "sortby": sortBy
                }
                //console.log(value.token)
                await axios.post('https://trademylist.com:8936/app_seller/filter', object, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            ProductList: response.data.data.product,
                            ProductLoder: false,
                        })
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
            }
        }
        catch (e) {
            // error reading value
        }

    }

    render() {
        return (
            <>
                <View style={styles.Container}>
                    <Header
                        country={this.state.country}
                        locationNow={this.state.locationNow}
                        latitude={this.state.latitude}
                        longitude={this.state.longitude}
                        categoryName={this.props.route.params.category_name} navigation={this.props.navigation}
                        getDataFilter={this.checkFilter}
                    />
                    <MapModal
                        modalProps={this.state.mapVisible}
                        onPressClose={() => this.closeModal()}
                        updateLocation={this.getUpdatelocProd}
                        navigation={this.props.navigation}
                    ></MapModal>
                    <View style={styles.FlatlistContainer}>
                        <FlatList
                            data={this.state.category}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <CatagoryList
                                    name={item.category_name}
                                    image={item.category_image}
                                    imagePath={this.state.categoryImgLink}
                                    navigation={this.props.navigation}
                                    color='#42f59e'
                                    process={this.props.route.params.process}
                                />
                            )}
                            keyExtractor={item => item._id}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', width: Devicewidth, alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10, paddingLeft: 20 }}>
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontWeight: 'bold', fontSize: 16, textAlign: 'left', }}>{this.state.locationNow}</Text>
                        <View style={{ width: Devicewidth / 6, alignItems: "center", flexDirection: 'row', }}>
                            {/* <TouchableOpacity onPress={() => this.handelMap()}> */}
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#ed661c', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }}>Edit</Text>
                            {/* </TouchableOpacity> */}
                            <View style={{
                                height: Deviceheight / 30,
                                width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 5
                            }}>
                                <Image source={require("../../Assets/BackIcon.png")} style={{ height: "40%", width: "60%" }}></Image>
                            </View>
                        </View>
                    </View>
                    <View style={styles.FlatlistContainer1}>
                        {this.state.ProductLoder == true ?
                            // <ActivityIndicator animating={this.state.loading} color={"#383ebd"} size="large" />
                            <View style={{
                                width: '100%',
                                height: '100%'
                            }}>
                                <Loading />
                            </View>
                            :
                            this.state.ProductList.length == 0 ?
                                <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: Deviceheight / 3 }}>
                                    <Image source={require("../../Assets/no_product.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                </View>
                                :
                                <FlatList
                                    data={this.state.ProductList}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    renderItem={({ item }) => (
                                        <ProductListing
                                            inr={item.product_price}
                                            image={item.cover_thumb}
                                            date={item.createdAt}
                                            desc={item.product_name}
                                            like={item.Like}
                                            currency={item.currencyCode}
                                            navigation={this.props.navigation}
                                            ProductId={item._id}
                                            likesProduct={this.state.likesProduct}
                                            process={this.props.route.params.process}
                                            getLike={this.productLike}
                                            unLike={this.productUnlike}
                                        />
                                    )}
                                    keyExtractor={item => item.id}
                                />
                            }
                        </View>
                    <Footer navigation={this.props.navigation} catdata="product" />
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    FlatlistContainer: {
        padding: 5,
        width: Devicewidth,
        alignItems: 'center',
        justifyContent: 'center',
    },
    FlatlistContainer1: {
        padding: 5,
        width: Devicewidth,
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
    },
})