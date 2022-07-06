import React, { useState, useEffect } from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, SafeAreaView, Platform } from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import ImageZoom from 'react-native-image-pan-zoom';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;


const ImageZoomeModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;

  useEffect(() => {

  }, [])
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
                <TouchableOpacity style={{  marginTop: 0, alignSelf: 'flex-start', alignItems: "center", justifyContent: "center", marginLeft: 20 }}
                  onPress={() => props.onPressClose()}
                >
                    <Text style={{ fontFamily:"Roboto-Regular" , marginTop: 5, color: "#000", fontSize: 15, textAlign: 'center', alignSelf: 'center',marginLeft:5}}>Close</Text>

                   <Icon name={'close'} size={20} color={'#fff'}/>
                </TouchableOpacity>
                <View style={{height:'100%',width:Devicewidth,alignItems:"center",alignSelf:"center",justifyContent:"center",}}>
                  <ImageZoom cropWidth={Devicewidth}
                    cropHeight={Deviceheight}
                    imageWidth={Devicewidth}
                    imageHeight={Deviceheight}>
                    <Image style={{ width: "100%", height: "100%",resizeMode:"contain"}}
                      source={{ uri: props.MyImage }} />
                  </ImageZoom>

                </View>
              </View>
            </View>

          </Modal>
          : null
      }
    </View>
  );
}


export default ImageZoomeModal;


const styles = StyleSheet.create({
  modalBody: {
    alignItems: 'center',
    width: Devicewidth,
    height: Deviceheight,
    backgroundColor: '#000',
  },
  modalContainer: {
   justifyContent: 'center',
   alignItems: 'center',
    flex: 1,
    backgroundColor: ' rgba(0,0,0,0.8)'

  },
})