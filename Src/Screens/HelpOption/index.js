import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
const axios = require('axios');

export default class HelpOption extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Option1: false,
            Option2: false,
        }
    }
    state = this.state;
    async componentDidMount() {

    }
     handelBack=(data)=>{
         //console.log("data",data);
        this.props.navigation.navigate('submitRequest',{OptionChoose:data})
      }
    render() {
        //console.log("my choise",this.state.Option)
        return (
            <>
                <View style={styles.Container}>
                    <View style={styles.HeaderContainer}>
                        <StatusBar backgroundColor="#000000" />


                        <View style={styles.HeadrIconContainer}>

                            <TouchableOpacity onPress={() =>this.handelBack("")} style={{
                                height: Deviceheight / 50,
                                width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, marginBottom: 5,
                            }}>
                                <Image source={require("../../Assets/BackIconLeft.png")} style={{ height: "100%", width: "100%" }}></Image>
                            </TouchableOpacity>
                            <Text style={{ fontFamily:"Roboto-Bold" , color: '#434343', fontSize: 20, fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.9, marginTop: 19, marginLeft: 20, }}>How can we help you</Text>
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, paddingTop: 20 }}>
                        {this.state.Option1 != true ?
                         this.state.Option2 == true ?
                         <View>
                                    <TouchableOpacity onPress={() => 
                                    this.setState({ 
                                        Option2: false,
                                     })}
                                      style={styles.BackOptionContainer}>
                                        <View style={{ alignSelf: "center", marginRight: 8 }}>
                                            <Icon name="angle-left" size={30} color={"#1cb49a"} />
                                        </View>
                                        <Text style={styles.OptionBack}>Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handelBack("I can't search in the location i want")} style={styles.OptionContainer}>
                                        <Text style={styles.OptionName}>I can't search in the location i want</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handelBack("I can't contact the seller" )} style={styles.OptionContainer}>
                                        <Text style={styles.OptionName}>I can't contact the seller</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.handelBack("Seller is not responding" )} style={styles.OptionContainer}>
                                        <Text style={styles.OptionName}>Seller is not responding</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ Option1: true, })} style={styles.OptionContainer}>
                                    <Text style={styles.OptionName}>I have a question about my account</Text>
                                    <View>
                                        <Icon name="angle-right" size={30} color={"#000"} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ Option2: true })} style={styles.OptionContainer}>
                                    <Text style={styles.OptionName}>I have an issue buying and selling</Text>
                                    <View>
                                        <Icon name="angle-right" size={30} color={"#000"} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handelBack('I have aquestion abouth credit card system and feature' )} style={styles.OptionContainer}>
                                    <Text style={styles.OptionName}>I have aquestion abouth credit card system and feature</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handelBack("I have a technical issue")} style={styles.OptionContainer}>
                                    <Text style={styles.OptionName}>I have a technical issue</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ Option1: false })} style={styles.BackOptionContainer}>
                                    <View style={{ alignSelf: "center", marginRight: 8 }}>
                                        <Icon name="angle-left" size={30} color={"#1cb49a"} />
                                    </View>
                                    <Text style={styles.OptionBack}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handelBack("I can't create an account" )} style={styles.OptionContainer}>
                                    <Text style={styles.OptionName}>I can't create an account</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handelBack("I'm not able to access my account" )} style={styles.OptionContainer}>
                                    <Text style={styles.OptionName}>I'm not able to access my account</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handelBack("I Want to edit my profile"  )} style={styles.OptionContainer}>
                                    <Text style={styles.OptionName}>I Want to edit my profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handelBack("I want to delete my account"  )} style={styles.OptionContainer}>
                                    <Text style={styles.OptionName}>I want to delete my account</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </ScrollView>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    HeaderContainer: { 
        alignSelf: 'center',
        width: Devicewidth,
        height: Deviceheight / 14,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        elevation:1
      },
      HeadrIconContainer: {
        width: Devicewidth,
        height: Deviceheight / 12,
        // justifyContent: "space-between",
        flexDirection: "row",
      },
    OptionContainer: {
        width: Devicewidth / 1.15,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: 'space-between',
        flexDirection: "row",
        marginBottom: 25,
        // backgroundColor:"green"
    },
    OptionName: {
        fontSize: 16,
        textAlign: "left",
        color: "#000"
    },
    BackOptionContainer: {
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: "row",
        marginBottom: 25,
        paddingLeft: 15
    },
    OptionBack: {
        fontSize: 18,
        textAlign: "left",
        color: "#1cb49a",
        alignSelf: "center",
        fontWeight: "bold"
    },
})