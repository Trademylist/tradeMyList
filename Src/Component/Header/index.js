import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LoginModal from '../LoginModal';
import LoginModalFirst from '../LoginModalFirst';
import SearchIcon from "react-native-vector-icons/Fontisto";
import AsyncStorage from '@react-native-community/async-storage';
import FilterModal from "../FilterModal"
const axios = require('axios');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;


const Header = (props) => {
  const Deviceheight = Dimensions.get('window').height;
  const [ModalVisible, setModalVisible] = useState(false)
  const [userDetails, SetuserDetails] = useState('')
  const [FilterVisible, SetFilterVisible] = useState(false)
  const [loginModal, SetLoginModal] = useState(false)
  const [loginModalFirst, SetLoginModalFirst] = useState(false)
  const { navigation } = props
  const ref_input = useRef();

  const [cancelIcon, SetCancelIcon] = useState(false)
  ShowCancelButton = () => {
    SetCancelIcon(true)
  }

  const [box, setBox] = useState(false)
  showBlankTextBox = () => {
    setBox(true)
  }

  makeboxfalse=() =>{
    setBox(false)
  }

  const handelMenu = async () => {
    try {
      const value = await AsyncStorage.getItem('UserData');
      if (value !== null) {
        navigation.navigate('menu')
      } else {
        SetLoginModalFirst(true)
      }
    } catch (e) {
      //console.log(e.data)
    }


  }
  const handelFilter = async () => {
    SetFilterVisible(true)
  }
  const closeFilterModal = () => {
    SetFilterVisible(false)
  }
  useEffect(() => {
    getStateFromPath();
    const unsubscribe = props.navigation.addListener('focus', () => {
      getStateFromPath();
    });
    // return unsubscribe
  }, [])

  const getStateFromPath = async () => {
    // try {
    //   let userdata = JSON.parse(await AsyncStorage.getItem('UserData'));
    //   // console.log('caaaaled', userdata);
    //   if (userdata !== null) {
    //     SetuserDetails(userdata)
    //     //console.log("my user data", userDetails);
    //   } else {
    //     SetuserDetails(null)
    //   }
    // } catch (e) {
    //   //console.log(e.data)
    // }

      try {
        const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
        //console.log("my AsyncStorage data at header", value);
        if (value !== null) {
            await axios.get("https://trademylist.com:8936/user/" +value.userid, {
                headers: {
                    'x-access-token': value.token,
                }
            })
                .then(response => {
                    //console.log("my user data response data at header",response.data.data)
                    SetuserDetails(response.data.data)
                        //console.log("my user data at header", userDetails);

                })
                .catch(error => {
                    //console.log(error.data)
                })
        } else {
            // alert('login Modal')
        }
    } catch (e) {
        // error reading value
    }
  }
  const closeloginModal = () => {
    SetLoginModal(false)
    SetLoginModalFirst(false)
  }

  const redcLogin = () => {
    SetLoginModalFirst(false)
    SetLoginModal(false)
    navigation.push('auth');
  }
  const closeloginModalFirst = () => {
    SetLoginModalFirst(false)
  }
  const redcLoginModal = () => {
    SetLoginModal(true)
  }

  const getfilterDetails = (distance, sortBy, lat, lng, selectedProdCategory, fromInr, toInr, country, obj) => {
    SetFilterVisible(false)
    props.getDataFilter(distance, sortBy, lat, lng, selectedProdCategory, fromInr, toInr, country, obj)
  }
  return (
        <SafeAreaView style={styles.Container}>
          <StatusBar backgroundColor="#000000" />
          <FilterModal
            modalProps={FilterVisible}
            onPressClose={() => closeFilterModal()}
            filerdata={getfilterDetails}
            process={props.process}
            navigation={props.navigation}
          ></FilterModal>
          <LoginModalFirst
            modalProps={loginModalFirst}
            onPressCloseFIrstMoadl={closeloginModalFirst}
            getloginmodal={redcLoginModal}
            navigation={props.navigation}
          ></LoginModalFirst>
          <LoginModal
            modalProps={loginModal}
            onPressClose={closeloginModal}
            onPressCloseFirstModal={closeloginModalFirst}
            getlogin={redcLogin}
            navigation={props.navigation}
          ></LoginModal>
          <View style={styles.HeadrIconContainer}>

            <TouchableOpacity onPress={() => handelMenu()} style={{
              height: Deviceheight / 20,
              width: Devicewidth / 10, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 10, borderRadius: 360,
            }}>
            {
                (userDetails !== '' && userDetails !== null) ?
                  userDetails.image !== null
                    ?
                    <Image source={{ uri: userDetails.image }} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                    :
                    <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
                :
                <Image source={require("../../Assets/default-avatar.png")} style={{ height: "100%", width: "100%", borderRadius: 360 }}></Image>
              }

            </TouchableOpacity>

            <View onPress={() => { this.refs['input'].focus() }} style={{ flexDirection: "row", width: Devicewidth / 1.35, alignItems: "center", alignSelf: "center", backgroundColor: "#eea631", borderRadius: 5, paddingLeft: 10 ,}}>
              <TouchableOpacity style={styles.SearchIcon}  onPress={() => ref_input.current.focus()}>
                <SearchIcon name={'search'} size={22} color={'#000'} />
              </TouchableOpacity>



                    <TextInput
                      placeholder={props.categoryName || "All Product"}
                      placeholderTextColor={"#000"}
                      style={styles.SearchContainer}
                      autoFocus={false}
                      keyboardType={"default"}
                      onChangeText={(value) => props.getsearchKey(value)}
                      ref={ref_input}
                    />







              {/*{ cancelIcon && */}
                <TouchableOpacity
                  style={styles.closeButtonParent}
                  onPress={() => ref_input.current.clear()}>
                  <Image
                    style={styles.closeButton}
                    source={require('../../Assets/cancel.png')}
                  />
                </TouchableOpacity>
              {/*}*/}

            </View>
            <TouchableOpacity onPress={() => handelFilter()} style={{
              height: Deviceheight / 40,
              width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginRight: 10
            }}>
              <Image source={require("../../Assets/filter1.png")} style={{ height: "100%", width: "100%" }}></Image>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  Container: {
    alignSelf: 'center',
    width: Devicewidth,
    height: Deviceheight / 12,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  HeadrIconContainer: {
    width: Devicewidth,
    height: Deviceheight / 12,
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor:"yellow"
  },
  SearchContainer: {
    borderRadius: 5,
    // height: Deviceheight / 20,
    width: Devicewidth / 2,
    alignSelf: 'center',
    justifyContent: "flex-end",
    fontSize: 16,
    textAlign: "left",
    paddingLeft:10
    // backgroundColor:"green"
  },
  SearchIcon: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: Deviceheight / 22,
    marginHorizontal: 5,
  },
  closeButton: {
    height: 16,
    width: 16,
  },
})

export default Header;
