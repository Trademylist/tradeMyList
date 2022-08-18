import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat'
import {ScrollView, View, Text, Image, ImageBackground, StyleSheet, Dimensions,SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { itemWidth } from '../ProductDetailsBannerSlider/slideEntryStyle';
import firestore from '@react-native-firebase/firestore';
import StarRating from 'react-native-star-rating';
import { chatList } from '../../helperFunctions/chatList';
import { UPDATE_CHAT_COUNTER } from '../../store/actions';
const axios = require('axios');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import {connect} from 'react-redux';

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

const ref = firestore().collection('Trade_Message');

function ChatDetails(props) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [productData, setProductData] = useState('')
  const [userData, setUserData] = useState('')
  const [userId, setUserId] = useState('')
  const [otherId, setOtherId] = useState('')
  const [ReviewList, setReviewList] = useState([])
  const [UserStarCount, setUserStarCount] = useState(0)
  const [UserReviewCount, setUserReviewCount] = useState(0)
  const navigation = useNavigation();

  useEffect(() => {
    setOtherId(props.route.params.otherId)
    getProductDetails(props.route.params.productId)
    getuserDetails(props.route.params.otherId)
    setMessages([])
    const messagesListener = ref
      .where('product_id', '==', props.route.params.productId)
      .orderBy('created', 'desc')
      .onSnapshot(querySnapshot => {
        let messageData = [];
        let documentWithKeys = [];
        if(querySnapshot){
          querySnapshot.docs.map(doc => {
            documentWithKeys.push({key: doc.ref.path.split("/")[1], value: doc.data()});
            messageData.push(doc.data())
          })
          gettrimMessage(messageData);
          updateSeenStatus(documentWithKeys);
        }
      }, (error) => {
        //console.log('errrrrrrrr', error);
      })
    return () => messagesListener();

  }, [])

  const updateSeenStatus = async (documentWithKeys) => {
    //console.log('qqq', documentWithKeys);
    const value = JSON.parse(await AsyncStorage.getItem('UserData'))
    if(documentWithKeys.length > 0){
      documentWithKeys.forEach(async element => {
        if((element.value.receiver_id == value.userid) && (props.route.params.otherId == element.value.sender_id)){
          if(!element.value.seen){
            ref
            .doc(element.key)
            .update({
              seen: true,
            })
            let val = await chatList(props.onChatCounterUpdate);
            // props.onChatCounterUpdate(val);
          }
        }
      });
    }
  }

  const gettrimMessage = async (messageData) => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('UserData'))
      const Trimdata = messageData.filter(data => data.receiver_id === value.userid && data.sender_id === props.route.params.otherId || data.receiver_id === props.route.params.otherId && data.sender_id === value.userid)
      let getmessageData = [];
      Trimdata.map((doc, index) => {
        getmessageData.push({
          _id: index,
          text: doc.message,
          createdAt: new Date().getTime(),
          user: {
            _id: doc.sender_id,
          },
        })
      });
      // //console.log(getmessageData)
      const sortmessageData = getmessageData.slice().sort((a, b) => b.created - a.created)

      setUserId(value.userid)
      setMessages(sortmessageData)

    } catch (e) {
      // error reading value
    }

    // const trimData = messageData.filter(data =>data. )
  }


  async function handleSend(messages) {
    try {
      const random = generateRandomNo();
      const value = JSON.parse(await AsyncStorage.getItem('UserData'))
      const senderId = value.userid
      const receiver_id = otherId
      const productId = props.route.params.productId;
      const sellerId = productData.user_id;
      const text = messages[0].text;
      firestore()
        .collection('Trade_Message')
        .add({
          messageId: random,
          created: new Date().getTime(),
          image: "",
          message: text,
          product_id: productId,
          prod_type: props.route.params.prod_type,
          receiver_id: receiver_id,
          seen: false,
          seller_id: sellerId,
          sender_id: senderId
        });
        HitPush(sellerId, senderId, receiver_id, productId, text)
    }
    catch (e) {
      // error reading value
    }
  }

  const generateRandomNo = () => {
    const val = Date.now().toString() + parseInt(Math.random() * 36);
    return val;
  }

  const HitPush = async (sellerId, senderId, receiver_id, productId, text) => {
    try {
      let ProductImage = '';
      if(productData.cover_thumb != ''){
          ProductImage=productData.cover_thumb
      }
      const value = JSON.parse(await AsyncStorage.getItem('UserData'))
      console.log("in handel HitPush", value);
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
          console.log('errorA',error)
        })
      }
    } catch (error) {
      console.log('errorB', error)
    }
  }

  async function handleSendQuickMessage(message) {
    try {
      // const value = JSON.parse(await AsyncStorage.getItem('UserData'))
      // const senderId = value.userid
      // const receiver_id = otherId
      // const productId = props.route.params.productId
      // const sellerId = productData.user_id
      // const text = message;
      // firestore()
      //   .collection('Trade_Message')
      //   .add({
      //     created: new Date().getTime(),
      //     image: "",
      //     message: text,
      //     product_id: productId,
      //     receiver_id: receiver_id,
      //     seen: false,
      //     seller_id: sellerId,
      //     sender_id: senderId
        // });
        setCurrentMessage(message)
    }
    catch (e) {
      // error reading value
    }
  }

  const getProductDetails = async (ProdId) => {
    let url = props.route.params.prod_type == 'p' ? 'product' : 'freebies';
    await axios.get(`https://trademylist.com:8936/app_user/${url}/` + ProdId)
      .then(response => {
        console.log('innnnn', response);
        setProductData(response.data.data.product)
      })
  }

  const getuserDetails = async (userId) => {
    getReviewList(userId)
    try {
      const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
      if (value !== null) {
        await axios.get("https://trademylist.com:8936/user/" + userId, {
          headers: {
            'x-access-token': value.token,
          }
        })
          .then(response => {
            // //console.log(response.data.data)
            setUserData(response.data.data)


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

  const getReviewList = async (UserId) => {
    const value = JSON.parse(await AsyncStorage.getItem('UserData'))
    if (value !== null) {
      //console.log("my token at chat", value.token);
      const object = {
        user_id: UserId,
      }
      await axios.post("https://trademylist.com:8936/app_seller/get_review", object, {
        headers: {
          'x-access-token': value.token,
        }
      })
        .then(response => {
          setReviewList(response.data.data.review_details)
          //console.log("my review list at chat", response.data.data);
          HandelStarCount(response.data.data.review_details)
        })
        .catch(error => {
          //console.log(error.data)
        })
    } else {
      // alert('login Modal')
    }

  }
  const HandelStarCount = (MyReviewList) => {
    //console.log("my review list at star count fnc", MyReviewList.length);
    let sum = 0
    let avg = 0
    let length = MyReviewList.length
    MyReviewList.map((rattingCount) => {
      sum = sum + rattingCount.rating
    })
    avg = sum / length
    setUserStarCount(avg)
    setUserReviewCount(length)
  }

  // const onSend = useCallback((messages = []) => {
  //   setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  // }, [])

  const renderSendButton = props => {
    return (
      <Send {...props}>
        <View style={currentMessage == '' ? styles.SearchIcon : styles.SearchIcon1}
          onPress={handleSend}
        >
            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: "#fff" }}>Send</Text>
        </View>
      </Send>
    )
  }
  console.log('errorA',productData);
  return (
  
    <SafeAreaView style={styles.container}>
      <View style={{ height: "100%" }}>
        <View style={{ flex: 1 }}>
            <View style={{ height: "100%" }}>
                <View style={{ flex: 1 }}>
                {/* <ScrollView
                style={{
                    width: "100%",
                }}
                > */}
                 <View
      style={{ alignSelf: "center", alignItems: "center", width: Devicewidth, height: Deviceheight / 12, flexDirection: "row", backgroundColor: "#fff", elevation: 5 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{
          height: Deviceheight / 42,
          width: Devicewidth / 21, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, marginBottom: 5,
        }}>
          <Image source={require("../../Assets/BackIconLeft.png")} style={{ height: "100%", width: "100%" }}></Image>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => props.navigation.navigate('productDetails', { "productId": props.route.params.productId, "process": productData.product_type == "Product" ? "general" : "commercial" })}
        style={{
          height: Deviceheight / 16,
          width: Devicewidth / 8, borderRadius: 10, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, marginBottom: 5,
        }}>
          {
            (productData.cover_thumb !== null && productData.cover_thumb !== "") ?
              <Image source={{ uri: productData.cover_thumb }} style={{ height: "100%", width: "100%" }}></Image>
              :
              <>
              {
                productData.category == "Jobs" ?
                <Image source={{uri : "https://trademylist.com:8936/jobs.jpg"}} style={{ height: "100%", width: "100%" }}></Image>
                :
                productData.category == "Services" ?
                <Image source={{uri : "https://trademylist.com:8936/services.jpg"}} style={{ height: "100%", width: "100%" }}></Image>
                :
                <Image source={require("../../Assets/no_product.png")} style={{ height: "100%", width: "100%" }}></Image>
              }
              </>
          }
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => props.navigation.navigate('productDetails', { "productId": props.route.params.productId, "process": productData.product_type == "Product" ? "general" : "commercial" })}
        style={{
          height: Deviceheight / 16,
          width: Devicewidth / 1.6, alignItems: 'flex-start', alignSelf: "center", marginLeft: 20, marginBottom: 5
        }}>
          <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 16, fontWeight: "bold", textAlign: "left", marginBottom: 2, marginTop: 5 }}>{productData.product_name && productData.product_name}</Text>
          {
            (productData.category != "Jobs" && productData.category != "Freebies" && productData.category != "Services") &&
            <Text style={{ fontFamily:"Roboto-Bold" , color: "#434343", fontSize: 12, textAlign: "left", }}>{productData.currencyCode && productData.currencyCode == "INR" ? "₹ " : productData.currencyCode == "USD" ? "$" : `${productData.currencyCode} `} {productData.product_price &&productData.product_price}</Text>
          }
        </TouchableOpacity>
      </View>

    

      <View style={{ alignSelf: "center", alignItems: "center", width: Devicewidth / 1.05, height: Deviceheight / 5, marginTop: 15, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e9e9e9" }}>
        <TouchableOpacity
        onPress={() => props.navigation.navigate('sellerDetails', { "sellerId": otherId })}
        style={{ height: Deviceheight / 7.2, width: Devicewidth / 1.1, paddingHorizontal: 20, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', }}>
          <View style={{
            height: Deviceheight / 10,
            width: Devicewidth / 5, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, backgroundColor: '#fff', padding: 2,
          }}>
            {
              userData.image !== null
                ?
                <Image source={{ uri: userData.image }} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                :
                <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
            }

          </View>
          <View style={{ alignItems: 'center', height: Deviceheight / 10, width: Devicewidth / 1.6, paddingLeft: 20, paddingTop: 15, }}>
            <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 18, textAlign: 'left', alignSelf: 'flex-start', }}>{userData.username ? userData.username : 'Test User'}</Text>
            <View style={{ alignItems: 'flex-start', alignSelf: 'flex-start', width: Devicewidth / 2.5, height: Deviceheight / 26, flexDirection: 'row', }}>
              <View style={{
                height: Deviceheight / 50,
                width: Devicewidth / 4, alignSelf: 'flex-start', marginTop: 10
              }}>
                <StarRating
                  disabled={true}
                  emptyStar={'star-o'}
                  fullStar={'star'}
                  halfStar={'star-half-full'}
                  iconSet={'FontAwesome'}
                  maxStars={5}
                  containerStyle={{ width: Devicewidth / 4.5, justifyContent: 'space-around', height: Deviceheight / 50, alignItems: "center", }}
                  starSize={15}
                  rating={UserStarCount}
                  fullStarColor={'#ff6801'}
                />
              </View>
              <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 14, fontWeight: 'bold', textAlign: 'left', marginTop: 8, marginLeft: 5 }}>({UserReviewCount})</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ height: Deviceheight / 20, width: Devicewidth / 1.1, paddingHorizontal: 20, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{
            height: Deviceheight / 30,
            width: Devicewidth / 2.3, alignItems: "center", justifyContent: "center", alignSelf: "center", flexDirection: 'row', justifyContent: "space-around",
          }}>
            <View style={{
              height: Deviceheight / 50,
              width: Devicewidth / 30, alignItems: "center", justifyContent: "center", alignSelf: "center",
            }}>
              <Image source={require("../../Assets/Member.png")} style={{ height: "100%", width: "100%" }}></Image>
            </View>
            <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 16, textAlign: 'center', alignSelf: 'center', }}>Member since 2020</Text>
          </View>
          {/* <TouchableOpacity>
            <Text style={{ fontFamily:"Roboto-Bold" , color: "#434343", fontSize: 12, textAlign: 'left', alignSelf: 'center', }}>Clear Chat</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      <View style={{
        flex:2,  marginBottom:0,padding:10,height:Deviceheight/1.45,
      }}>
        <GiftedChat
          messages={messages}
          onInputTextChanged={(val => setCurrentMessage(val))}
          onSend={handleSend}
          user={{
            _id: userId,
          }}
          alwaysShowSend
          scrollToBottom
          text={currentMessage}
          renderSend={renderSendButton}
          renderBubble={props => {
            return (
                <Bubble
                    {...props}

                    textStyle={{
                      right: {
                        color: 'white',
                      },
                      left: {
                        color: '#000000',
                      },
                    }}
                    wrapperStyle={{
                      left: {
                        backgroundColor: '#ffffff',
                      },
                      right: {
                        backgroundColor: "#373ec2",
                      },
                    }}
                />
            );
          }}
        />
      </View>
                {/* </ScrollView> */}
                </View>
                  <View
                      style={{
                          borderTopColor: "#dadada",
                          height:60,
                          borderTopWidth: 1,
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingBottom: 10,
                      }}
                    > 
                         {console.log('Chat details',Data)}
                      <View style={styles.FlatListContainer}>
                        <FlatList
                          data={Data}
                          scrollEnabled={true}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item }) => (
                            <TouchableOpacity style={{ borderRadius: 50, alignItems: 'center', justifyContent: "center", backgroundColor: '#373ec2', marginRight: 20, height: 48,  }} onPress={() => handleSendQuickMessage(item.name)}>
                              <Text style={{ fontFamily:"Roboto-Bold" ,padding: 15, fontSize: 14, textAlign: 'center', color: "#fff" }}>{item.name}</Text>
                            </TouchableOpacity>
                          )}
                          keyExtractor={item => item.key}
                        />
                      </View>
                </View>
            </View>
        </View>
        </View>
      </SafeAreaView>

  
  )
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
},

  FlatListContainer: {
    position: 'absolute',
    zIndex: 10001,
    bottom: 0,
    paddingHorizontal: 10,
    width: Devicewidth,

    alignSelf: 'center',
    // height: Deviceheight / 14,
    //alignItems: 'center',
    margin:5,
    //backgroundColor: "grey",
  },
  SearchIcon: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: 360,
    width: Devicewidth / 6,
    height: Deviceheight / 25,
    marginBottom: 8,
    backgroundColor: '#dddddd',
},
SearchIcon1: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: 360,
    width: Devicewidth / 6,
    height: Deviceheight / 25,
    marginBottom: 8,
    backgroundColor: '#373ec2',
},
})

const mapDispatchToProps = dispatch => {
  return {
      onChatCounterUpdate: (val) => dispatch({type: UPDATE_CHAT_COUNTER, payload: val}),
  }
}

export default connect(null, mapDispatchToProps)(ChatDetails);
