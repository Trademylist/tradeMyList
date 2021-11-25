import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image,TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import SearchIcon from 'react-native-vector-icons/Fontisto';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const axios = require('axios');



const ModelModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const { onPressClose, SetonPressClose } = props;
  const { navigation } = props
  const [modelList, setModelList]= useState([]);

  useEffect(() => {
    getcarmodel()
  }, [props.selectedMake])


  const getcarmodel = async () => {
    try {
      const data= {
          name: props.selectedMake, 
          type: 'Car'
      }
      await axios.post("https://trademylist.com:8936/app_user/subCategoryList",data)
      .then(response => {
        //console.log('abcdg', response);
        if(response.data.data.length>0) {
          setModelList(response.data.data[0].division)
        }
      })
      .catch(error => {
        console.log('errorA',error)
      })
    }catch(e){
      console.log('errorB',e.response)
    }
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

                  <View style={styles.HeadrIconContainer}>

                    <TouchableOpacity onPress={() => props.onPressClose()} style={{
                      height: Deviceheight / 50,
                      width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, marginBottom: 5,
                    }}>
                      <Image source={require("../../Assets/BackIconLeft.png")} style={{ height: "100%", width: "100%" }}></Image>
                    </TouchableOpacity>
                    <Text style={{ fontFamily:"Roboto-Bold" , color: '#434343', fontSize: 20, fontWeight: 'bold', textAlign: 'left', alignSelf: 'flex-start', width: Devicewidth / 1.9, marginTop: 19, marginLeft: 20, }}>Model</Text>
                  </View>
                  <View style={{ flexDirection: "row", padding:2, alignItems: "center", alignSelf: "center", backgroundColor: "#ffffff", borderRadius: 5, paddingLeft: 10, elevation: 5, marginTop: 5,marginBottom:10 ,}}>
                    <TouchableOpacity style={styles.SearchIcon} >
                    <SearchIcon name='search' size={15}  />
                    </TouchableOpacity>
                    <TextInput
                      placeholderTextColor={"grey"}
                      style={styles.SearchContainer}
                      autoFocus={false}
                      placeholder={'Search'}
                      keyboardType={"default"}
                    />
                  </View>
                  {
                    modelList.length > 0?
                    modelList.map((makeitem, makeindex) => {
                      return(
                        <View style={{flexDirection:'row'}} key={makeindex}>
                          <TouchableOpacity onPress={()=>props.getcarmodel(makeitem)}><Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, fontWeight: "bold", color: "#000", textAlign: 'left', alignSelf: "flex-start", marginLeft: 28, marginTop: 15}}>{makeitem}</Text></TouchableOpacity>
                          {
                            makeitem === props.selectedModel ?
                            <Icon name='check' size={20}  style={{position:'absolute',right:20,top:20,}} />
                            :
                            null
                          }
                        
                        </View>
                      )
                    })
                    :
                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, fontWeight: "bold", color: "#000", textAlign: 'left', alignSelf: "flex-start", marginLeft: 28, marginTop: 25 }}>Nothing In List</Text>
                  }

                </ScrollView>
              </View>
            </View>
          </Modal>
          : null
      }
    </View>
  );
}


export default ModelModal;


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
    backgroundColor: ' rgba(0,0,0,0.8)'
  },
  HeadrIconContainer: {
    width: Devicewidth,
    height: Deviceheight / 12,
    // justifyContent: "space-between",
    flexDirection: "row",
  },
  SearchContainer: {
    borderRadius: 5,
    height: Deviceheight / 21,
    width: Devicewidth / 1.3,
    alignSelf: 'center',
    justifyContent: "flex-end",
    fontSize: 13,
  },
  SearchIcon: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: Deviceheight / 28,
    width: Devicewidth / 14,
    marginRight: 15
  },
})