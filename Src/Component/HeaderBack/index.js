import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import NotificationIcon from "react-native-vector-icons/Fontisto"
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;

const HeaderBack = (props) => {
  const Deviceheight = Dimensions.get('window').height;
  const [ModalVisible, setModalVisible] = useState(false)
  const { navigation } = props

const handelBack=()=>{
  console.log('+_+_+_+_+_+_+_')
  navigation.goBack()
}
  return (
    <View style={styles.Container}>
      <StatusBar backgroundColor="#000000" />
      <View style={styles.HeadrIconContainer}>
        <TouchableOpacity
        hitSlop={{
          bottom: 15,
          top: 15,
          left: 15,
          right: 15
        }}
        onPress={() => handelBack()} style={{
          height: Deviceheight / 50,
          width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20,marginBottom:5, }}>
          <Image source={require("../../Assets/BackIconLeft.png")} style={{ height: "100%", width: "100%" }}></Image>
        </TouchableOpacity>
        <Text style={{ fontFamily:"Roboto-Bold" , color: '#434343', fontSize: 20, lineHeight: 22, fontWeight: 'bold', textAlign: 'left', marginLeft: 20}}>{props.Desc}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  Container: { 
    alignSelf: 'center',
    width: Devicewidth,
    height: Deviceheight / 14,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    // elevation:1
  },
  HeadrIconContainer: {
    width: Devicewidth,
    height: Deviceheight / 12,
    alignItems: "center",
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: '#000'
  },
})

export default HeaderBack;