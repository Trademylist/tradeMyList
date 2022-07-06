import React, { useState, useEffect, Component } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
// import { getStateFromPath } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Geocoder from 'react-native-geocoding';
// import Geolocation from '@react-native-community/geolocation';
import CustomMarker from '../MultiSlider/index'
import CatagoryModal from '../Catagorymodal';
import CarMakeModal from "../../Component/CarMakeModal"
import CarModelModal from "../../Component/CarModelModal"
import CarTrimModal from "../../Component/CarTrimModal"


import MapModal from '../MapModal'
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const axios = require('axios');
import {connect} from 'react-redux';
import { RESET_SLIDER_DISTANCE, STORE_SLIDER_DISTANCE } from '../../store/actions';

Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");
const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';

class FilterCOntainer  extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //filetr values
            filterValue: '',
            selectedCategory: '',
            selectedCategoryImage: ''
        }
    }
    state = this.state;

    async componentDidMount() {
        //for filtering views
        this.state.filterValue = await JSON.parse(await AsyncStorage.getItem('setFilter'));
        this.state.selectedCategory = await JSON.parse(await AsyncStorage.getItem('selectedCategory'));
        this.state.selectedCategoryImage = await JSON.parse(await AsyncStorage.getItem('selectedCategorymage'));
    }
  
    render() {

        return (
            <View>
              <CarMakeModal 
                  modalProps={carMakeStatus}
                  onPressClose={() => closeCarMakeModal()}
                  selectedMake={carMake}
                  makeCategory={selectedProdCategory}
                  getcarmake={selectcarMake}
                  navigation={props.navigation}
              >
              </CarMakeModal>
              <CarModelModal
                  modalProps={carModelStatus}
                  onPressClose={() => closeCarModelModal()}
                  selectedMake={carMake}
                  makeCategory={selectedProdCategory}
                  selectedModel={carModel}
                  getcarmodel={selectcarModal}
                  navigation={props.navigation}
              >
              </CarModelModal>
              <CarTrimModal
                  modalProps={carTrimStatus}
                  onPressClose={() => closeCarTrimModal()}
                  selectedModal={carModel}
                  makeCategory={selectedProdCategory}
                  selectedTrim={carTrim}
                  getcartrim={selectcarTrim}
                  navigation={props.navigation}
              >
              </CarTrimModal>
              <CatagoryModal
                modalProps={catagoryModalVisibal}
                onPressClose={() => closeCatagoryModal()}
                categoryList={categoryList}
                categoryImg={categoryImgLink}
                selectedProdCat={selectedProdCategory}
                getCategory={selectedCat}
                navigation={props.navigation}
              ></CatagoryModal>
              <MapModal
                modalProps={mapVisible}
                onPressClose={() => closeModal()}
                updateLocation={getUpdatelocProd}
              ></MapModal>      
                <View style={styles.FlatlistContainer}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>                  
                        <TouchableOpacity onPress={() => OpenCatagoryModal()}> 
                        <Text style={{ fontWeight: 'bold' }}>Category</Text>                                                       
                        <Image source={{ uri: this.state.selectedCategoryImage }} style={{ height: "60%", width: "60%", resizeMode: "contain", borderRadius: 360 }}></Image> 
                                                
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        );

    }
    
}

