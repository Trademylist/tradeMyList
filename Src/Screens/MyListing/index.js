import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, FlatList, StyleSheet, Dimensions, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import FavouriteListing from "../../Component/FavouriteListing"
import MyProductListing from "../../Component/MyProductListing"
import SoldProductListing from "../../Component/SoldListing"
import ExpireProductListing from "../../Component/ExpireListing"
import AsyncStorage from '@react-native-community/async-storage';
import Footer from "../../Component/Footer"
import Header from "../../Component/HeaderOne"
import MarkAsSoldModal from "../../Component/MarkAsSoldModal";
import MySubscriptionModal from "../../Component/SubscriptionModal"

const axios = require('axios');

export default class MyListing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Favourite: true,
            Product: false,
            Commercial: false,
            Sold: false,
            Expired: false,
            ProductList: [],
            ProductLoder: false,
            MarkAsSoldModalVisible: false,
            selectedProdId: null,
            selectedProdProcess: null,
            productType: '',
            showSubModal: false
        }
    }
    state = this.state;

    async componentDidMount() {
        this.fetchData();
        this.HandelReload();
    }

    HandelReload() {
        this.props.navigation.addListener('focus', async () => {
            const { Favourite, Product, Commercial, Sold, Expired } = this.state;
            let url = '';
            if (Favourite) {
                url = 'https://trademylist.com:8936/app_seller/likelist'
            } else if (Product) {
                url = 'https://trademylist.com:8936/app_seller/own_product'
            } else if (Commercial) {
                url = 'https://trademylist.com:8936/app_seller/own_freebies'
            } else if (Sold) {
                url = 'https://trademylist.com:8936/app_seller/all_sold_product'
            } else if (Expired) {
                url = 'https://trademylist.com:8936/app_seller/all_expire_product'
            }
            this.getData(url)
        })
    }

    fetchData = async () => {
        console.log('calleed');
        if (this.props.route.params.process !== '') {
            if (this.props.route.params.process === 'Commercial') {
                this.setState({
                    Favourite: false,
                    Product: false,
                    Commercial: true,
                    Sold: false,
                    Expired: false,
                })
                this.getData('https://trademylist.com:8936/app_seller/own_freebies')

            } else if (this.props.route.params.process === 'Product') {
                this.setState({
                    Favourite: false,
                    Product: true,
                    Commercial: false,
                    Sold: false,
                    Expired: false,
                })
                this.getData('https://trademylist.com:8936/app_seller/own_product')
            }
        }else if(this.props.route.params.process === 'sold'){
            this.setState({
                Favourite: false,
                Product: false,
                Commercial: false,
                Sold: true,
                Expired: false,
            })
            this.getData('https://trademylist.com:8936/app_seller/all_sold_product')
        }
         else {
            const { Favourite, Product, Commercial, Sold, Expired } = this.state;
            let url = '';
            if (Favourite) {
                url = 'https://trademylist.com:8936/app_seller/likelist'
            } else if (Product) {
                url = 'https://trademylist.com:8936/app_seller/own_product'
            } else if (Commercial) {
                url = 'https://trademylist.com:8936/app_seller/own_freebies'
            } else if (Sold) {
                url = 'https://trademylist.com:8936/app_seller/all_sold_product'
            } else if (Expired) {
                url = 'https://trademylist.com:8936/app_seller/all_expire_product'
            }
            this.getData(url)
        }
    }


    getData = async (URL) => {
        this.setState({
            ProductLoder: true
        })
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'));
            //console.log('url', URL)
            axios.get(URL, {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(response => {
                    //console.log('response data',response.data)
                    if (response.data.success) {
                        if (this.state.Expired || this.state.Sold) {
                            //console.log("my res data at listing for check", response.data);
                            const normalProd = response.data.data.product
                            const commercialProd = response.data.data.freebies
                            // const combine = normalProd.concat(commercialProd)
                            // //console.log(combine.length)
                            this.setState({
                                ProductList: [...normalProd, ...commercialProd],
                                ProductLoder: false,
                            })
                        } else {
                            this.setState({
                                ProductList: response.data.data.product,
                                ProductLoder: false,
                            })
                        }

                    }
                })
                .catch(error => {
                    //console.log(error.data)
                })
            // if(value !== null){
            //   setTimeout(() => {
            //     navigation.push('home');
            //   }, 2000)
            // }else{
            //   setTimeout(() => {
            //     navigation.push('home');
            //   }, 2000)
            // }

        } catch (e) {
            // error reading value
        }
    }
    //


    handelFavourite = () => {
        this.setState({
            Favourite: true,
            Product: false,
            Commercial: false,
            Sold: false,
            Expired: false,
            ProductList: []
        })
        this.getData('https://trademylist.com:8936/app_seller/likelist')
    }
    handelProduct = () => {
        this.setState({
            Favourite: false,
            Product: true,
            Commercial: false,
            Sold: false,
            Expired: false,
            ProductList: []
        })
        this.getData('https://trademylist.com:8936/app_seller/own_product')
    }
    handelCommmercial = () => {
        this.setState({
            Favourite: false,
            Product: false,
            Commercial: true,
            Sold: false,
            Expired: false,
            ProductList: []
        })
        this.getData('https://trademylist.com:8936/app_seller/own_freebies')
    }
    handelSold = () => {
        this.setState({
            Favourite: false,
            Product: false,
            Commercial: false,
            Sold: true,
            Expired: false,
            ProductList: []
        })
        this.getData('https://trademylist.com:8936/app_seller/all_sold_product')
    }
    handelExpired = () => {
        this.setState({
            Favourite: false,
            Product: false,
            Commercial: false,
            Sold: false,
            Expired: true,
            ProductList: []
        })

        this.getData('https://trademylist.com:8936/app_seller/all_expire_product')
    }

    domarkedSold = async (prodId, URL, productType) => {
        // try {
        //     const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        //     if (value !== null) {
        //         const object = {
        //             "product_id": prodId,
        //         }
        //         axios.post(URL, object, {
        //             headers: {
        //                 'x-access-token': value.token,
        //             }
        //         })
        //             .then(response => {
        //                 // console.warn(response.data)
        //                 this.setState({
        //                     Favourite: false,
        //                     Product: true,
        //                     Commercial: false,
        //                     Sold: false,
        //                     Expired: false,
        //                 })
        //                 this.getData('https://trademylist.com:8936/app_seller/own_product')

        //             })
        //             .catch(error => {
        //                 //console.log(error.data)
        //             })
        //     } else {
        //         alert('login Modal')
        //     }

        // } catch (e) {
        //     // error reading value
        // }
        this.setState({
            MarkAsSoldModalVisible: true,
            selectedProdId: prodId,
            productType: productType
        })
    }

    getprodActive = async (prodId) => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                const object = {
                    "product_id": prodId,
                }
                axios.post('https://trademylist.com:8936/app_seller/product_reactivation', object, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        // //console.log("my req data",response.data)
                        this.setState({
                            Favourite: false,
                            Product: false,
                            Commercial: false,
                            Sold: false,
                            Expired: true,
                        })
                        this.getData('https://trademylist.com:8936/app_seller/all_expire_product')

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

    getprodReSell = async (prodId) => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                for (let i = 0; i < this.state.ProductList.length; i++) {
                    if(this.state.ProductList[i]._id == prodId){
                        var key = (this.state.ProductList[i].product_type == "Product") ? "product_resell" : "freebies_resell";
                        break;
                    }
                }
                const object = {
                    "product_id": prodId,
                }
                axios.post(`https://trademylist.com:8936/app_seller/${key}`, object, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            Favourite: false,
                            Product: false,
                            Commercial: false,
                            Sold: true,
                            Expired: false,
                        })
                        this.getData('https://trademylist.com:8936/app_seller/all_sold_product')
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

    getprodDelete = async (prodId) => {
        // alert(prodId)
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                axios.delete('https://trademylist.com:8936/app_seller/all_expire_product/' + prodId, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            Favourite: false,
                            Product: false,
                            Commercial: false,
                            Sold: true,
                            Expired: false,
                        })
                        this.getData('https://trademylist.com:8936/app_seller/all_sold_product')

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
    getMyProdDelete = async (prodId, process) => {
        //console.log("in listing details delete section", this.state.Product)
        //console.log("my delete proId at listing details delete", prodId)
        //console.log("my delete process at listing details delete", process)

        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                axios.delete('https://trademylist.com:8936/app_seller/all_expire_product/' + prodId, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        //console.log("my pro delete res", response.data)
                        if (process == 'general') {
                            this.handelProduct()
                        }
                        else if (process == 'commercial') {
                            this.handelCommmercial()
                        }
                        else{
                            null
                        }

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

    doUnlike = async (prodId) => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))

            if (value !== null) {
                const object = {
                    "product_id": prodId,
                }
                axios.post('https://trademylist.com:8936/app_seller/dislikes', object, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        // console.warn(response.data)
                        this.setState({
                            Favourite: true,
                            Product: false,
                            Commercial: false,
                            Sold: false,
                            Expired: false,
                        })
                        this.getData('https://trademylist.com:8936/app_seller/likelist')

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
    closeMarkAsSoldModal = () => {
        this.setState({
            MarkAsSoldModalVisible: false
        })
    }

    onOpenSubModal = (prod_id, process) => {
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

    render() {
        //console.log('sssss', this.state.ProductList);
        return (
            <>
                <SafeAreaView style={styles.Container}>
                    <Header navigation={this.props.navigation} Heading={"Listings"} />
                    <MarkAsSoldModal
                        modalProps={this.state.MarkAsSoldModalVisible}
                        onPressClose={() => this.closeMarkAsSoldModal()}
                        productId={this.state.selectedProdId}
                        productType={this.state.productType}
                        navigation={this.props.navigation}
                    ></MarkAsSoldModal>
                    {
                    this.state.showSubModal &&
                        <MySubscriptionModal
                            modalProps={this.state.showSubModal}
                            onPressCloseSub={() => this.onCloseModal()}
                            Product_Id={this.state.selectedProdId}
                            Process={this.state.selectedProdProcess}
                        ></MySubscriptionModal>
                    }
                    <View style={{ width: Devicewidth, height: Deviceheight / 18, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#fff', }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'space-around', height: Deviceheight / 18 }}>
                            {this.state.Favourite == true ?
                                <TouchableOpacity style={{ width: Devicewidth / 4, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 2 }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Favourite</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.handelFavourite()} style={{ width: Devicewidth / 4, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Favourite</Text>
                                </TouchableOpacity>
                            }

                            {this.state.Product == true ?
                                <TouchableOpacity style={{ width: Devicewidth / 4, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 2 }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Product</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.handelProduct()} style={{ width: Devicewidth / 4, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Product</Text>
                                </TouchableOpacity>
                            }

                            {this.state.Commercial == true ?
                                <TouchableOpacity style={{ width: Devicewidth / 3.5, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 2 }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' ,letterSpacing:1}}>Commercial</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.handelCommmercial()} style={{ width: Devicewidth / 3.5, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Commercial</Text>
                                </TouchableOpacity>
                            }

                            {this.state.Sold == true ?
                                <TouchableOpacity style={{ width: Devicewidth / 4, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 2 }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Sold</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.handelSold()} style={{ width: Devicewidth / 4, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center" }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Sold</Text>
                                </TouchableOpacity>
                            }
                            {this.state.Expired == true ?
                                <TouchableOpacity style={{ width: Devicewidth / 4, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 2 }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Expired</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.handelExpired()} style={{ width: Devicewidth / 4, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold',letterSpacing:1 }}>Expired</Text>
                                </TouchableOpacity>
                            }
                        </ScrollView>
                    </View>

                    {this.state.Favourite == true ?

                        <View style={styles.FlatlistContainer}>
                            {this.state.ProductLoder == true ?
                                <ActivityIndicator style={{ alignSelf: "center", marginTop: Deviceheight / 4 }} animating={this.state.loder} color={"#383ebd"} size="large" />
                                :
                                this.state.ProductList.length == 0 ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: Deviceheight / 3 }}>
                                        <Image source={require("../../Assets/no_product.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                    </View>
                                    :
                                    <FlatList
                                        data={this.state.ProductList}
                                        showsVerticalScrollIndicator={false}
                                        numColumns={2}
                                        renderItem={({ item }) => (
                                            <FavouriteListing
                                                inr={item.product_price}
                                                currencyCode={item.currencyCode}
                                                image={item.cover_thumb}
                                                navigation={this.props.navigation}
                                                ProductId={item._id}
                                                process={item.product_type == 'Commercial' ? 'commercial' : 'general'}
                                                unLike={this.doUnlike}
                                            />
                                        )}
                                        keyExtractor={item => item._id}
                                    />
                            }
                        </View>
                        :
                        this.state.Product == true || this.state.Commercial == true ?
                            <View style={styles.FlatlistContainer}>
                                {this.state.ProductLoder == true ?
                                    <ActivityIndicator style={{ alignSelf: "center", marginTop: Deviceheight / 4 }} animating={this.state.loder} color={"#383ebd"} size="large" />
                                    :
                                    this.state.ProductList.length == 0 ?
                                        <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: Deviceheight / 3 }}>
                                            <Image source={require("../../Assets/no_product.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                        </View>
                                        :
                                        <FlatList
                                            data={this.state.ProductList}
                                            showsVerticalScrollIndicator={false}
                                            numColumns={2}
                                            renderItem={({ item }) => (
                                                <MyProductListing
                                                    category={item.category}
                                                    onPressOpenSub={this.onOpenSubModal}
                                                    inr={item.product_price}
                                                    currencyCode={item.currencyCode}
                                                    image={item.cover_thumb}
                                                    desc={item.product_name}
                                                    navigation={this.props.navigation}
                                                    ProductId={item._id}
                                                    getmarkedSold={this.domarkedSold}
                                                    DeleteMyProduct={this.getMyProdDelete}
                                                    process={this.state.Commercial ? 'commercial' : 'general'}
                                                />
                                            )}
                                            keyExtractor={item => item._id}
                                        />
                                }
                            </View>
                            :
                            this.state.Sold == true ?
                                <View style={styles.FlatlistContainer}>
                                    {this.state.ProductLoder == true ?
                                        <ActivityIndicator style={{ alignSelf: "center", marginTop: Deviceheight / 4 }} animating={this.state.loder} color={"#383ebd"} size="large" />
                                        :
                                        this.state.ProductList.length == 0 ?
                                            <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: Devicewidth / 1.5, height: '70%', marginBottom: 20}}>
                                                <Image source={require("../../Assets/sold.jpg")} style={{ height: "70%", width: "100%", resizeMode: "contain" }}></Image>
                                                <Text style={{letterSpacing: 1,  fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 18,letterSpacing:1 }}>No Sold Listings</Text>
                                                <Text style={{ marginTop: 5, fontFamily:"Roboto-medium" , color: '#606160', textAlign: 'center', fontSize: 14}}>It feels so good making your first sale on Trade.</Text>
                                                <Text style={{letterSpacing: 1,  fontFamily:"Roboto-medium" , color: '#606160', textAlign: 'center', fontSize: 14}}>And your second. And your third.</Text>
                                            </View>
                                            :
                                            <FlatList
                                                data={this.state.ProductList}
                                                showsVerticalScrollIndicator={false}
                                                numColumns={2}
                                                renderItem={({ item }) => (
                                                    <SoldProductListing
                                                        category={item.category}
                                                        inr={item.product_price}
                                                        currencyCode={item.currencyCode}
                                                        image={item.cover_thumb}
                                                        desc={item.product_name}
                                                        navigation={this.props.navigation}
                                                        ProductId={item._id}
                                                        prodDelete={this.getprodDelete}
                                                        prodReSell={(ProductId)=>this.getprodReSell(ProductId)}
                                                    />
                                                )}
                                                keyExtractor={item => item._id}
                                            />
                                    }
                                </View>
                                :
                                this.state.Expired == true ?
                                    <View style={styles.FlatlistContainer}>
                                        {this.state.ProductLoder == true ?
                                            <ActivityIndicator style={{ alignSelf: "center", marginTop: Deviceheight / 4 }} animating={this.state.loder} color={"#383ebd"} size="large" />
                                            :
                                            this.state.ProductList.length == 0 ?
                                                <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: Devicewidth / 1.5, marginBottom: Deviceheight/8, height: '80%' }}>
                                                    <Image source={require("../../Assets/expired.jpg")} style={{ height: "70%", width: "100%", resizeMode: "contain" }}></Image>
                                                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 18, fontWeight: 'bold',letterSpacing:1 }}>No Expired Listings</Text>
                                                    <Text style={{letterSpacing: 1, marginTop: 5, fontFamily:"Roboto-medium" , color: '#606160', textAlign: 'center', fontSize: 14}}>Your listing are active for 120 days after they are posted. (We have found buyers like listings that are fresh from the oven. )</Text>
                                                    <Text style={{letterSpacing: 1, fontFamily:"Roboto-medium" , color: '#606160', textAlign: 'center', fontSize: 14}}>When you listings expire, you can come here to reactivate them.</Text>

                                                </View>
                                                :
                                                <FlatList
                                                    data={this.state.ProductList}
                                                    showsVerticalScrollIndicator={false}
                                                    numColumns={2}
                                                    renderItem={({ item }) => (
                                                        <ExpireProductListing
                                                            category={item.category}
                                                            inr={item.product_price}
                                                            currencyCode={item.currencyCode}
                                                            image={item.cover_thumb}
                                                            desc={item.product_name}
                                                            navigation={this.props.navigation}
                                                            ProductId={item._id}
                                                            prodReactive={(ProductId)=>this.getprodActive(ProductId)}
                                                        />
                                                    )}
                                                    keyExtractor={item => item._id}
                                                />
                                        }
                                    </View>
                                    :
                                    null
                    }
                    <Footer navigation={this.props.navigation} catdata={this.state.Commercial ? "freebies" : "product"} />
                </SafeAreaView>
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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flex: 1,
    },
})
