import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';


const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const axios = require('axios');


const LoginModalFirst = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const { navigation } = props

  const redirectlogin = () => {
    props.getloginmodal()
  }
  useEffect(() => {

  }, [])
  const HandelTermsCondition = () => {
    props.onPressCloseFIrstMoadl()
    navigation.navigate('termsCondition')
  }
  const HandelPrivacyPolicy = () => {
    props.onPressCloseFIrstMoadl()
    navigation.navigate('privacyPolicy')
  }
  const HandelHelp = () => {
    props.onPressCloseFIrstMoadl()
    navigation.navigate('help')
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

                  <TouchableOpacity style={styles.HeadrIconContainer}
                    onPress={() => props.onPressCloseFIrstMoadl()}
                  >
                    <Image source={require('../../Assets/close_button.png')} style={{ width: 13, height: 13, resizeMode: 'contain' }}></Image>
                  </TouchableOpacity>

                  <View style={{ height: Deviceheight / 6.8, width: Devicewidth, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 5, backgroundColor: "#eeeeee", flexDirection: "row" }}>
                    <TouchableOpacity style={{
                      height: Deviceheight / 11,
                      width: Devicewidth / 5.5, alignItems: "center", justifyContent: "center", alignSelf: "center", borderRadius: 360, backgroundColor: '#fff', marginBottom: 10
                    }}>
                      <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                    </TouchableOpacity>
                    <View style={{ height: Deviceheight / 6.5, width: Devicewidth / 1.5, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 5, paddingLeft: 30, paddingBottom: 40 }}>
                      <Text style={{ fontFamily:"Roboto-Bold" , color: "#020202", fontSize: 20, fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start', }}>Log in</Text>
                      <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontSize: 16, textAlign: 'left', alignSelf: 'flex-start', marginTop: 5 }}>Log in to your account</Text>
                    </View>
                  </View>


                  {/* Terms & Contiditon */}
                  <TouchableOpacity onPress={() => HandelTermsCondition()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.05, height: Deviceheight / 16, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                      <View style={{
                        height: Deviceheight / 50,
                        width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                      }}>
                        <Image source={require("../../Assets/Terms.png")} style={{ height: "100%", width: "100%" }}></Image>
                      </View>
                      <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Terms & Contiditon</Text>
                    </View>
                    <View style={{
                      height: Deviceheight / 50,
                      width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                    }}>
                      <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                    </View>
                  </TouchableOpacity>


                  {/* Privacy Policy */}
                  <TouchableOpacity onPress={() => HandelPrivacyPolicy()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.05, height: Deviceheight / 16, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                      <View style={{
                        height: Deviceheight / 40,
                        width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                      }}>
                        <Image source={require("../../Assets/Privacy.png")} style={{ height: "100%", width: "100%" }}></Image>
                      </View>
                      <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Privacy Policy</Text>
                    </View>
                    <View
                      style={{
                        height: Deviceheight / 50,
                        width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                      }}>
                      <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                    </View>
                  </TouchableOpacity>


                  {/* Help */}
                  <TouchableOpacity onPress={() => HandelHelp()} style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "#dedede", borderBottomWidth: 1, width: Devicewidth / 1.05, height: Deviceheight / 16, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignSelf: "center", width: Devicewidth / 1.5, height: Deviceheight / 14, justifyContent: 'flex-start', paddingLeft: 10 }}>
                      <View style={{
                        height: Deviceheight / 50,
                        width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center",
                      }}>
                        <Image source={require("../../Assets/Help.png")} style={{ height: "100%", width: "100%" }}></Image>
                      </View>
                      <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", fontWeight: "bold", fontSize: 16, textAlign: 'center', alignSelf: 'center', marginLeft: 15 }}>Help</Text>
                    </View>
                    <View
                      style={{
                        height: Deviceheight / 50,
                        width: Devicewidth / 22, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 20,
                      }}>
                      <Image source={require("../../Assets/BackIconRight.png")} style={{ height: "100%", width: "100%" }}></Image>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ width: Devicewidth / 1.1, height: Deviceheight / 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 20, marginTop: 15 }} onPress={redirectlogin}>
                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Login</Text>
                  </TouchableOpacity>

                </ScrollView>
              </View>
            </View>
          </Modal>
          : null
      }
    </View>
  );
}


export default LoginModalFirst;


const styles = StyleSheet.create({
  modalBody: {
    alignItems: 'flex-start',
    flex: 1,
    width: Devicewidth,
    backgroundColor: '#fff',
    paddingBottom: 10
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: ' rgba(0,0,0,0.8)',
  },
  HeadrIconContainer: {
    paddingTop: Platform.OS == 'ios' ? 55 : 20,
    paddingLeft: 15,
    alignSelf: 'center',
    alignItems: 'flex-start',
    width: Devicewidth,
    height: Deviceheight / 15,
    backgroundColor: '#fff',
    justifyContent: "flex-start",
  },
})
