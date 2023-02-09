import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, StatusBar, TextInput, TouchableOpacity,ToastAndroid } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');
import Icon from 'react-native-vector-icons/Fontisto';
import StarRating from 'react-native-star-rating';
import Toast from 'react-native-simple-toast';


export default class ReviewExperience extends Component {
    constructor(props) {
        super(props)
        this.state = {
            PublishReviewOne: true,
            ReviewDescription: '',
            Tags:[],
            UserDetails:'',
            selectedTags:[],
            starCount:0,
            starText:''
        }
    }
    state = this.state;
    async componentDidMount() {
        // alert(this.props.route.params.productId )
        this.getBuyerTag()
        this.getUserDetails()
    }

    getUserDetails = async () => {
        try {
            console.log('ins');
            const userId = this.props.route.params.buyerId;
            console.log('userId', userId);
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                await axios.get("https://trademylist.com:8936/user/" + userId, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                .then(response => {
                    this.setState({
                        userDetails: response.data.data,
                    })
                })
                .catch(error => {
                    //console.log(error.data)
                })
            } else {
                // alert('login Modal')
            }
        } catch (e) {
            console.log('avc', e);
        }
    }
    getBuyerTag = async () => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                axios.get('https://trademylist.com:8936/app_seller/buyer_tag', {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                .then(response => {
                    if(response.data.success){
                        this.setState({
                            Tags:response.data.data
                        })
                    }
                })
                .catch (error => {
                    //console.log(error.data)
                })
            }
        }catch (e) {
            // error reading value
        }
    }

    chooseTag = (tag) => {
        let array = [...this.state.selectedTags];
        if(array.includes(tag)){
            array = array.filter( item => item !== tag );
        } else {
            array.push(tag)
        }
        this.setState({
            selectedTags:array
        })
    }

    PublishReview = async () => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                const {selectedTags,starCount,starText,ReviewDescription} = this.state
                const userId = this.props.route.params.buyerId
                const productId = this.props.route.params.productId
                const process = this.props.route.params.process
                const object={
                    "user_id":userId,
                    "product_id":productId,
                    "tags":selectedTags,
                    "user_type":"Buyer",    
                    "rating":starCount,
                    "description":ReviewDescription
                }
                if(userId == null || userId == undefined || userId == ""){
                    this.reviewSubmitFinal(process, productId, value);
                } else {
                    console.log('usesr,', userId);
                    const response = await axios.post('https://trademylist.com:8936/app_seller/review',object, {
                        headers: {
                            'x-access-token': value.token,
                        }
                    })
                    if(response.data.success){
                        this.reviewSubmitFinal(process, productId, value);
                    }
                }
            }
        }catch (e) {
            // error reading value
        }
    }

    reviewSubmitFinal = (process, productId, value) => {
        let url;
        if (process === 'general') {
            url = 'https://trademylist.com:8936/app_seller/product_sold'
        }else{
            url = 'https://trademylist.com:8936/app_seller/freebies_sold'
        }

        const prodObject = {
            "product_id":productId
        }
        axios.post(url,prodObject, {
            headers: {
                'x-access-token': value.token,
            }
        })
        .then(response => {
            if(response.data.success){
                Toast.showWithGravity(
                    "Product successfully updated",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                this.props.navigation.navigate('myListing', { "process": 'sold' })
            }
        })
        .catch(error => {
            console.log('errorA',error.data)
        })
    }

    PublishReviewTwo = () => {
        this.setState({
            PublishReviewOne: false
        })
    }

    onStarRatingPress(rating) {
        let text = "";
        if(rating == 1){
            text = "Horrible"
        } else if(rating == 2){
            text = "Poor"
        } else if(rating == 3){
            text = "Ok"
        } else if(rating == 4){
            text = "Good"
        } else {
            text = "Excellent"
        }
        this.setState({
            starCount: rating,
            starText: text
        });
      }

    render() {
        console.log('dsdads', this.state.Tags);
        return (
            <>
                <View style={styles.Container}>
                    <View style={styles.HeaderContainer}>
                        <StatusBar backgroundColor="#000000" />
                        <View style={styles.HeadrIconContainer}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{
                                height: Deviceheight / 50,
                                width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, 
                            }}>
                                <Icon name='arrow-left' size={15} color={'#000'} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#434343', fontSize: 20, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', width: Devicewidth / 1.5, marginLeft: 10, }}>Review your experience</Text>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                        {this.state.PublishReviewOne == false ?
                            <View style={{ height: Deviceheight / 1.8, width: Devicewidth / 1.01, paddingHorizontal: 5, alignSelf: 'center', alignItems: 'center', paddingTop: 30, marginBottom: 5 }}>
                                {
                                    this.state.userDetails &&
                                    <TouchableOpacity style={{
                                        height: Deviceheight / 8,
                                        width: Devicewidth / 4, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 360, backgroundColor: '#fff', padding: 2
                                    }}>
                                        {
                                            this.state.userDetails.image !== null || this.state.userDetails.image !== ''
                                            ?
                                            <Image source={{ uri: this.state.userDetails.image }} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                            :
                                            <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                        }
                                    
                                    </TouchableOpacity>
                                }
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 22, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', marginTop: 20, width: Devicewidth / 1.4 }}>Does your experience eith buyer get five stars?</Text>
                                <TouchableOpacity style={{
                                    // height: Deviceheight / 4,
                                    width: Devicewidth / 3, alignSelf: 'center', marginTop: 30,
                                }}>
                                    <StarRating
                                        disabled={false}
                                        emptyStar={'star-o'}
                                        fullStar={'star'}
                                        halfStar={'star-half-full'}
                                        iconSet={'FontAwesome'}
                                        maxStars={5}
                                        containerStyle={{ width: Devicewidth / 3, justifyContent: 'space-around', height: Deviceheight / 30, alignItems: "center", }}
                                        starSize={25}
                                        rating={this.state.starCount}
                                        fullStarColor={'#ff6801'}
                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginTop: 25 }}>{this.state.starText}</Text>
                                <TouchableOpacity style={styles.btnContainer_active} onPress={this.PublishReview}>
                                    <Text style={styles.btnText} >Publish review</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ height: Deviceheight, width: Devicewidth / 1.01, paddingHorizontal: 5, alignSelf: 'center', alignItems: 'center', paddingTop: 30, marginBottom: 5 ,}}>
                                <TouchableOpacity style={{
                                    height: Deviceheight / 8,
                                    width: Devicewidth / 4, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 360, backgroundColor: '#fff', padding: 2
                                }}>
                                    <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                </TouchableOpacity>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 22, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', marginTop: 20, }}>How would you describe buyer?</Text>
                                <View style={{ borderBottomColor:"#666666",borderBottomWidth:0.5, width: Devicewidth / 1.15,flexDirection: 'row', flexWrap: "wrap", alignSelf: "center", alignItems: 'flex-start', justifyContent: 'flex-start',marginTop:10,paddingBottom:10 }}>
                                    {
                                        this.state.Tags.map((tagData,tagindex) => {
                                            return(
                                                <TouchableOpacity style={[styles.SingleOption, this.state.selectedTags.includes(tagData) ? styles.active : '']} onPress={() =>this.chooseTag(tagData)}>
                                                    <Text style={this.state.selectedTags.includes(tagData) ?styles.OptionActive: styles.Option}>{tagData}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                    
                                </View>

                                <View style={styles.ProductDescContainer}>
                                    <TextInput
                                        placeholder={'Describe your experience'}
                                        placeholderTextColor={'#000'}
                                        style={styles.ProductDesc}
                                        onChangeText={(val) => this.setState({
                                           ReviewDescription: val
                                        })}
                                        value={this.state.ReviewDescription}
                                    >
                                    </TextInput>
                                </View>

                                <TouchableOpacity style={styles.btnContainer_active} onPress={this.PublishReviewTwo}>
                                    <Text style={styles.btnText} >Publish review</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </ScrollView>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingLeft: 10,
        paddingRight: 10
    },
    HeaderContainer: {
        alignSelf: 'center',
        width: Devicewidth,
        height: Deviceheight / 14,
        justifyContent: 'center',
        backgroundColor: '#fff',
        elevation: 5
    },
    HeadrIconContainer: {
        width: Devicewidth,
        height: Deviceheight / 12,
        // justifyContent: "space-between",
        flexDirection: "row",
    },
    btnContainer_active: {
        width: Devicewidth / 1.15,
        height: Deviceheight / 19,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#383ebd",
        borderRadius: 20,
        marginTop: 30
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    },
    ProductDescContainer: {
        marginTop: 20,
        // backgroundColor: 'pink',
        width: Devicewidth / 1.15,
        height: Deviceheight / 8,
        justifyContent: 'center',
        borderRadius: 10,
    },
    ProductDesc: {
        width: Devicewidth / 1.15,
        height: Deviceheight / 8,
        fontSize: 15,
        //fontFamily: 'Rubik',
        // backgroundColor: '#f5f5f5',
        alignSelf: 'center',
        borderRadius: 10,
        paddingLeft: 20,
    },
    SingleOption: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
        borderRadius: 20,
        elevation:2,
        backgroundColor:"#fff",
        marginBottom:10
    },
    Option: {
        fontSize: 14,
        color: "#000",
        textAlign: "center",
        fontWeight: "bold"
    },
    OptionActive: {
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold"
    },
    active: {
        backgroundColor: '#bdbdbd',
        color:'white'
    },
})