import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
import SellProductList from "../SellProductList";
import LoginModal from '../LoginModal'
import Fontisto from 'react-native-vector-icons/Fontisto';

const ProductCatagory = [
  {
    id: '1',
    Name: "CAR",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#42f59e"
  },
  {
    id: '2',
    Name: "ELECTRONICS",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#280f69"
  },
  {
    id: '3',
    Name: "FURNATURE",
    Image: require('../../Assets/HomeIcon.png'),
    Color: '#8f87a3'
  },
  {
    id: '4',
    Name: "SPORTS & LESUIRE",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#eb7575"
  },
  {
    id: '5',
    Name: "HOME & GARDEN",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#ed661c"
  },
  {
    id: '6',
    Name: "CLOTHES & SHOES",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#7a7674"
  },
  {
    id: '7',
    Name: "SPORTS & LESUIRE",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#eb7575"
  },
  {
    id: '8',
    Name: "HOME & GARDEN",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#ed661c"
  },
  {
    id: '9',
    Name: "CLOTHES & SHOES",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#7a7674"
  },
  {
    id: '10',
    Name: "CAR",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#42f59e"
  },
  {
    id: '12',
    Name: "ELECTRONICS",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#280f69"
  },
  {
    id: '13',
    Name: "FURNATURE",
    Image: require('../../Assets/HomeIcon.png'),
    Color: '#8f87a3'
  },
  {
    id: '14',
    Name: "SPORTS & LESUIRE",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#eb7575"
  },
  {
    id: '15',
    Name: "HOME & GARDEN",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#ed661c"
  },
  {
    id: '16',
    Name: "CLOTHES & SHOES",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#7a7674"
  },
  {
    id: '17',
    Name: "SPORTS & LESUIRE",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#eb7575"
  },
  {
    id: '18',
    Name: "HOME & GARDEN",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#ed661c"
  },
  {
    id: '19',
    Name: "CLOTHES & SHOES",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#7a7674"
  },
  {
    id: '20',
    Name: "CLOTHES & SHOES",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#7a7674"
  },
  {
    id: '21',
    Name: "CLOTHES & SHOES",
    Image: require('../../Assets/HomeIcon.png'),
    Color: "#7a7674"
  },
]

const SellModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const [loginModal, SetLoginModal] = useState(false)
  const { modalProps, SetmodalProps } = props;
  const { onPressClose, SetonPressClose } = props;
 

  const { navigation } = props
  useEffect(() => {

  }, [])
   console.warn(props.categoryData)
  const getcheck = () => {
    props.getFooter()
  }

  const closeloginModal = () => {
    SetLoginModal(false)
}
const redcLogin = () => {
  SetLoginModal(false)
  navigation.push('auth'); 
}
  const HandelSellProduct= async (val)=>{
    try{
      const value = await AsyncStorage.getItem('UserData');
      if(value !== null){
        props.onPressClose()
        if(props.ProdType === 'freebies'){
          navigation.navigate('commerciallistingDetails',{"category":val})
        }else{
          navigation.navigate('listingDetails',{"category":val})
        }
        }else{
          props.onPressClose()
          SetLoginModal(true)
        }
    }catch (e){
      //console.log(e.data)
    }
    
  }
  return (  
    <View>
       <LoginModal
          modalProps={loginModal}
          onPressClose={closeloginModal}
          getlogin={redcLogin}
          navigation={props.navigation}
        ></LoginModal>
      { 
        modalProps ?
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalProps}
            onRequestClose={() => {
              props.onPressClose()
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.HeadrIconContainer}>
                <TouchableOpacity onPress={() => props.onPressClose()} style={{ alignItems: 'center', justifyContent: 'center',  marginTop: 10,backgroundColor:"#f5f5f5" ,padding:4}}>
                <Fontisto name='close-a' size={12} color={"#000000"} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 20,paddingBottom:8 }}>
                  <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontWeight: 'bold', fontSize: 18, textAlign: 'left', marginLeft: 30 }}>What are you selling?</Text></View>
              </View>

              <View style={styles.modalBody}>
                <FlatList
                  data={props.categoryData}
                  showsVerticalScrollIndicator={false} 
                  numColumns={3}
                  renderItem={({ item }) => (
                    <SellProductList
                    name={item.category_name}
                    image={item.category_image}
                    getNotify={getcheck}
                    imagePath={props.CatImgLink}
                    navigation={props.navigation}
                    color='#42f59e'
                    handelProduct={HandelSellProduct}
                    />
                  )}
                  keyExtractor={item => item.category_name}
                />
              </View>
            </View>
          </Modal>
          : null
      }
    </View>
  );
}


export default SellModal;


const styles = StyleSheet.create({
  modalBody: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
    width: Devicewidth,
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop: 10
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: ' rgba(0,0,0,0.8)',
    paddingTop: Deviceheight / 5,
  },
  HeadrIconContainer: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    width: Devicewidth,
    height: Deviceheight / 15,
    backgroundColor: '#fff',
    justifyContent: "flex-start",
    flexDirection: 'row',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 15,
    paddingLeft: 15
  },
})