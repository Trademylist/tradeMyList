import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, FlatList, StyleSheet,StatusBar, SafeAreaView } from 'react-native';
import Header from "../../Component/HeaderOne"
import Footer from "../../Component/Footer"
import NotificationListing from "../../Component/NotificationList/index"
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const axios = require('axios');

const ref = firestore().collection('Trade_Message');

export default class Chatter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chatHeaderList: null,
            chatSellingList: null,
            chatBuyingList:null,
            Message: true,
            Notification: false,
            All: true,
            Selling: false,
            Buying: false,
            SellingChat: [],
            BuyingChat: [],
            AllChat: [],
            AllNotification: [],
            chatLoader:false,
            token: null,
            userId: null
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
        const value = JSON.parse(await AsyncStorage.getItem('UserData'));
        const currentUserId = value.userid;
        const token = value.token;
        this.setState({
            token: token,
            userId: currentUserId
        })
        this.getChat()
        // this.buyChat()
        // this.allChat()
        this.notificationdata()
        // this.HandelReload()


    }

    getChat = async () => {
        this.setState({
            chatLoader:true
        })
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'));
            const currentUserId = value.userid;
            const token = value.token;
            ref.where('sender_id', '==', currentUserId).onSnapshot(querySnapshot => {
                this.getAllChatData(currentUserId, token);
            });
            ref.where('receiver_id', '==', currentUserId).onSnapshot(querySnapshot => {
                this.getAllChatData(currentUserId, token);
            });
        } catch (e) {
            // error reading value
        }
    }

    getAllChatData = async (currentUserId, token) => {
        let query1 = ref.where('sender_id', '==', currentUserId);
        let query2 = ref.where('receiver_id', '==', currentUserId)
        let sent = [];
        let received = [];
        let productIds = [];
        let headerChats = [];
        let newHeaders = [];
        const allData = await Promise.all([query1.get(), query2.get()]);
        allData[0].docs.map(doc => {
            sent.push(doc.data())
        })
        allData[1].docs.map(doc => {
            received.push(doc.data());
        })
        const all = [...sent, ...received].sort((a,b) => b.created - a.created);
        for (let i = 0; i < all.length; i++) {
            let product_id = all[i].product_id;
            if(newHeaders.length == 0){
                newHeaders.push({product_id: all[i].product_id, data: [all[i]]});
            } else {
                let found = false;
                for (let j = 0; j < newHeaders.length; j++) {
                    const headerElement = newHeaders[j];
                    if(headerElement.product_id == product_id){
                        found = true;
                        let unique = true;
                        for (let k = 0; k < headerElement.data.length; k++) {
                            const element = headerElement.data[k];
                            let idToBeCheckedIn = (currentUserId == element.sender_id) ? element.receiver_id: element.sender_id;
                            let idToBeCheckedOut = (currentUserId == all[i].sender_id) ? all[i].receiver_id: all[i].sender_id;
                            if(idToBeCheckedOut == idToBeCheckedIn){
                                unique = false;
                                break;
                            }
                        }
                        if(unique){
                            newHeaders[j].data.push(all[i]);
                            break;
                        }
                    }
                }
                if(!found){
                    newHeaders.push({product_id: all[i].product_id, data: [all[i]]});
                }
            }
        }
        for (let i = 0; i < newHeaders.length; i++) {
            let main = newHeaders[i];
            for (let j = 0; j < main.data.length; j++) {
                let sub = main.data[j];
                headerChats.push(sub);
            }
        }

        headerChats = [...headerChats].sort((a,b) => b.created - a.created);

        // for (let i = 0; i < newHeaders.length; i++) {
        //     let main = newHeaders[i];
        //     for (let j = 0; j < main.data.length; j++) {
        //         let sub = main.data[j];
        //         if(headerChats.length == 0){
        //             headerChats.push(sub);
        //         } else {
        //             let unique = false;
        //             for (let k = 0; k < headerChats.length; k++) {
        //                 if(headerChats[k].product_id == sub.product_id){
        //                     console.log('sub', headerChats[k], sub);
        //                     let idToBeCheckedOut = (currentUserId == sub.sender_id) ? sub.receiver_id: sub.sender_id;
        //                     let idToBeCheckedIn = (currentUserId == headerChats[k].sender_id) ? headerChats[k].receiver_id: headerChats[k].sender_id;
        //                     console.log('idToBeCheckedIn != idToBeCheckedOut', idToBeCheckedIn, idToBeCheckedOut);
        //                     if(idToBeCheckedIn != idToBeCheckedOut){
        //                         unique = true;
        //                         headerChats.push(sub);
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        // let obj = {product_id: all[i].product_id, data: }
        // if(!productIds.includes(all[i].product_id)){
        //     productIds.push(all[i].product_id);
        //     headerChats.push(all[i]);
        // }

        // if(headerChats.length == 0){
        //     headerChats.push(all[i]);
        // } else {
        //     let idToBeCheckedFromMainArray = (currentUserId == all[i].sender_id) ? all[i].receiver_id: all[i].sender_id;
        //     let filteredArray = headerChats.filter(item => (item.product_id == all[i].product_id));
        //     console.log('filteredArray', filteredArray);
        //     if(filteredArray.length > 0){
        //         for (let k = 0; k < filteredArray.length; k++) {
        //             let idToBeCheckedFromInsideArray = (currentUserId == filteredArray[k].sender_id) ? filteredArray[k].receiver_id: filteredArray[k].sender_id;
        //             if(idToBeCheckedFromInsideArray != idToBeCheckedFromMainArray){
        //                 headerChats.push(all[i]);
        //                 break;
        //             }
        //         }
        //         console.log('headerChats', headerChats);
        //     } else {
        //         headerChats.push(all[i]);
        //     }
        // }
        this.getApiData(headerChats, currentUserId, token);
    }

    getApiData = async (chatHeads, currentUserId, token) => {
        let array = [];
        let users = [];
        for (let i = 0; i < chatHeads.length; i++) {
            let userIdToBeFetched = (currentUserId == chatHeads[i].sender_id) ? chatHeads[i].receiver_id: chatHeads[i].sender_id;
            const url = chatHeads[i].prod_type == 'p' ? 'product' : 'freebies';
            array.push(axios.get(`https://trademylist.com:8936/app_user/${url}/` + chatHeads[i].product_id));
            users.push(axios.get("https://trademylist.com:8936/user/" + userIdToBeFetched, {
                headers: {
                    'x-access-token': token,
                }
            }));
        }
        const productData = await Promise.all([...array]);
        const userData = await Promise.all([...users]);
        const updatedChatHeads = chatHeads.map(chatHead => {
            productData.forEach(pro => {
                if(chatHead.product_id == pro.data.data.product._id){
                    chatHead.product_name = pro.data.data.product.product_name;
                }
            });
            userData.forEach(user => {
                let toBeShownUserId = (currentUserId == chatHead.sender_id) ? chatHead.receiver_id: chatHead.sender_id;
                if(toBeShownUserId == user.data.data._id){
                    chatHead.userName = user.data.data.username;
                    chatHead.userImage = user.data.data.image;
                }
            });
            return chatHead;
        })
        this.setState({
            chatHeaderList: updatedChatHeads
        })
        const sellingList = updatedChatHeads.filter(item => item.seller_id == currentUserId);
        const buyingList = updatedChatHeads.filter(item => item.seller_id != currentUserId);
        this.setState({
            chatBuyingList: buyingList,
            chatSellingList: sellingList
        })
        //console.log("chatHeads", updatedChatHeads);
    }

    changeMessageTabState = type => {
        this.setState({
            All: type == 'all' ? true : false,
            Selling: type == 'sell' ? true : false,
            Buying: type == 'buy' ? true : false
        })
    }


    getSellingData = async (data) => {
        //console.log('selling Data',data)
        try {
            var sellingData = []
            const value = JSON.parse(await AsyncStorage.getItem('UserData'));
            let getSameByProdId = this.groupBy(data, 'product_id');
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
            this.props.navigation.navigate('chatDetails', { "productId": item.product_id, "prod_type": item.prod_type, "otherId": otherId })

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

    render() {
        //console.log('all chat',this.state.AllChat)
        //console.log('selling chat',this.state.SellingChat)
        return (
            <>
                <View style={styles.Container}>
                    <StatusBar barStyle={"light-content"}/>
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
                                    <TouchableOpacity onPress={() => this.changeMessageTabState('all')} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 1 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>All</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.changeMessageTabState('all')} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>All</Text>
                                    </TouchableOpacity>
                                }
                                {this.state.Selling == true ?
                                    <TouchableOpacity onPress={() => this.changeMessageTabState('sell')} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 1 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Selling</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.changeMessageTabState('sell')} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Selling</Text>
                                    </TouchableOpacity>
                                }
                                {this.state.Buying == true ?
                                    <TouchableOpacity onPress={() => this.changeMessageTabState('buy')} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", borderBottomColor: "#383ec1", borderBottomWidth: 1 }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#383ec1', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Buying</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.changeMessageTabState('buy')} style={{ width: Devicewidth / 3, height: Deviceheight / 18, alignItems: 'center', justifyContent: "center", }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#606160', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Buying</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                            {
                                <View style={styles.FlatListContainer}>
                                    {
                                        this.state.All &&
                                        <>
                                        {
                                            this.state.chatHeaderList !== null &&
                                            <>
                                                {
                                                    this.state.chatHeaderList.length > 0 ?
                                                    <FlatList
                                                    data={this.state.chatHeaderList}
                                                    scrollEnabled={true}
                                                    showsVerticalScrollIndicator={false}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity onPress={() => this.getNavigation(item)} style={styles.MainContainer}>
                                                            <View style={styles.ImageContainer}>
                                                            {
                                                                item.userImage ?
                                                                <Image source={{ uri: item.userImage }} style={styles.Image}></Image>
                                                                :
                                                                <Image source={require("../../Assets/default-avatar.png")} style={styles.Image}></Image>
                                                            }
                                                            </View>
                                                            <View style={styles.DescriptionContainer}>
                                                                <Text style={styles.Name}>{!item.userName ? 'Test User' : item.userName}</Text>
                                                                <Text style={((item.receiver_id == this.state.userId) && !item.seen) ? styles.DescriptionUnseen :styles.Description}>{item.product_name}</Text>
                                                                <Text style={((item.receiver_id == this.state.userId) && !item.seen) ? styles.Description2Unseen : styles.Description2}>{item.message}</Text>
                                                            </View>
                                                            {/* <View style={styles.DateMainContainer}>
                                                                <Text style={styles.Date}>{item.Days}</Text>
                                                            </View> */}
                                                        </TouchableOpacity>
                                                    )}

                                                    keyExtractor={item => item.messageId}
                                                    />
                                                    :
                                                    <>
                                                        <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: 10, marginTop: 10 }}>
                                                            <Image source={require("../../Assets/selling.jpg")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                                        </View>
                                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#000", fontWeight: "bold", textAlign: "center" }}>No Chatted User</Text>
                                                    </>
                                                }
                                            </>
                                        }
                                        </>
                                    }
                                    {
                                        this.state.Selling &&
                                        <>
                                        {
                                            this.state.chatSellingList !== null &&
                                            <>
                                                {
                                                    this.state.chatSellingList.length > 0 ?
                                                    <FlatList
                                                        data={this.state.chatSellingList}
                                                        scrollEnabled={true}
                                                        showsVerticalScrollIndicator={false}
                                                        renderItem={({ item }) => (
                                                            <TouchableOpacity onPress={() => this.getNavigation(item)} style={styles.MainContainer}>
                                                                <View style={styles.ImageContainer}>
                                                                {
                                                                    item.userImage ?
                                                                    <Image source={{ uri: item.userImage }} style={styles.Image}></Image>
                                                                    :
                                                                    <Image source={require("../../Assets/default-avatar.png")} style={styles.Image}></Image>
                                                                }
                                                                </View>
                                                                <View style={styles.DescriptionContainer}>
                                                                    <Text style={styles.Name}>{!item.userName ? 'Test User' : item.userName}</Text>
                                                                    <Text style={((item.receiver_id == this.state.userId) && !item.seen) ? styles.DescriptionUnseen :styles.Description}>{item.product_name}</Text>
                                                                    <Text style={((item.receiver_id == this.state.userId) && !item.seen) ? styles.Description2Unseen : styles.Description2}>{item.message}</Text>
                                                                </View>
                                                                {/* <View style={styles.DateMainContainer}>
                                                                    <Text style={styles.Date}>{item.Days}</Text>
                                                                </View> */}
                                                            </TouchableOpacity>
                                                        )}
                                                        keyExtractor={item => item.messageId}
                                                    />
                                                    :
                                                    <>
                                                        <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: 10, marginTop: 10 }}>
                                                            <Image source={require("../../Assets/selling.jpg")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                                        </View>
                                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#000", fontWeight: "bold", textAlign: "center" }}>No Chatted User</Text>
                                                    </>
                                                }
                                            </>
                                        }
                                        </>

                                    }
                                    {
                                        this.state.Buying &&
                                        <>
                                        {
                                            this.state.chatBuyingList !== null  &&
                                            <>
                                                {
                                                    this.state.chatBuyingList.length > 0 ?
                                                    <FlatList
                                                        data={this.state.chatBuyingList}
                                                        scrollEnabled={true}
                                                        showsVerticalScrollIndicator={false}
                                                        renderItem={({ item }) => (
                                                            <TouchableOpacity onPress={() => this.getNavigation(item)} style={styles.MainContainer}>
                                                                <View style={styles.ImageContainer}>
                                                                {
                                                                    item.userImage ?
                                                                    <Image source={{ uri: item.userImage }} style={styles.Image}></Image>
                                                                    :
                                                                    <Image source={require("../../Assets/default-avatar.png")} style={styles.Image}></Image>
                                                                }
                                                                </View>
                                                                <View style={styles.DescriptionContainer}>
                                                                    <Text style={styles.Name}>{!item.userName ? 'Test User' : item.userName}</Text>
                                                                    <Text style={((item.receiver_id == this.state.userId) && !item.seen) ? styles.DescriptionUnseen :styles.Description}>{item.product_name}</Text>
                                                                    <Text style={((item.receiver_id == this.state.userId) && !item.seen) ? styles.Description2Unseen : styles.Description2}>{item.message}</Text>
                                                                </View>
                                                                {/* <View style={styles.DateMainContainer}>
                                                                    <Text style={styles.Date}>{item.Days}</Text>
                                                                </View> */}
                                                            </TouchableOpacity>
                                                        )}
                                                        keyExtractor={item => item.messageId}
                                                    />
                                                    :
                                                    <>
                                                        <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: 10, marginTop: 10 }}>
                                                            <Image source={require("../../Assets/selling.jpg")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                                        </View>
                                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#000", fontWeight: "bold", textAlign: "center" }}>No Chatted User</Text>
                                                    </>
                                                }
                                            </>
                                        }
                                        </>
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
                                        keyExtractor={item => item._id}
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
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS == 'ios' ? 35 : 0,
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
    MainContainerUnseen: {
        alignItems: 'center',
        height: Deviceheight / 10,
        width: Devicewidth,
        alignSelf: "center",
        padding: 5,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: '#c2c2c2',
        borderBottomColor: '#c2c2c2',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    DescriptionContainer: {
        // backgroundColor:'green',
        alignItems: 'flex-start',
        width: Devicewidth / 1.5,
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
        color: '#000000',
        fontFamily: 'Roboto-Regular'
    },
    DescriptionUnseen: {
        textAlign: 'left',
        fontSize: 12,
        color: '#000000',
        fontFamily: 'Roboto-Bold'
    },
    Description2: {
        textAlign: 'left',
        fontSize: 10,
        color: '#000000',
        fontFamily: 'Roboto-Bold'
    },
    Description2Unseen: {
        textAlign: 'left',
        fontSize: 12,
        color: '#000',
        fontFamily: 'Roboto-Bold'
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
