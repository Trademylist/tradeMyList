import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, FlatList, StyleSheet,ActivityIndicator } from 'react-native';
import Header from "../../Component/HeaderOne"
import Footer from "../../Component/Footer"
import NotificationListing from "../../Component/NotificationList/index"
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const axios = require('axios');




// const Data = [
//     {
//         key: '1',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
//     {
//         key: '2',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
//     {
//         key: '3',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
//     {
//         key: '4',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
//     {
//         key: '5',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },

//     {
//         key: '6',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
//     {
//         key: '7',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
//     {
//         key: '8',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
//     {
//         key: '9',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
//     {
//         key: '10',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },

//     {
//         key: '11',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//         Desc2: "Is the price negotiable?",
//         Days: "20 Days ago",
//         Image: require('../../Assets/default-avatar.png')
//     },
// ];

// const NotificationData = [
//     {
//         key: '1',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
//     {
//         key: '2',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
//     {
//         key: '3',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
//     {
//         key: '4',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
//     {
//         key: '5',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },

//     {
//         key: '6',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
//     {
//         key: '7',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
//     {
//         key: '8',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
//     {
//         key: '9',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
//     {
//         key: '10',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },

//     {
//         key: '11',
//         name: 'Kundra',
//         Desc: "Website image upload 2",
//     },
// ];
const ref = firestore().collection('Trade_Message');

