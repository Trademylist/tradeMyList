import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, FlatList, StyleSheet, Dimensions, TextInput, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import admob, { MaxAdContentRating, InterstitialAd, AdEventType, RewardedAd, BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import { getApicall, postApiCall } from "../../ApiRequest/index";
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request } from "react-native-permissions";
import AsyncStorage from '@react-native-community/async-storage';
import Header from "../../Component/Header"
import Footer from "../../Component/Footer"
import CatagoryList from "../../Component/CatagoryList"
import ProductListing from "../../Component/ProductListing"
import MapModal from '../../Component/MapModal';
import Loading from '../Loading/Loading';
import LoginModal from '../../Component/LoginModal';
const axios = require('axios');
Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");

const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';

export default class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            category: [],
            categoryImgLink: '',
            locationNow: '',
            ProductList: [],
            mapVisible: false,
            lat: '',
            lng: '',
            likesProduct: [],
            ProductLoder: true,
            Reload: '',
            UserId: '',
            LatForMap: '',
            LngForMap: '',
            page: 1,
            LoadMore: false,
            CountryforProduct: '',
            loginModal: false,
            // locationPermissionState:false
        }
        // this.HandelReload = this.HandelReload.bind(this)
    }
    state = this.state;

    // updateFunction = () => {
    // }

    async componentDidMount() {
        this.setState({
            ProductLoder : true
        })
        const value = JSON.parse(await AsyncStorage.getItem('UserData'))
        if (value !== null) {
            this.setState({
                UserId: value.userid
            })
        }
        // {this.state.locationPermissionState==false?
        // this.HandelReloadOnUpdateLocation()
        // :
        this.getCatList()
        this.locationFinder()
        this.getAllLikes()
        admob()
            .setRequestConfiguration({
                // Update all future requests suitable for parental guidance
                maxAdContentRating: MaxAdContentRating.PG,

                // Indicates that you want your content treated as child-directed for purposes of COPPA.
                tagForChildDirectedTreatment: true,

                // Indicates that you want the ad request to be handled in a
                // manner suitable for users under the age of consent.
                tagForUnderAgeOfConsent: true,
            })
            .then(() => {
                // Request config successfully set!
            });
        this.HandelReload()
        // }
    }
    // shouldComponentUpdate(nextState) {
    //     // Rendering the component only if 
    //     // passed props value is changed

    //     if (nextState.ProductList !== this.state.ProductList) {
    //       this.componentDidMount()
    //     } else {
    //     //   return false;
    //     }
    //   }

    componentDidUpdate = async (prevProps, prevState) => {
        const {LatForMap, LngForMap} = prevState;
        const {latitude, longitude} = JSON.parse(await AsyncStorage.getItem('UserLocation'));
        if((latitude != LatForMap) || (longitude != LngForMap) && LatForMap !== "" && LngForMap !== "" && latitude !== "" && longitude !== ""){
            this.getCatList();
            this.locationFinder();
        }
    }

    HandelReload() {
        this.props.navigation.addListener('focus', async () => {
            // this.getCatList()
            this.locationFinder()
            this.getAllLikes()
            admob()
                .setRequestConfiguration({
                    // Update all future requests suitable for parental guidance
                    maxAdContentRating: MaxAdContentRating.PG,

                    // Indicates that you want your content treated as child-directed for purposes of COPPA.
                    tagForChildDirectedTreatment: true,

                    // Indicates that you want the ad request to be handled in a
                    // manner suitable for users under the age of consent.
                    tagForUnderAgeOfConsent: true,
                })
                .then(() => {
                    // Request config successfully set!
                });
        })
    }
    productLike = async (prodId, URL) => {
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
                        this.getAllLikes()
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
                        this.getAllLikes()

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
    getAllLikes = async () => {
        var likesList = [];
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                axios.get('https://trademylist.com:8936/app_seller/likelist', {
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

    handelMap = () => {

        this.setState({
            mapVisible: true
        })
    }

    locationFinder = async () => {
        const UserLocation = await JSON.parse(await AsyncStorage.getItem('UserLocation'))
        // //console.log("my location object", UserLocation);
        if (UserLocation !== null) {
            const latitude = UserLocation.latitude
            const longitude = UserLocation.longitude
            this.getcountryLocation(latitude, longitude)
        }
        else {
            request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                })
            ).then(res => {
                if (res == "granted") {
                    this.HandelReloadForLocationUpdate()
                    Geolocation.getCurrentPosition(
                        info => {
                            const { coords } = info
                            const latitude = coords.latitude
                            const longitude = coords.longitude
                            this.getcountryLocation(latitude, longitude)
                            let LocationObj = {
                                latitude: latitude,
                                longitude: longitude
                            }
                            AsyncStorage.setItem('UserLocation', JSON.stringify(LocationObj))
                        },
                        error => console.log('ssss',error),
                        {
                            enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 
                        }
                    )
                } else {
                    console.log("Location is not enabled");
                }
            });

        }
    }
    HandelReloadForLocationUpdate() {
        //console.log("uplate location reload fnc")
        this.props.navigation.addListener('focus', async () => {
            this.getCatList()
            this.getAllLikes()
            admob()
                .setRequestConfiguration({
                    // Update all future requests suitable for parental guidance
                    maxAdContentRating: MaxAdContentRating.PG,

                    // Indicates that you want your content treated as child-directed for purposes of COPPA.
                    tagForChildDirectedTreatment: true,

                    // Indicates that you want the ad request to be handled in a
                    // manner suitable for users under the age of consent.
                    tagForUnderAgeOfConsent: true,
                })
                .then(() => {
                    // Request config successfully set!
                });
        })
    }
    getcountryLocation = async (latitude, longitude,range) => {
        this.setState({
            LatForMap: latitude,
            LngForMap: longitude
        })
        //console.log('set my lat lng for map', this.state.LatForMap, this.state.LngForMap);
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
                // console.warn("my location name",location)
                // console.//console.log();("my location name log",location)
                this.setState({
                    locationNow: location,
                    CountryforProduct: country,
                })
                this.getlocationProduct(latitude, longitude, country,range)
            })
            .catch(err => {
                //console.log(err.data)
            })
    }
    HandelReloadOnUpdateLocation = async () => {
        console.warn("in reload fnc reloded")
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Example App',
                    'message': 'Example App access to your location '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.warn("calling granted")
                this.setState({
                    locationPermissionState: true
                })
                this.componentDidMount()
                console.warn("You can use the location")
                //   alert("You can use the location");
            } else {
                console.warn("location permission denied")
                //   alert("Location permission denied");
            }
        } catch (err) {
            console.warn(err)
        }

    }


    getlocationProduct = async (latitude, longitude, country,range) => {
        // //console.log("my locationNow requiredddddd", this.state.locationNow);
        
        //console.log("my range requiredddddd", range);
        //console.log("my country requiredddddd", country);
        let myRange = 0
        if(range==null){
            if(country=="United States"){
                myRange=500 * 1609.344
            }
            else{
                myRange=500 * 1000
            }
        }
        else{
            if(country=="United States"){
                myRange=range * 1609.344
            }
            else{
                myRange=range * 1000
            }
        }
        
        
        //console.log("my range noe", myRange);



        // this.setState({
        //     ProductLoder: true
        // })
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))

        if (value !== null) {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country,
                "distance":myRange
            }
            await axios.post(`https://trademylist.com:8936/app_seller/all_product?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                .then(response => {
                    //console.log("my required res", response);
                    //console.log("my logged user id", this.state.UserId);
                    this.setState({
                        ProductList: response.data.data.product,
                        lat: latitude,
                        lng: longitude,
                        country: country,
                        ProductLoder: false,
                    })
                })
                .catch(error => {
                    //console.log(error.data)
                    this.setState({
                        ProductLoder: false,
                    })
                })
        }
        else {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country
            }
            await axios.post(`https://trademylist.com:8936/app_user/all_product?page=${this.state.page}`, object)
                .then(response => {
                    //console.log("my required res", response);
                    //console.log("my logged user id", this.state.UserId);
                    this.setState({
                        ProductList: response.data.data.product,
                        lat: latitude,
                        lng: longitude,
                        country: country,
                        ProductLoder: false,
                    })
                })
                .catch(error => {
                    //console.log(error.data)
                    this.setState({
                        ProductLoder: false,
                    })
                })
        }
    }
    getCatList = async () => {
        await axios.get("https://trademylist.com:8936/app_user/category_list/product")
        .then(response => {
            console.log('cat', response);
            if (response.data.success) {
                this.setState({
                    category: response.data.data.category,
                    categoryImgLink: response.data.data.categoryImageUrl,
                })
            }
        })
        .catch((error) => {
            console.log('category fetch error', error.message);
        })
    }

    closeModal = async () => {
        this.setState({
            mapVisible: false
        })
    }

    getUpdatelocProd = async (lat, lng,range) => {
        this.getcountryLocation(lat, lng,range)
        this.setState({
            mapVisible: false
        })
    }

    ProdSearch = async (val) => {
        // this.setState({
        //     ProductLoder: true
        // })
        try {
            const { lat, lng, country } = this.state
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (val === '') {
                if (value !== null) {
                    const object = {
                        "latitude": lat,
                        "longitude": lng,
                        "country": country
                    }
                    await axios.post(`https://trademylist.com:8936/app_seller/all_product?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                        .then(response => {
                            this.setState({
                                ProductList: response.data.data.product,
                                // ProductLoder: false,
                            })
                        })
                        .catch(error => {
                            //console.log(error.data)
                        })
                }
                else {
                    const object = {
                        "latitude": lat,
                        "longitude": lng,
                        "country": country
                    }
                    await axios.post(`https://trademylist.com:8936/app_user/all_product?page=${this.state.page}`, object)
                        .then(response => {
                            this.setState({
                                ProductList: response.data.data.product,
                                // ProductLoder: false,
                            })
                        })
                        .catch(error => {
                            //console.log(error.data)
                        })
                }
            } else {
                const object = {
                    "latitude": lat,
                    "longitude": lng,
                    "country": country,
                    "search_value": val
                }
                axios.post('https://trademylist.com:8936/app_user/search_product', object)
                    .then(response => {
                        this.setState({
                            ProductList: response.data.data.product,
                            // ProductLoder: false,
                        })
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
            }
        } catch (e) {

        }

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
                    "sortBy": sortBy
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

    renderItem(itemprod, index) {
        //console.log(itemprod)
        if (itemprod[0].type == "banner") {
            return (
                <View key={index} style={{ width: WIDTH - 10, flexDirection: 'row', marginLeft: 10, marginRight: 10, marginBottom: 30, marginTop: 20, height: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                    <BannerAd size={BannerAdSize.SMART_BANNER}
                        unitId={'ca-app-pub-3940256099942544/6300978111'}>
                    </BannerAd>
                </View>
            )
        }
        const columns = itemprod.map((item, idx) => {
            return (
                <ProductListing
                    onPressOpen={this.openLoginModal}
                    inr={item.product_price}
                    image={item.cover_thumb}
                    date={item.createdAt}
                    desc={item.product_name}
                    like={item.Like}
                    currency={item.currencyCode}
                    navigation={this.props.navigation}
                    ProductId={item._id}
                    likesProduct={this.state.likesProduct}
                    process='general'
                    getLike={this.productLike}
                    unLike={this.productUnlike}
                    LoggedUserId={this.state.UserId}
                    ProductUserId={item.user_id}
                    Boost={item.boosted_upto}
                />
            )
        });
        return (
            <View key={index} style={{ width: WIDTH, flexDirection: 'row', marginBottom: 10 }}>
                {columns}
            </View>
        )
    }
    modifyData(data) {
        const numColumns = 2;
        const addBannerIndex = 6;
        const arr = [];
        var tmp = [];
        data.forEach((val, index) => {
            if (index % numColumns == 0 && index != 0) {
                arr.push(tmp);
                tmp = [];
            }
            if (index % addBannerIndex == 0 && index != 0) {
                arr.push([{ type: 'banner' }]);
                tmp = [];
            }
            tmp.push(val);

        });
        arr.push(tmp);
        return arr;
    }
    getlocationProductForLoadMore = async (latitude, longitude, country) => {
        //console.log("my locationNow requiredddddd", this.state.locationNow);
        // this.setState({
        //     ProductLoder: true
        // })
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))

        if (value !== null) {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country,
            }
            await axios.post(`https://trademylist.com:8936/app_seller/all_product?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                .then(response => {
                    //console.log("my required res", response);
                    //console.log("my logged user id", this.state.UserId);
                    this.setState({
                        ProductList: [...this.state.ProductList, ...response.data.data.product],
                        lat: latitude,
                        lng: longitude,
                        country: country,
                        // ProductLoder: false,
                        LoadMore: false
                    })
                })
                .catch(error => {
                    //console.log(error.data)
                })
        }
        else {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country
            }
            await axios.post(`https://trademylist.com:8936/app_user/all_product?page=${this.state.page}`, object)
                .then(response => {
                    //console.log("my logged user id", this.state.UserId);
                    this.setState({
                        ProductList: [...this.state.ProductList, ...response.data.data.product],
                        lat: latitude,
                        lng: longitude,
                        country: country,
                        // ProductLoder: false,
                        LoadMore: false
                    })
                })
                .catch(error => {
                    //console.log(error.data)
                })
        }
    }
    GetReched = () => {
        //console.log('reached');
        this.setState({
            LoadMore: true,
            page: this.state.page + 1
        }, () => {
            //console.log("my page log", this.state.page);
            this.getlocationProductForLoadMore(this.state.LatForMap, this.state.LngForMap, this.state.CountryforProduct)
        })
    }
    RenderLoadMore = () => {
        return (
            <>
                {this.state.ProductList.length >= 10 ?
                    this.state.LoadMore == true ?
                        <View style={{ alignSelf: 'center', alignItems: "center", justifyContent: "center",marginRight:20, }}>
                            <ActivityIndicator color={"#383ebd"} size='small' />
                            <Text style={{ fontFamily:"Roboto-Bold" , alignSelf: "center", textAlign: "center", fontSize: 14, fontWeight: "bold", color: "#ed661c", marginTop: 10 }}>Loading more data...</Text>

                        </View>
                        :
                        null
                    :
                    null
                }
            </>
        )
    }

    closeloginModal = () => {
        this.setState({
            loginModal: false
        })
    }

    openLoginModal = () => {
        this.setState({
            loginModal: true
        })
    }

    redcLogin = () => {
        this.setState({
            loginModal: false
        })
        this.props.navigation.push('auth');
    }

    render() {
        const newData = this.modifyData(this.state.ProductList);
        return (
            <>
                <View style={styles.Container}>
                    <Header
                        country={this.state.CountryforProduct}
                        locationNow={this.state.locationNow}
                        latitide={this.state.LatForMap}
                        longitude={this.state.LngForMap}
                        navigation={this.props.navigation} getsearchKey={this.ProdSearch} process='product' getDataFilter={this.checkFilter}
                    />
                    <LoginModal
                        modalProps={this.state.loginModal}
                        onPressClose={this.closeloginModal}
                        getlogin={this.redcLogin}
                        navigation={this.props.navigation}
                    ></LoginModal>
                    <MapModal
                        modalProps={this.state.mapVisible}
                        onPressClose={() => this.closeModal()}
                        updateLocation={this.getUpdatelocProd}
                        InitialLat={this.state.LatForMap}
                        InitialLng={this.state.LngForMap}
                        navigation={this.props.navigation}
                    ></MapModal>
                    {/* {this.state.CatagoryLoder == true ?
                        <ActivityIndicator animating={this.state.loder} color={"#383ebd"} size="large" />
                        : */}
                    <View style={styles.FlatlistContainer}>
                        <FlatList
                            data={this.state.category}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <CatagoryList
                                    name={item.category_name}
                                    image={item.category_image}
                                    imagePath={this.state.categoryImgLink}
                                    navigation={this.props.navigation}
                                    color='#42f59e'
                                    process='general'
                                />
                            )}
                            keyExtractor={item => item._id}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', width: Devicewidth, alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10, paddingLeft: 20 }}>
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontWeight: 'bold', fontSize: 16, textAlign: 'left', width: Devicewidth / 1.4 }}>{this.state.locationNow}</Text>
                        <View style={{ width: Devicewidth / 6, alignItems: "center", flexDirection: 'row', }}>
                            <TouchableOpacity onPress={() => this.handelMap()}><Text style={{ fontFamily:"Roboto-Bold" , color: '#ed661c', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }}>Edit</Text></TouchableOpacity>
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
                            <Loading />
                            :
                            this.state.ProductList.length == 0 ?
                                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: Deviceheight / 3 }}>
                                    <Image source={require("../../Assets/no_product.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                </View>
                                :
                                <>

                                    <FlatList
                                        keyExtractor={(item, index) => index.toString()}
                                        data={newData}
                                        showsVerticalScrollIndicator={false}
                                        onEndReached={() => this.GetReched()}
                                        onEndReachedThreshold={0.005}
                                        ListFooterComponent={this.RenderLoadMore}
                                        renderItem={({ item, index }) => this.renderItem(item, index)}

                                    />
                                    {/* <View  style={{width: WIDTH-20, flexDirection: 'row', marginLeft: 10, marginRight:10, marginBottom: 10, height: 60, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center'}}>
                            <BannerAd size={BannerAdSize.SMART_BANNER}
                                      unitId={'ca-app-pub-3940256099942544/6300978111'}>
                            </BannerAd>
                          </View> */}
                                </>

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
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginBottom: 20
    },
})