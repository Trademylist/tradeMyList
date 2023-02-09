import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, TextInput, Platform } from 'react-native';
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
//const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';
// const API_KEY = 'AIzaSyCZ9kuVUyhZxeFR3cPnebauMlffVOhoM1Y'
const API_KEY = 'AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4'
// const API_KEY = 'AIzaSyCMDLepAKckVIr8TWkM5Mq5SawWH0B6Bfw'
const FilterModal = (props) => {
  const [modal, modalVisible] = useState(false);
  const { modalProps, SetmodalProps } = props;
  const { onPressClose, SetonPressClose } = props;
  const [sliderOneChanging, SetsliderOneChanging] = useState(false)
  // const [sliderOneValue, SetsliderOneValue] = useState([0])
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
  // const [distance, setDistance] = useState('')
  const [Country, setCountry] = useState('')
  const [currency, setcurrency] = useState('')
  const [selectedCatImg, setSelectedCatImg] = useState('')
  const [carMake, setCarMake] = useState('')
  const [carModel, setCarModel] = useState('')
  const [carTrim, setCarTrim] = useState('')
  const [transMission, setTransMission] = useState('')
  const [carMileage, setCarMileage] = useState(200000);
  const [carYearLow, setCarYearLow] = useState(0);
  const [carYearHigh, setCarYearHigh] = useState(2021);
  const [sellerType, setSellerType] = useState('')
  const [carMakeStatus, setCarMakeStatus] = useState(false)
  const [carModelStatus, setCarModelStatus] = useState(false)
  const [carTrimStatus, setCarTrimStatus] = useState(false)
  const [TypeOfhousingListing, setTypeOfhousingListing] = useState('')
  const [TypeofhousingProperty, setTypeofhousingProperty] = useState('')
  const [noofBedrooms, setNoofBedrooms] = useState('')
  const [noofBathRooms, setNoofBathRooms] = useState('')


  const { navigation } = props


  useEffect(() => {
    getcategory()
    fetchLocation();
  }, [])

  useEffect(() => {
    fetchLocation();
  }, [props.savedLocation.latitude || props.savedLocation.longitude])

  useEffect(() => {
    Setslider1value(props.sliderDistance);
  }, [props.sliderDistance])


  const handelReset = () => {
    setSelectedCatImg('')
    setSelectedProdCategory('')
    Setslider1value(500)
    // setCountry('')
    setFromInr('')
    setToInr('')
    setSortBy('')
    props.onSliderReset();
    // setDistance('')
    AsyncStorage.setItem("setFilter", JSON.stringify("no"));
  }

  const getFilter = () => {
    props.onSliderUpdate(slider1value);


    //for filter
    AsyncStorage.setItem("setFilter", JSON.stringify("yes"));
    AsyncStorage.setItem("selectedCategory", JSON.stringify(selectedProdCategory));



    AsyncStorage.setItem('MapSliderValue', JSON.stringify(slider1value))
    if(selectedProdCategory === 'Car') {
      let obj = {
          "make": carMake,
          "model": carModel,
          "trim": carTrim,
          "range": carMileage,
          "seller": sellerType,
          "transmission": transMission,
          "year": {'lower': carYearLow, 'upper': carYearHigh},
          "unit": (Country == 'United States') ? ' miles' : ' km'
      }
      props.filerdata(slider1value, sortBy, lat, lng, selectedProdCategory, fromInr, toInr, Country, obj)
    } else if(selectedProdCategory === 'Housing') {
      let obj = {
          "typeList": TypeOfhousingListing,
          "propertyType": TypeofhousingProperty,
          "bedRoomNo": noofBedrooms,
          "bathRoomNo": noofBathRooms,
          "unit": (Country == 'United States') ? ' miles' : ' km'
      }
      props.filerdata(slider1value, sortBy, lat, lng, selectedProdCategory, fromInr, toInr, Country, obj)
    } else {
      props.filerdata(slider1value, sortBy, lat, lng, selectedProdCategory, fromInr, toInr, Country, null)
    }
  }

  const getUpdatelocProd = async () => {
    setMapVisible(false);
  }

  const fetchLocation = async () => {
    const {latitude, longitude, country, address} = props.savedLocation;
    setLocationNow(address)
    setLat(latitude)
    setLng(longitude)
    setCountry(country);
    getCurrency(country);
    Setslider1value(props.sliderDistance)
  }

  const getCurrency = async (country) => {
    const object =
    {
      country: country
    }
    axios.post("https://trademylist.com:8936/app_user/currency", object)
      .then(response => {
        if (response.data.success) {
          setcurrency(response.data.code)
        }
      })
  }
  const getcategory = async () => {
    let process = props.process == "general" ? "product" : (props.process == "product") ? "product" : "freebies";
    axios.get(`https://trademylist.com:8936/app_user/category_list/${process}`)
      .then(response => {
        //console.log('rrrr', response);
        setCategoryList(response.data.data.category)
        setCategoryImgLink(response.data.data.categoryImageUrl)
      })
      .catch(error => {
        console.log('errorA',error.data)
      })
  }

  const sliderOneValuesChangeStart = () => {
    SetsliderOneChanging(true)
  };

  const sliderOneValuesChange = values => {
    Setslider1value(values[0])
  };

  const sliderOneValuesChangeFinish = () => {
    SetsliderOneChanging(false)
  };
  const selectedCat = async (catName, imglink, image) => {
    setCatagoryModalVisibal(false)
    setSelectedProdCategory(catName)
    setSelectedCatImg(imglink + image)

    //for showing in filter view in list page
    AsyncStorage.setItem("selectedCategory", JSON.stringify(catName));
    AsyncStorage.setItem("selectedCategorymage", JSON.stringify(imglink + image));
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

  const OpenCarMakeModal = () => {
    setCarMakeStatus(true);
  }

  const OpenCarModelModal = () => {
    if (carMake !== '') {
        setCarModelStatus(true)
    }
  }

  const OpenCarTrimModal = () => {
    if (carModel !== '') {
       setCarTrimStatus(true);
    }
  }

  const closeCarMakeModal = () => {
       setCarMakeStatus(false);
  }

  const closeCarModelModal = () => {
    setCarModelStatus(false);
  }

  const selectcarMake = async (makedata) => {
    setCarMakeStatus(false);
    setCarModel('');
    setCarTrim('');
    setCarMake(makedata);
  }

  const selectcarModal = async (modelData) => {
    setCarModelStatus(false);
    setCarTrim('');
    setCarModel(modelData);
  }

  const closeCarTrimModal = () => {
    setCarTrimStatus(false);
  }

  const selectcarTrim = async (trimData) => {
    setCarTrimStatus(false);
    setCarTrim(trimData);
  }

  const onSetCarYear = (val) => {
    setCarYearHigh(val[1]);
    setCarYearLow(val[0]);
  }

    return (
   
    <View>
      
    
      
      {
        modalProps ?
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalProps}
            onRequestClose={() => {
              modalVisible(!modal)
            }}>
              
              
              <MapModal
        modalProps={mapVisible}
        onPressClose={() => closeModal()}
        updateLocation={getUpdatelocProd}
      ></MapModal>
            <View style={styles.modalContainer}>
              <View style={styles.modalBody}>
              <CatagoryModal
        modalProps={catagoryModalVisibal}
        onPressClose={() => closeCatagoryModal()}
        categoryList={categoryList}
        categoryImg={categoryImgLink}
        selectedProdCat={selectedProdCategory}
        getCategory={selectedCat}
        navigation={props.navigation}
      ></CatagoryModal>
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
                      <Text style={{ fontFamily:"Roboto-Regular" , fontSize: 14, color: '#000', }}>{locationNow}</Text>
                      {/* <Icon name="angle-right" size={30} color="#7f818e" /> */}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ fontFamily:"Roboto-Regular" , fontSize: 16, paddingLeft: 22, marginTop: 15 }}>Distance</Text>
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

                  {/* ==========================Sub Category Code for Car Added Below===================  */}
                  {
                    selectedProdCategory === 'Car' &&
                      <>
                        <TouchableOpacity onPress={() => OpenCarMakeModal()} style={styles.DescContainer}>
                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 5, marginBottom: 5 }}>{carMake === '' ? 'Make' : carMake}</Text>
                            <Icon name="angle-right" size={30} color="#7f818e" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => OpenCarModelModal()}
                            style={styles.DescContainer}>
                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 5, marginBottom: 5 }}>{carModel === '' ? 'Model' : carModel}</Text>
                            <Icon name="angle-right" size={30} color="#7f818e" />
                        </TouchableOpacity>

                        {/*<TouchableOpacity
                            onPress={() => OpenCarTrimModal()}
                            style={styles.DescContainer}>
                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 5, marginBottom: 5 }}>{carTrim === '' ? 'Trim' : carTrim}</Text>
                            <Icon name="angle-right" size={30} color="#7f818e" />
                        </TouchableOpacity>*/}

                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Seller</Text>
                        <View style={styles.SellerContainer}>
                            <TouchableOpacity style={[styles.SingleSeller, sellerType === 'Individual' ? styles.active : '']}
                            onPress={() =>  setSellerType('Individual')}>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: sellerType === "Individual" ? '#fff' : '#000', textAlign: 'center', marginTop: 6 }}>Individual</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.SingleSeller, sellerType === 'Dealer' ? styles.active : '']} onPress={() => setSellerType('Dealer')}>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: sellerType === "Dealer" ? '#fff' : '#000', textAlign: "center", marginTop: 6 }}>Dealer</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Year</Text>
                        <View style={{
                          alignSelf: 'center',
                          borderColor: '#000',
                          width: Devicewidth/1.05,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginRight: 20
                        }}>
                          <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 5, marginBottom: 5, paddingLeft: 20 }}>{carYearLow}</Text>
                          <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 5, marginBottom: 5, paddingLeft: 20 }}>{carYearHigh}</Text>
                        </View>

                        {/* {/ implement slider here /} */}
                        <View style={styles.SingleSliderMainContainer}>
                            <MultiSlider
                                values={[carYearLow, carYearHigh]}
                                sliderLength={Devicewidth / 1.18}
                                onValuesChange={(val) => onSetCarYear(val)}
                                customMarker={CustomMarker}
                                min={1990}
                                max={2022}
                                step={1}
                                selectedStyle={{ backgroundColor: "#232427" }}
                                snapped
                            />
                        </View>

                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Mileage</Text>
                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 5, marginBottom: 5, paddingLeft: 20 }}>{carMileage}{Country == 'United States' ? ' miles' : ' km'}</Text>

                        {/* {/ implement slider here /} */}
                        <View style={styles.SingleSliderMainContainer}>
                            <MultiSlider
                                values={[carMileage]}
                                sliderLength={Devicewidth / 1.18}
                                onValuesChange={(val) => setCarMileage(val)}
                                customMarker={CustomMarker}
                                min={0}
                                max={200000}
                                step={1}
                                selectedStyle={{ backgroundColor: "#232427" }}
                                snapped
                            />
                        </View>

                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Transmission</Text>
                        <View style={styles.TransmissionContainer}>
                            <TouchableOpacity style={[styles.SingleTransmission, transMission === 'Manual' ? styles.active : '']}
                            onPress={() => setTransMission('Manual')}>
                                <TouchableOpacity style={styles.transmission} >
                                    <Image source={require("../../Assets/Manual.png")} style={{ height: "80%", width: "80%" }}></Image>
                                </TouchableOpacity>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: transMission === 'Manual' ? '#fff' : '#000', textAlign: 'center', }}>Manual</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.SingleTransmission, transMission === 'Automatic' ? styles.active : '']}
                            onPress={() => setTransMission('Automatic')}>
                                <TouchableOpacity style={styles.transmission}  >
                                    <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                                </TouchableOpacity>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: transMission === 'Automatic' ? '#fff' : '#000', textAlign: "center", }}>Automatic</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                  }
                  {
                    selectedProdCategory == 'Housing' &&
                    <>
                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Type Of Listing</Text>
                      <View style={styles.TransmissionContainer}>
                          <TouchableOpacity style={[styles.SingleTransmission, TypeOfhousingListing === 'rent' ? styles.active : '']}
                          onPress={() => setTypeOfhousingListing('rent')}>
                              <TouchableOpacity style={{
                                  height: Deviceheight / 34,
                                  width: Devicewidth / 17, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                              }} onPress={() => setTypeOfhousingListing('rent')}>
                                  <Image source={require("../../Assets/Manual.png")} style={{ height: "80%", width: "80%" }}></Image>
                              </TouchableOpacity>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: TypeOfhousingListing === 'rent' ? '#fff' : '#000', textAlign: 'center', }}>For Rent</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.SingleTransmission, TypeOfhousingListing === 'sell' ? styles.active : '']}
                          onPress={() => setTypeOfhousingListing('sell')}>
                              <TouchableOpacity style={{
                                  height: Deviceheight / 36,
                                  width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                              }} onPress={() => setTypeOfhousingListing('sell')}>
                                  <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                              </TouchableOpacity>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: TypeOfhousingListing === 'sell' ? '#fff' : '#000', textAlign: "center", }}>For Sell</Text>
                          </TouchableOpacity>
                      </View>

                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Type Of Property</Text>
                      <View style={styles.TransmissionContainerProperty}>
                          <TouchableOpacity style={[styles.SingleTransmission, TypeofhousingProperty === 'Appartment' ? styles.active : '']}
                          onPress={() => setTypeofhousingProperty('Appartment')}>
                              <View style={{
                                  height: Deviceheight / 34,
                                  width: Devicewidth / 17, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                              }}>
                                  <Image source={require("../../Assets/Manual.png")} style={{ height: "80%", width: "80%" }}></Image>
                              </View>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: TypeofhousingProperty === 'Appartment' ? '#fff' : '#000', textAlign: 'center', }}>Appartment</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.SingleTransmission, TypeofhousingProperty === 'Room' ? styles.active : '']}
                          onPress={() => setTypeofhousingProperty('Room')}>
                              <TouchableOpacity style={{
                                  height: Deviceheight / 36,
                                  width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                              }} onPress={() => setTypeofhousingProperty('Room')}>
                                  <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                              </TouchableOpacity>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: TypeofhousingProperty === 'Room' ? '#fff' : '#000', textAlign: "center", }}>Room</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={[styles.SingleTransmission, TypeofhousingProperty === 'House' ? styles.active : '']}
                          onPress={() => setTypeofhousingProperty('House')}>
                              <TouchableOpacity style={{
                                  height: Deviceheight / 36,
                                  width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                              }} onPress={() => setTypeofhousingProperty('House')}>
                                  <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                              </TouchableOpacity>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: TypeofhousingProperty === 'House' ? '#fff' : '#000', textAlign: "center", }}>House</Text>
                          </TouchableOpacity>

                      </View>
                      <View style={styles.TransmissionContainer}>
                          <TouchableOpacity style={[styles.SingleTransmission, TypeofhousingProperty === 'Commercial' ? styles.active : '']}
                          onPress={() => setTypeofhousingProperty('Commercial')}>
                              <TouchableOpacity style={{
                                  height: Deviceheight / 36,
                                  width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                              }} onPress={() => setTypeofhousingProperty('Commercial')}>
                                  <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                              </TouchableOpacity>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: TypeofhousingProperty === 'Commercial' ? '#fff' : '#000', textAlign: "center", }}>Commercial</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={[styles.SingleTransmission, TypeofhousingProperty === 'Other' ? styles.active : '']}
                          onPress={() => setTypeofhousingProperty('Other')}>
                              <TouchableOpacity style={{
                                  height: Deviceheight / 36,
                                  width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                              }} onPress={() => setTypeofhousingProperty('Other')}>
                                  <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                              </TouchableOpacity>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: TypeofhousingProperty === 'Other' ? '#fff' : '#000', textAlign: "center", }}>Other</Text>
                          </TouchableOpacity>
                      </View>

                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>No Of Bedrooms</Text>
                      <View style={styles.TransmissionsmallContainerBedroom}>
                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBedrooms === 1 ? styles.active : '']}
                          onPress={() => setNoofBedrooms(1)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBedrooms === 1 ? '#fff' : '#000', textAlign: "center", }}>1</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBedrooms === 2 ? styles.active : '']} onPress={() => setNoofBedrooms(2)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBedrooms === 2 ? '#fff' : '#000', textAlign: "center", }}>2</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBedrooms === 3 ? styles.active : '']} onPress={() => setNoofBedrooms(3)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBedrooms === 3 ? '#fff' : '#000', textAlign: "center", }}>3</Text>
                          </TouchableOpacity>


                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBedrooms === 4 ? styles.active : '']} onPress={() => setNoofBedrooms(4)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBedrooms === 4 ? '#fff' : '#000', textAlign: "center", }}>4</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBedrooms === 5 ? styles.active : '']} onPress={() => setNoofBedrooms(5)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBedrooms === 5 ? '#fff' : '#000', textAlign: "center", }}>5</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBedrooms === 6 ? styles.active : '']} onPress={() => setNoofBedrooms(6)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBedrooms === 6 ? '#fff' : '#000', textAlign: "center", }}>6</Text>
                          </TouchableOpacity>
                      </View>

                      <View style={styles.TransmissionsmallContainerBedroom2}>
                        <TouchableOpacity style={[styles.SinglesmallTransmission, noofBedrooms === 7 ? styles.active : '']} onPress={() => setNoofBedrooms(7)}>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBedrooms === 7 ? '#fff' : '#000', textAlign: "center", }}>7</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.SinglesmallTransmission, noofBedrooms === 8 ? styles.active : '']} onPress={() => setNoofBedrooms(8)}>
                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBedrooms === 8 ? '#fff' : '#000', textAlign: "center", }}>8</Text>
                        </TouchableOpacity>
                      </View>





                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>No Of Bathrooms</Text>
                      <View style={styles.TransmissionsmallContainerBathroom}>

                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBathRooms === 1 ? styles.active : '']} onPress={() => setNoofBathRooms(1)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBathRooms === 1 ? '#fff' : '#000', textAlign: "center", }}>1</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBathRooms === 1.5 ? styles.active : '']} onPress={() => setNoofBathRooms(1.5)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBathRooms === 1.5 ? '#fff' : '#000', textAlign: "center", }}>1.5</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBathRooms === 2 ? styles.active : '']} onPress={() => setNoofBathRooms(2)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBathRooms === 2 ? '#fff' : '#000', textAlign: "center", }}>2</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBathRooms === 2.5 ? styles.active : '']} onPress={() => setNoofBathRooms(2.5)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBathRooms === 2.5 ? '#fff' : '#000', textAlign: "center", }}>2.5</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBathRooms === 3 ? styles.active : '']} onPress={() => setNoofBathRooms(3)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBathRooms === 3 ? '#fff' : '#000', textAlign: "center", }}>3</Text>
                          </TouchableOpacity>

                      </View>
                      <View style={styles.TransmissionsmallContainer}>
                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBathRooms === 3.5 ? styles.active : '']} onPress={() => setNoofBathRooms(3.5)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: sellerType === "Individual" ? '#fff' : '#000', textAlign: "center", }}>3.5</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.SinglesmallTransmission, noofBathRooms === 4 ? styles.active : '']} onPress={() => setNoofBathRooms(4)}>
                              <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: noofBathRooms === 4 ? '#fff' : '#000', textAlign: "center", }}>4+</Text>
                          </TouchableOpacity>
                      </View>
                    </>
                  }


                  <Text style={{ fontFamily:"Roboto-Regular" , fontSize: 16, paddingLeft: 22, marginTop: 10 }}>Price</Text>

                  <View style={styles.DescContainer2}>
                    {fromInr != '' ?
                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 15, color: "#000", textAlign: "left", alignSelf: "center",marginLeft:5,paddingTop:12,paddingBottom:12,marginRight:3 }}>{currency == "INR" ? "₹ " : currency == "USD" ? "$ " : `${currency} `}</Text>
                      :
                      null
                    }
                    <TextInput
                      placeholder={`From (${currency == "INR" ? "₹ " : currency == "USD" ? "$ " : `${currency}`})`}
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
                      <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 15, color: "#000", textAlign: "left", alignSelf: "center",marginLeft:5,paddingTop:12,paddingBottom:12,marginRight:3 }}>
                        {`${currency == "INR" ? "₹ " : currency == "USD" ? "$ " : `${currency} `}`}</Text>
                      :
                      null
                    }
                    <TextInput
                      placeholder={`To (${currency == "INR" ? "₹ " : currency == "USD" ? "$ " : `${currency} `})`}
                      placeholderTextColor={'black'}
                      style={toInr==''?styles.Input:styles.InputSelect}
                      onChangeText={(val) => setToInr(val)}
                      value={toInr}
                      keyboardType='numeric'
                    >
                    </TextInput>
                  </View>


                  <Text style={{ fontFamily:"Roboto-Regular" , fontSize: 16, paddingLeft: 22, marginTop: 20, }}>Sort by</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", height: Deviceheight / 8, width: Devicewidth / 1.1, alignSelf: "center", marginTop: 10, alignItems: "flex-start" }}>
                    <TouchableOpacity onPress={() => setSortBy('Distance')} style={[styles.sortDesign, sortBy === 'Distance' ? styles.active : '']} ><Text style={{ fontFamily:"Roboto-Regular" , fontSize: 12 }}>Distance</Text></TouchableOpacity>

                    <TouchableOpacity onPress={() => setSortBy('PriceAsc')} style={[styles.sortDesign, sortBy === 'PriceAsc' ? styles.active : '']}><Text style={{ fontFamily:"Roboto-Regular" , fontSize: 12 }}>Price: low to high</Text></TouchableOpacity>

                    <TouchableOpacity onPress={() => setSortBy('PriceDesc')} style={[styles.sortDesign, sortBy === 'PriceDesc' ? styles.active : '']}><Text style={{ fontFamily:"Roboto-Regular" , fontSize: 12 }}>Price: high to low</Text></TouchableOpacity>

                    <TouchableOpacity onPress={() => setSortBy('PublishRecent')} style={[styles.sortDesign, sortBy === 'PublishRecent' ? styles.active : '']}><Text style={{ fontFamily:"Roboto-Regular" , fontSize: 12 }}>Most recent</Text></TouchableOpacity>
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
TransmissionsmallContainerBedroom2: {
  width: Devicewidth / 3,
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
  marginTop: 20,
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
    paddingTop: Platform.OS == 'ios' ? 35 : 0,
    // backgroundColor: ' rgba(0,0,0,0.8)'
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
    height: Deviceheight / 20,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#ff6700",
    borderRadius: 30,
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
    paddingBottom: 12,
    alignSelf: 'flex-end',
    fontWeight: "bold",
    textAlign: "left",
    color: 'black'
  },
  InputSelect: {
    width: Devicewidth / 1.2,
    alignSelf: 'flex-end',
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "left",
    color: 'black',
    // paddingLeft: 10,
    paddingTop: 12,
    paddingBottom: 12,
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

export default connect(mapStateToProps, mapDispatchToProps)(FilterModal);
