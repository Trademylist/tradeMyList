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


const HeaderOne = (props) => {
  const Deviceheight = Dimensions.get('window').height;
  const [ModalVisible, setModalVisible] = useState(false)
  const { navigation } = props


  return (
  <View style={styles.Container}>
    <StatusBar backgroundColor="#000000" />
    <View style={styles.HeadrIconContainer}>
      <Text style={{ fontFamily:"Roboto-Bold" , color: "#464646", fontSize: 22, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center' }}>{props.Heading}</Text>
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
    elevation:1
  },
  HeadrIconContainer: {
    width: Devicewidth,
    height: Deviceheight / 14,
    justifyContent: 'center',
  },
})

export default HeaderOne;