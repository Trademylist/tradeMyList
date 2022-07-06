import React, { Component } from 'react';
import { View, Text, Image, StatusBar, StyleSheet, Dimensions, FlatList, TouchableOpacity,SafeAreaView } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');            
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import ProductListing from "../../Component/SellerProductListing"
import AsyncStorage from '@react-native-community/async-storage';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';
import DotIcon from 'react-native-vector-icons/Entypo';
import BlockandReportOptionModal from "../../Component/ReportBlockChooseModal/index"
import BlockModal from "../../Component/BlockModal/index"
import ReportModal from '../../Component/ReportModal/ReportModal';
const axios = require('axios');
Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");


export default class SellerDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Product: true,
            Commercial: false,
            Reviews: false,
            locationNow: '',
            ProductList: [],
            CommercialList: [],
            lat: '',
            lng: '',
            UserData: '',
            ReviewList: [],
            UserStarCount: 0,
            UserReviewCount: 0,
            FastDeliveryCommentCount: 0,
            FriendlyCommentCount: 0,
            BlockandReportOptionModalVisible: false,
            blockModal: false,
            reportModal: false,
        }
    }

    async componentDidMount() {
        // alert(this.props.route.params.sellerId)
        // const url = 'https://trademylist.com:8936/app_seller/own_product'
        // this.getProduct(url)
        this.getsellerDetailsPath(this.props.route.params.sellerId)

    }

    getsellerDetailsPath = async (sellerId) => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                const object = {
                    "user_id": sellerId
                }
                await axios.post("https://trademylist.com:8936/app_user/get_review", object, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            UserData: response.data.data.user_details,
                            ReviewList: response.data.data.review_details,
                            ProductList: response.data.data.seller_products,
                            CommercialList: response.data.data.seller_commercial
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
        } catch (e) {
            // error reading value
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
                    ReviewList: data
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
        })
    }
    handelCommercial = () => {
        this.setState({
            Product: false,
            Commercial: true,
            Reviews: false,
        })
    }
    handelReviews = () => {
        this.setState({
            Product: false,
            Commercial: false,
            Reviews: true
        })
    }
    HandelReportandBlock = () => {
        this.setState({
            BlockandReportOptionModalVisible: true
        })
    }
    closeBlockandReportOptionModal = async () => {
        this.setState({
            BlockandReportOptionModalVisible: false
        })
    }

    OpenBlock = () => {
        this.setState({
            BlockandReportOptionModalVisible: false,
            blockModal: true,
        })
    }

    OpenReport = () => {
        this.setState({
            BlockandReportOptionModalVisible: false,
            reportModal: true,
        })
    }

    closeBlockModal = () => {
        this.setState({
            blockModal: false
        })
    }

    closeReportModal = () => {
        this.setState({
            reportModal: false
        })
    }

    render() {
        console.log("Reviews", this.state.ReviewList);
        return (
            <SafeAreaView style={styles.Container}>
            
                <View style={styles.Container}>
                    <View style={styles.Container1}>
                        <StatusBar backgroundColor="#000000" />
                        <View style={styles.HeadrIconContainer}>

                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{
                                height: Deviceheight / 50,
                                width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, marginBottom: 5,
                            }}>
                                <Image source={require("../../Assets/BackIconLeft.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.HandelReportandBlock()} style={{
                                height: Deviceheight / 50,
                                width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20, marginBottom: 5,
                            }}>
                                <DotIcon name='dots-three-vertical' size={15} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <BlockandReportOptionModal
                        modalProps={this.state.BlockandReportOptionModalVisible}
                        onPressClose={() => this.closeBlockandReportOptionModal()}
                        navigation={this.props.navigation}
                        OpenBlockModal={this.OpenBlock}
                        OpenReportModal={this.OpenReport}
                    ></BlockandReportOptionModal>


                    <BlockModal
                        modalProps={this.state.blockModal}
                        onPressBlockClose={() => this.closeBlockModal()}
                        navigation={this.props.navigation}
                        seller_Id={this.props.route.params.sellerId}
                    ></BlockModal>
                    <ReportModal
                        modalProps={this.state.reportModal}
                        onPressReportClose={() => this.closeReportModal()}
                        navigation={this.props.navigation}
                        seller_Id={this.props.route.params.sellerId}
                    ></ReportModal>
                    <View style={{ backgroundColor: 'orange', height: Deviceheight / 6, width: Devicewidth, paddingHorizontal: 20, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ alignItems: 'flex-start', height: Deviceheight / 8, width: Devicewidth / 2.5 }}>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 20, fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start', marginTop: 5 }}>{this.state.UserData.username}</Text>
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
                                        containerStyle={{ width: Devicewidth / 4, justifyContent: 'space-around', height: Deviceheight / 50, alignItems: "center", }}
                                        starSize={18}
                                        rating={this.state.UserStarCount}
                                        fullStarColor={'#ffffff'}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily:"Roboto-Regular" , color: '#000', fontSize: 16, fontWeight: 'bold', textAlign: 'left', marginTop: 5, marginLeft: 5 }}>({this.state.UserReviewCount})</Text>
                            </View>
                            <View style={{
                                height: Deviceheight / 28,
                                width: Devicewidth / 3, alignItems: "center", justifyContent: "center", alignSelf: 'flex-start', flexDirection: 'row', justifyContent: "space-around", marginTop: 2
                            }}>
                               <View style={{
                                    height: 60,
                                    width: 20, marginRight:5, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Verified1.png")} style={{ height: 20, width: 20 }}></Image>
                                </View> 
                                <Text style={{ fontFamily:"Roboto-Regular" , color: "#000", fontSize: 14, textAlign: 'center', alignSelf: 'center', }}>Verified with :</Text>
                                <TouchableOpacity style={{
                                    height:60,
                                    width: 20,marginLeft:5, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    {this.state.UserData.login_type == null ?
                                        <Image source={require("../../Assets/Email_Black.png")} style={{ height:15, width: 16}}></Image>
                                        :
                                        this.state.UserData.login_type == "facebook" ?
                                            <Icon name='facebook' style={{ fontSize: 12, marginTop: 0 }} />
                                            :
                                            this.state.UserData.login_type == "google" ?
                                                <Icon name='google' style={{ fontSize: 12, marginTop: 0 }} />
                                                :
                                                null
                                    }h
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={{
                            height: 90,
                            width: 90, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, backgroundColor: '#fff', padding: 2
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
                    {this.state.Product == true || this.state.Commercial == true ?
                        this.state.ProductList.length == 0 ?
                            <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: Deviceheight / 3 }}>
                                <Image source={require("../../Assets/no_product.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                            </View>
                            :
                            <View style={styles.FlatlistContainer1}>
                                <FlatList
                                    data={this.state.Commercial ? this.state.CommercialList : this.state.ProductList}
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
                        this.state.Reviews == true ?
                            <View style={{ width: Devicewidth, alignSelf: 'center', alignItems: "flex-start", backgroundColor: '#fff', paddingTop: 10, paddingLeft: 10 }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', fontSize: 14, fontWeight: "bold", textAlign: "left", marginBottom: 15, marginTop: 5 }}>{this.state.UserData.username} is usally described as</Text>
                                <View style={{ alignItems: "flex-start", flexDirection: "row", width: Devicewidth / 1.6, justifyContent: 'space-between', marginBottom: 15 }}>
                                    <View style={{ alignItems: "flex-start", flexDirection: "row", borderRadius: 20, borderWidth: 1, borderColor: "#606160", padding: 5, }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', fontSize: 16, fontWeight: "bold", textAlign: "left", marginRight: 5 }}>Fast Delivery:</Text>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 16, fontWeight: "bold", textAlign: "left" }}>{this.state.FastDeliveryCommentCount}</Text>
                                    </View>
                                    <View style={{ alignItems: "flex-start", flexDirection: "row", borderRadius: 20, borderWidth: 1, borderColor: "#606160", padding: 5 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', fontSize: 16, fontWeight: "bold", textAlign: "left", marginRight: 5 }}>Friendly:</Text>
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
                                                    <View
                                                    style={{
                                                        height: Deviceheight / 12,
                                                        width: Devicewidth / 6, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, marginLeft: 30
                                                    }}>
                                                        {
                                                            item.sender_id.image === ''
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
                                                    <View style={{ alignItems: 'center', height: Deviceheight / 24, width: Devicewidth / 5, borderRadius: 30, alignSelf: 'flex-end', justifyContent: 'center', borderWidth: 1, borderColor: '#8744c1', marginBottom: 50, marginLeft: 20 }}>
                                                        <Text style={{ fontFamily:"Roboto-Regular" , color: '#8431d0', textAlign: 'center', fontSize: 16, }}>{item.user_type}</Text>
                                                    </View>
                                                </View>
                                                {item.tags.length > 0 ?
                                                    <View style={{ alignItems: 'center', height: Deviceheight / 26, paddingHorizontal:10, borderRadius: 30, alignSelf: 'flex-start', justifyContent: 'center', borderWidth: 1, borderColor: '#cbc3c3', marginLeft: 35, marginTop: 10, }}>
                                                        <Text style={{ fontFamily:"Roboto-Regular" , color: '#000000', textAlign: 'center', fontSize: 14, }}>{item.tags[0]}</Text>
                                                    </View>
                                                    :
                                                    null}
                                                <Text style={{ fontFamily:"Roboto-Regular" , color: '#000', fontSize: 16, textAlign: "left", width: Devicewidth / 1.11, alignSelf: "flex-start", marginLeft: 25, paddingBottom: 10, borderBottomColor: '#dfdfdf', borderBottomWidth: 1, paddingLeft: 15, paddingTop: 5, }}>{item.description}</Text>

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

            </SafeAreaView>        
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
    Container1: {
        alignSelf: 'center',
        width: Devicewidth,
        height: Deviceheight / 14,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        elevation: 1
    },
    HeadrIconContainer: {
        width: Devicewidth,
        height: Deviceheight / 12,
        justifyContent: "space-between",
        flexDirection: "row",
    },
})