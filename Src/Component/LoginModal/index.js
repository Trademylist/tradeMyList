import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, ActivityIndicator, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LoginManager, AccessToken, LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import { UPDATE_CHAT_COUNTER } from '../../store/actions';
import { chatList } from '../../helperFunctions/chatList';


const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const axios = require('axios');


const LoginModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const [loder, Setloder] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const { onPressClose, SetonPressClose } = props;
  const [FCMToken, SetFCMToken] = useState('');
  // const [GooogleData, SetGooogleData] = useState('');
  const { navigation } = props

  const redirectlogin = () => {
    props.getlogin()
  }
  useEffect(() => {
    GoogleConfig()
    requestUserPermission()
  }, [])

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //console.log('Authorization status:', authStatus);
      getToken()
    }
  }

  const getToken = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    SetFCMToken(token)
    //console.log('Firebase fcm token:', token);

  }
  const HandelTermsCondition = () => {
    props.onPressClose()
    navigation.navigate('termsCondition')
  }

  const HandelPrivacyPolicy = () => {
    props.onPressClose()
    navigation.navigate('privacyPolicy')
  }
  const GoogleConfig = () => {
    GoogleSignin.configure({
      scopes: [], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '1093260793182-53b99plrg10jcm1em3plfl9th1spb8g5.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }


  const GsignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // this.setState({ userInfo });
      let Gresult = userInfo.user
      SetGooogleLogin(Gresult)
      //console.log("Google login data", Gresult);
      //DATA IS COMING HERE


    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        //console.log("CANCLED");

      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        console.log("ERROR", error);

        // some other error happened
      }
    }
  };
  const SetGooogleLogin = async (GData) => {
    Setloder(true)
    const object = {
      "email": GData.email,
      "username": GData.name,
      "notification_token": FCMToken,
      "login_type": "google",
      "socialId": GData.id,
      "image": GData.photo
    }
    //console.log("my google login object", object);
    await axios.post("https://trademylist.com:8936/app/social_login", object)
      .then(async response => {
        //console.log(response.data.success)
        if (response.data.success === true) {
          try {
            //console.log("google login response api", response.data.data);
            await AsyncStorage.setItem('UserData', JSON.stringify(response.data.data))
            await AsyncStorage.setItem('LoginType','google')
            setTimeout(async () => {
              props.onPressClose()
              let val = await chatList(props.onChatCounterUpdate);
              // props.onChatCounterUpdate(val);
              Setloder(false)
              props.navigation.push('home')
            }, 1000)

          } catch (e) {
            // saving error

          }
        }
      })
      .catch(error => {
        console.log('errorA',error.data)
      })
  }
  // const now123 = () => {
  //   console.log("in fncccccccccccccc")
  //   var current_access_token = '';
  //   AccessToken.getCurrentAccessToken().then((data) => {
  //     current_access_token = data.accessToken.toString();
  //   }).then(() => {
  //     let logout =
  //       new GraphRequest(
  //         "me/permissions/",
  //         {
  //           accessToken: current_access_token,
  //           httpMethod: 'DELETE'
  //         },
  //         (error, result) => {
  //           if (error) {
  //             console.log('Error fetching data: ' + error.toString());
  //           } else {
  //             LoginManager.logOut();
  //             console.log("in logout")
  //           }
  //         });
  //     new GraphRequestManager().addRequest(logout).start();
  //   })
  //     .catch(error => {
  //       console.log(error)
  //     });
  // }
  const fblogin = async () => {
    //console.log('in at fb potal');
    try {
      LoginManager.setLoginBehavior('native_with_fallback');
      // LoginManager.logOut();
      let fbResult = await LoginManager.logInWithPermissions(['public_profile', 'email'])
      // console.warn(fbResult);
      if (!fbResult.isCancelled) {
        AccessToken.getCurrentAccessToken().then((data) => {
          const accessToken = data.accessToken.toString();
          const responseInfoCallback = async (error, result) => {

            if (error) {
              console.log("Error fetching data: ", error.toString())
            } else {
              SetFbLogin(result)
              //console.log("my fb result", result);
            }
          }
          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken: accessToken,
              parameters: {
                fields: {
                  string: 'email,name,id,picture.type(large)'
                }
              }
            },
            responseInfoCallback
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start()
        })
      }
    } catch (error) {
       console.warn(error);
      console.log("ERROR WHILE LOGIN!");
    }
  }

  const SetFbLogin = async (FbData) => {
    Setloder(true)
    console.log("fb Login data", FbData)
    const object = {
      "email": FbData.email,
      "username": FbData.name,
      "notification_token": FCMToken,
      "login_type": "facebook",
      "socialId": FbData.id,
      "image": FbData.picture.data.url
    }
    //console.log("my fb login object", object);
    await axios.post("https://trademylist.com:8936/app/social_login", object)
      .then(async response => {
        console.log(response.data.data)
        if (response.data.success === true) {
          try {
            console.log("fb login response api", response.data.data);
            await AsyncStorage.setItem('UserData', JSON.stringify(response.data.data))
            await AsyncStorage.setItem('LoginType','facebook')
            setTimeout(async () => {
              props.onPressClose()
              let val = await chatList(props.onChatCounterUpdate);
              // props.onChatCounterUpdate(val);
              Setloder(false)
              props.navigation.push('home')
            }, 1000)

          } catch (e) {
            // saving error

          }
        }
      })
      .catch(error => {
        console.log('errorA',error.data)
      })
  }

  const applelogin = async () => {
    alert('ok');
  };

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
                {loder == true ?
                  <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, }} animating={loder} color={"#383ebd"} size="large" />
                  :
                  <ScrollView showsVerticalScrollIndicator={false}>

                    <TouchableOpacity style={styles.HeadrIconContainer}
                      onPress={() => props.onPressClose()}
                    >
                      <Image source={require('../../Assets/close_button.png')} style={{ width: 15, height: 15, resizeMode: 'contain' }}></Image>
                    </TouchableOpacity>

                    <View style={{ height: Deviceheight / 13, width: Devicewidth / 1.7, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 50, marginBottom: 30 }}>
                      <Image source={require("../../Assets/logo.png")} style={{ height: "100%", width: '100%', resizeMode: "contain" }} />
                    </View>

                    <TouchableOpacity
                      onPress={() => GsignIn()}
                      // onPress={() => now123()}
                      style={styles.btnContainer}>
                      <View style={{ height: Deviceheight / 41, width: Devicewidth / 20.5, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', }}>
                        <Image source={require("../../Assets/google.png")} style={{ height: "100%", width: '100%', resizeMode: "contain" }} />
                      </View>
                      <Text style={styles.btnText} >Login with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={fblogin} style={styles.btnContainer1}>
                      <View style={{ height: Deviceheight / 41, width: Devicewidth / 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                        <Image source={require("../../Assets/facebook.png")} style={{ height: "100%", width: '100%', resizeMode: "contain" }} />
                      </View>
                      <Text style={styles.btnText} >Login with Facebook</Text>
                    </TouchableOpacity>

                        <TouchableOpacity onPress={applelogin} style={styles.btnContainer2}>
                          <View style={{ height: Deviceheight / 41, width: Devicewidth / 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <Image source={require("../../Assets/apple.png")} style={{ height: "100%", width: '100%', resizeMode: "contain", tintColor: 'white' }} />
                          </View>
                          <Text style={styles.btnText} >Login with Apple</Text>
                        </TouchableOpacity>

                    <Text style={styles.OR} >OR</Text>
                    <TouchableOpacity style={{ alignItems: 'center', alignSelf: "center", justifyContent: "center", }} onPress={redirectlogin}>
                      <Text style={styles.Email} >Login with Email</Text>
                    </TouchableOpacity>

                    <Text style={styles.accepting} >if you are continue,you are accepting</Text>

                    <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 10 }}>
                      <Text style={styles.trade} >Trade </Text>
                      <TouchableOpacity onPress={() => HandelTermsCondition()}><Text style={styles.Terms}>Terms and Conditions </Text></TouchableOpacity>
                      <Text style={styles.and}>and </Text>
                      <TouchableOpacity onPress={() => HandelPrivacyPolicy()}><Text style={styles.Privacy}>PrivacyPolicy </Text></TouchableOpacity>
                    </View>
                    {/* <Text style={styles.trade} >Trade <TouchableOpacity><Text style={styles.Terms}>Terms and Conditions </Text></TouchableOpacity><Text style={styles.and}>and </Text><TouchableOpacity><Text style={styles.Privacy}>PrivacyPolicy </Text></TouchableOpacity></Text> */}
                  </ScrollView>
                }
              </View>
            </View>
          </Modal>
          : null
      }
    </View>
  );
}


