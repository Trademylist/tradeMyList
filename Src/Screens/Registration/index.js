import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, SafeAreaView,StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import Icon from 'react-native-vector-icons/FontAwesome';
const axios = require('axios');

export default class Registration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            confirmpass: '',
            passwordType: true,
            ConfpasswordType: true,
            passwordIcon: 'eye',
            ConfpasswordIcon: 'eye',
            isValidEmail: '',
            isValidPassword: '',
            isValidConfirmPassword: '',
            loder: false
        }
    }
    state = this.state;
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
        else if (type === 'Confpass') {
            this.state.ConfpasswordIcon === 'eye' ?
                this.setState({
                    ConfpasswordIcon: 'eye-slash'
                })
                :
                this.setState({
                    ConfpasswordIcon: 'eye'
                })
            this.setState({
                ConfpasswordType: !this.state.ConfpasswordType
            })
        }
    }
    handlePasswordChange = async (val) => {
        //console.log("my pass val ", val);
        if (val.trim().length >= 8) {
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

    handleConfirmPasswordChange = async (val) => {
        // //console.log("my  confr pass val ",val);
        if (val.trim().length >= 8) {
            this.setState({
                isValidConfirmPassword: true,
                confirmpass: val
            })
        } else {
            this.setState({
                isValidConfirmPassword: false,
                confirmpass: val
            })
        }
    }

    handleValidEmail = async (val) => {
        //console.log(val)
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

    registerUser = async (e) => {
        this.setState({
            loder: true
        })
        e.preventDefault();
        const { email, password, confirmpass } = this.state;
        if (confirmpass === password) {
            const object = {
                "email": email,
                "password": confirmpass,
            }
            await axios.post("https://trademylist.com:8936/app/registration", object)
                .then(response => {
                    //console.log(response.data)
                    this.setState({
                        loder: false
                    })
                    alert(response.data.message)
                })
                .catch(error => {
                    //console.log(error.data)
                    this.setState({
                        loder: false
                    })
                })

        } else {
            alert('Password Dosent Match')
        }

    }

    render() {
        return (
            <SafeAreaView style={{flex: 1,
                backgroundColor: '#FFF'}}>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Desc={"Registration"} />
                    <View style={{ height: Deviceheight / 12, width: Devicewidth / 2, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 50, marginBottom: 30 }}>
                        <Image source={require("../../Assets/logo.png")} style={{ height: "100%", width: '100%', resizeMode: "contain" }} />
                    </View>
                    <View style={styles.descriptionContainer}>
                        <View style={styles.maininputContainer}>
                            <View style={styles.inputContainer}>
                                <Icon name='envelope' size={20} color={this.state.email == "" ? "#acacac" : "#383ebd"} style={{ alignSelf: "center", marginLeft: 10 }} />
                                <TextInput
                                    placeholder={'Email'}
                                    placeholderTextColor={'#acacac'}
                                    style={styles.Input}
                                    autoCapitalize="none"
                                    // onChangeText={(val) => this.handleValidEmail(val)}
                                    // value={this.state.email}
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
                            <View style={styles.inputContainer2}>
                                <Icon name='key' size={20} color={this.state.password == "" ? "#acacac" : "#383ebd"} style={{ alignSelf: "center", marginLeft: 10 }} />

                                <TextInput
                                    placeholder={'Password'}
                                    placeholderTextColor={'#acacac'}
                                    autoCapitalize="none"
                                    style={styles.Input2}
                                    secureTextEntry={this.state.passwordType}
                                    onChangeText={(val) => this.handlePasswordChange(val)}
                                    value={this.state.password}
                                >
                                </TextInput>
                                <Icon name={this.state.passwordIcon} size={20} color={'#acacac'} style={{ alignSelf: "center", marginRight: 15, }} onPress={() => this._changeIcon('pass')} />
                            </View>
                            {this.state.isValidPassword || this.state.isValidPassword === '' ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                                </Animatable.View>
                            }
                            <View style={styles.inputContainer1}>

                                <Icon name='key' size={20} color={this.state.confirmpass == "" ? "#acacac" : "#383ebd"} style={{ alignSelf: "center", marginLeft: 10 }} />

                                <TextInput
                                    placeholder={'Confirm Password'}
                                    placeholderTextColor={'#acacac'}
                                    autoCapitalize="none"
                                    style={styles.Input1}
                                    secureTextEntry={this.state.ConfpasswordType}
                                    onChangeText={(val) => this.handleConfirmPasswordChange(val)}
                                    value={this.state.confirmpass}
                                >
                                </TextInput>
                                <Icon name={this.state.ConfpasswordIcon} size={20} color={'#acacac'} style={{ alignSelf: "center", marginRight: 10, marginLeft: 5 }} onPress={() => this._changeIcon('Confpass')} />
                            </View>
                            {this.state.isValidConfirmPassword || this.state.isValidConfirmPassword === '' ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
                                </Animatable.View>
                            }
                        </View>
                        {this.state.isValidEmail && this.state.isValidPassword && this.state.isValidConfirmPassword ?

                            <TouchableOpacity style={styles.btnContainer1} onPress={this.registerUser}>
                                <Text style={styles.btnText} >Sign Up</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.btnContainer} onPress={this.registerUser}>
                                <Text style={styles.btnText} >Sign Up</Text>
                            </TouchableOpacity>
                        }

                        <TouchableOpacity >
                            <Text style={styles.forgotText}>Or</Text>
                        </TouchableOpacity>




                        <View style={styles.ContentContainer}>
                            <Text style={styles.AccountText}>Already have an account? </Text>
                            <TouchableOpacity style={styles.signupContainer} onPress={() => this.props.navigation.navigate('login')}
                            >
                                <Text style={styles.signup}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </SafeAreaView>
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
    },
    maininputContainer: {
        alignItems: 'flex-start',
        backgroundColor: '#d7d7d7',
        borderRadius: 5,
        width: Devicewidth / 1.05,
        // height: Deviceheight / 6,
        paddingLeft: 5
    },
    inputContainer: {
        alignSelf: "center",
        flexDirection: 'row',
        backgroundColor: '#d7d7d7',
        width: Devicewidth / 1.08,
        height: Deviceheight / 16,
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
    },
    inputContainer2: {
        alignSelf: "center",
        flexDirection: 'row',
        width: Devicewidth / 1.08,
        height: Deviceheight / 16,
        justifyContent: 'space-around',
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff",
    },
    Input: {
        marginLeft: 15,
        width: Devicewidth / 1.2,
        height: '100%',
        fontSize: 15,
        lineHeight: 18,
        marginLeft: 30,
        paddingLeft: 5,
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
        alignSelf: 'flex-end'
    },
    Input2: {
        width: Devicewidth / 1.27,
        height: Deviceheight / 18,
        fontSize: 15,
        paddingLeft: 10,
        paddingTop: 12,
        marginLeft: 30,
        fontFamily: 'Roboto-Medium',
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
        fontFamily: 'Raleway Medium',

    },
    headingContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
        textAlign: 'left'
    },
    btnContainer: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 19,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#d7d7d7",
        borderRadius: 20,
        marginTop: 40
    },
    btnContainer1: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 19,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#383ebd",
        borderRadius: 20,
        marginTop: 40
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
        color: "#acacac",
        marginTop: 30,
        fontWeight: 'bold'
    },
    ContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 20
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