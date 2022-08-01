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
import {connect} from 'react-redux';

const axios = require('axios');

Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");
//const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';
const API_KEY = 'AIzaSyCZ9kuVUyhZxeFR3cPnebauMlffVOhoM1Y'

class CatProductList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ProductLoder: false,
            categorySelected: null,
            category: [],
            categoryImgLink: '',
            locationNow: '',
            country: '',
            latitude: '',
            longitude: '',
            allProducts:[],
            ProductList: [],
            likesProduct: [],
            mapVisible: false,
        }
    }
    state = this.state;

    async componentDidMount() {
        // this.setState({
        //     ProductLoder: true
        // })
        const process = this.props.route.params.process;
        //console.log('process', process);
        let URL;
        let LikesUrl;
        if (process === 'general') {
            URL = 'https://trademylist.com:8936/app_user/category_list/product'
            LikesUrl = 'https://trademylist.com:8936/app_seller/likelist'
        } else {
            URL = 'https://trademylist.com:8936/app_user/category_list/freebies'
            LikesUrl = 'https://trademylist.com:8936/app_seller/commercial_likelist'
        }
        this.setState({
            allProducts: this.props.route.params.productList
        }, () => {
            this.getFilteredProducts(this.props.route.params.category_name);
        })
        // this.getAllLikes(LikesUrl)
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.route.params.category_name !== this.props.route.params.category_name) {
            this.getFilteredProducts(this.props.route.params.category_name)
        }
    }

    getFilteredProducts = (cat_name) => {
        //console.log('pro', this.state.allProducts);
        if(this.state.allProducts.length > 0){
            const array = this.state.allProducts.filter(prod => prod.category == cat_name);
            this.setState({
                ProductList : array
            })
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

    getlocationProduct = async (catName) => {
        const {latitude, longitude, country} = this.props.savedLocation;
        const object = {
            "category": catName,
            "country": country,
            'latitude': latitude,
            'longitude':  longitude
        }
        // console.warn(object)
        axios.post(this.props.route.params.process === 'general' ? "https://trademylist.com:8936/app_user/productByCategory" : 
        "https://trademylist.com:8936/app_user/freebiesByCategory", object)
            .then(response => {
                console.log('res', response);
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
    
    handelMap = () => {
        this.setState({
            mapVisible: true
        })
    }

    checkFilter = async (distance, sortBy, lat, lng, selectedProdCategory, fromInr, toInr) => {
        this.props.route.params.checkFilter(distance, sortBy, lat, lng, selectedProdCategory, fromInr, toInr);
        this.props.navigation.pop();
        // this.props.
        // this.setState({
        //     ProductLoder: true
        // })
        // try {
        //     const value = JSON.parse(await AsyncStorage.getItem('UserData'))

        //     if (value !== null) {
        //         const object = {
        //             "latitude": lat,
        //             "longitude": lng,
        //             "category": selectedProdCategory,
        //             "distance": distance,
        //             "no_of_day": 30,
        //             "price": [{ "lower": fromInr, "upper": toInr }],
        //             "sortby": sortBy
        //         }
        //         //console.log(value.token)
        //         axios.post('https://trademylist.com:8936/app_seller/filter', object, {
        //             headers: {
        //                 'x-access-token': value.token,
        //             }
        //         })
        //             .then(response => {
        //                 this.setState({
        //                     ProductList: response.data.data.product,
        //                     ProductLoder: false,
        //                 })
        //             })
        //             .catch(error => {
        //                 //console.log(error.data)
        //             })
        //     }
        // }
        // catch (e) {
        //     // error reading value
        // }
    }

    closeModal = async () => {
        this.setState({
            mapVisible: false
        })
    }

    getUpdatelocProd = async () => {
        this.setState({
            mapVisible: false
        })
        this.props.navigation.pop();
    }

    render() {
        const {savedLocation, categoryImageBaseUrl, categoryList, commercialCategoryList, commercialCategoryImageBaseUrl} = this.props;
        return (
            <>
                <View style={styles.Container}>
                    <Header
                        categoryName={this.props.route.params.category_name}
                        navigation={this.props.navigation}
                        getDataFilter={this.checkFilter}
                        process={this.props.route.params.process}
                    />
                    <MapModal
                        modalProps={this.state.mapVisible}
                        onPressClose={() => this.closeModal()}
                        updateLocation={this.getUpdatelocProd}
                        navigation={this.props.navigation}
                    ></MapModal>
                    <View style={styles.FlatlistContainer}>
                        <FlatList
                            data={this.props.route.params.process == "general" ? categoryList : commercialCategoryList}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <CatagoryList
                                    productList={this.state.allProducts}
                                    name={item.category_name}
                                    image={item.category_image}
                                    imagePath={this.props.route.params.process == "general" ? categoryImageBaseUrl : commercialCategoryImageBaseUrl}
                                    navigation={this.props.navigation}
                                    color='#42f59e'
                                    process={this.props.route.params.process}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', width: Devicewidth, alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10, paddingLeft: 20 }}>
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontWeight: 'bold', fontSize: 16, textAlign: 'left', }}>{savedLocation.address}</Text>
                        <TouchableOpacity onPress={() => this.handelMap()} style={{ width: Devicewidth / 6, alignItems: "center", flexDirection: 'row', }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#ed661c', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }}>Edit</Text>
                            <View style={{
                                height: Deviceheight / 30,
                                width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 5
                            }}>
                                <Image source={require("../../Assets/BackIcon.png")} style={{ height: "40%", width: "60%" }}></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.FlatlistContainer1}>
                        {this.state.ProductLoder == true ?
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
                                    keyExtractor={(item, index) => index.toString()}
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
        height: '13%',
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

const mapStateToProps = state => {
    return {
        savedLocation: state.savedLocation,
        commercialCategoryList : state.commercialCategoryList,
        commercialCategoryImageBaseUrl : state.commercialCategoryImageBaseUrl,
        categoryList : state.categoryList,
        categoryImageBaseUrl : state.categoryImageBaseUrl
    }
}

export default connect(mapStateToProps, null)(CatProductList)