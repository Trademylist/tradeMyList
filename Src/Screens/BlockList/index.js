import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import Header from "../../Component/HeaderBack"
import AsyncStorage from '@react-native-community/async-storage';
const axios = require('axios');

const Data = [
    {
        key: '1',
        name: 'Kundra',
    },
    {
        key: '2',
        name: 'Rudra',
    },
];
export default class BlockList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            BlockList: []
        }
    }
    state = this.state;

    componentDidMount() {
        this.getBlockList()
    }
    getBlockList = async () => {
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        if (value !== null) {
            await axios.get("https://trademylist.com:8936/app_seller/block_user", {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(response => {
                    this.setState({
                        BlockList: response.data.data,
                    })
                    //console.log("my block list", this.state.BlockList);
                })
                .catch(error => {
                    //console.log(error.data)
                })
        } else {
            // error
        }

    }
    UnblockUser = async (myId) => {
        //console.log("my id", myId);
        const object = {
            "block_user_id": myId
        }
        //console.log("my object", object);
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        if (value !== null) {
            await axios.post("https://trademylist.com:8936/app_seller/unblock_user", object, {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(response => {
                    //console.log("my unblock response", response);
                    // alert("User Unblocked")
                    this.getBlockList()
                })
                .catch(error => {
                    //console.log(error.data)
                })
        } else {
            // error
        }

    }

    render() {
        return (
            <>
                <View style={styles.Container}>
                    <Header navigation={this.props.navigation} Desc={"Block list"} />
                    <View style={styles.FlatListContainer}>
                        {this.state.BlockList.length == 0 ?
                            <>
                                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: Deviceheight / 4, width: Devicewidth / 1.5, marginBottom: 10, marginTop: 10 }}>
                                    <Image source={require("../../Assets/selling.jpg")} style={{ height: "100%", width: "100%", resizeMode: "contain" }}></Image>
                                </View>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: "#000", fontWeight: "bold", textAlign: "center" }}>No Users in block list</Text>
                            </>
                            :
                            <FlatList
                                data={this.state.BlockList}
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={styles.MainContainer}>

                                        <View style={styles.nameMainContainer}>
                                            <Text style={styles.name}>{item.username}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.UnblockUser(item._id)} style={styles.UnblockContainer}>
                                            <Text style={styles.Unblock}>UNBLOCK</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                keyExtractor={item => item.id}
                            />
                        }
                    </View>
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
    FlatListContainer: {
        width: Devicewidth,
        height: Deviceheight / 1.1,
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 10,
    },
    MainContainer: {
        alignItems: 'center',
        height: Deviceheight / 22,
        width: Devicewidth,
        alignSelf: "center",
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    UnblockContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
        height: Deviceheight / 26,
        width: Devicewidth / 5,
        backgroundColor: '#373ec2',
        borderRadius: 5
    },
    Unblock: {
        textAlign: 'left',
        fontSize: 12,
        color: '#ffffff'
    },
    nameMainContainer: {
        alignItems: 'flex-start',
        width: Devicewidth / 4,
        height: Deviceheight / 22,
        marginLeft: 20,
        justifyContent: "center"
    },
    name: {
        textAlign: 'left',
        fontSize: 16,
        color: '#000000'
    },
})