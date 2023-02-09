import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    ScrollView,
    FlatList,
    StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';
import admob, { MaxAdContentRating, InterstitialAd, AdEventType, RewardedAd, BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
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

//const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';
// const API_KEY = 'AIzaSyCZ9kuVUyhZxeFR3cPnebauMlffVOhoM1Y'
const API_KEY = 'AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4'
export default class CommercialList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category: [],
            categoryImgLink: '',
            locationNow: '',
            ProductList: [],
            category: [],
            categoryImgLink: '',
            likesProduct: [],
            mapVisible: false,
            ProductLoder: true,
            UserId: '',
            page: 1,
            LoadMore: false,
            CountryforProduct: '',
            lat: '',
            lng: ''
        }
    }
    state = this.state;

    async componentDidMount() {
        this.setState({
            ProductLoder : true
        })
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        if (value !== null) {
            this.setState({
                UserId: value.userid
            })
        }
        // //console.log('Commercial Mounted');
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

    }
    HandelReload() {
        this.props.navigation.addListener('focus', async () => {
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
        })
    }
    productLike = async (prodId, URL) => {
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
                        // alert(response.data)
                        this.getAllLikes()
                    })
                    .catch(error => {
                        // //console.log(error.data)
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
                        // //console.log(error.data)
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
                axios.get('https://trademylist.com:8936/app_seller/commercial_likelist', {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        if (response.data.data.product.length > 0) {
                            response.data.data.product.map((prodData, prodIndex) => {
                                likesList.push(prodData._id)
                            })
                            this.setState({
                                likesProduct: likesList
                            })
                        }
                    })
                    .catch(error => {
                        // //console.log(error.data)
                    })
            }

        } catch (e) {
            // error reading value
        }
    }

    getCatList = async () => {
        await axios.get("https://trademylist.com:8936/app_user/category_list/freebies")
            .then(response => {
                // console.warn(response.data.data.category)
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
                    // //console.log(error.response.data);
                    // //console.log(error.response.status);
                    // //console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    // //console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    // //console.log('Error', error.message);
                }
                // //console.log('error data' + error.data)
            })

    }

    locationFinder = async () => {
        const UserLocation = await JSON.parse(await AsyncStorage.getItem('UserLocation'))
        // //console.log("my location object", UserLocation);
        if (UserLocation !== null) {
            const latitude = UserLocation.latitude
            const longitude = UserLocation.longitude
            // //console.log("my location lat", latitude);
            // //console.log("my location lng", longitude);
            this.getcountryLocation(latitude, longitude)
        }
        else {
            Geolocation.getCurrentPosition(
                info => {
                    const { coords } = info
                    const latitude = coords.latitude
                    const longitude = coords.longitude
                    this.getcountryLocation(latitude, longitude)
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

    getcountryLocation = async (latitude, longitude,range) => {
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
                    CountryforProduct: country,
                    lat: latitude,
                    lng: longitude
                })
                this.getlocationProduct(latitude, longitude, country,range)
            })
            .catch(err => {
                // //console.log(err.data)
            })
    }

    getlocationProduct = async (latitude, longitude, country,range) => {
        // this.setState({
        //     ProductLoder: true
        // })
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
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        if (value !== null) {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country,
                "distance":myRange
            }

            //console.log("my req obj",object);
            await axios.post(`https://trademylist.com:8936/app_seller/all_freebies?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                .then(response => {
                    console.log("my reqqqq data", response.data);
                    this.setState({
                        ProductList: response.data.data.product,
                        lat: latitude,
                        lng: longitude,
                        country: country,
                        LoadMore: false,
                        ProductLoder: false
                    })
                })
                .catch(error => {
                    // //console.log(error.data)
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
            await axios.post(`https://trademylist.com:8936/app_user/all_freebies?page=${this.state.page}`, object)
                .then(response => {
                    this.setState({
                        ProductList: response.data.data.product,
                        lat: latitude,
                        lng: longitude,
                        country: country,
                        LoadMore: false,
                        ProductLoder: false
                    })
                })
                .catch(error => {
                    // //console.log(error.data)
                    this.setState({
                        ProductLoder: false,
                    })
                })
        }
    }

    handelMap = () => {
        this.setState({
            mapVisible: true
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
                        "latitude": this.state.lat,
                        "longitude": this.state.lng,
                        "country": this.state.country
                    }
                    await axios.post(`https://trademylist.com:8936/app_seller/all_freebies?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                        .then(response => {
                            this.setState({
                                ProductList: response.data.data.product,
                                // ProductLoder: false,
                            })
                        })
                        .catch(error => {
                            // //console.log(error.data)
                        })
                }
                else {
                    const object = {
                        "latitude": lat,
                        "longitude": lng,
                        "country": country
                    }
                    await axios.post(`https://trademylist.com:8936/app_user/all_freebies?page=${this.state.page}`, object)
                        .then(response => {
                            this.setState({
                                ProductList: response.data.data.product,
                                // ProductLoder: false,
                            })
                        })
                        .catch(error => {
                            // //console.log(error.data)
                        })
                }
            } else {
                const object = {
                    "latitude": lat,
                    "longitude": lng,
                    "country": country,
                    "search_value": val
                }
                // //console.log(object)
                axios.post('https://trademylist.com:8936/app_user/search_freebies', object)
                    .then(response => {
                        this.setState({
                            ProductList: response.data.data.product,
                            // ProductLoder: false,
                        })
                    })
                    .catch(error => {
                        // //console.log(error.data)
                    })
            }
        } catch (e) {

        }

    }
    renderItem(itemprod, index) {
        // //console.log(itemprod)
        if (itemprod[0].type == "banner") {
            return (
                <View key={index} style={{ width: WIDTH - 10, flexDirection: 'row', marginLeft: 10, marginRight: 10, marginBottom: 30, marginTop: 20, height: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                    <BannerAd size={BannerAdSize.SMART_BANNER}
                        unitId={Platform.OS == 'ios' ? 'ca-app-pub-7489460627950788/2002515682' : 'ca-app-pub-3940256099942544/6300978111'}>
                    </BannerAd>
                </View>
            )
        }
        const columns = itemprod.map((item, idx) => {
            return (
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
                    process='commercial'
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
        // this.setState({
        //     ProductLoder: true
        // })
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        if (value !== null) {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country
            }
            await axios.post(`https://trademylist.com:8936/app_seller/all_freebies?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                .then(response => {
                    this.setState({
                        ProductList: [...this.state.ProductList, ...response.data.data.product],
                        lat: latitude,
                        lng: longitude,
                        country: country,
                        LoadMore: false
                        // ProductLoder: false
                    })
                })
                .catch(error => {
                    // //console.log(error.data)
                })
        }
        else {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country
            }
            await axios.post(`https://trademylist.com:8936/app_user/all_freebies?page=${this.state.page}`, object)
                .then(response => {
                    this.setState({
                        ProductList: [...this.state.ProductList, ...response.data.data.product],
                        lat: latitude,
                        lng: longitude,
                        country: country,
                        LoadMore: false
                        // ProductLoder: false
                    })
                })
                .catch(error => {
                    // //console.log(error.data)
                })
        }
    }
    GetReched = () => {
        // //console.log('reached');
        this.setState({
            LoadMore: true,
            page: this.state.page + 1
        }, () => {
            // //console.log("my page log", this.state.page);
            this.getlocationProductForLoadMore(this.state.LatForMap, this.state.LngForMap, this.state.CountryforProduct)
        })
    }
    RenderLoadMore = () => {
        return (
            <>
                {this.state.ProductList.length >= 10 ?
                    this.state.LoadMore == true ?
                        <View style={{ alignSelf: 'center', alignItems: "center", justifyContent: "center", marginRight: 20, }}>
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

    render() {
        console.log('vvv', this.state.ProductList);
        const newData = this.modifyData(this.state.ProductList);
        // //console.log("my commercial List", this.state.ProductList);
        // console.warn(newData)
        return (
            <>
                <View style={styles.Container}>
                    <Header
                        country={this.state.CountryforProduct}
                        locationNow={this.state.locationNow}
                        latitide={this.state.lat}
                        longitude={this.state.lng}
                        navigation={this.props.navigation} getsearchKey={this.ProdSearch} process='freebies'
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
                                    process='commercial'
                                />
                            )}
                            keyExtractor={item => item.id}
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
                            // <ActivityIndicator animating={this.state.loder} color={"#383ebd"} size="large" />
                            <Loading />
                            :
                            this.state.ProductList.length == 0 ?
                                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: Deviceheight / 3 }}>
                                    <Image source={require("../../Assets/no_product.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                </View>
                                :
                                <FlatList
                                    data={newData}
                                    showsVerticalScrollIndicator={false}
                                    onEndReached={() => this.GetReched()}
                                    onEndReachedThreshold={0.005}
                                    ListFooterComponent={this.RenderLoadMore}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                />
                        }
                    </View>
                    <Footer navigation={this.props.navigation} catdata="freebies" />
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
    },
})
