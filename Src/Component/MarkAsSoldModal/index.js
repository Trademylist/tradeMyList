import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';


const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const axios = require('axios');


const MarkAsSoldModal = (props) => {
    const [modal, modalVisible] = useState(false);
    const { modalProps, SetmodalProps } = props;
    const [BlockModal, SetBlockModal] = useState(false);
    const { navigation } = props

    useEffect(() => {
      
    }, [])

    const HandelOk=()=>{
        navigation.navigate('selectBuyer',{'productId':props.productId,'productType':props.productType})
        props.onPressClose()
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
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, fontWeight: "bold", color: "#000", textAlign: 'center', }}>Mark as sold</Text>

                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#000", textAlign: 'center', marginTop: 15,  width: Devicewidth / 1.6,marginBottom:20  }}>This action can't be undone. Only select this when you have met the buyer and receive payment. Continue?</Text>
                                    <View style={{  alignItems: "center", justifyContent: 'space-around', alignSelf: "center", flexDirection: "row", }}>
                                        <TouchableOpacity 
                                        onPress={() => props.onPressClose()} 
                                        style={{ borderRadius: 50, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#4046af", width: Devicewidth / 3.5, height: Deviceheight / 18, marginRight: 20 }}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#000", textAlign: 'center', fontWeight: "bold", }}>NO</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                         onPress={() => HandelOk()} 
                                          style={{ borderRadius: 50, alignItems: "center", justifyContent: "center", backgroundColor: "#4046af", width: Devicewidth / 3.5, height: Deviceheight / 18 }}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#fff", fontWeight: "bold", textAlign: 'center', }}>YES</Text>
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


export default MarkAsSoldModal;


const styles = StyleSheet.create({
    modalBody: {
        alignItems: 'center',
        // height: Deviceheight / 3,
        width: Devicewidth / 1.35,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignSelf: "center",
        justifyContent: "center",
        paddingTop: 25,
        paddingBottom:25
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: ' rgba(0,0,0,0.8)'
    },
})