import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');

export default class SubmitRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Email: '',
            Name: "",
            Description: '',
            MobileNumber: '',
            Option: ''
        }
    }
    state = this.state;
    async componentDidMount() {}
    //     //console.log("my option in did mount", this.props.route.params.OptionChoose)
    //     if (this.props.route.params.OptionChoose !== undefined) {
    //         this.setState({
    //             Option: this.props.route.params.OptionChoose
    //         })
    //     }
    // }
    // componentDidUpdate(prevProps) {
    //     if (this.props.route.params.OptionChoose !== prevProps.route.params.OptionChoose) {
    //         this.setState({
    //             Option: this.props.route.params.OptionChoose
    //         })
    //     }
    // }

    HandelSubmit = async () => {
        const Choise = this.props.route.params.OptionChoose;
        //console.log("my option", Choise)

        const object = {
            "email": this.state.Email,
            "name": this.state.Name,
            "description": this.state.Description,
            "phone_no": this.state.MobileNumber,
            "option": Choise
        }
        //console.log("my object", object);
        await axios.post("https://trademylist.com:8936/app_user/contactUs", object)
            .then(response => {
                //console.log("my submit response", response);
                if (response.data.success == true) {
                    //console.log(response.data)
                    this.setState({
                        Email: '',
                        Name: "",
                        Description: '',
                        MobileNumber: '',
                    })
                }
                else {
                    // error comming
                }

            })
            .catch(error => {
                //console.log(error.data)
            })
    }
    render() {
        return (
            <>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Desc={"Submit a request"} />

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, paddingTop: 20 }}>

                        {/* for email */}
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 12, textAlign: 'left', fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}>Your email address*</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={"email@domain.com"}
                                placeholderTextColor={'#000'}
                                style={styles.Input}
                                onChangeText={(val) => this.setState({
                                    Email: val
                                })}
                                value={this.state.Email}
                            >
                            </TextInput>
                        </View>
                        {/* for Help */}
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 12, textAlign: 'left', fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}>How can we help you*</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('helpOption')} style={styles.inputContainer}>
                            {/* <View style={styles.inputContainer}> */}
                            <Text style={styles.Input}>{this.props.route.params.OptionChoose}</Text>
                            {/* </View> */}
                        </TouchableOpacity>

                        {/* for Name */}
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 12, textAlign: 'left', fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}>Name*</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={''}
                                placeholderTextColor={'#000'}
                                style={styles.Input}
                                onChangeText={(val) => this.setState({
                                    Name: val
                                })}
                                value={this.state.Name}
                            >
                            </TextInput>
                        </View>
                        {/* for Description */}
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 12, textAlign: 'left', fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}>Description*</Text>
                        <View style={styles.inputContainer1}>
                            <TextInput
                                placeholder={''}
                                placeholderTextColor={'#000'}
                                style={styles.Input1}
                                onChangeText={(val) => this.setState({
                                    Description: val
                                })}
                                value={this.state.Description}
                            >
                            </TextInput>
                        </View>
                        {/* for Mobile Number */}
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontSize: 12, textAlign: 'left', fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}>Mobile Number*</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={''}
                                placeholderTextColor={'#000'}
                                style={styles.Input}
                                keyboardType={'number-pad'}
                                onChangeText={(val) => this.setState({
                                    MobileNumber: val
                                })}
                                value={this.state.MobileNumber}
                            >
                            </TextInput>
                        </View>

                        <TouchableOpacity style={this.state.Email == '' || this.state.Help == '' || this.state.Name == '' || this.state.Description == '' || this.state.MobileNumber == '' ? styles.btnContainer : styles.btnContainer1}
                            onPress={this.HandelSubmit}
                        >
                            <Text style={styles.btnText} >Submit</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    inputContainer: {
        alignSelf: "center",
        // backgroundColor: 'green',
        width: Devicewidth / 1.08,
        height: Deviceheight / 22,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#d7d7d7",
        borderRadius: 2,
        marginBottom: 25
    },
    Input: {
        width: Devicewidth / 1.1,
        fontSize: 12,
        // backgroundColor: 'yellow',
        alignSelf: 'center'
    },
    inputContainer1: {
        alignSelf: "center",
        // backgroundColor: 'green',
        width: Devicewidth / 1.08,
        height: Deviceheight / 12,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: "#d7d7d7",
        borderRadius: 2,
        marginBottom: 25
    },
    Input1: {
        width: Devicewidth / 1.1,
        fontSize: 12,
        // backgroundColor: 'yellow',
        alignSelf: 'center'
    },
    btnContainer: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 19,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#d7d7d7",
        borderRadius: 20,
        marginTop: 10
    },
    btnContainer1: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 19,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#383ebd",
        borderRadius: 20,
        marginTop: 10
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    },
})