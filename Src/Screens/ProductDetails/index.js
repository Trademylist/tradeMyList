import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput, Share, ActivityIndicator, ToastAndroid, Linking, SafeAreaView } from 'react-native';
import { getApicall, postApiCall } from "../../ApiRequest/index";
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import { SliderBox } from "react-native-image-slider-box";
import ImageSlider from 'react-native-image-slider';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import StarRating from 'react-native-star-rating';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EditIcon from 'react-native-vector-icons/EvilIcons';
import MySubscriptionModal from "../../Component/SubscriptionModal"
import ImageView from "react-native-image-viewing";
import axios from 'axios';
import LoginModal from '../../Component/LoginModal';

const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const ASPECT_RATIO = Devicewidth / Deviceheight;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");
// const axios = require('axios');
const images = [
    {
        uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
    },
    {
        uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
    },
    {
        uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
    },
];
const Data = [
    {
        key: '1',
        name: 'Is it still available?',
    },
    {
        key: '2',
        name: 'Is the price negotiable',
    },
    {
        key: '3',
        name: 'Is it still available?',
    },
    {
        key: '4',
        name: 'Is the price negotiable',
    },
];

var unitmapping = {
    "days": 24 * 60 * 60 * 1000,
    "hours": 60 * 60 * 1000,
    "minutes": 60 * 1000,
    "seconds": 1000
};
export default class ProductDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productDetails: '',
            productImages: [],
            productZoomImages: [],
            lat: 0,
            lng: 0,
            userDetails: '',
            messageInput: '',
            sellerId: '',
            ReviewList: [],
            UserStarCount: 0,
            UserReviewCount: 0,
            likesProduct: [],
            postedAt: '',
            ProductLoder: true,
            SubscriptionModal: false,
            ProductID: '',
            Process: '',
            loggedUserId: '',
            imageVisible: false,
            ZoomImageIndex: 0,
            ImageCurrentIndex: 0,
            images: [
                "https://source.unsplash.com/1024x768/?nature",
                "https://source.unsplash.com/1024x768/?water",
                "https://source.unsplash.com/1024x768/?girl",
                "https://source.unsplash.com/1024x768/?tree",
            ],
            loginModal: false
        }
    }
    state = this.state;
    async componentDidMount() {
        //console.log("welcome to didmount at pro dtails")
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        const productId = this.props.route.params.productId;
        const process = this.props.route.params.process
        //console.log("my pro id at pro dtails", productId)
        //console.log("my process at pro dtails", process)
        if (productId !== undefined) {
            this.setState({
                ProductID: productId,
                Process: process,
                loggedUserId: value ? value.userid : null
            })
            this.getProductDetails(productId, process)
        }
        else {
            if (Platform.OS === 'android') {
                Linking.getInitialURL().then(url => {
                    //console.log("url"+url)
                    this.navigate(url);
                });
            } else {
                //console.log("url"+url)
                Linking.addEventListener('url', this.handleOpenURL);
            }
        }
        this.getAllLikes()
    }
    navigate = (url) => { // E
        const { navigate } = this.props.navigation;
        const route = url.replace(/.*?:\/\//g, '');
        // const id = route.match(/\/([^\/]+)\/?$/)[1];
        // const id2 = route.match(/\/([^\/]+)\/?$/)[2];
        const routeName = route.split('/')[0];
        var splitData = route.split("/");
        var id = splitData[2];
        var process = splitData[3];
        //console.log("id%%% "+splitData[2] +" ** id2 "+splitData[3])
        //console.log("routeName"+routeName)
        //console.log("route"+route)
        //console.log("split "+splitData)

        //const process = this.props.route.params.process
        //console.log("cdetails %%%%%%%%%%")
        this.getProductDetails(id, process)
        // if (routeName === 'people') {
        //   navigate('People', { id, name: 'chris' })
        // };
    }
    getReviewList = async (UserId) => {
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        //console.log("my data sayaaaannnn", value);
        if (value !== null) {
            const object = {
                user_id: UserId,
            }
            await axios.post("https://trademylist.com:8936/app_seller/get_review", object, {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(response => {
                    this.setState({
                        ReviewList: response.data.data.review_details,
                    })
                    this.HandelStarCount(response.data.data.review_details)
                })
                .catch(error => {
                    //console.log(error.data)
                })
        } else {
            // alert('login Modal')
        }

    }
    HandelStarCount = (MyReviewList) => {
        //console.log("my review list at star count fnc", MyReviewList.length);
        let sum = 0
        let avg = 0
        let length = MyReviewList.length
        MyReviewList.map((rattingCount) => {
            sum = sum + rattingCount.rating
        })
        avg = sum / length
        this.setState({
            UserStarCount: avg,
            UserReviewCount: length,
        })
    }

    getShare = async () => {
        try {
            const { ProductName } = this.state
            const productId = this.props.route.params.productId;
            const process = this.props.route.params.process
            //const ProductLink = 'https://trademylist.com/product-details/?id=' + productId;
            const ProductLink = 'https://trademylist.com/product-details/' + productId + "/" + process;
            const ShareLink = ProductName !== undefined ? ProductName + "" + ProductLink : ProductLink
            await Share.share({
                title: ProductName,
                message:
                    ShareLink,
                url: ProductLink
            });

        } catch (error) {
            //console.log(error.message);
        }
    }

    getProductDetails = async (productid, process) => {
        //console.log("my pro id at pro dtails api call", productid)
        //console.log("my process at pro dtails api call", process)
        let url;
        if (process === 'general') {
            url = "https://trademylist.com:8936/app_user/product/" + productid
        } else {
            url = "https://trademylist.com:8936/app_user/freebies/" + productid
        }
        //console.log("innn", url);
        axios.get(url)
            .then(response => {
                //console.log("api call", response);
                console.log("mypro dtails api call", response.data.data.product)
                var imageData = [];
                var imgzoomData = []
                imageData.push(response.data.data.product.cover_thumb)
                if (response.data.data.product.cover_thumb == "") {
                    if (response.data.data.product.category == "Jobs") {
                        imgzoomData.push({ "uri": "https://trademylist.com:8936/jobs.jpg" });
                    } else if (response.data.data.product.category == "Services") {
                        imgzoomData.push({ "uri": "https://trademylist.com:8936/services.jpg" });
                    }
                } else {
                    imgzoomData.push({ "uri": response.data.data.product.cover_thumb })
                }
                if (response.data.data.product.image.length > 0) {
                    response.data.data.product.image.map((imgdata, imgindex) => {
                        imageData.push(imgdata)
                        if (imgdata == "") {
                            if (response.data.data.product.category == "Jobs") {
                                imgzoomData.push({ "uri": "https://trademylist.com:8936/jobs.jpg" });
                            } else if (response.data.data.product.category == "Services") {
                                imgzoomData.push({ "uri": "https://trademylist.com:8936/services.jpg" });
                            }
                        } else {
                            imgzoomData.push({ "uri": imgdata });
                        }
                    })
                }
                //console.log(response);
                Geocoder.from(response.data.data.product.address)
                    .then(json => {
                        if (imageData[0] == "") {
                            if (response.data.data.product.category == "Jobs") {
                                imageData[0] = "https://trademylist.com:8936/jobs.jpg";
                            } else if (response.data.data.product.category == "Services") {
                                imageData[0] = "https://trademylist.com:8936/services.jpg";
                            }
                        }
                        this.setState({
                            lat: json.results[0].geometry.location.lat,
                            lng: json.results[0].geometry.location.lng,
                            productDetails: response.data.data.product,
                            productImages: imageData,
                            productZoomImages: imgzoomData,
                            sellerId: response.data.data.product.user_id
                        })
                        //console.log("my recent geocoder lat", json.results[0].geometry.location.lat)
                        //console.log("my recent geocoder lng", json.results[0].geometry.location.lng)
                        //console.log("my recent lat", this.state.lat)
                        //console.log("my recent lng", this.state.lng)
                        //console.log("my recent seller id", this.state.sellerId)
                        const event = new Date();
                        const isoStringTime = event.toISOString()
                        const UploadedTime = response.data.data.product.createdAt;
                        // let GetDiff = new Date(isoStringTime) - new Date(response.data.data.product.updatedAt)
                        // //console.log(isoStringTime)
                        // //console.log(response.data.data.product.updatedAt)
                        // const timeCompare = Math.floor(GetDiff/unitmapping.days)+" days "+Math.floor(GetDiff/unitmapping.hours)+" hours "+Math.floor(GetDiff/unitmapping.minutes)+" minutes ";
                        // //console.log(timeCompare)
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
                        } else if (mnth > 0) {
                            time = mnth + " Months"
                        } else if (hours > 0) {
                            time = hours + " Hours"
                        } else {
                            time = minutes + " Minutes"
                        }
                        this.setState({
                            postedAt: time
                        })

                        this.getSellerDetails(response.data.data.product.user_id)

                        this.getReviewList(response.data.data.product.user_id)
                    })
                // .catch(error => console.warn(error));
            })
            .catch(error => {
                console.log('errorA', error)
            })

    }

    getSellerDetails = async (userId) => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                await axios.get("https://trademylist.com:8936/user/" + userId, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        //console.log('vas', response)
                        this.setState({
                            userDetails: response.data.data,
                            ProductLoder: false
                        })

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

    getMessage = async (msgData) => {
        this.setState({
            messageInput: msgData
        })
    }

    sendMessage = async () => {
        try {
            const random = this.generateRandomNo();
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            const { messageInput, sellerId } = this.state
            const senderId = value.userid
            const receiver_id = sellerId
            const productId = this.props.route.params.productId;
            const prodType = this.props.route.params.process == 'general' ? 'p' : 'c';
            const SellerIds = sellerId;
            const text = messageInput;
            firestore()
                .collection('Trade_Message')
                .add({
                    messageId: random,
                    created: new Date().getTime(),
                    image: "",
                    message: text,
                    product_id: productId,
                    prod_type: prodType,
                    receiver_id: receiver_id,
                    seen: false,
                    seller_id: SellerIds,
                    sender_id: senderId
                });
            this.HitPush(SellerIds, senderId, receiver_id, productId, text)
            ToastAndroid.showWithGravity(
                "Message Successfully sent",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
            );
            this.setState({
                messageInput: ''
            })
            //console.log("before chatterrrrrrrrrrrrrrrrrrrrr========================>>");
            this.props.navigation.navigate('chatDetails', { "productId": productId, "prod_type": prodType, "otherId": receiver_id })

        } catch (e) {
            // error reading value
        }
    }

    generateRandomNo = () => {
        const val = Date.now().toString() + parseInt(Math.random() * 36);
        return val;
    }

    HitPush = async (sellerId, senderId, receiver_id, productId, text) => {
        console.log("in handel HitPush");
        let ProductImage = ''
        if (this.state.productImages.length != 0) {
            ProductImage = this.state.productImages[0]
        }
        const value = JSON.parse(await AsyncStorage.getItem('UserData'))
        if (value !== null) {
            const object = {
                "seller_id": sellerId,
                "sender_id": senderId,
                "receiver_id": receiver_id,
                "product_id": productId,
                "message": text,
                "image": ProductImage
            }
            axios.post("https://trademylist.com:8936/app_seller/chat_push", object, {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(response => {
                    console.log("Hit push response", response)
                })
                .catch(error => {
                    console.log('errorB', error)
                })
        }
    }

    RemoveFavProduct = async (prodId) => {

        try {
            let URL;
            if (this.props.route.params.process === 'general') {
                URL = 'https://trademylist.com:8936/app_seller/dislikes'
            } else {
                URL = 'https://trademylist.com:8936/app_seller/commercial_dislikes'
            }
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

    AddFavProduct = async (prodId) => {
        try {
            let URL;
            if (this.props.route.params.process === 'general') {
                URL = 'https://trademylist.com:8936/app_seller/likes'
            } else {
                URL = 'https://trademylist.com:8936/app_seller/commercial_likes'
            }
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
                        this.getAllLikes()
                    })
                    .catch(error => {
                        console.log('errorC', error);
                    })
            } else {
                this.openLoginModal()
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

    getImageindx = (val) => {
        alert('atleast eseche')
    }
    OpenSubscriptionModal = () => {
        //console.log("calling sub");
        this.setState({
            SubscriptionModal: true,
        })
    }
    closeSubscriptionModal = () => {
        this.setState({
            SubscriptionModal: false,
        })
    }
    getItem = async () => {
        alert('yoo')
    }
    setIsVisible = () => {
        this.setState({
            imageVisible: false
        })
    }
    ProductEdit = () => {
        if (this.state.Process === 'general') {
            this.props.navigation.navigate('listingDetails', { "productId": this.state.ProductID })
        } else {
            this.props.navigation.navigate('commerciallistingDetails', { "productId": this.state.ProductID })
        }
    }
    openZoom = (index) => {
        //console.log(`image ${index} pressed`);
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
        const { productDetails } = this.state;
        console.log('details', productDetails);
        return (
            <SafeAreaView style={styles.Container}>
                {
                    productDetails != "" &&
                    <>
                        <MySubscriptionModal
                            modalProps={this.state.SubscriptionModal}
                            onPressCloseSub={() => this.closeSubscriptionModal()}
                            navigation={this.props.navigation}
                            Product_Id={this.state.ProductID}
                            Process={this.state.Process}
                        ></MySubscriptionModal>
                        <LoginModal
                            modalProps={this.state.loginModal}
                            onPressClose={this.closeloginModal}
                            getlogin={this.redcLogin}
                            navigation={this.props.navigation}
                        ></LoginModal>
                        <ImageView
                            swipeToCloseEnabled={false}
                            images={this.state.productZoomImages}
                            imageIndex={this.state.ZoomImageIndex}
                            visible={this.state.imageVisible}
                            onRequestClose={() => this.setIsVisible()}
                        />
                        <ScrollView keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} contentContainerStyle={{ width: Devicewidth }} >
                            <View style={{ width: Devicewidth / 1.05, height: Deviceheight / 2.5, justifyContent: "center", alignItems: "center", position:'relative', alignSelf: 'center', }}>

                                <View style={{ alignSelf: "center",position:'relative', alignItems: "center", width: Devicewidth / 1.2, height: Deviceheight / 3, }}>
                                    <SliderBox
                                        images={this.state.productImages}
                                        sliderBoxHeight={Deviceheight / 2.8}
                                        resizeMethod={'resize'}
                                        resizeMode={'cover'}
                                        currentImageEmitter={index =>
                                            this.setState({
                                                ImageCurrentIndex: index
                                            })}
                                        onCurrentImagePressed={index => {
                                            this.setState({
                                                imageVisible: true,
                                                ZoomImageIndex: index
                                            })
                                        }}
                                        dotColor="#FFEE58"
                                        inactiveDotColor="#E1E1E1"
                                        paginationBoxVerticalPadding={20}
                                        ImageComponentStyle={{ resizeMode: 'contain', marginTop: 5, paddingTop: 20 }}
                                    />

                                    <View style={{
                                        height: Deviceheight / 28,
                                        width: Devicewidth / 9, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 10, marginBottom: 5, backgroundColor: "#00000094", position: 'absolute', bottom:10, right: -20,
                                    
                                    }}>
                                        <Text style={{ fontFamily: "Roboto-Bold", color: "#fff", fontSize: 18, textAlign: "center" }}>{this.state.ImageCurrentIndex + 1}/{this.state.productImages.length}</Text>
                                    </View>

                                </View>
                                <View style={styles.HeadrIconContainer}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}
                                        hitSlop={{
                                            bottom: 15,
                                            top: 15,
                                            left: 15,
                                            right: 15
                                        }}
                                        style={{
                                            height: Deviceheight / 36,
                                            width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 10, marginTop:25, marginBottom: 5, backgroundColor: "#00000094", borderRadius: 2,
                                        }}>
                                        <Icon name='close-a' size={16} color={'#f0f0f0'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        height: 30,
                                        width: 30, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 5, marginBottom: 5, backgroundColor: "#00000094", borderRadius: 2,
                                        padding:2,
                                        top:15
                                    }} onPress={() => this.getShare()}>
                                        <Icon name='share' size={16} color={'#f0f0f0'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            {this.state.loggedUserId === this.state.sellerId ?
                                <TouchableOpacity
                                    onPress={() => this.OpenSubscriptionModal()}
                                    style={{
                                        height: Deviceheight / 15,
                                        width: Devicewidth / 1.4, borderRadius: 50, alignItems: "center", justifyContent: "center", alignSelf: "center", backgroundColor: "#373ec2", flexDirection: "row", marginTop: 10,
                                    }}>
                                    <View style={{
                                        alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 15,
                                    }}>
                                        <Entypo name="flash" size={30} color="#fb7700" />
                                    </View>
                                    <Text style={{ fontFamily: "Roboto-Bold", color: "#fff", fontSize: 16, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>Sell Faster Now</Text>
                                </TouchableOpacity>
                                :
                                null
                            }
                            {
                                (this.state.userDetails !== '' && this.state.userDetails !== null)
                                    ?
                                    <View style={{ height: Deviceheight / 7.2, width: Devicewidth / 1.01, paddingRight: 20, paddingLeft: 15, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity style={{
                                            height: 80,
                                            width: 80, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, backgroundColor: '#fff', padding: 2
                                        }} onPress={() => this.props.navigation.navigate('sellerDetails', { "sellerId": this.state.sellerId })}>
                                            {
                                                this.state.userDetails && this.state.userDetails.image !== null
                                                    ?
                                                    <Image source={{ uri: this.state.userDetails.image }} style={{ height: "100%", width: "100%", borderRadius: 360 }} />
                                                    :
                                                    <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                            }

                                        </TouchableOpacity>
                                        <View style={{ alignItems: 'flex-start', height: Deviceheight / 8, width: Devicewidth / 1.5, paddingTop: 15, }}>
                                            <Text style={{ fontFamily: "Roboto-Bold", color: "#000", fontSize: 18, fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start', marginTop: 5, marginLeft: 5 }}>{this.state.userDetails.username}</Text>
                                            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', width: Devicewidth / 2.5, height: Deviceheight / 26, flexDirection: 'row', }}>
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
                                                        fullStarColor={'#ff6801'}
                                                    />
                                                </TouchableOpacity>
                                                <Text style={{ fontFamily: "Roboto-Bold", color: '#000', fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 8, marginLeft: 5 }}>({this.state.UserReviewCount})</Text>
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    <></>
                            }

                            <View style={{ marginTop: 10, height: Deviceheight / 18, width: Devicewidth / 1.01, paddingRight: 20, paddingLeft: 15, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                {
                                    this.state.productDetails.category == "Freebies" ?
                                        <Text style={{ fontFamily: "Roboto-Black", color: "#2c384e", fontSize: 22, fontWeight: 'bold', textAlign: 'left', alignSelf: 'center' }}>{'Free'}</Text>
                                        :
                                        <Text style={{ fontFamily: "Roboto-Black", color: "#2c384e", fontSize: 22, fontWeight: 'bold', textAlign: 'left', alignSelf: 'center' }}>{(this.state.productDetails.category != "Jobs" && this.state.productDetails.category != "Freebies" && this.state.productDetails.category != "Services") ? this.state.productDetails.currencyCode == "INR" ? "₹ " : this.state.productDetails.currencyCode == "USD" ? "$ " : `${this.state.productDetails.currencyCode} ` : null} {(this.state.productDetails.category != "Jobs" && this.state.productDetails.category != "Freebies" && this.state.productDetails.category != "Services") && this.state.productDetails.product_price}</Text>
                                }
                                {this.state.loggedUserId === this.state.sellerId ?
                                    <TouchableOpacity style={{
                                        height: Deviceheight / 24,
                                        width: Devicewidth / 12, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, borderRadius: 360, backgroundColor: '#ffffff', elevation: 2
                                    }} onPress={() => this.ProductEdit()}>
                                        <EditIcon name="pencil" size={22} color="#fb7700" />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        hitSlop={{
                                            bottom: 15,
                                            top: 15,
                                            left: 15,
                                            right: 15
                                        }}
                                        style={{
                                            height: Deviceheight / 24,
                                            width: Devicewidth / 12, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 10, marginBottom: 5, borderRadius: 360, backgroundColor: "#ffffff", elevation: 2
                                        }} onPress={() => this.state.likesProduct.indexOf(this.props.route.params.productId) !== -1 ? this.RemoveFavProduct(this.props.route.params.productId) : this.AddFavProduct(this.props.route.params.productId)}>
                                        {
                                            this.state.likesProduct.indexOf(this.props.route.params.productId) !== -1 ?

                                                <FontAwesomeIcon name="heart" size={18} color="#fb7700" />
                                                : <FontAwesomeIcon name="heart" size={18} color="#ccc" />
                                        }

                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={{ fontFamily: "Roboto-Bold", color: "#000", fontSize: 17, fontWeight: '900', textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1 }}>{this.state.productDetails.product_name}</Text>
                            </View>
                            <Text style={{ fontFamily: "Roboto-Regular", color: "#000", fontSize: 18, textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, marginLeft: 20, marginTop: 15 }}>Category</Text>
                            <Text style={{ fontFamily: "Roboto-Regular", color: "#666666", fontSize: 16, textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, marginLeft: 20, marginTop: 5 }}>{this.state.productDetails.category}</Text>
                            <View style={styles.inputContainer1}>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#000", fontSize: 18, textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, }}>Posted</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#666666", fontSize: 16, textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, marginTop: 5, paddingBottom: 5 }}>{this.state.postedAt} ago</Text>
                            </View>
                            <Text style={{ fontFamily: "Roboto-Regular", color: "#000", fontSize: 18, textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, marginLeft: 20, marginTop: 10 }}>Description</Text>
                            <Text style={{ fontFamily: "Roboto-Regular", color: "#666666", fontSize: 16, textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, marginLeft: 20, marginTop: 5 }}>{this.state.productDetails.product_description}</Text>
                            {
                                (productDetails.sub_category.length > 0 || productDetails.sub_category_number.length > 0) &&
                                <View>
                                    {/* <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 18, fontWeight: '900', textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, marginLeft: 20, marginVertical: 10 }}>Specifications</Text> */}
                                    {
                                        productDetails.sub_category.map(subC => {
                                            var key = subC.key.replace(/([a-z](?=[A-Z]))/g, '$1 ')
                                            key = key.split("_").join(" ");

                                            return (
                                                (key != 'unit') ?
                                                    <View style={{
                                                        // flexDirection: 'row',

                                                        justifyContent: 'flex-start',
                                                        // flexWrap: 'wrap',
                                                        // width: '90%',
                                                        alignSelf: 'center',
                                                        // marginVertical: 5,
                                                        paddingTop: 15,
                                                        marginBottom: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#e1e1e1",
                                                        width: Devicewidth / 1.1,
                                                    }} key={key}>
                                                        <Text style={{ fontFamily: "Roboto-Regular", color: "#000", fontSize: 18, textTransform: 'capitalize' }}>{key}</Text>
                                                        <Text style={{ fontFamily: "Roboto-Regular", color: "#666666", fontSize: 16, marginTop: 5, marginBottom: 5 }}>{subC.value}</Text>
                                                    </View>
                                                    :
                                                    null
                                            )
                                        })}
                                    {
                                        productDetails.sub_category_number.map(subC => {
                                            var key = subC.key.replace(/([a-z](?=[A-Z]))/g, '$1 ');
                                            //if(key=='range') subC.value = key;
                                            key = key.split("_").join(" ");
                                            return (
                                                <View style={{
                                                    justifyContent: 'flex-start',
                                                    alignSelf: 'center',
                                                    paddingTop: 15,
                                                    marginBottom: 10,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: "#e1e1e1",
                                                    width: Devicewidth / 1.1,
                                                }} key={key}>
                                                    <Text style={{ fontFamily: "Roboto-Regular", color: "#000", fontSize: 18, textTransform: 'capitalize' }}>{key}</Text>
                                                    <Text style={{ fontFamily: "Roboto-Regular", color: "#666666", fontSize: 16, marginTop: 5, marginBottom: 5 }}>{subC.value}</Text>
                                                </View>
                                            )
                                        }
                                        )}
                                </View>
                            }

                            <Text style={{ fontFamily: "Roboto-Regular", color: "#000", fontSize: 18, fontWeight: '900', textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, marginLeft: 20, marginTop: 10 }}>Location</Text>
                            <Text style={{ fontFamily: "Roboto-Regular", color: "#666666", fontSize: 16, textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.1, marginLeft: 20, marginTop: 5 }}>{this.state.productDetails.address}</Text>
                            <View style={{ alignItems: 'center', justifyContent: "center", alignSelf: 'center', width: Devicewidth / 1.1, height: Deviceheight / 4, marginBottom: 10, marginTop: 15, borderBottomWidth: 1, borderBottomColor: "#e1e1e1", }}>
                                {/* <Image source={require("../../Assets/Map.jpg")} style={{ height: "100%", width: "100%", resizeMode: 'contain' }}></Image> */}
                                <MapView
                                    style={{ height: "100%", width: "100%" }}
                                    showsMyLocationButton={false}
                                    showsUserLocation={false}
                                    minZoomLevel={10}
                                    // initialRegion={{
                                    //     latitude: parseFloat(this.state.lat),
                                    //     longitude: parseFloat(this.state.lng),
                                    //     latitudeDelta: LATITUDE_DELTA,
                                    //     longitudeDelta: LONGITUDE_DELTA,
                                    // }}
                                    region={{
                                        latitude: parseFloat(this.state.lat),
                                        longitude: parseFloat(this.state.lng),
                                        latitudeDelta: LATITUDE_DELTA,
                                        longitudeDelta: LONGITUDE_DELTA,
                                    }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(this.state.lat),
                                            longitude: parseFloat(this.state.lng),
                                        }}
                                    />
                                </MapView>
                            </View>

                        </ScrollView>
                        {this.state.userDetails == '' ?
                            null
                            :
                            <>
                                {this.state.loggedUserId === this.state.sellerId ?
                                    null
                                    :
                                    <>
                                        <View style={styles.FlatListContainer}>
                                            <FlatList
                                                data={Data}
                                                scrollEnabled={true}
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity style={{ borderRadius: 50, alignItems: 'center', justifyContent: "center", backgroundColor: '#363ed9', marginRight: 20, height:48, padding: 10, }} onPress={() => this.getMessage(item.name)}>
                                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: 14, textAlign: 'center', color: "#fff" }}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                )}
                                                keyExtractor={item => item.key}
                                            />
                                        </View>
                                        <View style={styles.MessageInputContainer}>
                                            <TextInput
                                                style={styles.SearchContainer}
                                                autoFocus={false}
                                                placeholder={'Type your message here...'}
                                                keyboardType={"default"}
                                                onChangeText={(val) => this.setState({
                                                    messageInput: val
                                                })}
                                                value={this.state.messageInput}
                                            />
                                            <TouchableOpacity style={this.state.messageInput == '' ? styles.SearchIcon : styles.SearchIcon1} onPress={this.sendMessage}>
                                                <Text style={{ fontFamily: "Roboto-Bold", fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: "#fff" }}>Send</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                }
                            </>
                        }
                    </>
                }
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    HeadrIconContainer: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 20,
        justifyContent: "space-between",
        flexDirection: "row",
        // backgroundColor: "green",
        position: "absolute",
        top: 15,
    },
    inputContainer: {
        marginTop: 5,
        // backgroundColor:'pink',
        width: Devicewidth / 1.1,
        height: Deviceheight / 20,
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: "#e1e1e1",
        alignSelf: 'center',
        marginBottom: 5,
    },
    inputContainer1: {
        marginTop: 15,
        // backgroundColor:'pink',
        width: Devicewidth / 1.1,
        height: Deviceheight / 14,
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: "#e1e1e1",
        alignSelf: 'center',
        marginBottom: 5,
    },
    FlatListContainer: {
        width: Devicewidth / 1.1,
        alignSelf: 'center',
        height: Deviceheight / 14,
        alignItems: 'center',
        paddingTop: 5,
    },
    MessageInputContainer: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        borderRadius: 360,
        marginTop: 10,
        width: Devicewidth / 1.1,
        height: Deviceheight / 14,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#cccccc",
        marginBottom: 10
    },
    SearchIcon: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        borderRadius: 360,
        width: Devicewidth / 6,
        height: Deviceheight / 20,
        backgroundColor: '#dddddd',
    },
    SearchIcon1: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        borderRadius: 360,
        width: Devicewidth / 6,
        height: Deviceheight / 20,
        backgroundColor: '#373ec2',
    },
    SearchContainer: {
        borderRadius: 360,
        height: Deviceheight / 17,
        width: Devicewidth / 1.5,
        alignSelf: 'center',
        justifyContent: "flex-end",
        fontSize: 16,
    },
})