export default class Chatter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Message: true,
            Notification: false,
            All: true,
            Selling: false,
            Buying: false,
            SellingChat: [],
            BuyingChat: [],
            AllChat: [],
            AllNotification: [],
            chatLoader:false

        }
    }
    state = this.state;


    async componentDidMount() {
        this.setState({
            All: true,
            Selling: false,
            Buying: false,
            SellingChat: [],
            BuyingChat: [],
            AllChat: [],
        })
        this.getChat()
        this.buyChat()
        // this.allChat()
        this.notificationdata()
        // this.HandelReload()


    }
    // async componentDidUpdate(prevState) {
    //     if(this.state.AllChat !== prevState.AllChat){
    //         this.componentDidMount()
    //     }
    // }

    HandelReload() {
        this.props.navigation.addListener('focus', async () => {
            alert('yoo')
            this.setState({
                All: true,
                Selling: false,
                Buying: false,
                SellingChat: [],
                BuyingChat: [],
                AllChat: [],
            })
            this.getChat()
            this.buyChat()
            // this.allChat()
            this.notificationdata()
        })
    }

    getChat = async () => {
        this.setState({
            chatLoader:true
        })
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            // ref.orderBy('created', 'desc')
            // ref.where('seller_id', '==', value.userid)
            //     // .where('seen', '==', true)
            //     // .orderBy('createdAt', 'desc')
            //     .onSnapshot(querySnapshot => {
            //         var checkSelling = []
            //         querySnapshot.docs.map(doc => {
            //             checkSelling.push(doc.data())
            //         })
            //         this.getSellingData(checkSelling)
            //     })
            ref.where('seller_id', '==', value.userid)
            .get()
            .then(querySnapshot => {
                var checkSelling = []
                querySnapshot.docs.map(doc => {
                    checkSelling.push(doc.data())
                })
                this.getSellingData(checkSelling)
            });

        } catch (e) {
            // error reading value
        }

    }




    getSellingData = async (data) => {
        //console.log('selling Data',data)
        try {
            var sellingData = []
            const value = JSON.parse(await AsyncStorage.getItem('UserData'));
            let getSameByProdId = this.groupBy(data, 'product_id');
            console.log("getSameByProdId",getSameByProdId);
            getSameByProdId.map((data, index) => {
            axios.get("https://trademylist.com:8936/app_user/product/" + data.product_id)
            .then(response => {
                if(response.data.data.product !== null){
                    const productname = response.data.data.product.product_name
                    var getUser;
                    if (data.sender_id === value.userid) {
                        getUser = data.receiver_id
                    } else {
                        getUser = data.sender_id
                    }
                    //console.log('product name',productname)
                    //console.log('user',getUser)

                    axios.get("https://trademylist.com:8936/user/" + getUser, {
                        headers: {
                            'x-access-token': value.token,
                        }
                    })
                    .then(response => {
                        const object= {
                            talkerFirstname:response.data.data.username,
                            image:response.data.data.image,
                            message:data.message,
                            date:data.created,
                            sender_id:data.sender_id,
                            receiver_id:data.receiver_id,
                            product_id:data.product_id,
                            product_name:productname
                        }
                        //console.log('message object',index,object)
                        this.setState({
                            SellingChat:[...this.state.SellingChat,object],
                            AllChat:[...this.state.AllChat,object]
                        })
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
                }
            })
            .catch(error => {
                //console.log(error.data)
            })
            })
            // const newChat = [getSameByProdId, ...this.state.AllChat]
            // this.setState({
            //     SellingChat: getSameByProdId,
            //     AllChat: newChat
            // })
        } catch (e) {
            // error reading value
        }
    }

    buyChat = async () => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            // ref.where('seller_id', '!=', value.userid)
            //     // .where('seen', '==', true)
            //     // .orderBy('createdAt', 'desc')
            //     .onSnapshot(querySnapshot => {
            //         var checkSelling = []
            //         querySnapshot.docs.map(doc => {
            //             checkSelling.push(doc.data())
            //         })
            //         this.getBuyingData(checkSelling)
            //     })

            ref.where('seller_id', '!=', value.userid)
            .get()
            .then(querySnapshot => {
                var checkSelling = []
                querySnapshot.docs.map(doc => {
                    checkSelling.push(doc.data())
                })
                this.getBuyingData(checkSelling)
            });
        } catch (e) {
            // error reading value
        }
    }

    getBuyingData = async (buydata) => {
        try {
            // //console.log(buydata)
            var buyingData = []
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            const Trimdata = buydata.filter(data => data.receiver_id === value.userid || data.sender_id === value.userid)
            if (Trimdata.length > 0) {
                let getSameByProdIdbuying = this.groupBy(Trimdata, 'product_id')
                getSameByProdIdbuying.map((data, index) => {
                    // //console.log(data)
                    axios.get("https://trademylist.com:8936/app_user/product/" + data.product_id)
                        .then(response => {
                            const productname = response.data.data.product.product_name
                            var getUser;
                            if (data.sender_id === value.userid) {
                                getUser = data.receiver_id
                            } else {
                                getUser = data.sender_id
                            }
                            //console.log(getUser)
                            axios.get("https://trademylist.com:8936/user/" + getUser, {
                                headers: {
                                    'x-access-token': value.token,
                                }
                            })
                            .then(response => {
                                const object= {
                                    talkerFirstname:response.data.data.username,
                                    image:response.data.data.image,
                                    message:data.message,
                                    date:data.created,
                                    sender_id:data.sender_id,
                                    receiver_id:data.receiver_id,
                                    product_id:data.product_id,
                                    product_name:productname
                               }
                               buyingData.push(object)
                               this.setState({
                                BuyingChat:[...this.state.BuyingChat,object],
                                AllChat:[...this.state.AllChat,object]
                            })
                            })
                            .catch(error => {
                                //console.log(error.data)
                            })

                        })
                        .catch(error => {
                            //console.log(error.data)
                        })
                })
                // const newChatbuying = [getSameByProdIdbuying, ...this.state.AllChat]
                // this.setState({
                //     BuyingChat: getSameByProdIdbuying,
                //     AllChat: newChatbuying
                // })
            }
        } catch (e) {
            // error reading value
        }
    }



    groupBy = (array, key) => {
        console.log('array',array);
        // empty object is the initial value for result object
        var selectedArray = []
        var selectedArrayData = []
        array.map((data, index) => {
            if (selectedArray.length === 0) {
                selectedArray.push(data[key])
                selectedArrayData.push(data)
            } else {
                const found = selectedArray.indexOf(data[key])
                if (found === -1) {
                    selectedArray.push(data[key])
                    selectedArrayData.push(data)
                } else {
                    selectedArrayData[found] = data
                    selectedArray[found] = data[key]

                }
            }
        })
        //console.log(selectedArray)
        return selectedArrayData;
    };



    getnotifyseen = async (notifyid) => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            const object = { "_id": notifyid, "seen": true }
            await axios.delete("https://trademylist.com:8936/app_seller/notification/"+notifyid, {
                headers: {
                    'x-access-token': value.token,
                }
            })
            .then(response => {
                //console.log(response.data)
                if (response.data.success) {
                    this.notificationdata()
                }
            })
            .catch(error => {
                //console.log(error.data)
            })

        } catch (e) {
            // error reading value
        }
    }

    getnotifyseenall = async (notifyid) => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            const object = { "_id": notifyid, "seen": true }
            await axios.delete("https://trademylist.com:8936/app_seller/delete_notification", {
                headers: {
                    'x-access-token': value.token,
                }
            })
            .then(response => {
                //console.log(response.data)
                if (response.data.success) {
                    this.notificationdata()
                }
            })
            .catch(error => {
                //console.log(error.data)
            })

        } catch (e) {
            // error reading value
        }
    }

    notificationdata = async () => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            await axios.get("https://trademylist.com:8936/app_seller/notification", {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(response => {
                    this.setState({
                        AllNotification: response.data.data,
                        chatLoader:false
                    })
                })
                .catch(error => {
                    //console.log(error.data)
                })
        } catch (e) {
            // error reading value
        }
    }

    getNavigation = async (item) => {
        // //console.log(item)
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            let otherId;
            if (item.receiver_id === value.userid) {
                otherId = item.sender_id
            } else {
                otherId = item.receiver_id
            }
            this.props.navigation.navigate('chatDetails', { "productId": item.product_id, "otherId": otherId })

        } catch {

        }
    }


    // allChat = async () => {
    //     const {BuyingChat,SellingChat} = this.state
    //     const allchat = [...BuyingChat,...SellingChat];
    //     //console.log('allchat'+allchat)
    //     this.setState({
    //         AllChat:allchat
    //     })
    // }
    handelMessage = () => {
        this.setState({
            Message: true,
            Notification: false
        })
    }
    handelNotification = () => {
        this.setState({
            Message: false,
            Notification: true
        })
    }
    handelAll = () => {
        this.setState({
            All: true,
            Selling: false,
            Buying: false
        })
    }
    handelSelling = () => {
        this.setState({
            All: false,
            Selling: true,
            Buying: false
        })
    }
    handelBuying = () => {
        this.setState({
            All: false,
            Selling: false,
            Buying: true
        })
    }
    render() {
        //console.log('all chat',this.state.AllChat)
        //console.log('selling chat',this.state.SellingChat)
        return (
            <>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Heading={"Chat"} />


                    <View style={{ width: Devicewidth,  alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#fff', borderBottomColor: '#e6e6e6', borderBottomWidth: 1 }}>
                        {this.state.Message == true ?
                            <TouchableOpacity onPress={() => this.handelMessage()} style={{ width: Devicewidth / 2, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 1 }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Message</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.handelMessage()} style={{ width: Devicewidth / 2, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Message</Text>
                            </TouchableOpacity>
                        }

                        {this.state.Notification == true ?
                            <TouchableOpacity onPress={() => this.handelNotification()} style={{ width: Devicewidth / 2, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 1 }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Notification</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.handelNotification()} style={{ width: Devicewidth / 2, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Notification</Text>
                            </TouchableOpacity>
                        }
                    </View>


                    {this.state.Message == true ?
                        <>
                            <View style={{ width: Devicewidth,  alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#fff', borderBottomColor: '#e6e6e6', borderBottomWidth: 1 }}>
                                {this.state.All == true ?
                                    <TouchableOpacity onPress={() => this.handelAll()} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 1 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>All</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.handelAll()} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>All</Text>
                                    </TouchableOpacity>
                                }
                                {this.state.Selling == true ?
                                    <TouchableOpacity onPress={() => this.handelSelling()} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 1 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Selling</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.handelSelling()} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Selling</Text>
                                    </TouchableOpacity>
                                }
                                {this.state.Buying == true ?
                                    <TouchableOpacity onPress={() => this.handelBuying()} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 1 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Buying</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.handelBuying()} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Buying</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                            {
                                this.state.All
                                    ?
                                    <View style={styles.FlatListContainer}>
                                        {this.state.AllChat == 0 ?
                                            <>
                                                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: 10, marginTop: 10 }}>
                                                    <Image source={require("../../Assets/selling.jpg")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                                </View>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#000", fontWeight: "bold", textAlign: "center" }}>No Chantted User</Text>
                                            </>
                                            :
                                            <FlatList
                                                data={this.state.AllChat}
                                                scrollEnabled={true}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item }) => (
                                                    <View style={styles.MainContainer}>
                                                        <View style={styles.ImageContainer}>
                                                            {
                                                                item.image !== '' || item.image !== undefined
                                                                    ?
                                                                    <Image source={{ uri: item.image }} style={styles.Image}></Image>
                                                                    :
                                                                    <Image source={require("../../Assets/default-avatar.png")} style={styles.Image}></Image>
                                                            }


                                                        </View>
                                                        <TouchableOpacity style={styles.DescriptionContainer} onPress={() => this.getNavigation(item)}>
                                                            <Text style={styles.Name}>{item.talkerFirstname === null ? 'Test User' : item.talkerFirstname}</Text>
                                                            <Text style={styles.Description}>{item.product_name}</Text>
                                                            <Text style={styles.Description2}>{item.message}</Text>
                                                        </TouchableOpacity>
                                                        <View style={styles.DateMainContainer}>

                                                            <Text style={styles.Date}>{item.Days}</Text>
                                                        </View>
                                                    </View>
                                                )}
                                                keyExtractor={item => item.id}
                                            />
                                        }
                                    </View>
                                    :
                                    this.state.Selling
                                        ?
                                        <View style={styles.FlatListContainer}>
                                            {this.state.SellingChat.length == 0 ?
                                                <>
                                                    <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: 10, marginTop: 10 }}>
                                                        <Image source={require("../../Assets/selling.jpg")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                                    </View>
                                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#000", fontWeight: "bold", textAlign: "center" }}>No Chantted User</Text>
                                                </>
                                                :
                                                <FlatList
                                                    data={this.state.SellingChat}
                                                    scrollEnabled={true}
                                                    showsVerticalScrollIndicator={false}
                                                    renderItem={({ item }) => (
                                                        <View style={styles.MainContainer}>
                                                            <View style={styles.ImageContainer}>
                                                                {
                                                                    item.image !== '' || item.image !== undefined
                                                                        ?
                                                                        <Image source={{ uri: item.image }} style={styles.Image}></Image>
                                                                        :
                                                                        <Image source={require("../../Assets/default-avatar.png")} style={styles.Image}></Image>
                                                                }

                                                            </View>
                                                            <TouchableOpacity style={styles.DescriptionContainer} onPress={() => this.getNavigation(item)}>
                                                                <Text style={styles.Name}>{item.talker_name === null ? 'Test User' : item.talker_name}</Text>
                                                                <Text style={styles.Description}>{item.product_name}</Text>
                                                                <Text style={styles.Description2}>{item.message}</Text>
                                                            </TouchableOpacity>
                                                            <View style={styles.DateMainContainer}>

                                                                <Text style={styles.Date}>{item.Days}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    keyExtractor={item => item.id}
                                                />
                                            }
                                        </View>
                                        :
                                        <View style={styles.FlatListContainer}>
                                            {this.state.BuyingChat.length == 0 ?
                                                <>
                                                    <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: 10, marginTop: 10 }}>
                                                        <Image source={require("../../Assets/selling.jpg")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                                    </View>
                                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#000", fontWeight: "bold", textAlign: "center" }}>No Chantted User</Text>
                                                </>
                                                :
                                                <FlatList
                                                    data={this.state.BuyingChat}
                                                    scrollEnabled={true}
                                                    showsVerticalScrollIndicator={false}
                                                    renderItem={({ item }) => (
                                                        <View style={styles.MainContainer}>
                                                            <View style={styles.ImageContainer}>
                                                                {
                                                                    item.image !== '' || item.image !== undefined
                                                                        ?
                                                                        <Image source={{ uri: item.image }} style={styles.Image}></Image>
                                                                        :
                                                                        <Image source={require("../../Assets/default-avatar.png")} style={styles.Image}></Image>
                                                                }

                                                            </View>
                                                            <TouchableOpacity style={styles.DescriptionContainer} onPress={() => this.props.navigation.navigate('chatDetails', { "productId": item.product_id, "otherId": item.receiver_id })}>
                                                                <Text style={styles.Name}>{item.receiver_name === null ? 'Test User' : item.talkerFirstname}</Text>
                                                                <Text style={styles.Description}>{item.product_name}</Text>
                                                                <Text style={styles.Description2}>{item.message}</Text>
                                                            </TouchableOpacity>
                                                            <View style={styles.DateMainContainer}>
                                                                <Text style={styles.Date}>{item.Days}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    keyExtractor={item => item.id}
                                                />
                                            }
                                        </View>

                            }

                        </>
                        :
                        <View style={styles.NotificationFlatListContainer}>
                            {this.state.AllNotification.length == 0 ?
                                 <>

                                 <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 22, color: "#000", fontWeight: "bold", textAlign: "center",marginTop: 30,marginBottom:10 }}>You're all caught up</Text>
                                 <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 3, width: Devicewidth / 1.5, marginBottom: 10, marginTop: 10,}}>
                                     <Image source={require("../../Assets/no_data.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                 </View>
                                 <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#000", textAlign: "center",width:Devicewidth/1.2,marginTop:5 ,fontWeight:"800"}}>Way to go! Check back later for the latest updates on all your listings and items you are following here.</Text>
                             </>
                                :
                                <>
                                    <TouchableOpacity style={{ alignItems: 'center', height: Deviceheight / 22, width: Devicewidth / 5, borderRadius: Deviceheight / 44, justifyContent: 'center', backgroundColor: '#ff6700', marginLeft: Devicewidth / 1.35, marginTop: 10,marginBottom:10 }} onPress={this.getnotifyseenall}>
                                        <Text style={{ fontFamily:"Roboto-Regular" , color: "#ffffff", fontSize: 16, textAlign: 'center' }}>Clear All</Text>
                                    </TouchableOpacity>
                                    <FlatList
                                        data={this.state.AllNotification}
                                        scrollEnabled={true}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <NotificationListing
                                                name={item.title}
                                                desc={item.message}
                                                notifiyId={item._id}
                                                notifyseen={this.getnotifyseen}
                                            />

                                        )}
                                        keyExtractor={item => item.id}
                                    />
                                </>
                            }
                        </View>
                    }


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
        backgroundColor: '#ffffff'
    },
    NotificationFlatListContainer: {
        width: Devicewidth,
        flex:1,
        alignItems: 'center',
        // backgroundColor: 'pink',
        marginBottom:20
    },
    FlatListContainer: {
        width: Devicewidth,
        flex:1,
        alignItems: 'center',
        // backgroundColor:'yellow',
        marginBottom:20
    },
    ImageContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: Deviceheight / 14,
        width: Devicewidth / 7,
        borderRadius: 360,
        // backgroundColor:'green'
    },
    Image: {
        resizeMode: "contain",
        width: '100%',
        height: "100%",
        borderRadius: 360
    },
    MainContainer: {
        alignItems: 'center',
        height: Deviceheight / 10,
        width: Devicewidth,
        alignSelf: "center",
        padding: 5,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#fff',
        borderBottomColor: '#c2c2c2',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    DescriptionContainer: {
        alignItems: 'flex-start',
        width: Devicewidth / 2,
        height: Deviceheight / 12,
        justifyContent: 'space-evenly'
    },
    Name: {
        textAlign: 'left',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000'
    },
    Description: {
        textAlign: 'left',
        fontSize: 12,
        color: '#000000'
    },
    Description2: {
        textAlign: 'left',
        fontSize: 10,
        color: '#9e9e9e'
    },
    DateMainContainer: {
        alignItems: 'flex-start',
        width: Devicewidth / 4,
        height: Deviceheight / 20,
        alignSelf: 'flex-start',
        justifyContent: "center"
    },
    Date: {
        textAlign: 'left',
        fontSize: 14,
        color: '#9e9e9e'
    },
})