const styles = StyleSheet.create({
  TransmissionContainerProperty: {
    width: Devicewidth / 1.3,
    height: Deviceheight / 14,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 15,
    marginTop: 10,
},
FlatlistContainer: {
    // borderWidth: 1,
    padding: 5,
    height: Deviceheight/8,
    width: Devicewidth,
    justifyContent: 'center',
},
  TransmissionsmallContainer: {
    width: Devicewidth / 3,
    height: Deviceheight / 15,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 15,
    marginTop: 10,
},
  SinglesmallTransmission: {
    width: Devicewidth / 9,
    height: Deviceheight / 17,
    backgroundColor: '#f5f5f5',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    margin: 5
},
  TransmissionsmallContainerBedroom: {
    width: Devicewidth / 1.8,
    height: Deviceheight / 14,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 15,
    marginTop: 10,
},
TransmissionsmallContainerBathroom: {
    width: Devicewidth / 1.4,
    height: Deviceheight / 14,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 15,
    marginTop: 10,
},
  transmission: {
    height: Deviceheight / 34,
    width: Devicewidth / 17,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 5
},
  SingleTransmission: {
    width: Devicewidth / 3.7,
    height: Deviceheight / 13,
    backgroundColor: '#f5f5f5',
    alignSelf: 'center',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    margin: 5

},
TransmissionContainer: {
  width: Devicewidth,
  height: Deviceheight / 14,
  backgroundColor: '#fff',
  alignSelf: 'flex-start',
  borderRadius: 10,
  marginLeft: 20,
  alignItems: 'center',
  justifyContent: 'space-evenly',
  flexDirection: 'row',
  paddingRight: 15,
  marginTop: 10,
},
  SellerContainer: {
    width: Devicewidth,
    height: Deviceheight / 24,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingRight: 15,
    marginTop: 5
},
SingleSeller: {
  width: Devicewidth / 5,
  height: Deviceheight / 24,
  backgroundColor: '#f5f5f5',
  alignSelf: 'center',
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'space-between',
},
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
    paddingTop: 20,
    paddingLeft: 15,
    alignSelf: 'center',
    alignItems: 'flex-start',
    width: Devicewidth,
    height: Deviceheight / 14,
    backgroundColor: '#f5f5f5',
    justifyContent: "flex-start",
    elevation: 1,
    flexDirection: "row",
    justifyContent: 'space-around'
  },
  DescContainer: {
    width: Devicewidth / 1.1,
    height: Deviceheight / 18,
    backgroundColor: '#f5f5f5',
    alignSelf: 'center',
    borderRadius: 5,
    paddingLeft: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 15,
    marginTop: 20
  },
  DescContainer1: {
    width: Devicewidth / 1.1,
    // height: Deviceheight / 13,
    backgroundColor: '#f5f5f5',
    alignSelf: 'center',
    borderRadius: 5,
    paddingLeft: 15,
    alignItems: 'flex-start',
    paddingRight: 15,
    marginTop: 20,
    paddingTop: 5,
    paddingBottom: 2
  },
  desc1: {
    // height:Deviceheight/18,
    width: Devicewidth / 1.22,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    // backgroundColor:"green"
  },
  SingleSliderMainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: Devicewidth / 1.7,
  },
  DescContainer2: {
    width: Devicewidth / 1.1,
    // height: Deviceheight / 16,
    backgroundColor: '#f5f5f5',
    alignSelf: 'center',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 15,
    marginTop: 20
  },

  btnContainer: {
    alignSelf: "center",
    width: Devicewidth / 1.05,
    height: Deviceheight / 16,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#ff6700",
    borderRadius: 20,
    marginTop: 20
  },
  btnText: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  Input: {
    marginLeft: 15,
    width: Devicewidth / 1.2,
    // height: Deviceheight / 18,
    fontSize: 15,
    marginLeft: 10,
    // paddingLeft: 10,
    paddingTop: 12,
    fontFamily: 'Raleway; Medium',
    alignSelf: 'flex-end',
    fontWeight: "bold", 
    textAlign: "left",
    color: 'black'
  },
  InputSelect: {
    width: Devicewidth / 1.2,
    fontFamily: 'Raleway; Medium',
    alignSelf: 'flex-end',
    fontSize: 15, 
    fontWeight: "bold", 
    textAlign: "left",
    color: 'black',
    // paddingLeft: 10,
    paddingTop: 12,
},
  active: {
    backgroundColor: '#bdbdbd',
  },
  sortDesign: {
    backgroundColor: "#f5f5f5",
    alignSelf: "flex-start",
    alignItems: "center",
    height: Deviceheight / 26,
    borderRadius: 50,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 20,
    marginBottom: 5
  }
})

const mapDispatchToProps = dispatch => {
  return {
      onSliderUpdate: (val) => dispatch({type: STORE_SLIDER_DISTANCE, payload: val}),
      onSliderReset: () => dispatch({type: RESET_SLIDER_DISTANCE})
  }
}

const mapStateToProps = state => {
  return {
    savedLocation: state.savedLocation,
    sliderDistance: state.sliderDistance
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterCOntainer);