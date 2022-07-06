import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import BlockModal from "../BlockModal/index"

const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const axios = require('axios');


const ReportandBlockOptionModal = (props) => {
    const [modal, modalVisible] = useState(false);
    const { modalProps, SetmodalProps } = props;
    const [blockModal, SetBlockModal] = useState(false);
    const { navigation } = props

    useEffect(() => {

    }, [])

    const HandelBlock = () => {
       props.OpenBlockModal()
    }

    const HandelReport = () => {
        props.OpenReportModal()
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
                        
                        <TouchableOpacity onPress={() => props.onPressClose()} style={styles.modalContainer}>
                            <View style={styles.modalBody}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <TouchableOpacity onPress={() => HandelBlock()}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: "#000", textAlign: "left", marginBottom: 20, fontFamily:"Roboto-Medium",}}>Block User</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => HandelReport()}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: "#000", textAlign: "left",fontFamily:"Roboto-Medium", }}>Report User</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    : null
            }
        </View>
    );
}


export default ReportandBlockOptionModal;


const styles = StyleSheet.create({
    modalBody: {
        alignItems: 'flex-start',
        // height: Deviceheight / 6,
        // width: Devicewidth / 2,
        backgroundColor: '#fff',
        paddingLeft:20,
        paddingRight:50,
        paddingVertical:20,
        position: "absolute",
        top: 50,
        right: 25,
        borderRadius: 5
    },
    modalContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
        backgroundColor: ' rgba(0,0,0,0.8)'
    },
})