import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;



const ImageOptionModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const { onPressClose, SetonPressClose } = props;
  const { navigation } = props


  // useEffect(() => {
  //   const backAction = () => {
  //     console.log('baaaaack');
  //     // Alert.alert("Hold on!", "Are you sure you want to go back?", [
  //     //   {
  //     //     text: "Cancel",
  //     //     onPress: () => null,
  //     //     style: "cancel"
  //     //   },
  //     //   { text: "YES", onPress: () => BackHandler.exitApp() }
  //     // ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const chooseFile = async (data) => {
    props.getchooseFileData(data)
  }


  const captureImage = async (data) => {
    props.getcaptureFileData(data)
  }



  return (
    <View>
      {
        modalProps ?
          <Modal
            har
            animationType="slide"
            transparent={true}
            visible={modalProps}
            onRequestClose={() => {
              props.onPressClose()
            }}>
            <View  onPress={() => props.onPressClose()} style={styles.modalContainer}>
              <View style={styles.modalBody}>
                <ScrollView showsVerticalScrollIndicator={false}>
                 
                  {/* <TouchableOpacity style={styles.HeadrIconContainer}
                    onPress={() => props.onPressClose()}
                  >
                    <Image source={require('../../Assets/Cross.png')} style={{ width: 17, height: 17, resizeMode: 'contain' }}></Image>
                  </TouchableOpacity> */}
                 
                  <Text style={{fontFamily:"Roboto-Medium",color:'#787878',fontSize:16,textAlign:'left',marginTop:20,}}>Select Image Source</Text>
                  <TouchableOpacity style={{alignItems:'flex-start',justifyContent:'flex-start',alignSelf:'flex-start',borderRadius:5,marginTop:30,alignSelf:"flex-start"}} onPress={() => chooseFile('photo')}>
                   <Text style={{fontFamily:"Roboto-Medium",color:'#262626',fontSize:16,textAlign:'left'}}>Load from Library</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={{alignItems:'flex-start',justifyContent:'flex-start',alignSelf:'flex-start',borderRadius:5,marginTop:30,alignSelf:"flex-start"}} onPress={() => captureImage('photo')}>
                   <Text style={{fontFamily:"Roboto-Medium",color:'#262626',fontSize:16,textAlign:'left'}}>Use Camera</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity  onPress={() => props.onPressClose()} style={{alignItems:'flex-start',justifyContent:'flex-start',alignSelf:'flex-start',marginTop:30,}}>
                   <Text style={{fontFamily:"Roboto-Medium",color:'#262626',fontSize:16,textAlign:'left'}}>Cancel</Text>
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


export default ImageOptionModal;


const styles = StyleSheet.create({
  modalBody: {
    alignItems: 'flex-start',
    height:Deviceheight/3.3,
    width: Devicewidth,
    backgroundColor: '#fff',
    paddingBottom: 10,
    alignSelf:"flex-end",
    paddingLeft:15
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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