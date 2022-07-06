import React, { Component } from 'react';
import { SafeAreaView,View, Text, Image, ScrollView, StyleSheet, Dimensions, Switch, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');

export default class NotificationSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            UserInfo: '',
            SwitchValuePushNotification: true,
            PushNotificationShowMore: false,
            PushNotificationFavouriteListingChange: true,
            PushNotificationPriceChange: true,
            PushNotificationNewPictureAdd: true,
            PushNotificationFavouriteListingSold: true,
            PushNotificationFavouriteListingDeleted: true,
            PushNotificationFavouriteListingExpired: true,
            PushNotificationNewReview: true,
            PushNotificationUserFavouriteListing: true,
            PushNotificationListingExpired: true,

            SwitchValueEmailNotifcation: true,
            EmailNotificationShowMore: false,
            EmailNotificationFavouriteListingChange: true,
            EmailNotificationPriceChange: true,
            EmailNotificationNewPictureAdd: true,
            EmailNotificationFavouriteListingSold: true,
            EmailNotificationFavouriteListingDeleted: true,
            EmailNotificationFavouriteListingExpired: true,
            EmailNotificationNewReview: true,
            EmailNotificationUserFavouriteListing: true,
            EmailNotificationListingExpired: true,

            SwitchValueChatNotification: true,
            ChatNotificationShowMore: false,
            ChatNotificationUnreadMessagePush: true,
            ChatNotificationUnreadMessageEmail: true,
        }
    }
    state = this.state;
    async componentDidMount() {
        this.getStateFromPath()
    }
    getStateFromPath = async () => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {

                await axios.get("https://trademylist.com:8936/app_seller/userdetail", {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            UserInfo: response.data.data
                        })
                        this.SetAllNotification()
                        // //console.log("user info", this.state.UserInfo);

                    })
            } else {
                // error reading value
            }
        } catch (e) {
            // error reading value
        }

    }
    SetAllNotification = () => {
        this.setState({
            PushNotificationFavouriteListingChange: this.state.UserInfo.notification.push.description_change_favorited_product,
            PushNotificationPriceChange: this.state.UserInfo.notification.push.price_change_favorited_product,
            PushNotificationNewPictureAdd: this.state.UserInfo.notification.push.image_change_favorited_product,
            PushNotificationFavouriteListingSold: this.state.UserInfo.notification.push.soldOut_favorited_product,
            PushNotificationFavouriteListingDeleted: this.state.UserInfo.notification.push.delete_favorite_product,
            PushNotificationFavouriteListingExpired: this.state.UserInfo.notification.push.expired_favorite_product,
            PushNotificationNewReview: this.state.UserInfo.notification.push.review,
            PushNotificationUserFavouriteListing: this.state.UserInfo.notification.push.user_visit_product,
            PushNotificationListingExpired: this.state.UserInfo.notification.push.expired_product,

            EmailNotificationFavouriteListingChange: this.state.UserInfo.notification.email.description_change_favorited_product,
            EmailNotificationPriceChange: this.state.UserInfo.notification.email.price_change_favorited_product,
            EmailNotificationNewPictureAdd: this.state.UserInfo.notification.email.image_change_favorited_product,
            EmailNotificationFavouriteListingSold: this.state.UserInfo.notification.email.soldOut_favorited_product,
            EmailNotificationFavouriteListingDeleted: this.state.UserInfo.notification.email.delete_favorite_product,
            EmailNotificationFavouriteListingExpired: this.state.UserInfo.notification.email.expired_favorite_product,
            EmailNotificationNewReview: this.state.UserInfo.notification.email.review,
            EmailNotificationUserFavouriteListing: this.state.UserInfo.notification.email.user_visit_product,
            EmailNotificationListingExpired: this.state.UserInfo.notification.email.expired_product,

            ChatNotificationUnreadMessagePush: this.state.UserInfo.notification.push.chat,
            ChatNotificationUnreadMessageEmail: this.state.UserInfo.notification.email.chat,
        })

    }
    HandelPushNotification = async (val) => {
        this.setState({ SwitchValuePushNotification: val })
        this.SetAllPushNotificationState(val)
        const object = {
            notification: {
                push: {
                    expired_product: this.state.PushNotificationListingExpired,
                    user_visit_product: this.state.PushNotificationUserFavouriteListing,
                    review: this.state.PushNotificationNewReview,
                    expired_favorite_product: this.state.PushNotificationFavouriteListingExpired,
                    delete_favorite_product: this.state.PushNotificationFavouriteListingDeleted,
                    soldOut_favorited_product: this.state.PushNotificationFavouriteListingSold,
                    image_change_favorited_product: this.state.PushNotificationNewPictureAdd,
                    price_change_favorited_product: this.state.PushNotificationPriceChange,
                    description_change_favorited_product: this.state.PushNotificationFavouriteListingChange
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification res", response.data);
                        // alert("push notification Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    SetAllPushNotificationState = (pushstatus) => {
        if (pushstatus == false) {
            this.setState({
                PushNotificationFavouriteListingChange: false,
                PushNotificationPriceChange: false,
                PushNotificationNewPictureAdd: false,
                PushNotificationFavouriteListingSold: false,
                PushNotificationFavouriteListingDeleted: false,
                PushNotificationFavouriteListingExpired: false,
                PushNotificationNewReview: false,
                PushNotificationUserFavouriteListing: false,
                PushNotificationListingExpired: false,
            })
        }
        else if (pushstatus == true) {
            this.setState({
                PushNotificationFavouriteListingChange: true,
                PushNotificationPriceChange: true,
                PushNotificationNewPictureAdd: true,
                PushNotificationFavouriteListingSold: true,
                PushNotificationFavouriteListingDeleted: true,
                PushNotificationFavouriteListingExpired: true,
                PushNotificationNewReview: true,
                PushNotificationUserFavouriteListing: true,
                PushNotificationListingExpired: true,
            })
        }
        else {
            null
        }
    }
    HandelPushNotificationFavouriteListing = async (val) => {
        // //console.log("val", val);
        this.setState({ PushNotificationFavouriteListingChange: val })
        const object = {
            notification: {
                push: {
                    description_change_favorited_product: val
                }
            }
        }

        // //console.log("obj", object);
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification Favourite Listing res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelPushNotificationPriceChange = async (val) => {
        this.setState({ PushNotificationPriceChange: val })
        const object = {
            notification: {
                push: {
                    price_change_favorited_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification price_change res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelPushNotificationPcicAddFevaurite = async (val) => {
        this.setState({ PushNotificationNewPictureAdd: val })
        const object = {
            notification: {
                push: {
                    image_change_favorited_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                //console.log(response.data)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification New Picture Add res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelPushNotificationFavouriteListingSold = async (val) => {
        this.setState({ PushNotificationFavouriteListingSold: val })
        const object = {
            notification: {
                push: {

                    soldOut_favorited_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification Favourite Listing sold res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelPushNotificationFavouriteListingDeleted = async (val) => {
        this.setState({ PushNotificationFavouriteListingDeleted: val })
        const object = {
            notification: {
                push: {

                    delete_favorite_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification Favourite Listing delete res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelPushNotificationFavouriteListingExpired = async (val) => {
        this.setState({ PushNotificationFavouriteListingExpired: val })
        const object = {
            notification: {
                push: {
                    expired_favorite_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification Favourite Listing Expired res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelPushNotificationNewReview = async (val) => {
        this.setState({ PushNotificationNewReview: val })
        const object = {
            notification: {
                push: {
                    review: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification new review res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelPushNotificationUserFavouriteListing = async (val) => {
        this.setState({ PushNotificationUserFavouriteListing: val })
        const object = {
            notification: {
                push: {
                    user_visit_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification  user Favourite Listing res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelPushNotificationListingExpired = async (val) => {
        this.setState({ PushNotificationListingExpired: val })
        const object = {
            notification: {
                push: {

                    expired_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("push notification Listing expired res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }


    // For email notification
    HandelEmailNotification = async (val) => {
        this.setState({ SwitchValueEmailNotifcation: val })
        this.SetAllEmailNotificationState(val)
        const object = {
            notification: {
                email: {
                    expired_product: this.state.EmailNotificationListingExpired,
                    user_visit_product: this.state.EmailNotificationUserFavouriteListing,
                    review: this.state.EmailNotificationNewReview,
                    expired_favorite_product: this.state.EmailNotificationFavouriteListingExpired,
                    delete_favorite_product: this.state.EmailNotificationFavouriteListingDeleted,
                    soldOut_favorited_product: this.state.EmailNotificationFavouriteListingSold,
                    image_change_favorited_product: this.state.EmailNotificationNewPictureAdd,
                    price_change_favorited_product: this.state.EmailNotificationPriceChange,
                    description_change_favorited_product: this.state.EmailNotificationFavouriteListingChange
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification res", response.data);
                        // alert("Email notification Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    SetAllEmailNotificationState = (Emailstatus) => {
        if (Emailstatus == false) {
            this.setState({
                EmailNotificationFavouriteListingChange: false,
                EmailNotificationPriceChange: false,
                EmailNotificationNewPictureAdd: false,
                EmailNotificationFavouriteListingSold: false,
                EmailNotificationFavouriteListingDeleted: false,
                EmailNotificationFavouriteListingExpired: false,
                EmailNotificationNewReview: false,
                EmailNotificationUserFavouriteListing: false,
                EmailNotificationListingExpired: false,
            })
        }
        else if (Emailstatus == true) {
            this.setState({
                EmailNotificationFavouriteListingChange: true,
                EmailNotificationPriceChange: true,
                EmailNotificationNewPictureAdd: true,
                EmailNotificationFavouriteListingSold: true,
                EmailNotificationFavouriteListingDeleted: true,
                EmailNotificationFavouriteListingExpired: true,
                EmailNotificationNewReview: true,
                EmailNotificationUserFavouriteListing: true,
                EmailNotificationListingExpired: true,
            })
        }
        else {
            null
        }
    }
    HandelEmailNotificationFavouriteListing = async (val) => {
        // //console.log("val", val);
        this.setState({ EmailNotificationFavouriteListingChange: val })
        const object = {
            notification: {
                email: {
                    description_change_favorited_product: val
                }
            }
        }

        // //console.log("obj", object);
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification Favourite Listing res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelEmailNotificationPriceChange = async (val) => {
        this.setState({ EmailNotificationPriceChange: val })
        const object = {
            notification: {
                email: {
                    price_change_favorited_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification price_change res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelEmailNotificationPcicAddFevaurite = async (val) => {
        this.setState({ EmailNotificationNewPictureAdd: val })
        const object = {
            notification: {
                email: {
                    image_change_favorited_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification New Picture Add res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelEmailNotificationFavouriteListingSold = async (val) => {
        this.setState({ EmailNotificationFavouriteListingSold: val })
        const object = {
            notification: {
                email: {

                    soldOut_favorited_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification Favourite Listing sold res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelEmailNotificationFavouriteListingDeleted = async (val) => {
        this.setState({ EmailNotificationFavouriteListingDeleted: val })
        const object = {
            notification: {
                email: {

                    delete_favorite_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification Favourite Listing delete res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelEmailNotificationFavouriteListingExpired = async (val) => {
        this.setState({ EmailNotificationFavouriteListingExpired: val })
        const object = {
            notification: {
                email: {
                    expired_favorite_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification Favourite Listing Expired res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelEmailNotificationNewReview = async (val) => {
        this.setState({ EmailNotificationNewReview: val })
        const object = {
            notification: {
                email: {
                    review: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification new review res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelEmailNotificationUserFavouriteListing = async (val) => {
        this.setState({ EmailNotificationUserFavouriteListing: val })
        const object = {
            notification: {
                email: {
                    user_visit_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification  user Favourite Listing res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelEmailNotificationListingExpired = async (val) => {
        this.setState({ EmailNotificationListingExpired: val })
        const object = {
            notification: {
                email: {

                    expired_product: val,
                }
            }
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Email notification Listing expired res", response.data);
                        // alert("Email notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }


    // For Chat Notification

    HandelChatNotification = async (val) => {
        this.setState({ SwitchValueChatNotification: val })
        this.SetAllChatNotificationState(val)
        const object = {
            notification: {
                push: {
                    chat: this.state.ChatNotificationUnreadMessagePush
                },
                email: {
                    chat: this.state.ChatNotificationUnreadMessageEmail
                }
            }
        }

        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Chat notification res", response.data);
                        // alert("push notification Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    SetAllChatNotificationState = (chatstatus) => {
        if (chatstatus == false) {
            this.setState({
                ChatNotificationUnreadMessagePush: false,
                ChatNotificationUnreadMessageEmail: false
            })
        }
        else if (chatstatus == true) {
            this.setState({
                ChatNotificationUnreadMessagePush: true,
                ChatNotificationUnreadMessageEmail: true
            })
        }
        else {
            null
        }
    }
    HandelChatNotificationPushUnreadMessage = async (val) => {
        // //console.log("val",val);
        this.setState({ ChatNotificationUnreadMessagePush: val })
        const object = {
            notification: {
                push: {
                    chat: val
                }
            }
        }

        // //console.log("obj",object);
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Chat notification Push Unread Message res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    HandelChatNotificationEmailUnreadMessage = async (val) => {
        // //console.log("val",val);
        this.setState({ ChatNotificationUnreadMessageEmail: val })
        const object = {
            notification: {
                email: {
                    chat: val
                }
            }
        }

        // //console.log("obj",object);
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        // //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                // //console.log(response)
                if (response.data.success === true) {
                    try {
                        // //console.log("Chat notification email Unread Message res", response.data);
                        // alert("push notification Favourite Listing Updated Successfully")

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                // //console.log(error.data)
            })
    }
    render() {
        return (
            <>    
            <SafeAreaView style={{ flex: 1 }}>

                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Desc={"Notifications"} />
                    <ScrollView>
                        {/* Push Notification */}
                        <View style={{ alignSelf: 'center', width: Devicewidth / 1.08, alignItems: 'flex-start', borderBottomColor: "#b3b1b2", borderBottomWidth: 1, justifyContent: 'flex-start', marginTop: 15, marginBottom: 10, }}>
                            <View style={{ alignSelf: 'center', width: Devicewidth / 1.08, height: Deviceheight / 6.2, alignItems: 'center', flexDirection: 'row', justifyContent: "space-between", marginBottom: 5, }}>
                                <View style={{ alignSelf: 'center', width: Devicewidth / 1.5, height: Deviceheight / 6.2, alignItems: 'flex-start', }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#010101", fontWeight: "bold", textAlign: 'left', marginBottom: 5 }}>Push Notification</Text>
                                    <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                    <TouchableOpacity onPress={() => this.setState({ PushNotificationShowMore: true })}>
                                        <Text style={styles.ShowBtn}>Show More</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ alignSelf: 'center', width: Devicewidth / 6, height: Deviceheight / 6.5, alignItems: 'flex-start', paddingTop: 25 }}>
                                    <Switch
                                        onValueChange={(value) => this.HandelPushNotification(value)}
                                        value={this.state.SwitchValuePushNotification}
                                        thumbColor={"#ffffff"}
                                        trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                </View>
                            </View>
                            {this.state.PushNotificationShowMore == true ?
                                <View style={styles.ShowMoreMainContainer}>

                                    <Text style={styles.TextLine}>Listng Updates</Text>

                                    {/* fot favourite listing change */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Favourite Listing changes</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelPushNotificationFavouriteListing(value)}
                                                value={this.state.PushNotificationFavouriteListingChange}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Price change */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Price changes</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelPushNotificationPriceChange(value)}
                                                value={this.state.PushNotificationPriceChange}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot New picture added to favourite */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>New picture added to favourite</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelPushNotificationPcicAddFevaurite(value)}
                                                value={this.state.PushNotificationNewPictureAdd}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Favourite Listing Sold */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Favourite listing sold</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelPushNotificationFavouriteListingSold(value)}
                                                value={this.state.PushNotificationFavouriteListingSold}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Favourite Listing Deleted */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Favourite listing deleted</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelPushNotificationFavouriteListingDeleted(value)}
                                                value={this.state.PushNotificationFavouriteListingDeleted}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Favourite Listing Expired */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Favourite listing expired</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) =>
                                                    this.HandelPushNotificationFavouriteListingExpired(value)}
                                                value={this.state.PushNotificationFavouriteListingExpired}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#808080", textAlign: 'left', marginBottom: 25 }}>Activity</Text>
                                    {/* fot New review */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>New review</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) =>
                                                    this.HandelPushNotificationNewReview(value)}
                                                value={this.state.PushNotificationNewReview}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot User favourite listing */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>User favourite listing</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelPushNotificationUserFavouriteListing(value)}
                                                value={this.state.PushNotificationUserFavouriteListing}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Listing expired */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Listing expired</Text>
                                            <Text style={styles.TextLine}>Push notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelPushNotificationListingExpired(value)}
                                                value={this.state.PushNotificationListingExpired}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>

                                </View>
                                :
                                null
                            }
                            {this.state.PushNotificationShowMore == true ?
                                <TouchableOpacity onPress={() => this.setState({ PushNotificationShowMore: false })}>
                                    <Text style={styles.ShowBtn}>Show Less</Text>
                                </TouchableOpacity>
                                :
                                null
                            }

                        </View>


                        {/* For Email */}
                        <View style={{ alignSelf: 'center', width: Devicewidth / 1.08, alignItems: 'flex-start', borderBottomColor: "#b3b1b2", borderBottomWidth: 1, justifyContent: 'flex-start', marginTop: 15, marginBottom: 10, }}>
                            <View style={{ alignSelf: 'center', width: Devicewidth / 1.08, height: Deviceheight / 6.2, alignItems: 'center', flexDirection: 'row', justifyContent: "space-between", marginBottom: 5, }}>

                                <View style={{ alignSelf: 'center', width: Devicewidth / 1.5, height: Deviceheight / 6.2, alignItems: 'flex-start', }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#010101", fontWeight: "bold", textAlign: 'left', marginBottom: 5 }}>Email</Text>
                                    <Text style={styles.TextLine}>Email about your listings activity, and updates</Text>
                                    <TouchableOpacity onPress={() => this.setState({ EmailNotificationShowMore: true })}>
                                        <Text style={styles.ShowBtn}>Show More 1</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ alignSelf: 'center', width: Devicewidth / 6, height: Deviceheight / 6.5, alignItems: 'flex-start', paddingTop: 25 }}>
                                    <Switch
                                        onValueChange={(value) => this.HandelEmailNotification(value)}
                                        value={this.state.SwitchValueEmailNotifcation}
                                        thumbColor={"#ffffff"}
                                        trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                </View>
                            </View>
                            {this.state.EmailNotificationShowMore == true ?
                                <View style={styles.ShowMoreMainContainer}>

                                    <Text style={styles.TextLine}>Listng Updates</Text>

                                    {/* fot favourite listing change */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Favourite Listing changes</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationFavouriteListing(value)}
                                                value={this.state.EmailNotificationFavouriteListingChange}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Price change */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Price changes</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationPriceChange(value)}
                                                value={this.state.EmailNotificationPriceChange}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot New picture added to favourite */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>New picture added to favourite</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationPcicAddFevaurite(value)}
                                                value={this.state.EmailNotificationNewPictureAdd}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Favourite Listing Sold */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Favourite listing sold</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationFavouriteListingSold(value)}
                                                value={this.state.EmailNotificationFavouriteListingSold}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Favourite Listing Deleted */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Favourite listing deleted</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationFavouriteListingDeleted(value)}
                                                value={this.state.EmailNotificationFavouriteListingDeleted}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Favourite Listing Expired */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Favourite listing expired</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationFavouriteListingExpired(value)}
                                                value={this.state.EmailNotificationFavouriteListingExpired}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#808080", textAlign: 'left', marginBottom: 25 }}>Activity</Text>
                                    {/* fot New review */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>New review</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationNewReview(value)}
                                                value={this.state.EmailNotificationNewReview}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot User favourite listing */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>User favourite listing</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationUserFavouriteListing(value)}
                                                value={this.state.EmailNotificationUserFavouriteListing}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    {/* fot Listing expired */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Listing expired</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelEmailNotificationListingExpired(value)}
                                                value={this.state.EmailNotificationListingExpired}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>

                                </View>
                                :
                                null
                            }
                            {this.state.EmailNotificationShowMore == true ?
                                <TouchableOpacity onPress={() => this.setState({ EmailNotificationShowMore: false })}>
                                    <Text style={styles.ShowBtn}>Show Less</Text>
                                </TouchableOpacity>
                                :
                                null
                            }

                        </View>


                        {/* For Chat */}
                        <View style={{ alignSelf: 'center', width: Devicewidth / 1.08, alignItems: 'flex-start', borderBottomColor: "#b3b1b2", borderBottomWidth: 1, justifyContent: 'flex-start', marginTop: 15, marginBottom: 10, }}>
                            <View style={{ alignSelf: 'center', width: Devicewidth / 1.08, height: Deviceheight / 6.2, alignItems: 'center', flexDirection: 'row', justifyContent: "space-between", marginBottom: 5, }}>

                                <View style={{ alignSelf: 'center', width: Devicewidth / 1.5, height: Deviceheight / 6.2, alignItems: 'flex-start', }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#010101", fontWeight: "bold", textAlign: 'left', marginBottom: 5 }}>Chat Notification</Text>
                                    <Text style={styles.TextLine}>Push notifications and emails about chat messages</Text>
                                    <TouchableOpacity onPress={() => this.setState({ ChatNotificationShowMore: true })}>
                                        <Text style={styles.ShowBtn}>Show More</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ alignSelf: 'center', width: Devicewidth / 6, height: Deviceheight / 6.5, alignItems: 'flex-start', paddingTop: 25 }}>
                                    <Switch
                                        onValueChange={(value) => this.HandelChatNotification(value)}
                                        value={this.state.SwitchValueChatNotification}
                                        thumbColor={"#ffffff"}
                                        trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                </View>
                            </View>
                            {this.state.ChatNotificationShowMore == true ?
                                <View style={styles.ShowMoreMainContainer}>

                                    <Text style={styles.TextLine}>Push Notification</Text>

                                    {/* fot favourite listing change */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Unread messages</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelChatNotificationPushUnreadMessage(value)}
                                                value={this.state.ChatNotificationUnreadMessagePush}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>
                                    <Text style={styles.TextLine}>Email</Text>
                                    {/* fot Price change */}
                                    <View style={styles.InnerToggelMainContainer}>
                                        <View style={styles.InnerDscriptionlMainContainer}>
                                            <Text style={styles.Heading}>Unread messages</Text>
                                            <Text style={styles.TextLine}>Email notifications about your listing, activity, and updates1</Text>
                                        </View>

                                        <View style={styles.InnerToggelContainer}>
                                            <Switch
                                                onValueChange={(value) => this.HandelChatNotificationEmailUnreadMessage(value)}
                                                value={this.state.ChatNotificationUnreadMessageEmail}
                                                thumbColor={"#ffffff"}
                                                trackColor={{ true: '#ff6801', false: '#9b9595' }} />
                                        </View>
                                    </View>

                                </View>
                                :
                                null
                            }
                            {this.state.ChatNotificationShowMore == true ?
                                <TouchableOpacity onPress={() => this.setState({ ChatNotificationShowMore: false })}>
                                    <Text style={styles.ShowBtn}>Show Less</Text>
                                </TouchableOpacity>
                                :
                                null
                            }

                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView >
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
    ShowMoreMainContainer: {
        alignSelf: 'center',
        width: Devicewidth / 1.2,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    TextLine: {
        fontSize: 14,
        color: "#808080",
        textAlign: 'left',
        marginBottom: 20
    },
    InnerToggelMainContainer: {
        alignSelf: 'center',
        width: Devicewidth / 1.3,
        height: Deviceheight / 9,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginBottom: 5,
    },
    InnerDscriptionlMainContainer: {
        alignSelf: 'flex-start',
        width: Devicewidth / 1.8,
        alignItems: 'flex-start',
    },
    Heading: {
        fontSize: 18,
        color: "#010101",
        fontWeight: "bold",
        textAlign: 'left',
        marginBottom: 5
    },
    InnerToggelContainer: {
        alignSelf: 'center',
        width: Devicewidth / 6,
        height: Deviceheight / 6.5,
        alignItems: 'flex-start',
        paddingTop: 25
    },
    ShowBtn: {
        fontSize: 16,
        color: "#9b9595",
        fontWeight: "bold",
        textAlign: 'left',
        marginBottom: 10
    },

})