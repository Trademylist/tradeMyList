import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';


const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const axios = require('axios');


const ProductUploadBackModal = (props) => {
    const [modal, modalVisible] = useState(false);
    const { modalProps, SetmodalProps } = props;
    const [BackStatus, SetBackStatus] = useState(false);
    const { navigation } = props

    useEffect(() => {
        
    }, [])

    const HandelOk = () => {
        if(props.Process=="general"){
            navigation.navigate('productList')
            props.onPressClose()
        }
        else{
            navigation.navigate('productList')
            props.onPressClose()
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
                        <View style={styles.modalContainer}>
                            <View style={styles.modalBody}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#7f818e", textAlign: 'center', marginTop: 15, width: Devicewidth / 1.6, marginBottom: 30 }}>You are really,really close to posting it and making sell.</Text>
                                    <View style={{ alignItems: "center", justifyContent: 'space-around', alignSelf: "center", flexDirection: "row", }}>
                                        <TouchableOpacity
                                            onPress={() => props.onPressClose()}
                                            style={{ borderRadius: 50, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#4046af", width: Devicewidth / 3.5, height: Deviceheight / 18, marginRight: 15 }}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#000", textAlign: 'center', fontWeight: "bold", }}>STAY</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => HandelOk()}
                                            style={{ borderRadius: 50, alignItems: "center", justifyContent: "center", backgroundColor: "#4046af", width: Devicewidth / 3.5, height: Deviceheight / 18 }}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#fff", fontWeight: "bold", textAlign: 'center', }}>DISCARD</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                    : null
            }
        </View>
    );
}


export default ProductUploadBackModal;


const styles = StyleSheet.create({
    modalBody: {
        alignItems: 'center',
        // height: Deviceheight / 3,
        width: Devicewidth / 1.5,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignSelf: "center",
        justifyContent: "center",
        paddingTop: 15,
        paddingBottom: 15
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