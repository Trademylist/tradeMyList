import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';


const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const axios = require('axios');


const BlockModal = (props) => {
    const [modal, modalVisible] = useState(false);
    const { modalProps, SetmodalProps } = props;
    const [BlockModal, SetBlockModal] = useState(false);
    const { navigation } = props

    useEffect(() => {
        
    }, [])

    const HandelBlockAPI=async()=>{

        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                const object = {
                    "block_user_id": props.seller_Id
                }
                await axios.post("https://trademylist.com:8936/app_seller/block_user", object, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        //console.log("my block response",response);
                        if(response.data.success==true){
                            
                        // alert(response.data.message)
                        props.onPressBlockClose()
                        }
                        else{
                            // error comming
                        }

                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
            } else {
                null
            }
        } catch (e) {
            // error reading value
        }
    }
    
    return (
        <View>
            {
                modalProps ?
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalProps}
                        onRequestClose={() => {
                            modalVisible(!modal)
                        }}>
                        <TouchableOpacity onPress={() => props.onPressBlockClose()} style={styles.modalContainer}>
                            <View style={styles.modalBody}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, fontWeight: "bold", color: "#000", textAlign: 'center', }}>Block User</Text>

                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: "#000", textAlign: 'center', marginTop: 15,  width: Devicewidth / 1.6,marginBottom:30 ,alignSelf:"center" }}>Blocking will prevent you from sending and receiving any messages to the user. Are you sure?</Text>
                                    <View style={{  alignItems: "center", justifyContent: 'space-around', alignSelf: "center", flexDirection: "row", }}>
                                        <TouchableOpacity onPress={() => props.onPressBlockClose()} style={{ borderRadius: 50, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#4046af", width: Devicewidth / 3.5, height: Deviceheight / 18, marginRight: 15 }}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#000", textAlign: 'center', fontWeight: "bold", }}>CANCEL</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => HandelBlockAPI()}  style={{ borderRadius: 50, alignItems: "center", justifyContent: "center", backgroundColor: "#4046af", width: Devicewidth / 3.5, height: Deviceheight / 18 ,marginLeft:10}}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#fff", fontWeight: "bold", textAlign: 'center', }}>OK</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    : null
            }
        </View>
    );
}


export default BlockModal;


const styles = StyleSheet.create({
    modalBody: {
        alignItems: 'center',
        height: Deviceheight / 3,
        width: Devicewidth / 1.3,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignSelf: "center",
        justifyContent: "center",
        paddingTop: 15
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: ' rgba(0,0,0,0.8)'
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
    },
})