import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import Toast from 'react-native-simple-toast';

const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const axios = require('axios');


const ReportModal = (props) => {
    const [modal, modalVisible] = useState(false);
    const { modalProps, SetmodalProps } = props;
    const [BlockModal, SetBlockModal] = useState(false);
    const [reasons, setReasons] = useState([]);
    const [subReasons, setSubReasons] = useState([]);
    const [selectedReason, setSelectedReason] = useState(null);
    const [selectedSubReason, setSelectedSubReason] = useState(null);
    const { navigation } = props

    useEffect(() => {
        fetchReportComments()
    }, [])

    const fetchReportComments = async () => {
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'));
        if (value !== null) {
            await axios.get("https://trademylist.com:8936/app_seller/commentList", {
                headers: {
                    'x-access-token': value.token,
                }
            })
            .then(response => {
                let array = response.data.data.map(data => {
                    let obj = {
                        value: data.comment,
                        label: data.comment,
                        data: data.sub_comment
                    }
                    return obj
                })
                //console.log('array', array);
                setReasons(array);
            })
            .catch((error) => {
                console.log(' errorA', error.message);
            })
        } else {
            console.log(' error');
        }
    }

    const submitReport = async()=>{
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                const obj = {
                    "reported_to": props.seller_Id,
                    "comment": selectedReason,
                    "sub_comment": selectedSubReason
                }
                await axios.post("https://trademylist.com:8936/app_seller/report", obj, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        if(response.data.success==true){
                            Toast.showWithGravity(
                                "Report submitted successfully",
                                Toast.SHORT,
                                Toast.BOTTOM,
                            );
                            props.onPressReportClose()
                        }
                        else{
                            Toast.showWithGravity(
                                "Report coudn't be submitted",
                                Toast.SHORT,
                                Toast.BOTTOM,
                            );
                        }
                    })
                    .catch(error => {
                        console.log('errorA',error.data)
                    })
            } else {
                console.log('errorB',(error));
            }
        } catch (e) {
            console.log('errorC',e);
            // error reading value
        }
    }

    const dropDownChangeHandler = (val) => {
        setSelectedSubReason(null);
        setSelectedReason(val);
        setSubReasons([])
        for (let i = 0; i < reasons.length; i++) {
            if(reasons[i].value == val){
                let array = reasons[i].data.map(data => {
                    let obj = {
                        value: data,
                        label: data,
                    }
                    return obj
                })
                setSubReasons(array);
                break;
            }            
        }
    }

    const dropDownSubChangeHandler = (val) => {
        setSelectedSubReason(val);
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
                            <View style={{
                                width: '80%',
                                height: '50%',
                                alignSelf: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 15,
                                justifyContent: "space-evenly",
                                // alignItems: 'center'
                            }}>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, fontWeight: "bold", color: "#000", textAlign: 'center', }}>Report User</Text>
                                <Dropdown
                                    label={'Select'}
                                    onChangeText={val => dropDownChangeHandler(val)}
                                    data={reasons}
                                    value={selectedReason}
                                    containerStyle={{
                                        width: '70%',
                                        height: '20%',
                                        alignSelf: 'center',
                                    }}
                                />
                                {
                                    subReasons.length > 0 &&
                                    <Dropdown
                                        useNativeDrive={true}
                                        label={'Select'}
                                        onChangeText={val => dropDownSubChangeHandler(val)}
                                        data={subReasons}
                                        value={selectedSubReason}
                                        containerStyle={{
                                            width: '70%',
                                            height: '20%',
                                            alignSelf: 'center',
                                        }}
                                    />
                                }
                                <TouchableOpacity style={!selectedReason ? styles.SearchIcon : styles.SearchIcon1} onPress={submitReport}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: "#fff" }}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                    : null
            }
        </View>
    );
}


export default ReportModal;


const styles = StyleSheet.create({
    SearchIcon: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        borderRadius: 360,
        width: Devicewidth / 6,
        height: Deviceheight / 20,
        backgroundColor: '#dddddd',
    },
    SearchIcon1: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        borderRadius: 360,
        width: Devicewidth / 6,
        height: Deviceheight / 20,
        backgroundColor: '#373ec2',
    },
    modalBody: {
        alignItems: 'center',
        height: Deviceheight / 3.6,
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