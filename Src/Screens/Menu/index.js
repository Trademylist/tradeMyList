import React, { Component } from 'react';
import { Modal, View, Text, Image, ScrollView, StyleSheet, Dimensions, TextInput, TouchableOpacity,ActivityIndicator, Platform, Alert } from 'react-native';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import AsyncStorage from '@react-native-community/async-storage';
import ImageOptionModal from '../../Component/Image/index';
import IconCross from 'react-native-vector-icons/FontAwesome';
import FbIcon from 'react-native-vector-icons/AntDesign';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign'
import ImagePicker from 'react-native-image-crop-picker';
import { LoginManager, AccessToken, LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import AuthContext from '../../Context/AuthContext';
const axios = require('axios');
import {connect} from 'react-redux';
import { UPDATE_CHAT_COUNTER } from '../../store/actions';
import Toast from 'react-native-simple-toast';
import Box from 'react-native-vector-icons/FontAwesome5'
import CheckedBox from 'react-native-vector-icons/FontAwesome5'
class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
            ImageOptionVisible: false,
            profileImg: '',
            LoginType:'',
            loading:true,
            isModalVisible: false,
            modalLoading:false,
            checked: false
        }
        this.HandelReload = this.HandelReload.bind(this)
    }
    state = this.state;
    componentDidMount() {
        this.getData()
        this.HandelReload()
    }
    HandelReload() {
        this.props.navigation.addListener('focus', async () => {
            this.getData()
        })
    }
    onChecked = () => {
        this.setState({checked : !this.state.checked})
    }
    getData = async () => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            const LoginType = await AsyncStorage.getItem('LoginType')
            console.warn('logintype',LoginType)
            if (value !== null) {

                await axios.get("https://trademylist.com:8936/user/" + value.userid, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        //console.log("my login data at menu modal res", response);
                        // SetUserData(response.data.data)

                        this.setState({
                            userData: response.data.data,
                            LoginType:LoginType,
                            loading:false,
                        })
                        //console.log("my login data at menu modal", this.state.userData)
                        //console.log(response.data.data.socialId)
                        

                    })
            } else {
                // error reading value
            }
        } catch (e) {
            // error reading value
        }
    }
    deleteAccount = async () => {
        if(this.state.checked === false){Alert.alert("Please select the checkbox in order to delete your account")}
        else{
        try { const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        this.setState({modalLoading:true})
        console.warn('id',value.userid)
        console.warn('Token',value.token)
        if (value !== null) {

            await axios.delete("https://trademylist.com:8936/user/" + value.userid, {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(async response => {
                    this.setState({modalLoading:false, isModalVisible:false})
                    await AsyncStorage.removeItem("UserData");
                    await AsyncStorage.removeItem("LoginType");
                    await AsyncStorage.removeItem("MapSliderValue");
                    this.props.navigation.replace("productList")
                    console.log("Del Api =====",response.data)
                    Toast.showWithGravity(
                        "Account Deleted successfully",
                        Toast.SHORT,
                        Toast.BOTTOM,
                    );
                    this.props.navigation.replace("productList")
                })
        } else {
            // error reading value
        }
    } catch (e) {
        // error reading value
    }
    }
}

    saveData = async () => {
        const object = {
            image: this.state.profileImg,
        }
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        //console.log("value", value);

        await axios.post("https://trademylist.com:8936/app_seller/useredit", object, {
            headers: {
                'x-access-token': value.token,
            }
        })
            .then(response => {
                console.log(response)
                if (response.data.success === true) {
                    try {

                        //console.log(response.data)
                        alert("Image Updated Successfully")
                        this.getData();

                    } catch (e) {
                        // saving error

                    }
                }
            })
            .catch(error => {
                //console.log(error.data)
            })
    }

    HandelMyListing = () => {
        this.props.navigation.navigate('myListingMenu')
    }
    HandelReview = () => {
        this.props.navigation.navigate('allReview')
    }
    HandelBlockList = () => {
        this.props.navigation.navigate('blockList')
    }
    HandelNotificationSettings = () => {
        this.props.navigation.navigate('notificationSettings')
    }
    HandelEditEmail = () => {
        this.props.navigation.navigate('editEmail')
    }
    HandelChangePasswword = () => {
        this.props.navigation.navigate('changePassword')
    }
    HandelTermsCondition = () => {
        this.props.navigation.navigate('termsCondition')
    }
    HandelPrivacyPolicy = () => {
        this.props.navigation.navigate('privacyPolicy')
    }
    HandelHelp = () => {
        this.props.navigation.navigate('help')
    }
    HandelEditName = () => {
        this.props.navigation.navigate('editName')
    }

    logout = async (context) => {
        try {
            this.props.onChatCounterUpdate(0);
            //console.log('in try');
            var current_access_token = '';
            AccessToken.getCurrentAccessToken().then((data) => {
                current_access_token = data.accessToken.toString();
            }).then(() => {
                let logout =
                    new GraphRequest(
                        "me/permissions/",
                        {
                            accessToken: current_access_token,
                            httpMethod: 'DELETE'
                        },
                        (error, result) => {
                            if (error) {
                                //console.log('Error fetching data: ' + error.toString());
                            } else {
                                LoginManager.logOut();
                                //console.log("in logout")
                                this.logout2(context)
                            }
                        });
                new GraphRequestManager().addRequest(logout).start();
            })
                .catch(error => {
                    //console.log(error)
                });
        }
        catch (exception) {
            // this.props.navigation.navigate("productList")
            return false;
        }
    }

    logout1 = async (context) => {
        this.props.onChatCounterUpdate(0);
        await AsyncStorage.removeItem("UserData");
        await AsyncStorage.removeItem("LoginType");
        await AsyncStorage.removeItem("MapSliderValue");
        // if(this.state.userData.login_type == "google"){
        //     await GoogleSignin.revokeAccess();
        //     await GoogleSignin.signOut();
        // }
        // context.updateUser();
        this.props.navigation.replace("productList")
    }

    logout2 = async (context) => {
        await AsyncStorage.removeItem("UserData");
        await AsyncStorage.removeItem("LoginType");
        await AsyncStorage.removeItem("MapSliderValue");
        this.props.navigation.replace("productList")
        // context.updateUser();
    }

    changeimage = async () => {
        this.setState({
            ImageOptionVisible: true
        })
    }
    closeImageOptionModal = () => {
        this.setState({
            ImageOptionVisible: false
        })
    }

    getFileFromGallery = async (data) => {
        let options = {
            mediaType: data,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }

            //this.getImageupload(response)
            this.getImageuploadGallery(response)
            this.setState({
                ImageOptionVisible: false,
            })
        });
    }

    requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                // console.warn(err);
                return false;
            }
        } else return true;
    };


    getCaptureFromCamera = async (data) => {
        ImagePicker.openCamera({
            multiple: false,
        }).then(image => {
            this.getImageupload(image)
            this.setState({
                ImageOptionVisible: false,
                ImageSpinnerVisible: true
            })
            // this.getImageaddupload(image)
            console.log("my image from camera", image);
        });


    }

    getImageuploadGallery = async (image) => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                let data = new FormData();
                const img = {
                    name: Math.floor(Math.random() * 100000000 + 1) + ".jpg",
                    type: image.type,
                    uri: image.uri
                }
                console.log("my IMG 3",JSON.stringify(img));
                data.append('file', img);
                await axios.post("https://trademylist.com:8936/app_seller/upload", data, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            profileImg: response.data.data.image,
                            ImageOptionVisible: false,
                            ImageSpinnerVisible: false
                        })
                        this.saveData();
                    })
                    .catch(error => {
                        console.log('errr', error)
                    })
                // setFilePath(response);

            }
        } catch (e) {
            // error reading value
        }
    }

    getImageupload = async (image) => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                let data = new FormData();
                const img = {
                    name: Math.floor(Math.random() * 100000000 + 1) + ".jpg",
                    type: image.mime,
                    uri: image.path
                }
                console.log("my IMG",JSON.stringify(img));
                data.append('file', img);
                await axios.post("https://trademylist.com:8936/app_seller/upload", data, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            profileImg: response.data.data.image,
                        })
                        this.saveData();
                    })
                    .catch(error => {
                        console.log(error.data)
                    })

            }
        } catch (e) {
            // error reading value
        }
    }

    render() {
        //console.log(this.state.userData);
        return (
            <AuthContext.Consumer>
            {
                context =>
                <View style={styles.modalBody}>


                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ImageOptionModal
                            modalProps={this.state.ImageOptionVisible}
                            onPressClose={() => this.closeImageOptionModal()}
                            getchooseFile={this.getFileFromGallery}
                            getcaptureFile={this.getCaptureFromCamera}
                            navigation={this.props.navigation}
                        ></ImageOptionModal>
                        <TouchableOpacity style={styles.HeadrIconContainer}
                            onPress={() => this.props.navigation.navigate('productList')}
                        >
                            <Image source={require('../../Assets/close_button.png')} style={{ width: 13, height: 13, resizeMode: 'contain' }}></Image>
                        </TouchableOpacity>

                        <View style={{ height: Deviceheight / 4, width: Devicewidth, backgroundColor: "#eeeeee", alignItems: "center", justifyContent: 'center' }}>
                            <TouchableOpacity style={{
                                height: 70,
                                width: 70, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, backgroundColor: '#fff', marginTop: 5
                            }} onPress={this.changeimage}>
                                {
                                    this.state.profileImg === ''
                                        ?
                                        this.state.userData.image === null
                                            ?
                                            <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                            :
                                            <Image source={{ uri: this.state.userData.image }} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                        :
                                        <Image source={{ uri: this.state.profileImg }} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                                }

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.HandelEditName()}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 20, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center', marginTop: 5 }}>{this.state.userData.username || 'Test User'}</Text>
                            </TouchableOpacity>
                            <View style={{
                                height: Deviceheight / 30, alignItems: "center", justifyContent: "center", alignSelf: "center", flexDirection: 'row', justifyContent: "space-around",
                            }}>
                                <View style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 30, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Member.png")} style={{ height: "80%", width: "80%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Regular" , color: "#000", fontSize: 16, textAlign: 'center', alignSelf: 'center',fontWeight:"400",marginLeft: 5 }}>Member since {this.state.userData.createdAt ? new Date(this.state.userData.createdAt).getFullYear() : ''}</Text>
                            </View>

                            <View style={{
                                height: Deviceheight / 30,
                                width: Devicewidth / 2.7, alignItems: "center", justifyContent: "center", alignSelf: "center", flexDirection: 'row', justifyContent: "space-around"
                            }}>
                                <View style={{
                                    height:60, 
                                    width: 20, marginRight:5, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Verified.png")} style={{ height: 20, width: 20}}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Regular" , color: "#000", fontSize: 16, textAlign: 'center', alignSelf: 'center',fontWeight:"400" }}> Verified with : </Text>

                                <TouchableOpacity style={{
                                    height: 60,
                                    width: 20, marginLeft:5, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    {
                                        this.state.LoginType == null ?
                                            <Image source={require("../../Assets/Email_Black.png")} style={{ height:15, width: 16 }}></Image>
                                            :
                                            this.state.LoginType == "facebook" ?
                                                <FbIcon name='facebook-square' sstyle={{height:25,width:23}} size={20} />
                                                :
                                                (String(this.state.LoginType).toLowerCase() == "google" || String(this.state.LoginType).toLowerCase() == "g") ?
                                                    <Icon name='google' style={{height:25,width:23}} size={20} />
                                                    :
                                                    null
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.loading==true?
                        null
                        :
                        <View>

                        {/* My Listing */}
                        <TouchableOpacity onPress={() => this.HandelMyListing()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                <View style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Listing.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>My Listing</Text>
                            </View>
                            <View style={{
                                height: Deviceheight / 50,
                                width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                            }}>
                                <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </View>
                        </TouchableOpacity>


                        {/* All Review */}
                        <TouchableOpacity onPress={() => this.HandelReview()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                <View style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Review.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>All Reviews</Text>
                            </View>
                            <View style={{
                                height: Deviceheight / 50,
                                width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                            }}>
                                <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </View>
                        </TouchableOpacity>


                        {/* Block List */}
                        <TouchableOpacity onPress={() => this.HandelBlockList()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                <View style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Block.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Block List</Text>
                            </View>
                            <View style={{
                                height: Deviceheight / 50,
                                width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                            }}>
                                <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </View>
                        </TouchableOpacity>


                        {/* Notification Settings */}
                        <TouchableOpacity onPress={() => this.HandelNotificationSettings()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                <View style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Notification.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Notification Settings</Text>
                            </View>
                            <View
                                style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                                }}>
                                <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </View>
                        </TouchableOpacity>

                        {/* {String(this.state.LoginType).toLowerCase() === "facebook" || String(this.state.LoginType).toLowerCase() === "google" ?
                            null
                            : */}
                             {this.state.LoginType == null  &&
                            <>
                                {/* Edit Email */}
                                <TouchableOpacity onPress={() => this.HandelEditEmail()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                        <View style={{
                                            height: Deviceheight / 55,
                                            width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                        }}>
                                            <Image source={require("../../Assets/Email.png")} style={{ height: "100%", width: "100%" }}></Image>
                                        </View>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Edit Email</Text>
                                    </View>
                                    <View style={{
                                        height: Deviceheight / 50,
                                        width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                                    }}>
                                        <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                                    </View>
                                </TouchableOpacity>

                                {/* Change Password */}
                                
                                <TouchableOpacity onPress={() => this.HandelChangePasswword()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                        <View style={{
                                            height: Deviceheight / 80,
                                            width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                        }}>
                                            <Image source={require("../../Assets/Password.png")} style={{ height: "100%", width: "100%" }}></Image>
                                        </View>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Change Password</Text>
                                    </View>
                                    <View style={{
                                        height: Deviceheight / 50,
                                        width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                                    }}>
                                        <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                                    </View>
                                </TouchableOpacity>
                            </>
                        }


                        {/* Terms & Contiditon */}
                        <TouchableOpacity onPress={() => this.HandelTermsCondition()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                <View style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Terms.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Terms & Contiditon</Text>
                            </View>
                            <View style={{
                                height: Deviceheight / 50,
                                width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                            }}>
                                <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </View>
                        </TouchableOpacity>


                        {/* Privacy Policy */}
                        <TouchableOpacity onPress={() => this.HandelPrivacyPolicy()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                <View style={{
                                    height: Deviceheight / 40,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Privacy.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Privacy Policy</Text>
                            </View>
                            <View
                                style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                                }}>
                                <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </View>
                        </TouchableOpacity>


                        {/* Help */}
                        <TouchableOpacity onPress={() => this.HandelHelp()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                <View style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/Help.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Help</Text>
                            </View>
                            <View
                                style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                                }}>
                                <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setState({isModalVisible:true})} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.1, height: Deviceheight / 14, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                                <View style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                                }}>
                                    <Image source={require("../../Assets/DeleteAccount.png")} style={{ height: "100%", width: "100%" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Delete Account</Text>
                            </View>
                            <View
                                style={{
                                    height: Deviceheight / 50,
                                    width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                                }}>
                                <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </View>
                        </TouchableOpacity>

                        <View style={{ width: Devicewidth / 1.05, height: Deviceheight / 14, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#cccccc", marginTop: 10 }}>
                            <TouchableOpacity style={{ width: Devicewidth / 1.2, height: Deviceheight / 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 30 }} onPress={() =>
                                this.state.LoginType == "facebook" ?
                                this.logout(context):
                                this.logout1(context)}>
                                <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                       }
                        <Modal visible={this.state.isModalVisible} transparent={true}>
                            { this.state.modalLoading ? <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, }} animating={true} color={"#383ebd"} size="large" /> : 
                        <View style={{ width: "88%", height: 430, alignSelf: "center",  marginTop: "35%",borderRadius: 10, borderColor:"grey",borderWidth:1, shadowColor: 'rgba(0,0,0,0.5)',
                        shadowRadius: 1,
                        shadowOpacity: 0.5,
                        shadowOffset: {
                          width: 0,
                          height: 1,}
                         }}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1, backgroundColor: "#ebe7e6",borderRadius: 10,}}>
                        <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })} style={{ alignSelf:"flex-end",marginTop:8,marginRight:8 }}>

<Icon name='close' color="#ff6801" size={25} />
</TouchableOpacity>
<View style={{flexDirection:"row",alignItems:"center",width:"90%", alignSelf:"center",marginTop:10}}>
<Text style={{color:"red",fontWeight:"500",fontSize:20}}>Caution: </Text> 
<Text style={{color:"black",fontWeight:"500",fontSize:17,marginLeft:5,}}>By Deleting Your Account</Text>
</View>
<Text style={{color:"#000",width:"85%",alignSelf:"center",textAlign:"justify",fontSize:16,marginTop:10}}>1. You’ll lose all the data and content in that account, like emails, files, chats, and photos. </Text>
<Text style={{color:"#000",width:"85%",alignSelf:"center",textAlign:"justify",fontSize:16,marginTop:8}}>2. You’ll lose access to subscriptions and content you bought with that account.</Text>
<Text style={{color:"#000",width:"85%",alignSelf:"center",textAlign:"justify",fontSize:16,marginTop:8}}>3. If you change your mind after deleting your account, you will not be able to recover any data. </Text>
<View style={{flexDirection:"row",alignItems:"center",width:"90%",alignSelf:"center",marginTop:8}}>
    {this.state.checked ? <TouchableOpacity onPress={()=>this.setState({checked:false})}>
    <CheckedBox name="check-square" size={25} color="#ff6801"/>
</TouchableOpacity> 
: 
<TouchableOpacity onPress={()=>this.setState({checked:true})} >
    <Box name="square" size={25} color="#ff6801"/>
</TouchableOpacity>}

<Text style={{color:"#110b26",textAlign:"justify",fontSize:15,marginLeft:8}}>I Understand, and accept the conditions</Text>
</View>
<TouchableOpacity  onPress={this.deleteAccount} style={{width:"70%",height:40,backgroundColor:"#b8070d",alignSelf:"center",marginTop:15,alignItems:"center",justifyContent:"center",borderRadius:30}}>
<Text style={{color:"#fff",fontSize:18,}}>Confirm Account Delete</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>this.setState({isModalVisible:false})} style={{marginBottom:15, width:"70%",height:40,backgroundColor:"#615959",alignSelf:"center",marginTop:15,alignItems:"center",justifyContent:"center",borderRadius:30}}>
<Text style={{color:"#fff",fontSize:18,}}>Cancel</Text>
</TouchableOpacity>
                        </ScrollView>
                        </View> }
                        </Modal>



                    </ScrollView>

                </View>
            }
            </AuthContext.Consumer>
        )
    }
}

const styles = StyleSheet.create({
    modalBody: {
        alignItems: 'flex-start',
        flex: 1,
        width: Devicewidth,
        backgroundColor: '#fff',
        paddingBottom: 10,
        paddingTop: Platform.OS == 'ios' ? 35 : 0,
    },
    HeadrIconContainer: {
        paddingTop: 20,
        paddingLeft: 15,
        alignSelf: 'center',
        alignItems: 'flex-start',
        width: Devicewidth,
        height: Deviceheight / 15,
        backgroundColor: '#fff',
        justifyContent: "flex-start",
        elevation: 2
    },
})

const mapDispatchToProps = dispatch => {
    return {
        onChatCounterUpdate: (val) => dispatch({type: UPDATE_CHAT_COUNTER, payload: val}),
    }
}

export default connect(null, mapDispatchToProps)(Menu);
