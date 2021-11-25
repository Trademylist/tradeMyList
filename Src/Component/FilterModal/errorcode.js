import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { getStateFromPath } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import CustomMarker from '../MultiSlider/index'
import CatagoryModal from '../Catagorymodal';
import MapModal from '../MapModal'
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const axios = require('axios');
Geocoder.init("AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4");


const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';
const FilterModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const { onPressClose, SetonPressClose } = props;
  const [sliderOneChanging, SetsliderOneChanging] = useState(false)
  const [sliderOneValue, SetsliderOneValue] = useState([0])
  const [slider1value, Setslider1value] = useState(500)
  const [catagoryModalVisibal, setCatagoryModalVisibal] = useState(false)
  const [selectedProdCategory, setSelectedProdCategory] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [categoryImgLink, setCategoryImgLink] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [locationNow, setLocationNow] = useState('')
  const [mapVisible, setMapVisible] = useState(false)
  const [fromInr, setFromInr] = useState('')
  const [toInr, setToInr] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [distance, setDistance] = useState('')
  const [Country, setCountry] = useState('')
  const [currency, setcurrency] = useState('')
  const [selectedCatImg, setSelectedCatImg] = useState('')

  const { navigation } = props


  useEffect(() => {
    getcategory();
    setLocationNow(props.locationNow)
    setLat(props.latitude)
    setLng(props.longitude)
    setCountry(props.country)
    getCurrency(props.country)
  }, [])

  useEffect(() => {
    setLocationNow(props.locationNow)
    setLat(props.latitude)
    setLng(props.longitude)
    setCountry(props.country)
    getCurrency(props.country)
  }, [props.locationNow])

  const handelReset = () => {
    setSelectedCatImg('')
    setSelectedProdCategory('')
    Setslider1value('500')
    setCountry('')
    setFromInr('')
    setToInr('')
    setSortBy('')
    setDistance('')
  }

  const getFilter = () => {
    props.filerdata(distance, sortBy, lat, lng, selectedProdCategory, fromInr, toInr)
  }

  const locationFinder = async () => {
    const UserLocation = await JSON.parse(await AsyncStorage.getItem('UserLocation'))
    if (UserLocation !== null) {
      const latitude = UserLocation.latitude
      const longitude = UserLocation.longitude
      getcountryLocation(latitude, longitude)
    }
    else {
      Geolocation.getCurrentPosition(
        info => {
          const { coords } = info
          const latitude = coords.latitude
          const longitude = coords.longitude
          getcountryLocation(latitude, longitude)
        },
        error => console.log('errorA',error),
        {
          enableHighAccuracy: false,
          timeout: 2000,
          maximumAge: 3600000
        }
      )
    }
  }

  const getUpdatelocProd = async (lat, lng) => {
    getcountryLocation(lat, lng)
    setMapVisible(false)
  }

  const getcountryLocation = async (latitude, longitude) => {
    axios
      .request({
        method: 'post',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
      })
      .then(response => {
        const totallength = response.data.results.length;
        const getcontrylist = totallength - 2
        var country = response.data.results[getcontrylist].formatted_address;
        var location = response.data.results[0].address_components[1].long_name;
        setLocationNow(location)
        setLat(latitude)
        setLng(longitude)
        setCountry(country)
        getCurrency(country)
        // this.setState({
        //     locationNow:location
        // })
        // this.getlocationProduct(latitude, longitude,country)
      })
      .catch(err => {
        //console.log(err.data)
      })
  }
  const getCurrency = async (country) => {
    //console.log("contry berfore ", country)
    const object =
    {
      country: country
    }
    await axios.post("https://trademylist.com:8936/app_user/currency", object)
      .then(response => {
        if (response.data.success) {
          setcurrency(response.data.code)
        }
      })
  }
  const getcategory = async () => {
    await axios.get("https://trademylist.com:8936/app_user/category_list/" + props.process)
      .then(response => {
        setCategoryList(response.data.data.category)
        setCategoryImgLink(response.data.data.categoryImageUrl)
      })
      .catch(error => {
        //console.log(error.data)
      })
  }

  const sliderOneValuesChangeStart = () => {
    SetsliderOneChanging(true)
  };

  const sliderOneValuesChange = values => {
    //console.log("hellotune:", values)
    let newValues = [0];
    newValues[0] = values[0];
    SetsliderOneValue(newValues)
    const slider1value = sliderOneValue
    Setslider1value(slider1value)
    setDistance(slider1value)
  };

  const sliderOneValuesChangeFinish = () => {
    SetsliderOneChanging(false)
  };
  const selectedCat = async (catName, imglink, image) => {
    setCatagoryModalVisibal(false)
    setSelectedProdCategory(catName)
    setSelectedCatImg(imglink + image)
  }

  const OpenCatagoryModal = () => {
    setCatagoryModalVisibal(true)
  }

  const closeCatagoryModal = () => {
    setCatagoryModalVisibal(false)
  }

  const closeModal = async () => {
    setMapVisible(false)
  }

  const handelMap = async () => {
    setMapVisible(true)
  }

  return (
    <View>
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
        navigation={props.navigation}
      ></MapModal>
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
                  <View style={styles.HeadrIconContainer}
                  >
                    <TouchableOpacity onPress={() => props.onPressClose()}>
                      <Image source={require("../../Assets/BackIconLeft.png")} style={{ height: 15, width: 15, alignSelf: "center", marginTop: 3, marginRight: 20 }}></Image>
                    </TouchableOpacity>
                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: "#000", fontWeight: "bold", width: Devicewidth / 2, marginRight: 10, textAlign: "center", alignSelf: "flex-start", paddingRight: 10 }}>Filters</Text>
                    <TouchableOpacity onPress={() => handelReset()}>
                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: "#000", fontWeight: "bold" }}>Reset</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.DescContainer} onPress={() => OpenCatagoryModal()}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: "center", height: Deviceheight / 16, width: Devicewidth / 12, borderRadius: 360, marginRight: 15 }}>
                        {
                          selectedCatImg !== '' ?
                            <Image source={{ uri: selectedCatImg }} style={{ height: "100%", width: "100%", resizeMode: "contain", borderRadius: 360 }}></Image>
                            :
                            <Image source={require("../../Assets/all-category.png")} style={{ height: "100%", width: "100%", resizeMode: "contain", borderRadius: 360 }}></Image>
                        }
                      </View>
                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 20, color: '#000', marginTop: 5, marginBottom: 5, fontWeight: "bold" }}>{selectedProdCategory === '' ? 'All categories' : selectedProdCategory}</Text>
                    </View>
                    <Icon name="angle-right" size={30} color="#7f818e" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.DescContainer1} onPress={() => handelMap()}>
                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', fontWeight: "bold" }}>Location</Text>
                    <View style={styles.desc1}>
                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: '#000', }}>{locationNow}</Text>
                      <Icon name="angle-right" size={30} color="#7f818e" />
                    </View>
                  </TouchableOpacity>
                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, paddingLeft: 22, marginTop: 15 }}>Distance</Text>
                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, paddingLeft: 22, marginTop: 5, fontWeight: "bold" }}>{slider1value} {Country === 'United States' ? ' miles' : ' km'}</Text>
                  <View style={styles.SingleSliderMainContainer}>
                    <MultiSlider
                      values={[slider1value]}
                      sliderLength={Devicewidth / 1.25}
                      onValuesChangeStart={sliderOneValuesChangeStart}
                      onValuesChange={sliderOneValuesChange}
                      onValuesChangeFinish={sliderOneValuesChangeFinish}
                      customMarker={CustomMarker}
                      min={0}
                      max={500}
                      step={1}
                      selectedStyle={{ backgroundColor: "#232427" }}
                      snapped
                    />
                  </View>
                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, paddingLeft: 22, marginTop: 10 }}>Price</Text>

                  <View style={styles.DescContainer2}>
                    {fromInr != '' ?
                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 15, color: "#000", textAlign: "left", alignSelf: "center",marginLeft:5 }}>{currency == "INR" ? "₹" : "$"}</Text>
                      :
                      null
                    }
                    <TextInput
                      placeholder={`From (${currency == "INR" ? "₹" : "$"})`}
                      placeholderTextColor={'black'}
                      style={fromInr==''?styles.Input:styles.InputSelect}
                      onChangeText={(val) => setFromInr(val)}
                      value={fromInr}
                      keyboardType='numeric'
                    >
                    </TextInput>
                  </View>
                  <View style={styles.DescContainer2}>
                    {toInr != '' ?
                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 15, color: "#000", textAlign: "left", alignSelf: "center",marginLeft:5 }}>{currency == "INR" ? "₹" : "$"}</Text>
                      :
                      null
                    }
                    <TextInput
                      placeholder={`To (${currency == "INR" ? "₹" : "$"})`}
                      placeholderTextColor={'black'}
                      style={toInr==''?styles.Input:styles.InputSelect}
                      onChangeText={(val) => setToInr(val)}
                      value={toInr}
                      keyboardType='numeric'
                    >
                    </TextInput>
                  </View>


                  <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, paddingLeft: 22, marginTop: 20, }}>Sort by</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", height: Deviceheight / 8, width: Devicewidth / 1.1, alignSelf: "center", marginTop: 10, alignItems: "flex-start" }}>
                    <TouchableOpacity onPress={() => setSortBy('Distance')} style={[styles.sortDesign, sortBy === 'Distance' ? styles.active : '']} ><Text style={{ fontFamily:"Roboto-Bold" , fontSize: 12 }}>Distance</Text></TouchableOpacity>

                    <TouchableOpacity onPress={() => setSortBy('Price: low to high')} style={[styles.sortDesign, sortBy === 'Price: low to high' ? styles.active : '']}><Text style={{ fontFamily:"Roboto-Bold" , fontSize: 12 }}>Price: low to high</Text></TouchableOpacity>

                    <TouchableOpacity onPress={() => setSortBy('Price: high to low')} style={[styles.sortDesign, sortBy === 'Price: high to low' ? styles.active : '']}><Text style={{ fontFamily:"Roboto-Bold" , fontSize: 12 }}>Price: high to low</Text></TouchableOpacity>

                    <TouchableOpacity onPress={() => setSortBy('Most recent')} style={[styles.sortDesign, sortBy === 'Most recent' ? styles.active : '']}><Text style={{ fontFamily:"Roboto-Bold" , fontSize: 12 }}>Most recent</Text></TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.btnContainer} onPress={getFilter}>
                    <Text style={styles.btnText} >Apply filters</Text>
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


export default FilterModal;


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
    paddingLeft: 20,
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
    paddingLeft: 20,
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
    height: Deviceheight / 18,
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
    paddingLeft: 10,
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
    paddingLeft: 10,
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