import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const axios = require('axios');


const DeleteProductConfermationModal = (props) => {
    const [modal, modalVisible] = useState(false);
    const { modalProps, SetmodalProps } = props;
    const { navigation } = props

    useEffect(() => {

    }, [])

    const HandelDelete= async (prodId) => {
        props.DeleteProduct(prodId)
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
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, fontWeight: "bold", color: "#000", textAlign: 'center', }}>Confirm!</Text>

                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: "#000", textAlign: 'center', marginTop: 15,  width: Devicewidth / 1.6,marginBottom:20  }}>Are you sure you want to delete this item ?</Text>
                                    <View style={{  alignItems: "center", justifyContent: 'space-around', alignSelf: "center", flexDirection: "row", }}>
                                        <TouchableOpacity
                                         onPress={() => HandelDelete()} 
                                          style={{ borderRadius: 50, alignItems: "center", justifyContent: "center", backgroundColor: "#4046af", width: Devicewidth / 3.5, height: Deviceheight / 18 ,marginRight: 15 }}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#fff", fontWeight: "bold", textAlign: 'center', }}>YES</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                        onPress={() => props.onPressClose()} 
                                        style={{ borderRadius: 50, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#4046af", width: Devicewidth / 3.5, height: Deviceheight / 18, }}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#000", textAlign: 'center', fontWeight: "bold", }}>NO</Text>
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


export default DeleteProductConfermationModal;


const styles = StyleSheet.create({
    modalBody: {
        alignItems: 'center',
        // height: Deviceheight / 3,
        width: Devicewidth / 1.4,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignSelf: "center",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom:20,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: ' rgba(0,0,0,0.8)'
    },
})