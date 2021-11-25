import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import ProductListing from "../../Component/ProductListing"
import AsyncStorage from '@react-native-community/async-storage';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';
import FbIcon from 'react-native-vector-icons/AntDesign';
const axios = require('axios');
Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");

const Product = [
    {
        id: '1',
        Inr: 21000,
        Image: require('../../Assets/load_spinner.png'),
        Desc: "Product upload"
    },
    {
        id: '2',
        Inr: 21000,
        Image: require('../../Assets/load_spinner.png'),
        Desc: "Product upload"
    },
    {
        id: '2',
        Inr: 21000,
        Image: require('../../Assets/load_spinner.png'),
        Desc: "Product upload"
    },
    {
        id: '3',
        Inr: 21000,
        Image: require('../../Assets/load_spinner.png'),
        Desc: "Product upload"
    },
    {
        id: '4',
        Inr: 21000,
        Image: require('../../Assets/load_spinner.png'),
        Desc: "Product upload"
    },
    {
        id: '5',
        Inr: 21000,
        Image: require('../../Assets/load_spinner.png'),
        Desc: "Product upload"
    },
]
const ReviewData = [
    {
        key: '1',
        name: 'Kundra Shaw',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "awesome",
        Type: "Buyer",
        Review: "Fast Delivery"
    },
    {
        key: '2',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "Testing",
        Type: "Seller",
        Review: "Friendly"
    },
    {
        key: '3',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "awesome",
        Type: "Buyer",
        Review: "Fast Delivery"
    },
    {
        key: '4',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "Testing",
        Type: "Seller",
        Review: "Friendly"
    },
    {
        key: '5',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "Testing",
        Type: "Seller",
        Review: "Friendly"
    },
    {
        key: '6',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "awesome",
        Type: "Buyer",
        Review: "Fast Delivery"
    },
    {
        key: '7',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "awesome",
        Type: "Buyer",
        Review: "Fast Delivery"
    },
    {
        key: '8',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "awesome",
        Type: "Buyer",
        Review: "Fast Delivery"
    },
    {
        key: '9',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "Testing",
        Type: "Seller",
        Review: "Friendly"
    },
    {
        key: '10',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "awesome",
        Type: "Buyer",
        Review: "Fast Delivery"
    },
    {
        key: '2',
        name: 'Rudra Basu',
        Image: require('../../Assets/default-avatar.png'),
        Desc: "Testing",
        Type: "Seller",
        Review: "Friendly"
    },
];
export default class MyListingMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Product: true,
            Commercial: false,
            Reviews: false,
            locationNow: '',
            ProductList: [],
            lat: '',
            lng: '',
            UserData: '',
            ReviewList: [],
            UserStarCount: 0,
            UserReviewCount: 0,
            FastDeliveryCommentCount: 0,
            FriendlyCommentCount: 0,
            loading: true
        }
    }

    async componentDidMount() {
        const url = 'https://trademylist.com:8936/app_seller/own_product'
        this.getProduct(url)
        this.getStateFromPath()
        this.getReviewList()
        
    }

    getProduct = async(URL) => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'));
            axios.get(URL, {
                headers: {
                    'x-access-token': value.token,
                }
            })
            .then(response => {
                if(response.data.success){
                    this.setState({
                        ProductList:response.data.data.product,
                        loading:false
                    })
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
                  
        } catch(e) {
            // error reading value
                }
    }

    getStateFromPath = async () => {
        try {
            const userdata = JSON.parse(await AsyncStorage.getItem('UserData'));
            this.setState({
                UserData: userdata
            })
        } catch (e) {
            //console.log(e.data)
        }
    }
   
    getReviewList = async () => {
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        if (value !== null) {
            await axios.get("https://trademylist.com:8936/app_seller/review", {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(response => {
                    this.setState({
                        ReviewList: response.data.data,
                    })
                    this.GetReviewUserInfo()
                    this.HandelStarCount()
                    this.HandelTagsCount()
                })
                .catch(error => {
                    //console.log(error.data)
                })
        } else {
            // alert('login Modal')
        }

    }
    GetReviewUserInfo = async () => {
        let data = this.state.ReviewList
        if (data.length > 0) {
            data.map(async (userData, userIndex) => {
                try {
                    const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
                    if (value !== null) {
                        await axios.get("https://trademylist.com:8936/user/" + userData.sender_id, {
                            headers: {
                                'x-access-token': value.token,
                            }
                        })
                            .then(response => {
                                data[userIndex].sender_id = response.data.data
                            
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
                this.setState({
                    ReviewList:data,
                    loading:false
                })
                return true
            })
         
        }
    }
    HandelStarCount = () => {
        let sum = 0
        let avg = 0
        let length = this.state.ReviewList.length
        this.state.ReviewList.map((rattingCount) => {
            sum = sum + rattingCount.rating
        })
        avg = sum / length
        this.setState({
            UserStarCount: avg,
            UserReviewCount: length,
        })
    }
    HandelTagsCount = () => {
        let friendly = 0
        let FastDelivery = 0
        this.state.ReviewList.map((tagsCount) => {
            if (tagsCount.tags[0] == "Friendly") {
                friendly = friendly + 1
            }
            else if (tagsCount.tags[0] == "Fast delivery") {
                FastDelivery = FastDelivery + 1
            }
            else {
                // error
            }
            this.setState({
                FriendlyCommentCount: friendly,
                FastDeliveryCommentCount: FastDelivery,
            })
        })


    }

    handelProduct = () => {
        this.setState({
            Product: true,
            Commercial: false,
            Reviews: false,
            loading:true,
            ProductList:[]
        })
        const url = 'https://trademylist.com:8936/app_seller/own_product'
        this.getProduct(url)
    }
    handelCommercial = () => {
        this.setState({
            Product: false,
            Commercial: true,
            Reviews: false,
            loading:true,
            ProductList:[]
        })
        const url = 'https://trademylist.com:8936/app_seller/own_freebies'
        this.getProduct(url)
    }
    handelReviews = () => {
        this.setState({
            Product: false,
            Commercial: false,
            loading:true,
            Reviews: true
        })
        this.getReviewList()
    }
    state = this.state;

    render() {

        // console.warn("my reviewUserlist", this.state.ReviewList)
        return (
            <>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} />
                    <View style={{ backgroundColor: '#ff6801', height: Deviceheight / 6, width: Devicewidth, paddingHorizontal: 20, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ alignItems: 'flex-start', height: Deviceheight / 8, width: Devicewidth / 2.5 }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 20, fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start', marginTop: 5,marginBottom:2 }}>{this.state.UserData.username==null?'Trade User':this.state.UserData.username}</Text>
                            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', width: Devicewidth / 2.5, height: Deviceheight / 26, flexDirection: 'row',marginBottom:2 }}>
                                <TouchableOpacity style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 4, alignSelf: 'flex-start', marginTop: 10
                                }}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={'star-o'}
                                        fullStar={'star'}
                                        halfStar={'star-half-full'}
                                        iconSet={'FontAwesome'}
                                        maxStars={5}
                                        containerStyle={{ width: Devicewidth / 4.5, justifyContent: 'space-around', height: Deviceheight / 50, alignItems: "center", }}
                                        starSize={15}
                                        rating={this.state.UserStarCount}
                                        fullStarColor={'#ffffff'}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily:"Roboto-Regular" , color: '#000', fontSize: 16, textAlign: 'left', marginTop: 5, marginLeft: 5 }}>({this.state.UserReviewCount})</Text>
                            </View>
                            <View style={{
                                height: Deviceheight / 28,
                                width: Devicewidth / 3, alignItems: "center", justifyContent: "center", alignSelf: 'flex-start', flexDirection: 'row', justifyContent: "space-around", marginTop: 2
                            }}>
                                <View style={{
                                    height: Deviceheight / 55,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Verified1.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Regular" , color: "#000", fontSize: 14, textAlign: 'center', alignSelf: 'center', }}>Verified with :</Text>
                                <TouchableOpacity style={{
                                    height: Deviceheight / 60,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    {this.state.UserData.login_type == null ?
                                        <Image source={require("../../Assets/Email_Black.png")} style={{ height: "100%", width: "100%" }}></Image>
                                        :
                                        this.state.UserData.login_type == "facebook" ?
                                            <FbIcon name='facebook-square' style={{ fontSize: 15, marginTop: 4 }} />
                                            :
                                            this.state.UserData.login_type == "google" ?
                                                <Icon name='google' style={{ fontSize: 15, marginTop: 4 }} />
                                                :
                                                null
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={{
                            height: Deviceheight / 10,
                            width: Devicewidth / 5, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, backgroundColor: '#fff', padding: 2
                        }}>
                            {this.state.UserData.image !== '' ?
                                <Image source={{ uri: this.state.UserData.image }} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                :
                                <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: Devicewidth, height: Deviceheight / 16, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#fff', borderBottomColor: '#e6e6e6', borderBottomWidth: 1 }}>
                        {this.state.Product == true ?
                            <TouchableOpacity onPress={() => this.handelProduct()} style={{ width: Devicewidth / 3, height: Deviceheight / 16, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 2 }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Product</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.handelProduct()} style={{ width: Devicewidth / 3, height: Deviceheight / 16, alignItems: 'center', justifyContent: "center", }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Product</Text>
                            </TouchableOpacity>
                        }
                        {this.state.Commercial == true ?
                            <TouchableOpacity onPress={() => this.handelCommercial()} style={{ width: Devicewidth / 3, height: Deviceheight / 16, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 2 }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Commercial</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.handelCommercial()} style={{ width: Devicewidth / 3, height: Deviceheight / 16, alignItems: 'center', justifyContent: "center", }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Commercial</Text>
                            </TouchableOpacity>
                        }
                        {this.state.Reviews == true ?
                            <TouchableOpacity onPress={() => this.handelReviews()} style={{ width: Devicewidth / 3, height: Deviceheight / 16, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 2 }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Reviews</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.handelReviews()} style={{ width: Devicewidth / 3, height: Deviceheight / 16, alignItems: 'center', justifyContent: "center", }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Reviews</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    { 
                        this.state.loading==false?
                        this.state.ProductList.length == 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: Deviceheight / 3 }}>
                                <Image source={require("../../Assets/no_product.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                            </View>
                            :
                            <View style={styles.FlatlistContainer1}>
                                <FlatList
                                    data={this.state.ProductList}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    renderItem={({ item }) => (
                                        <ProductListing
                                            category={item.category}
                                            inr={item.product_price}
                                            image={item.cover_thumb}
                                            date={item.createdAt}
                                            desc={item.product_name}
                                            like={item.Like}
                                            currency={item.currencyCode}
                                            navigation={this.props.navigation}
                                            ProductId={item._id}
                                            likesProduct={null}
                                            // process='general'
                                            process={this.state.Commercial ? 'commercial' : 'general'}
                                        />
                                    )}
                                    keyExtractor={item => item._id}
                                />
                            </View>
                        :
                        null    
                    
                    }     
                    {    this.state.Reviews == true ?
                            <View style={{ width: Devicewidth, alignSelf: 'center', alignItems: "flex-start", backgroundColor: '#fff', paddingTop: 10, paddingLeft: 10 }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', fontSize: 14, fontWeight: "bold", textAlign: "left", marginBottom: 15, marginTop: 5 }}>{this.state.UserData.username} is usally described as</Text>
                                <View style={{ alignItems: "flex-start", flexDirection: "row", width: Devicewidth / 1.6, justifyContent: 'space-between', marginBottom: 15 }}>
                                    <View style={{ alignItems: "flex-start", flexDirection: "row", borderRadius: 20, borderWidth: 1, borderColor: "#606160", paddingHorizontal: 10,paddingVertical:3 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', fontSize: 14, fontWeight: "bold", textAlign: "left", marginRight: 5 }}>Fast Delivery:</Text>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 16, fontWeight: "bold", textAlign: "left" }}>{this.state.FastDeliveryCommentCount}</Text>
                                    </View>
                                    <View style={{ alignItems: "flex-start", flexDirection: "row", borderRadius: 20, borderWidth: 1, borderColor: "#606160", paddingHorizontal: 10,paddingVertical:3 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', fontSize: 14, fontWeight: "bold", textAlign: "left", marginRight: 5 }}>Friendly:</Text>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 16, fontWeight: "bold", textAlign: "left" }}>{this.state.FriendlyCommentCount}</Text>
                                    </View>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 16, fontWeight: "bold", textAlign: "left" }}>All reviews</Text>
                                <View style={styles.FlatListContainerReview}>
                                    <FlatList
                                        data={this.state.ReviewList}
                                        scrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => (

                                            <TouchableOpacity
                                            onPress={() => this.props.navigation.push('sellerDetails', { "sellerId": item.sender_id._id })}
                                            style={styles.MainContainer}>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', width: Devicewidth, height: Deviceheight / 8, alignSelf: 'flex-start', paddingTop: 10, }}>
                                                    <View style={{
                                                        height: Deviceheight / 12,
                                                        width: Devicewidth / 6, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, marginLeft: 30
                                                    }}> 
                                                        { 
                                                            item.sender_id.image != ''
                                                                ?
                                                                <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                                                :
                                                                <Image source={{ uri: item.sender_id.image }} style={{ height: "100%", width: "100%", borderRadius: 360 }} />
                                                        }

                                                    </View>
                                                    <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', width: Devicewidth / 2.8, height: Deviceheight / 12, paddingTop: 10, marginLeft: 10, }}>
                                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 18, fontWeight: 'bold', textAlign: 'left', }}>{item.sender_id.username}</Text>
                                                        <View style={{
                                                            height: Deviceheight / 60,
                                                            width: Devicewidth / 4.5, alignSelf: 'flex-start', marginTop: 10,
                                                        }}>
                                                            {/* <Image source={require("../../Assets/Star.png")} style={{ height: "100%", width: "100%", resizeMode: 'contain' }}></Image> */}
                                                            <StarRating
                                                                disabled={false}
                                                                emptyStar={'star-o'}
                                                                fullStar={'star'}
                                                                halfStar={'star-half-full'}
                                                                iconSet={'FontAwesome'}
                                                                maxStars={5}
                                                                containerStyle={{ width: Devicewidth / 4.5, justifyContent: 'space-around', height: Deviceheight / 60, alignItems: "center", }}
                                                                starSize={18}
                                                                rating={item.rating}
                                                                fullStarColor={'#ff6801'}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={{ alignItems: 'center', height: Deviceheight / 26, width: Devicewidth / 6, borderRadius: 30, alignSelf: 'flex-end', justifyContent: 'center', borderWidth: 1, borderColor: '#8744c1', marginBottom: 50, marginLeft: 20 }}>
                                                        <Text style={{ fontFamily:"Roboto-Regular" , color: '#8431d0', textAlign: 'center', fontSize: 14, }}>{item.user_type}</Text>
                                                    </View>
                                                </View>
                                                {item.tags.length > 0 ?
                                                    <View style={{ alignItems: 'center', height: Deviceheight / 26, width: Devicewidth / 5, borderRadius: 30, alignSelf: 'flex-start', justifyContent: 'center', borderWidth: 1, borderColor: '#cbc3c3', marginLeft: 35, marginTop: 10, }}>
                                                        <Text style={{ fontFamily:"Roboto-Regular" ,fontWeight:"bold", color: '#000000', textAlign: 'center', fontSize: 12, }}>{item.tags[0]}</Text>
                                                    </View>
                                                    :
                                                    null}
                                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#333', fontSize: 16, fontWeight: "bold", textAlign: "left", width: Devicewidth / 1.11, alignSelf: "flex-start", marginLeft: 25, paddingBottom: 10, borderBottomColor: '#dfdfdf', borderBottomWidth: 1, paddingLeft: 20, paddingTop: 5, }}>{item.description}</Text>

                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={item => item._id}
                                    />
                                </View>



                            </View>
                            :
                            null
                    }         
                    

                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: "#000",
        fontWeight: "bold",
    },
    FlatlistContainer1: {
        padding: 5,
        width: Devicewidth,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flex: 1,
    },
    FlatListContainerReview: {
        width: Devicewidth,
        height: Deviceheight / 1.1,
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 10,
        // backgroundColor: 'pink'
    },
    MainContainer: {
        alignItems: 'center',
        height: Deviceheight / 4,
        width: Devicewidth,
        alignSelf: "center",
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        marginBottom: 40,

    },
})