import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, FlatList, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, BackHandler, PermissionsAndroid, Platform } from 'react-native';
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
import {connect} from 'react-redux';
import MySubscriptionModal from "../../Component/SubscriptionModal"
import FilterContainer from '../../Component/FilterCOntainer'
import FilterModal from '../../Component/FilterModal';
import FilterCOntainer from '../../Component/FilterCOntainer';


Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");

const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            category: [],
            categoryImgLink: '',
            locationNow: '',
            ProductList: [],
            mapVisible: false,
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
            filterApplied: false,
            showSubModal: false,
            selectedProdId: null,
            selectedProdProcess: null,
            selectedCategoryName: null,
            
            //filetr values
            filterValue: '',
            selectedCategory: '',
            selectedCategoryImage: ''
        }
    }
    state = this.state;

    // backAction = () => {
    //     console.log('bbac', this.props.nav);
    //     // this.props.route.getState()
    //     // Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //     //   {
    //     //     text: "Cancel",
    //     //     onPress: () => null,
    //     //     style: "cancel"
    //     //   },
    //     //   { text: "YES", onPress: () => BackHandler.exitApp() }
    //     // ]);
    //     // return true;
    // };

    async componentDidMount() {
        // console.log('bbac', this.props);
        // this.backHandler = BackHandler.addEventListener(
        //     "hardwareBackPress",
        //     this.backAction
        // );
        this.setState({
            ProductLoder : true
        })
        admob()
        .setRequestConfiguration({
            maxAdContentRating: MaxAdContentRating.PG,
            tagForChildDirectedTreatment: true,
            tagForUnderAgeOfConsent: true,
        })
        .then(() => {
        });
        const value = JSON.parse(await AsyncStorage.getItem('UserData'));
        if (value !== null) {
            this.setState({
                UserId: value.userid
            })
        }
        this.getCatList()      
        this.getlocationProduct()
        this.getAllLikes();
        this.HandelReload();
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        // this.backHandler.remove();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.savedLocation.latitude && this.props.savedLocation.latitude &&
            ((this.props.savedLocation.latitude != prevProps.savedLocation.latitude) || (this.props.savedLocation.longitude != prevProps.savedLocation.longitude) || (this.props.sliderDistance != prevProps.sliderDistance))){
                this.setState({
                    page: 1,
                    filterApplied: false
                }, () => {
                    this.getlocationProduct();
                })
            }
    }

    HandelReload() {
        this.props.navigation.addListener('focus', async () => {
            this.getAllLikes();
            this.setState({
                page: 1
            })
            admob()
            .setRequestConfiguration({
                maxAdContentRating: MaxAdContentRating.PG,
                tagForChildDirectedTreatment: true,
                tagForUnderAgeOfConsent: true,
            })
            .then(() => {
            });
            this.getlocationProduct();
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
                        // console.warn('like ',response.data)
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
                         //console.warn('unlike ',response.data)
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


    getlocationProduct = async () => {
        this.setState({
            LoadMore: false
        })
        const {latitude, longitude, country} = this.props.savedLocation;
        let myRange = 0
        if(!this.props.sliderDistance){
            if(country=="United States"){
                myRange=500 * 1609.344
            }
            else{
                myRange=500 * 1000
            }
        }
        else{
            if(country=="United States"){
                myRange=500 * 1609.344
            }
            else{
                myRange=500 * 1000
            }
        }
        
        const value = JSON.parse(await AsyncStorage.getItem('UserData'))

        //for filtering views
        this.state.filterValue = await JSON.parse(await AsyncStorage.getItem('setFilter'));
        this.state.selectedCategory = await JSON.parse(await AsyncStorage.getItem('selectedCategory'));
        this.state.selectedCategoryImage = await JSON.parse(await AsyncStorage.getItem('selectedCategorymage'));
        

        if (value !== null) {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country,
                "distance":myRange,
                "category": this.state.selectedCategoryName
            }
            axios.post(`https://trademylist.com:8936/app_seller/all_product?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                .then(response => {
                    //console.log('ss1', response);
                    this.setState({
                        ProductList: response.data.data.product,
                        country: country,
                        ProductLoder: false,
                    })
                    window.scrollTo(0, 0);
                })
                .catch(error => {
                    this.setState({
                        ProductLoder: false,
                    })
                })
        }
        else {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country,
                "distance":myRange,
                "category": this.state.selectedCategoryName
            }
            axios.post(`https://trademylist.com:8936/app_user/all_product?page=${this.state.page}`, object)
            .then(response => {
                //console.log('ss', response);
                this.setState({
                    ProductList: response.data.data.product,
                    country: country,
                    ProductLoder: false,
                })
            })
            .catch(error => {
                this.setState({
                    ProductLoder: false,
                })
            })
        }
    }

    getCatList = async () => {
        try {
            const response = await axios.get("https://trademylist.com:8936/app_user/category_list/product");
            if(response.data.success){
                const obj = {
                    categories : response.data.data.category,
                    imagePath : response.data.data.categoryImageUrl
                }
                this.props.onStoreCategoryList(obj);
            } else {
                console.log('category fetch error', error.message);
            }
        } catch (error) {
            console.log('category fetch error', error.message);
        }
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
    }

    ProdSearch = async (val) => {
        try {
            const { latitude, longitude, country } = this.props.savedLocation;
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (val === '') {
                if (value !== null) {
                    const object = {
                        "latitude": latitude,
                        "longitude": longitude,
                        "country": country
                    }
                    axios.post(`https://trademylist.com:8936/app_seller/all_product?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                    .then(response => {
                        this.setState({
                            ProductList: response.data.data.product,
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
                    axios.post(`https://trademylist.com:8936/app_user/all_product?page=${this.state.page}`, object)
                    .then(response => {
                        this.setState({
                            ProductList: response.data.data.product,
                        })
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
                }
            } else {
                const object = {
                    "latitude": latitude,
                    "longitude": longitude,
                    "country": country,
                    "search_value": val
                }
                axios.post('https://trademylist.com:8936/app_user/search_product', object)
                    .then(response => {
                        this.setState({
                            ProductList: response.data.data.product,
                        })
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
            }
        } catch (e) {
            //console.log(e.data)
        }

    }

    checkFilter = async (distance, sortBy, lat, lng, selectedProdCategory, fromInr, toInr, country, obj) => {
        try {
            this.setState({
                ProductLoder: true,
                filterApplied: true,
            }, async () => {
                const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
                if (value !== null) {
                    let object = {
                        "latitude": lat,
                        "longitude": lng,
                        "category": selectedProdCategory,
                        "distance": distance,
                        // "no_of_day": 30,
                        "price": [{ "lower": fromInr, "upper": toInr }],
                        "sortBy": sortBy
                    }
                    if(obj){
                        object = {...object, ...obj}
                    }
                    axios.post('https://trademylist.com:8936/app_seller/filter', object, {
                        headers: {
                            'x-access-token': value.token,
                        }
                    })
                    .then(response => {
                        //console.log('asdda', response);
                        this.setState({
                            ProductList: response.data.data.product,
                            ProductLoder: false,
                        })
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
                } else {
                    let object = {
                        "latitude": lat,
                        "longitude": lng,
                        "category": selectedProdCategory,
                        "distance": distance,
                        // "no_of_day": 30,
                        "price": [{ "lower": fromInr, "upper": toInr }],
                        "sortBy": sortBy
                    }
                    if(obj){
                        object = {...object, ...obj}
                    }
                    axios.post('https://trademylist.com:8936/app_user/filter', object)
                    .then(response => {
                        // console.log('asdda wt', JSON.parse(response.config.data));
                        //console.log('ss', response);
                        this.setState({
                            ProductList: response.data.data.product,
                            ProductLoder: false,
                        })
                    })
                    .catch(error => {
                        //console.log(error.response)
                    })
                }
            })
        }
        catch (e) {
            // error reading value
        }

    }

    renderItem(itemprod, index) {
        
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
                    key={idx}
                    category={item.category}
                    onPressOpenSub={this.onOpenSubModal}
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

    getlocationProductForLoadMore = async () => {
        let myRange = 0
        if(!this.props.sliderDistance){
            if(this.props.savedLocation.country=="United States"){
                myRange=500 * 1609.344
            }
            else{
                myRange=500 * 1000
            }
        }
        else{
            if(this.props.savedLocation.country=="United States"){
                myRange=500 * 1609.344
            }
            else{
                myRange=500 * 1000
            }
        }
        const value = JSON.parse(await AsyncStorage.getItem('UserData'))
        const { latitude, longitude, country } = this.props.savedLocation;
        if (value !== null) {
            const object = {
                "latitude": latitude,
                "longitude": longitude,
                "country": country,
                "distance":myRange,
                "category": this.state.selectedCategoryName
            }
            axios.post(`https://trademylist.com:8936/app_seller/all_product?page=${this.state.page}`, object, { headers: { 'x-access-token': value.token } })
                .then(response => {
                    this.setState({
                        ProductList: [...this.state.ProductList, ...response.data.data.product],
                        country: country,
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
                "country": country,
                "distance":myRange,
                "category": this.state.selectedCategoryName
            }
            axios.post(`https://trademylist.com:8936/app_user/all_product?page=${this.state.page}`, object)
                .then(response => {
                    this.setState({
                        ProductList: [...this.state.ProductList, ...response.data.data.product],
                        country: country,
                        LoadMore: false
                    })
                })
                .catch(error => {
                    //console.log(error.data)
                })
        }
    }

    GetReched = () => {
        if(!this.state.filterApplied){
            this.setState({
                LoadMore: true,
                page: this.state.page + 1
            }, () => {
                this.getlocationProductForLoadMore()
            })
        }
    }
    RenderLoadMore = () => {
        return (
            <>
                {this.state.ProductList.length >= 10 ?
                    this.state.LoadMore == true ?
                        <View style={{ alignSelf: 'center', alignItems: "center", justifyContent: "center",marginRight:20, }}>
                            <ActivityIndicator color={"#383ebd"} size='small' />
                            <Text style={{ fontFamily:"Roboto-Bold" , fontFamily:"Roboto-Bold", alignSelf: "center", textAlign: "center", fontSize: 14, fontWeight: "bold", color: "#ed661c", marginTop: 10 }}>Loading more data...</Text>

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

    onOpenSubModal = (prod_id, process) => {
        //console.log("calling sub", prod_id, process);
        this.setState({
            showSubModal: true,
            selectedProdId: prod_id,
            selectedProdProcess: process
        })
    }

    onCloseModal = () => {
        this.setState({
            showSubModal: false,
            selectedProdId: null,
            selectedProdProcess: null
        })
    }

    onSelectCategoryHandler = (category, process) => {
        this.setState({
            selectedCategoryName : category,
            page: 1
        }, () => {
            this.getlocationProduct()
        })
    }

    onShowAllProductsHandler = () => {
        
        this.setState({
            selectedCategoryName : null,
            page: 1
        }, () => {
            this.getlocationProduct()
        })
    }

    render() {
        const newData = this.modifyData(this.state.ProductList); 
        const {savedLocation, categoryList, categoryImageBaseUrl} = this.props;

       
        return (
            <>
                <View style={styles.Container}>
                {
                    this.state.showSubModal &&
                    <MySubscriptionModal
                        modalProps={this.state.showSubModal}
                        onPressCloseSub={() => this.onCloseModal()}
                        Product_Id={this.state.selectedProdId}
                        Process={this.state.selectedProdProcess}
                    ></MySubscriptionModal>
                }
                    <Header
                        categoryName={this.state.selectedCategoryName}
                        navigation={this.props.navigation}
                        getsearchKey={this.ProdSearch}
                        process='product'
                        getDataFilter={this.checkFilter}
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
                    ></MapModal>

                    {/* FOR THE FILTER VIEW CONTAINER */}
                    
                    <View style={styles.FlatlistContainer}>                        
                        <FlatList
                        data={categoryList}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <CatagoryList
                                    // productList={this.state.ProductList}
                                    onSelectCategory={this.onSelectCategoryHandler}
                                    checkFilter={this.checkFilter}
                                    name={item.category_name}
                                    image={item.category_image}
                                    imagePath={categoryImageBaseUrl}
                                    navigation={this.props.navigation}
                                    color='#42f59e'
                                    process='general'
                                />
                            )}
                        />
                    </View>
                    
                    <View style={{ flexDirection: 'row', width: Devicewidth, alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10, paddingLeft: 20 }}>
                        <Text style={{ fontFamily:"Roboto-Regular",fontWeight:'bold', fontSize: 18, textAlign: 'left', width: Devicewidth / 1.4 }}>{savedLocation.address}</Text>
                        <View style={{ width: Devicewidth / 6, alignItems: "center", flexDirection: 'row', }}>
                            <TouchableOpacity onPress={() => this.handelMap()}><Text style={{ fontFamily:"Roboto-Bold" , fontFamily:"Roboto-Bold", color: '#ed661c', fontSize: 16, fontWeight: 'bold', textAlign: 'left' }}>Edit</Text></TouchableOpacity>
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
                                <View style={{ alignItems: 'center', justifyContent: 'flex-start', alignSelf: 'center', height: '100%', width: Devicewidth / 1.5,
                                }}>
                                    <Image source={require("../../Assets/no_product.png")} style={{ height: Deviceheight/3, width: Deviceheight/3, resizeMode: "contain" }}></Image>
                                </View>
                                :
                                <>
                                    <FlatList 
                                        data={newData}
                                        showsVerticalScrollIndicator={false}
                                        onEndReached={() => this.GetReched()}
                                        onEndReachedThreshold={0.005}
                                        ListFooterComponent={this.RenderLoadMore}
                                        renderItem={({ item, index }) => this.renderItem(item, index)}
                                        keyExtractor={(item, index) => index.toString()}

                                    />
                                    {/* <View  style={{width: WIDTH-20, flexDirection: 'row', marginLeft: 10, marginRight:10, marginBottom: 10, height: 60, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center'}}>
                            <BannerAd size={BannerAdSize.SMART_BANNER}
                                      unitId={'ca-app-pub-3940256099942544/6300978111'}>
                            </BannerAd>
                          </View> */}
                                </>

                        }
                    </View>
                    <Footer pageName={this.props.route.name} onShowAllProducts={this.onShowAllProductsHandler} navigation={this.props.navigation} catdata="product" />
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
        // borderWidth: 1,
        padding: 5,
        height: Deviceheight/8,
        width: Devicewidth,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    FilterViewContainer: {
        padding: 10,
        height: Deviceheight/8,
        width: Devicewidth,
    },
    FlatlistContainer1: {
        padding: 5,
        width: Devicewidth,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        // marginBottom: 20,
    },
})

const mapDispatchToProps = dispatch => {
    return {
        onStoreCategoryList: (data) => dispatch({type: 'STORE_CATEGORY_LIST', payload: data})
    }
}

const mapStateToProps = state => {
    return {
        savedLocation: state.savedLocation,
        categoryList : state.categoryList,
        categoryImageBaseUrl : state.categoryImageBaseUrl,
        sliderDistance: state.sliderDistance
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);