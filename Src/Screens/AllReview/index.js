import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import StarRating from 'react-native-star-rating';
import Header from "../../Component/HeaderBack"
const axios = require('axios');
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const Data = [
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
export default class AllReview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ReviewList: [],
        }
    }
    state = this.state;
     componentDidMount() {
        this.getReviewList()
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
                    ReviewList:data
                })
                return true
            })
        }
    }
    render() {
        console.log('errorA',this.state.ReviewList)
        return (
            <View style={styles.Container}>
                <Header navigation={this.props.navigation} Desc={"All Reviews"} />
                <View style={styles.FlatListContainer}>
                    <FlatList
                        data={this.state.ReviewList}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={styles.MainContainer}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', width: Devicewidth, height: Deviceheight / 8, alignSelf: 'flex-start', paddingTop: 10, }}>
                                    <TouchableOpacity style={{
                                        height: Deviceheight / 10,
                                        width: Devicewidth / 5, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, marginLeft: 20
                                    }}>
                                        {
                                        item.sender_id.image == ''
                                        ?
                                        <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                        :
                                        <Image source={{ uri: item.sender_id.image }} style={{ height: "100%", width: "100%", borderRadius: 360 }}/>
                                    }
                                    </TouchableOpacity>
                                    <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', width: Devicewidth / 2.5, height: Deviceheight / 10, paddingTop: 10, marginLeft: 10 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 20, fontWeight: 'bold', textAlign: 'left', }}>{item.sender_id.username}</Text>
                                        <TouchableOpacity style={{
                                            height: Deviceheight / 50,
                                            width: Devicewidth / 4, alignSelf: 'flex-start', marginTop: 10,
                                        }}>
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
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'center', height: Deviceheight / 26, width: Devicewidth / 6, borderRadius: 30, alignSelf: 'flex-end', justifyContent: 'center', borderWidth: 1, borderColor: '#8744c1', marginBottom: 50, }}>
                                        <Text style={{ fontFamily:"Roboto-Regular" , color: '#8431d0', textAlign: 'center', fontSize: 16, }}>{item.user_type}</Text>
                                    </View>
                                </View>
                                {item.tags.length > 0 ?
                                    <View style={{ alignItems: 'center', paddingHorizontal:8,paddingVertical:3, borderRadius: 30, alignSelf: 'flex-start', justifyContent: 'center', borderWidth: 1, borderColor: '#cbc3c3', marginLeft: 20, marginTop: 10 }}>
                                        <Text style={{ fontFamily:"Roboto-Regular" , color: '#000000', textAlign: 'center', fontSize: 14,fontWeight:"bold" }}>{item.tags[0]}</Text>
                                    </View>
                                    :
                                    null}
                                <Text style={{  fontFamily:"Roboto-Bold" , color: '#333', fontSize: 16, fontWeight: "bold", textAlign: "left", width: Devicewidth / 1.18, alignSelf: "flex-start", marginLeft: 25, height: Deviceheight / 24, borderBottomColor: '#dfdfdf', borderBottomWidth: 1,  }}>{item.description}</Text>

                            </View>
                        )}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    FlatListContainer: {
        width: Devicewidth,
        height: Deviceheight / 1.1,
        alignItems: 'center',
        marginBottom: 10,
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
        marginBottom: 5,

    },
})