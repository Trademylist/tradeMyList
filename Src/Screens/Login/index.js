import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Dimensions, TextInput, TouchableOpacity ,ToastAndroid, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import LoginModal from "../../Component/LoginModal"
import Icon from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';
import { chatList } from '../../helperFunctions/chatList';
import { UPDATE_CHAT_COUNTER } from '../../store/actions';
import {connect} from 'react-redux';
import Toast from 'react-native-simple-toast';

const axios = require('axios');

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            passwordType: true,
            passwordIcon: 'eye',
            isValidEmail: '',
            isValidPassword: '',
            FCMToken:''
        }
    }
    state = this.state;
    async componentDidMount() {
    //this.requestUserPermission()
    const fcmtoken = await  AsyncStorage.getItem('fcm_token')
    this.setState({FCMToken: fcmtoken})
    }
    closeModal = () => {
        this.setState({
            LoginVisible: false
        })
    }
    handelLoginModal = () => {
        this.setState({
            LoginVisible: true
        })
    }
     requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
          this.getToken()
        }
      }
    getToken = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    this.setState({
        FCMToken:token
    })
    console.log('Firebase fcm token:', this.state.FCMToken);

    }

    loginUser = async (e) => {
        this.setState({
            loder: true
        })
        e.preventDefault();
        const { email, password } = this.state;
        const object = {
            "email": email,
            "password": password,
            "notification_token": this.state.FCMToken,
        }
        console.warn('logindata',object)
        await axios.post("https://trademylist.com:8936/app/login", object)
            .then(async response => {
                //console.log("login data",response)
                if (response.data.success === true) {
                    try {
                        AsyncStorage.setItem('UserData', JSON.stringify(response.data.data))
                        let val = await chatList(this.props.onChatCounterUpdate);
                        // this.props.onChatCounterUpdate(val);
                        this.props.navigation.goBack();
                        this.setState({
                            loder: false
                        })
                    } catch (e) {
                        // saving error
                        this.setState({
                            loder: false
                        })

                    }
                }
                else{
                    this.setState({
                        loder: false
                    })

                }
                Toast.showWithGravity(
                    response.data.message,
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
            })
            .catch(error => {
                console.log('errorA',error.data)
            })
    }

    handleValidEmail = async (val) => {
        console.log('errorB',val)
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(val) === false) {
            this.setState({
                isValidEmail: false,
                email: val
            })
        } else {
            this.setState({
                isValidEmail: true,
                email: val
            })
        }
        // if(val.trim().length >= 4 ) {
        //    this.setState({
        //     isValidEmail:true
        //    })
        // } else {
        //     this.setState({
        //         isValidEmail:false
        //        })
        // }
    }

    handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            this.setState({
                isValidPassword: true,
                password: val
            })
        } else {
            this.setState({
                isValidPassword: false,
                password: val
            })
        }
    }

    _changeIcon = (type) => {
        if (type === 'pass') {
            this.state.passwordIcon === 'eye' ?
                this.setState({
                    passwordIcon: 'eye-slash'
                })
                :
                this.setState({
                    passwordIcon: 'eye'
                })
            this.setState({
                passwordType: !this.state.passwordType
            })
        }
    }
    render() {
        return (
            <>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Desc={"Login"} />
                    <View style={{ height: Deviceheight / 12, width: Devicewidth / 1.5, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 60, marginBottom: 50 }}>
                        <Image source={require("../../Assets/logo.png")} style={{ height: "100%", width: '100%', resizeMode: "contain" }} />
                    </View>
                    {this.state.loder == true ?
                        <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, }} animating={this.state.loder} color={"#383ebd"} size="large" />
                        :
                        <View style={styles.descriptionContainer}>
                            <View style={styles.maininputContainer}>
                                <View style={styles.inputContainer}>
                                    {/* <Image source={require('../../Assets/Email.png')} style={styles.ImageStyle} /> */}

                                    <Icon name='envelope' size={20} color={this.state.email == "" ? "#acacac" : "#383ebd"} style={{ alignSelf: "center", marginLeft: 10 }} />
                                    <TextInput
                                        sty
                                        placeholder={'Email'}
                                        placeholderTextColor={'#acacac'}
                                        style={styles.Input}
                                        autoCapitalize="none"
                                        onChangeText={(val) =>
                                            this.handleValidEmail(val)
                                        }
                                        value={this.state.email}
                                    >
                                    </TextInput>
                                </View>
                                {this.state.isValidEmail || this.state.isValidEmail === '' ? null :
                                    <Animatable.View animation="fadeInLeft" duration={500}>
                                        <Text style={styles.errorMsg}>Please Enter a valid email.</Text>
                                    </Animatable.View>
                                }
                                <View style={styles.inputContainer1}>

                                    <Icon name='key' size={20} color={this.state.password == "" ? "#acacac" : "#383ebd"} style={{ alignSelf: "center", marginLeft: 10 }} />

                                    <TextInput
                                        placeholder={'Password'}
                                        placeholderTextColor={'#acacac'}
                                        style={styles.Input1}
                                        autoCapitalize="none"
                                        secureTextEntry={this.state.passwordType}
                                        onChangeText={(val) => this.handlePasswordChange(val)}
                                        value={this.state.password}
                                    >
                                    </TextInput>
                                    <Icon name={this.state.passwordIcon} size={20} color={'#acacac'} style={{ alignSelf: "center", marginRight: 10, marginLeft: 5 }} onPress={() => this._changeIcon('pass')} />
                                </View>
                                {this.state.isValidPassword || this.state.isValidPassword === '' ? null :
                                    <Animatable.View animation="fadeInLeft" duration={500}>
                                        <Text style={styles.errorMsg}>Password must be 6 characters long.</Text>
                                    </Animatable.View>
                                }
                            </View>

                            <TouchableOpacity disabled={!this.state.isValidEmail || !this.state.isValidPassword} style={this.state.isValidEmail == true && this.state.isValidPassword == true ? styles.btnContainer_active : styles.btnContainer} onPress={this.loginUser}>
                                <Text style={styles.btnText} >Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('forgotpass')}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>




                            <View style={styles.ContentContainer}>
                                <Text style={styles.AccountText}>Don't have an account ?</Text>
                                <TouchableOpacity style={styles.signupContainer} onPress={() => this.props.navigation.navigate('registration')}
                                >
                                    <Text style={styles.signup}>Signup</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: Platform.OS == 'ios' ? 35 : 0,
    },
    descriptionContainer: {
        flex: 0.7,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        // backgroundColor:"green"
    },
    maininputContainer: {
        alignItems: 'flex-start',
        backgroundColor: '#d7d7d7',
        borderRadius: 5,
        width: Devicewidth / 1.05,
        // height: Deviceheight / 9,
        paddingLeft: 5,
        alignItems:"center"
    },
    inputContainer: {
        alignSelf: "center",
        flexDirection: 'row',
        backgroundColor: '#d7d7d7',
        width: Devicewidth / 1.08,
        height: Deviceheight / 17,
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff",
        borderRadius: 5,
    },
    inputContainer1: {
        alignSelf: "center",
        flexDirection: 'row',
        backgroundColor: '#d7d7d7',
        width: Devicewidth / 1.08,
        // height: Deviceheight / 17,
        justifyContent: 'space-around',
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff",
        alignItems:"center"
    },
    Input: {
        marginLeft: 15,
        width: Devicewidth / 1.2,
        height: '100%',
        fontSize: 15,
        lineHeight: 16,
        marginLeft: 30,
        paddingLeft: 10,
        paddingTop: 12,
        fontFamily: 'Roboto-Medium',
        // backgroundColor:'yellow',
        alignSelf: 'flex-end'
    },
    Input1: {
        width: Devicewidth / 1.35,
        height: Deviceheight / 18,
        fontSize: 15,
        paddingLeft: 10,
        paddingTop: 12,
        marginLeft: 15,
        fontFamily: 'Roboto-Medium',
        // backgroundColor:'yellow',
        alignSelf: 'flex-end'
    },
    ImageStyle: {
        padding: 5,
        height: 18,
        width: 20,
        resizeMode: 'stretch',
        position: 'absolute',
        left: 5,
        top: 18,
    },
    signinText: {
        color: "#000000",
        fontSize: 16,
        fontFamily: 'Roboto-Medium',

    },
    headingContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
        textAlign: 'left'
    },
    btnContainer: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 20,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#d7d7d7",
        borderRadius: 30,
        marginTop: 60
    },
    btnContainer_active: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 20,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#383ebd",
        borderRadius: 30,
        marginTop: 60
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    },
    forgotText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        color: "#383ebd",
        marginTop: 30,
        fontWeight: 'bold'
    },
    ContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 25
    },
    AccountText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        color: "#9d9d9d",
    },
    signupContainer: {
        width: Devicewidth / 7,
        height: Deviceheight / 38,
        alignItems: "center",
        justifyContent: 'center',
        marginLeft: 2,
        // backgroundColor:'green'
    },
    signup: {
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        textAlign: "center",
        color: "#383ebd",
        fontWeight: "bold",
    },

    errorMsg: {
        color: '#FF0000',
        fontSize: 12,
        textAlign: 'left',
        alignSelf: "flex-start",
        paddingLeft: 10,
        paddingVertical: 2
    },
})

const mapDispatchToProps = dispatch => {
    return {
        onChatCounterUpdate: (val) => dispatch({type: UPDATE_CHAT_COUNTER, payload: val}),
    }
}

export default connect(null, mapDispatchToProps)(Login);
