import React, { useState, useEffect } from 'react';
import {SafeAreaView,View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;



const CatagoryModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const { onPressClose, SetonPressClose } = props;
  const { navigation } = props

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
  ]

  useEffect(() => {

  }, [])

  // console.warn(props.categoryList)
  return (
    <SafeAreaView style={styles.container}>
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

                <View style={styles.HeadrIconContainer}>

<TouchableOpacity onPress={() => props.onPressClose()} style={{
  height: Deviceheight / 50,
  width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, marginBottom: 5,
}}>
  <Image source={require("../../Assets/BackIconLeft.png")} style={{ height: "100%", width: "100%" }}></Image>
</TouchableOpacity>
<Text style={{ fontFamily:"Roboto-Bold" , color: '#434343', fontSize: 18, textAlign: 'left', fontWeight: 'bold', alignSelf: 'flex-start', width: Devicewidth / 3, marginTop: 19, marginLeft: 120, }}>Categories</Text>
</View>



                  <View style={styles.FlatlistContainer}>
                    <FlatList
                      data={props.categoryList}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={{ flexDirection: "row", width: Devicewidth / 1.08, height: Deviceheight / 18, alignItems: "center", alignSelf: "center", borderRadius: 5, paddingLeft: 5, marginTop: 10 }} onPress={()=>props.getCategory(item.category_name,props.categoryImg,item.category_image)}>
                          <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', height: 50, width: 50, backgroundColor: item.Color, borderRadius: 360, marginRight: 15 }} >
                            <Image source={{uri: props.categoryImg+item.category_image}} style={{ height: "85%", width: "85%", resizeMode: "contain", borderRadius: 360 }}></Image>
                          </View>
                          <Text style={{ fontFamily:"Roboto-Bold" , color: "#000", textAlign: "left", fontSize: 15, fontWeight: "bold" }}>{item.category_name}</Text>
                          {
                            item.category_name === props.selectedProdCat ?
                            <FontAwesomeIcon name='check'  style={{position:'absolute',right:20,top:15,fontSize:15}} />
                            :
                            null 
                          }
                        </TouchableOpacity>  
                      )}
                      keyExtractor={item => item._id}
                    />
                  </View>


                </ScrollView>
              </View>
            </View>
          </Modal>
          : null
      }
    
    </SafeAreaView>
  );
}


export default CatagoryModal;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },  

  modalBody: {
    alignItems: 'flex-start',
    flex: 1,
    width: Devicewidth,
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop:40
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: ' rgba(0,0,0,0.8)'
  },
  HeadrIconContainer: {
    width: Devicewidth,
    height: Deviceheight / 12,
    flexDirection: "row",
  },
  FlatlistContainer: {
    width: Devicewidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
})