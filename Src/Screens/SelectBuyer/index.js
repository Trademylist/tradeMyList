import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Fontisto';
const axios = require('axios');
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;


const ref = firestore().collection('Trade_Message');
export default class SelectBuyer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            buyerDetails: []
        }
    }
    // state = this.state;

    async componentDidMount() {
        const productId = this.props.route.params.productId;
        const productType = this.props.route.params.productType;
        // this.gettingSeller(productId)
        // this.getFavList(productId, productType)
        this.getAllPossibleBuyers(productId)
    }

    getAllPossibleBuyers = async (productId) => {
        let allData = []
        ref.where('product_id', '==', productId).get().then(querySnapshot => {
            querySnapshot.docs.map(doc => {
                allData.push(doc.data())
            })
            this.filterData(allData);
        });
    }

    filterData = async (allData) => {
        const {userid, token} = JSON.parse(await AsyncStorage.getItem('UserData'));
        const data = allData.map(item => {
            let val = (item.seller_id == item.sender_id) ? item.receiver_id: item.sender_id;
            return {
                ...item, ...{foundUserId: val}
            };
        });
        const key = 'foundUserId';
        const unique = [...new Map(data.map(item => [item[key], item])).values()];
        this.getApiDetails(unique, token);
    }

    getApiDetails = async (unique, token) => {
        let users = [];
        for (let i = 0; i < unique.length; i++) {
            users.push(axios.get("https://trademylist.com:8936/user/" + unique[i].foundUserId, {
                headers: {
                    'x-access-token': token,
                }
            }));
        }
        const userData = await Promise.all([...users]);
        const updatedUsers = unique.map(user => {
            userData.forEach(userD => {
                if(user.foundUserId == userD.data.data._id){
                    user.userName = userD.data.data.username;
                    user.userImage = userD.data.data.image;
                }
            });
            return user;
        })
        console.log('data', updatedUsers);
        this.setState({
            buyerDetails: updatedUsers
        })
    }

    // gettingSeller = async (productId) => {

    //     ref
    //         .where('product_id', '==', productId)
    //         .orderBy('created', 'desc')
    //         .get()
    //         .then(querySnapshot => {
    //             var messageData = []
    //             querySnapshot.docs.map(doc => {
    //                 messageData.push(doc.data())
    //             })
    //             this.gettrimMessage(messageData)
    //         });
    //     // firestore()
    //     //     .collection('trade_chats')
    //     //     .where('product_id', '==', productId)
    //     //     .orderBy('created', 'desc')
    //     //     .onSnapshot(querySnapshot => {
    //     //         let messageData = []
    //     //         querySnapshot.docs.map(doc => {
    //     //             messageData.push(doc.data())
    //     //         })
    //     //         this.gettrimMessage(messageData)
    //     //     })
    // }
    // groupBy = (array, key) => {
    //     // empty object is the initial value for result object
    //     var selectedArray = []
    //     var selectedArrayData = []
    //     array.map((data, index) => {
    //         if (selectedArray.length === 0) {
    //             selectedArray.push(data[key])
    //             selectedArrayData.push(data)
    //         } else {
    //             const found = selectedArray.indexOf(data[key])
    //             if (found === -1) {
    //                 selectedArray.push(data[key])
    //                 selectedArrayData.push(data)
    //             } else {
    //                 selectedArrayData[found] = data
    //                 selectedArray[found] = data[key]

    //             }
    //         }
    //     })
    //     //console.log(selectedArray)
    //     //console.log(selectedArrayData)
    //     return selectedArrayData;
    // }

    // gettrimMessage = async (msgData) => {
    //     if (msgData.length > 0) {
    //         const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
    //         let getSameByProdId = this.groupBy(msgData, 'product_id')
    //         getSameByProdId.map((data, index) => {
    //         // //console.log("my message data", msgData);
    //         // //console.log("my getSameByProdId", getSameByProdId);
    //         var getUser;
    //                 if (data.sender_id === value.userid) {
    //                     getUser = data.receiver_id
    //                 } else {
    //                     getUser = data.sender_id
    //                 }
                    
    //         //console.log("my userid", value.userid);
    //         //console.log("my getUser data", getUser);
    //         axios.get("https://trademylist.com:8936/user/" + getUser, {
    //                     headers: {
    //                         'x-access-token': value.token,
    //                     }
    //                 })
    //                 .then(response => {
    //                     //console.log(response.data)
    //                     if (response.data.success) {
    //                         const object = {
    //                             "id": response.data.data._id,
    //                             "username": response.data.data.username,
    //                             "userImage": response.data.data.image
    //                         }
    //                         this.setState({
    //                             buyerDetails: [...this.state.buyerDetails, object],
    //                         }, () => {
    //                             let array = [...this.state.buyerDetails];
    //                             let updated = array.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
    //                             this.setState({
    //                                 buyerDetails: updated,
    //                             })
    //                         })
    //                     }
    //                 })
    //             }
    //         )
    //     }
    // }

    // getFavList = async (productId, prodType) => {
    //     try {
    //         const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
    //         if (value !== null) {
    //             let url;
    //             if (prodType === 'general') {
    //                 url = "https://trademylist.com:8936/app_user/product/" + productId
    //             } else {
    //                 url = "https://trademylist.com:8936/app_user/freebies/" + productId
    //             }
    //             await axios.get(url)
    //                 .then(response => {
    //                     const getlikeDetails = response.data.data.product.likelist;
    //                     if (getlikeDetails.length > 0) {
    //                         getlikeDetails.map((lkData, lkindex) => {
    //                             axios.get("https://trademylist.com:8936/user/" + lkData, {
    //                                 headers: {
    //                                     'x-access-token': value.token,
    //                                 }
    //                             })
    //                                 .then(response => {
    //                                     //console.log(response.data)
    //                                     if (response.data.success) {
    //                                         const object = {
    //                                             "id": response.data.data._id,
    //                                             "username": response.data.data.username,
    //                                             "userImage": response.data.data.image
    //                                         }
                                            
    //                                         this.setState({
    //                                             buyerDetails: [...this.state.buyerDetails, object],
    //                                         }, () => {
    //                                             let array = [...this.state.buyerDetails];
    //                                             let updated = array.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
    //                                             this.setState({
    //                                                 buyerDetails: updated,
    //                                             })
    //                                         })
                                            
    //                                     }
    //                                     // this.setState({
    //                                     //     userDetails: response.data.data,
    //                                     //     ProductLoder: false
    //                                     // })

    //                                 })
    //                                 .catch(error => {
    //                                     //console.log(error.data)
    //                                 })
    //                             return true
    //                         })
    //                     }
    //                 })
    //                 .catch(error => {
    //                     //console.log(error.data)
    //                 })
    //         } else {
    //             // alert('login Modal')
    //         }
    //     } catch (e) {
    //         // error reading value
    //     }
    // }


    render() {
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
                                <Icon name='close-a' size={12} color={'#000'} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#434343', fontSize: 20, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', width: Devicewidth / 1.9, marginLeft: 60, }}>Select a buyer</Text>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, height: Deviceheight / 1.2, }}>
                        {
                            this.state.buyerDetails.map((btrData, btrindex) => { 
                                return (
                                    <TouchableOpacity key={btrindex} style={{ width: Devicewidth / 1.01, paddingHorizontal: 5, alignSelf: 'flex-start', alignItems: 'flex-start', flexDirection: 'row', marginTop: 5, marginBottom: 5 }}
                                        onPress={() => this.props.navigation.navigate('reviewExperience', { "productId": this.props.route.params.productId, "buyerId": btrData.foundUserId, 'process': this.props.route.params.productType })}>
                                        <View style={{
                                            height: Deviceheight / 20,
                                            width: Devicewidth / 10, alignItems: 'flex-start', justifyContent: 'flex-start', alignSelf: 'flex-start', borderRadius: 360, backgroundColor: '#fff', padding: 2
                                        }}>
                                            {
                                                btrData.userImage !== null && btrData.userImage !== ''
                                                    ?
                                                    <Image source={{ uri: btrData.userImage }} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                                    :
                                                    <Image source={require("../../Assets/default-avatar.png")} style={{
                                                    width: '100%',
                                                    height: "100%",
                                                    borderRadius: 360 }}></Image>
                                            }
                                        </View>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 18, fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start', marginTop: 8, marginLeft: 10 }}>{(btrData.userName)?btrData.userName:'Trade User'}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }


                    </ScrollView>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('reviewExperience', { "productId": this.props.route.params.productId, "buyerId": null, 'process': this.props.route.params.productType })} style={{ height: Deviceheight / 12, width: Devicewidth / 1.01, paddingHorizontal: 5, alignSelf: 'flex-end', alignItems: 'center', justifyContent: "center" }}>
                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 17, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', }}>Sold it somewhere else</Text>
                    </TouchableOpacity>
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
})