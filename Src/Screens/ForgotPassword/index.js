import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Dimensions, TextInput, TouchableOpacity,ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import LoginModal from "../../Component/LoginModal"
import Icon from 'react-native-vector-icons/FontAwesome';

const axios = require('axios');

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            isValidEmail: '',
            OpenOtpVerification: false,
            Otp: '',
            OpenChangePass: false,
            ConfNewPass: '',
            Newemail: ''
        }
    }
    state = this.state;

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

    loginUser = async (e) => {
        this.setState({
            loder: true
        })
        e.preventDefault();
        const { email } = this.state;
        const object = {
            "email": email,
        }
        await axios.post("https://trademylist.com:8936/app_user/send_verification", object)
            .then(response => {
                console.log('errorA',response.data)
                if (response.data.success === true) {
                    try {
                        this.setState({
                            loder: false,
                            OpenOtpVerification: true
                        })

                    } catch (e) {
                        // saving error
                        this.setState({
                            loder: false,
                        })
                    }
                }
                else{
                    this.setState({
                        loder: false,
                    })
                }
                ToastAndroid.showWithGravity(
                    response.data.message,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                );
            })
            .catch(error => {
                console.log('errorB',error.data)
            })
    }

    OtpVerify = async (e) => {
        this.setState({
            loder: true
        })
        e.preventDefault();
        const { email, Otp } = this.state;
        const object = {
            "email": email,
            "code": Otp
        }
        await axios.post("https://trademylist.com:8936/app_user/check_verification", object)
            .then(response => {
                console.log('errorC',response.data)
                if (response.data.success === true) {
                    try {
                        this.setState({
                            loder: false,
                            OpenChangePass: true
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
                ToastAndroid.showWithGravity(
                    response.data.message,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                );
            })
            .catch(error => {
                console.log('errorD',error.data)
            })
    }
    ChangePass = async (e) => {
        const { Newemail, ConfNewPass } = this.state;
        const object = {
            "email": Newemail,
            "password": ConfNewPass
        }
        await axios.post("https://trademylist.com:8936/app_user/change_password", object)
            .then(response => {
                console.log('errorE',response)
                if (response.data.success === true) {
                    try {
                        console.log('errorF',response.data)
                        this.props.navigation.navigate('login')
                    } catch (e) {
                        // saving error

                    }
                }
                ToastAndroid.showWithGravity(
                    response.data.message,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                );
            })
            .catch(error => {
                console.log('errorG',error.data)
            })
    }
    handleValidEmail = async (val) => {
        console.log('errorH',val)
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

                    <Header navigation={this.props.navigation} Desc={"Forgot Password"} />
                    <View style={{ height: Deviceheight / 12, width: Devicewidth / 1.5, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 60, marginBottom: 50 }}>
                        <Image source={require("../../Assets/logo.png")} style={{ height: "100%", width: '100%', resizeMode: "contain" }} />
                    </View>
                    {this.state.loder == true ?
                        <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, }} animating={this.state.loder} color={"#383ebd"} size="large" />
                        :
                        <>
                            {this.state.OpenOtpVerification == false ?
                                <View style={styles.descriptionContainer}>
                                    <View style={styles.maininputContainer}>
                                        <View style={styles.ContentContainer}>
                                            <Text style={styles.forgotText}>Provide Your Email</Text>
                                        </View>
                                        <View style={styles.ContentContainer}>
                                            <Text style={styles.Desctext}>We will send a confirmation code to your email</Text>
                                        </View>
                                        <View style={styles.inputContainer1}>

                                            <Icon name='envelope' size={20} color={this.state.email == "" ? "#acacac" : "#383ebd"} style={{ alignSelf: "center", marginLeft: 10 }} />

                                            <TextInput
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
                                    </View>

                                    <TouchableOpacity style={this.state.isValidEmail == true ? styles.btnContainer_active : styles.btnContainer} onPress={this.loginUser}>
                                        <Text style={styles.btnText} >Get Confirmation Code</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                this.state.OpenChangePass == false ?
                                    <View style={styles.descriptionContainer}>
                                        <View style={styles.maininputContainer}>
                                            <View style={styles.ContentContainer}>
                                                <Text style={styles.Desctext}>Please enter the confirmation code sent to your email</Text>
                                            </View>
                                            <View style={styles.inputContainer1}>
                                                <TextInput
                                                    // placeholder={'Otp'}
                                                    placeholderTextColor={'#acacac'}
                                                    style={styles.Input}
                                                    autoCapitalize="none"
                                                    onChangeText={(val) =>
                                                        this.setState({
                                                            Otp: val
                                                        })
                                                    }
                                                    value={this.state.Otp}
                                                >
                                                </TextInput>

                                            </View>
                                        </View>

                                        <TouchableOpacity style={this.state.Otp != '' ? styles.btnContainer_active : styles.btnContainer} onPress={this.OtpVerify}>
                                            <Text style={styles.btnText} >Submit Confirmation Code</Text>
                                        </TouchableOpacity>


                                    </View>
                                    :
                                    <View style={styles.descriptionContainer}>
                                        <View style={styles.maininputContainer}>
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder='Email'
                                                textColor='#808080'
                                                fontSize={15}
                                                selectTextOnFocus={true}
                                                spellCheck={false}
                                                keyboardType='default'
                                                onChangeText={(val) => this.setState({
                                                    Newemail: val
                                                })}
                                                value={this.state.Newemail}
                                            />
                                            {this.state.isValidEmail || this.state.isValidEmail === '' ? null :
                                            <Animatable.View animation="fadeInLeft" duration={500}>
                                                <Text style={styles.errorMsg}>Please Enter a valid email.</Text>
                                            </Animatable.View>
                                        }
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder='New password'
                                                textColor='#808080'
                                                fontSize={15}
                                                selectTextOnFocus={true}
                                                spellCheck={false}
                                                keyboardType='default'
                                                onChangeText={(val) => this.setState({
                                                    ConfNewPass: val
                                                })}
                                                value={this.state.ConfNewPass}
                                            />
                                        </View>

                                        <TouchableOpacity style={this.state.Newemail != '' || this.state.ConfNewPass != "" ? styles.btnContainer_active : styles.btnContainer}
                                         onPress={this.ChangePass}
                                        >
                                            <Text style={styles.btnText} >Change Password</Text>
                                        </TouchableOpacity>


                                    </View>
                            }
                        </>

                    }
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF'
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
        // height: Deviceheight / 6,
        paddingLeft: 5,
        paddingBottom: 10,
        paddingTop: 5
    },
    inputContainer: {
        alignSelf: "center",
        flexDirection: 'row',
        backgroundColor: '#d7d7d7',
        width: Devicewidth / 1.08,
        height: Deviceheight / 18,
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
        height: Deviceheight / 16,
        justifyContent: 'space-around',
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff",
        marginTop: 10
    },
    Input: {
        marginLeft: 15,
        width: Devicewidth / 1.2,
        height: '100%',
        fontSize: 15,
        lineHeight: 17,
        // marginLeft: 30,
        paddingLeft: 10,
        paddingTop: 12,
        fontFamily: 'Raleway; Medium',
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
        fontFamily: 'Raleway; Medium',
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
        fontFamily: 'Raleway; Medium',

    },
    headingContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
        textAlign: 'left'
    },
    textInput: {
        marginLeft: 15,
        textAlign: 'left',
        fontSize: 15,
        height: Deviceheight / 20,
        width: Devicewidth / 1.13,
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff",
    },
    btnContainer: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 19,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#d7d7d7",
        borderRadius: 20,
        marginTop: 60
    },
    btnContainer_active: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 19,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#ff6801",
        borderRadius: 20,
        marginTop: 60
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    },
    forgotText: {
        fontFamily: 'Raleway; Medium',
        fontSize: 17,
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: "center"
        // marginLeft:Devicewidth / 3.4
    },
    Desctext: {
        fontFamily: 'Raleway; Medium',
        fontSize: 12,
        marginTop: 8,
        fontWeight: 'bold',
        color: '#acacac',
        textAlign: "center"
        // marginLeft:Devicewidth / 6.5
    },

    ContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center"
    },
    AccountText: {
        fontFamily: 'Raleway; Medium',
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
        fontFamily: 'Raleway; Medium',
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