const styles = StyleSheet.create({
  modalBody: {
    alignItems: 'flex-start',
    flex: 1,
    width: Devicewidth,
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop: Platform.OS == 'ios' ? 35 : 0,
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
  btnContainer: {
    width: Devicewidth / 1.1,
    height: Deviceheight / 18,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#f33038",
    borderRadius: 50,
    marginTop: 40,
    alignSelf: "center",
    flexDirection: "row"
  },
  btnContainer1: {
    width: Devicewidth / 1.1,
    height: Deviceheight / 18,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#014eff",
    borderRadius: 50,
    marginTop: 20,
    alignSelf: "center",
    flexDirection: "row"
  },
  btnContainer2: {
    width: Devicewidth / 1.1,
    height: Deviceheight / 18,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "black",
    borderRadius: 50,
    marginTop: 20,
    alignSelf: "center",
    flexDirection: "row"
  },
  btnText: {
    fontSize: 14,
    textAlign: "center",
    color: "#fffdfd",
    fontWeight: "bold",
    marginLeft: 20,
    marginRight: 40,
  },
  OR: {
    fontSize: 16,
    textAlign: "center",
    color: "#898989",
    fontWeight: "bold",
    marginVertical: 20,
    alignSelf: 'center',
  },
  Email: {
    fontSize: 14,
    textAlign: "center",
    color: "#383ebd",
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: 'center',
  },
  accepting: {
    fontSize: 14,
    textAlign: "center",
    color: "#808080",
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: 'center',
  },
  trade: {
    fontSize: 14,
    textAlign: "center",
    color: "#808080",
    fontWeight: "bold",
    alignSelf: 'center',
  },
  Terms: {
    fontSize: 14,
    textAlign: "center",
    color: "#383ebd",
    fontWeight: "bold",
    alignSelf: 'center',
  },
  and: {
    fontSize: 14,
    textAlign: "center",
    color: "#808080",
    fontWeight: "bold",
    alignSelf: 'center',
  },
  Privacy: {
    fontSize: 14,
    textAlign: "center",
    color: "#383ebd",
    fontWeight: "bold",
    alignSelf: 'center',
  },
})

const mapDispatchToProps = dispatch => {
  return {
      onChatCounterUpdate: (val) => dispatch({type: UPDATE_CHAT_COUNTER, payload: val}),
  }
}

export default connect(null, mapDispatchToProps)(LoginModal);
