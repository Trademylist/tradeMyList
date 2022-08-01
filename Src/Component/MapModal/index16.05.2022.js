import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, TextInput, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomMarker from '../MultiSlider/index'
import MapView, { Marker, Circle, AnimatedRegion } from 'react-native-maps';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {connect} from 'react-redux';
import { STORE_SLIDER_DISTANCE } from '../../store/actions';
import {Platform} from 'react-native';
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const ASPECT_RATIO = Devicewidth / Deviceheight;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const axios = require('axios');
//const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';
const API_KEY = 'AIzaSyCZ9kuVUyhZxeFR3cPnebauMlffVOhoM1Y'

class MapModal extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      sliderOneChanging: false,
      slider1value: 1,
      isShowingResults: false,
      searchResults: [],
      locationNow: '',
      region: {
        latitude: '',
        longitude: '',
        latitudeDelta: 5,
        longitudeDelta: 5
      },
      lat: '',
      lng: '',
      country: "India",
      locationData: null,
    }
  }



  async componentDidMount() {
    this.getAllData();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(this.props.savedLocation.latitude && this.props.savedLocation.latitude &&
        ((this.props.savedLocation.latitude != prevProps.savedLocation.latitude) || (this.props.savedLocation.longitude != prevProps.savedLocation.longitude))){
        this.setState({
          locationData: this.props.savedLocation
        })
    }
    if((this.props.sliderDistance != prevProps.sliderDistance)){
      this.setState({
        slider1value: this.props.sliderDistance,
      })
  }
}

  getAllData = async () => {
    this.setState({
      slider1value: this.props.sliderDistance,
    })
    this.fetchWholeAddressToLocalState();
  }

  fetchWholeAddressToLocalState = () => {
    this.setState({
      locationData: this.props.savedLocation
    })
  }

  showGlobalLocation = () => {

  }

  onFocus = async () => {
    let obj = {...this.state.locationData};
    obj.wholeAddress = '';
    this.setState({
      locationData: obj
    })
  }

  geturrentSituation = async (searchText) => {
    try {
      if (searchText !== '') {
        const response = await axios.request({
          method: 'post',
          url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${searchText}`,
        })
        if(response.data.predictions.length > 0){
          this.setState({
            isShowingResults: true,
            searchResults: response.data.predictions,
          })
        }
      } else {
        this.setState({
          isShowingResults: false
        })
      }
    } catch (error) {
      console.log('rrr', error);
    }
  }

  searchLocation = async (searchText) => {
    let obj = {...this.state.locationData};
    obj.wholeAddress = searchText;
    this.setState({
      locationData: obj
    })
    this.geturrentSituation(searchText)
  }

  showUpdatedAddress = async (item) => {
    try {
      Keyboard.dismiss();
      const response = await axios.request({
        method: 'post',
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${item.description}&key=${API_KEY}`,
      });
        //console.log('india', response);
        const latitude = response.data.results[0].geometry.location.lat;
        const longitude = response.data.results[0].geometry.location.lng;
        const wholeAddress = item.description;
        const addresses = response.data.results[0].address_components;
        let address = '';
        let country = '';
        for (let i = 0; i < addresses.length; i++) {
          const element = addresses[i];
          if(element.types.includes("country") && country == ''){
            country = element.long_name;
          }
          if(element.types.includes("locality")){
            address = element.long_name;
          } else if(element.types.includes("administrative_area_level_1") && address == ''){
            address = element.long_name;
          } else if(element.types.includes("country") && address == ''){
            address = element.long_name;
          }
        }

        let regionToAnimate = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.0222 * this.state.slider1value,
          longitudeDelta: 0.0222 * this.state.slider1value,
          wholeAddress: wholeAddress,
          country: country,
          address: address
        };
        this.map.animateToRegion({
          ...regionToAnimate
        });
        this.setState({
          locationData: regionToAnimate,
          isShowingResults: false,
          searchResults: [],
        })
    } catch (error) {
      console.log('err', error);
    }

      // .then(response => {

      //   const lng = response.data.results[0].geometry.location.lng
      //   var CountryString = response.data.results[0].formatted_address
      //   var SplitedCountry = CountryString.split(" ")
      //   var MyCountry = SplitedCountry[SplitedCountry.length - 1]

      //   let region = {
      //     latitude: parseFloat(response.data.results[0].geometry.location.lat),
      //     longitude: parseFloat(response.data.results[0].geometry.location.lng),
      //     latitudeDelta: 6,
      //     longitudeDelta: 6
      //   };
      //   this.map.animateToRegion({
      //     ...this.state.initialRegion,
      //     latitude: parseFloat(response.data.results[0].geometry.location.lat),
      //     longitude: parseFloat(response.data.results[0].geometry.location.lng),
      //   });
      //   this.setState({
      //     initialRegion: region,
      //     lat: parseFloat(response.data.results[0].geometry.location.lat),
      //     lng: parseFloat(response.data.results[0].geometry.location.lng),
      //     locationNow: item.description,
      //     isShowingResults: false,
      //     searchResults: [],
      //     country: MyCountry

      //   });
      //   let LocationObj = {
      //     latitude: this.state.lat,
      //     longitude: this.state.lng
      //   }
      //   // AsyncStorage.setItem('UserLocation', JSON.stringify(LocationObj))
      //   // // SetLat(lat)
      //   // // SetLng(lng)
      //   // // SetSearchResults([])
      //   // // SetIsShowingResults(false)
      //   // // SetLocationNow(searchText)
      //   // // // SetIsShowingResults(true)
      //   // // // SetSearchResults(response.data.predictions)
      // })
      // .catch((e) => {
      //   // //console.log(e.response);
      // });
  }

  setFinalLocation = async () => {
    AsyncStorage.setItem('MapSliderValue', JSON.stringify(this.state.slider1value));
    AsyncStorage.setItem('UserLocation', JSON.stringify(this.state.locationData));
    this.props.onSliderUpdate(this.state.slider1value);
    this.props.onUpdateLocation(this.state.locationData);
    this.props.updateLocation(this.state.slider1value)
  }

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true
    })
  };

  sliderOneValuesChange = values => {
    //console.log(values[0]);
    //console.log(values[0] * 0.0522);
    this.map.animateToRegion({
      ...this.state.locationData,
      latitudeDelta: values[0] * 0.0222,
      longitudeDelta: values[0] * 0.0222
    });
    this.setState(prevState => {
      return {
        locationData: {
          ...prevState.locationData,
          latitudeDelta: values[0] * 0.0222,
          longitudeDelta: values[0] * 0.0222
        },
        locationChosen: true
      };
    });
    // const slider1value = this.state.sliderOneValue
    this.setState({
      slider1value: values[0]
    })
  };

  sliderOneValuesChangeFinish = () => {
    this.setState({
      sliderOneChanging: false
    })
  };
  HandelBack = () => {
    this.fetchWholeAddressToLocalState();
    this.props.onPressClose();
  }
  getCurrentLocation=()=>{
    Geolocation.getCurrentPosition(pos=>{
        this.getAddressByLatANDLng(pos.coords.latitude, pos.coords.longitude)
    },err=>{
      //console.log(err);
      alert("Feteching the Position failed ,please pick one manually !")
    }
  )


  }
  getAddressByLatANDLng = async (latitude,longitude)=>{
    const response = await axios
    .request({
        method: 'post',
        'Content-Type': 'application/json',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
    });

    const wholeAddress = response.data.results[0].formatted_address;
    const addresses = response.data.results[0].address_components;

    for (let i = 0; i < addresses.length; i++) {
      const element = addresses[i];
      if(element.types.includes("locality")){
        var address = element.long_name;
      } else if(element.types.includes("country")){
        var country = element.long_name;
      }
    }
    let regionToAnimate = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      latitudeDelta: 0.0222 * this.state.slider1value,
      longitudeDelta: 0.0222 * this.state.slider1value,
      wholeAddress: wholeAddress,
      country: country,
      address
    };
    this.map.animateToRegion({
      ...regionToAnimate
    });
    this.setState({
      locationData: regionToAnimate,
      isShowingResults: false,
      searchResults: [],
    })
      // AsyncStorage.setItem('UserLocation', JSON.stringify(LocationObj))
  }

  goToInitialLocation = () => {
    let initialRegion = Object.assign({}, this.state.locationData);
    initialRegion["latitudeDelta"] = 0.0222 * this.state.slider1value;
    initialRegion["longitudeDelta"] = 0.0222 * this.state.slider1value;
    this.map.animateToRegion(initialRegion, 2000);
  }

  render() {
    const {locationData, latitudeDelta, longitudeDelta} = this.state;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalProps}
          onRequestClose={() => {
            this.HandelBack()
          }}>
          <View style={styles.modalContainer}>
            {
                locationData &&
                <View style={styles.modalBody}>
              <View style={styles.HeadrIconContainer}>
                <TouchableOpacity onPress={() => this.HandelBack()} style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5, backgroundColor: "#f5f5f5", padding: 4 }}>
                  <Fontisto name='close-a' size={12} color={"#000000"} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 20, paddingBottom: 8 }}>
                  <Text style={{ fontFamily:"Roboto-Bold" , color: '#000', fontWeight: 'bold', fontSize: 18, textAlign: 'left', marginLeft: 40, marginTop: -55 }}>Set Location</Text></View>
              </View>
              <View style={{ height: Deviceheight / 1.4, width: Devicewidth, alignItems: "center", justifyContent: 'center', }}>
                  <MapView
                    style={{ height: "100%", width: "100%", marginBottom: this.state.marginMap }}
                    mapPadding={{ top: 120, right: 25, bottom: 0, left: 0 }}
                    // region={this.state.initialRegion}
                    followUserLocation={true} 
                    ref={ref => this.map = ref}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    initialRegion={{...locationData}}
                    onMapReady={this.goToInitialLocation}
                    >
                    <Circle
                      center={{
                        latitude: parseFloat(locationData.latitude),
                        longitude: parseFloat(locationData.longitude),
                      }}
                      radius={this.state.slider1value * 1000}
                      strokeWidth = { 1 }
                      strokeColor = { '#1a66ff' }
                      fillColor = { 'rgba(230,238,255,0.5)' }
                    />
                    {locationData.latitude && locationData.longitude &&
                      <Marker
                        coordinate={{
                          latitude: parseFloat(locationData.latitude),
                          longitude: parseFloat(locationData.longitude),
                        }}
                      />
                    }
                  </MapView>
                <View style={{ height: Deviceheight / 2.2, width: Devicewidth / 1.18, alignItems: "center", justifyContent: 'center', position: "absolute", top: 50, marginTop:25     }}>     
 
                  <View style={styles.inputContainer}>  
                    <View style={styles.inputContainer1}>
                      <FontAwesomeIcon name='search' style={{ color: '#ccc', fontSize: 20, position: 'absolute', left: 5,  top: 7, padding: 5, }} />    
                      <TextInput 
                        placeholder={'Search'} 
                        placeholderTextColor={'#acacac'}
                        style={styles.Input}
                        autoCapitalize="none" 
                        value={locationData.wholeAddress} 
                        onTouchStart={this.onFocus}
                        onChangeText={(text) => this.searchLocation(text)}
                      >
                      </TextInput>   
                    </View>
                  </View>
                  <View style={{ alignItems: 'center', alignSelf: 'center', justifyContent: 'center', paddingBottom:10, width: Devicewidth - 50, height: 250, }}> 
                    {this.state.isShowingResults && (
                      <FlatList
                        keyboardShouldPersistTaps='always'
                        data={this.state.searchResults}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              style={styles.resultItem}
                              onPress={() => this.showUpdatedAddress(item)
                            }>
                              <Text>{item.description}</Text>
                            </TouchableOpacity>
                          );
                        }}
                        keyExtractor={(item) => item.id}
                        style={styles.searchResultsContainer}
                      />
                    )}
                  </View> 
                </View> 

                {/* need to implement cuerrent location feature here */}
                <TouchableOpacity onPress={this.getCurrentLocation}
                style={{ backgroundColor: "transparent", alignItems: "center", justifyContent: "center", height: Deviceheight / 20, width: Devicewidth / 10, position: "absolute", top: 20, right: 40, borderRadius:0,elevation:10,   }}> 
                  <Ionicons name='md-locate' size={30} color={"#2d3d53"} />
                </TouchableOpacity>  


              </View>
              <View style={styles.RangeContainer}>
                <Text style={{ fontFamily:"Roboto-Bold" , fontWeight: 'bold', fontSize: 12 }}>
                  {this.state.slider1value ? this.state.slider1value : 1 } {((this.state.locationData.country == 'USA') ||
                (this.state.locationData.country == 'United States')) ? ' miles' : ' km'}</Text>
                <View style={styles.SingleSliderMainContainer}>
                  <MultiSlider
                    values={[this.state.slider1value]}
                    sliderLength={Devicewidth / 1.8}
                    onValuesChangeStart={this.sliderOneValuesChangeStart}
                    onValuesChange={this.sliderOneValuesChange}
                    onValuesChangeFinish={this.sliderOneValuesChangeFinish}
                    customMarker={CustomMarker}
                    min={1}
                    max={500}
                    step={1}
                    selectedStyle={{ backgroundColor: "#232427" }}
                    snapped
                  />
                </View>
                <Text style={{ fontFamily:"Roboto-Bold" , fontWeight: 'bold', fontSize: 12 }}>500{((this.state.locationData.country == 'USA') ||
                (this.state.locationData.country == 'United States')) ? ' miles' : ' km'}</Text>
              </View>

              <View style={{ width: Devicewidth / 1.05, height: Deviceheight / 14, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', }}>
                <TouchableOpacity style={{ width: Devicewidth / 1.1, height: Deviceheight / 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 20 }} onPress={() => this.setFinalLocation()} >
                  <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Set Location</Text>

                </TouchableOpacity>

              </View>
            </View>
            }
          </View>
        </Modal>
      </View>
    )
  }
}

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
    backgroundColor: ' rgba(0,0,0,0.8)',
    paddingTop: Platform.OS == 'ios' ? 35 : 0,
  },
  HeadrIconContainer: {
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center',
    alignItems: 'flex-start',
    width: Devicewidth,
    height: Deviceheight / 15,
    backgroundColor: '#fff',
    justifyContent: "flex-start",
    elevation: 2,

  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    // zIndex:10,
    width: Devicewidth / 1.2,
  //  height: Deviceheight / 11.5,
    borderRadius: 10,
    justifyContent: 'center',
    elevation: 5
  },
  inputContainer1: {
    marginTop: 0, 
    marginBottom:5,  
   
    backgroundColor: '#fff',
    // zIndex:10,
    width: Devicewidth / 1.25,
   // height: Deviceheight / 14,  
      height: 45,  
    borderRadius: 10,  
    justifyContent: 'center',
    elevation: 5, 

  
  }, 
  Input: { 
    marginLeft: 30,
    width: Devicewidth / 1.4,
 //height: Deviceheight / 14,
    borderRadius: 10,
    fontSize: 14,
    paddingLeft: 10, 
    textAlign: 'left', 
    // borderWidth:1,
    backgroundColor: '#fff',
    // borderTopColor:"#fff",
    // borderTopWidth:1,
    // borderBottomColor:"#fff",
    // borderBottomWidth:1,
    borderRadius: 10,
    // borderColor: '#acacac',
    color: '#000',   
    //whiteSace:'nowrap',
    //overflow:'hidden',
   // textOverflow:'ellipsis',

  },
  ImageStyle: {
    padding: 5,
    height: 32,
    width: 35,
    resizeMode: 'stretch',
    position: 'absolute',
    left: 5,
    top: 15,
  },
  searchResultsContainer: {
    width: Devicewidth - 80,
    height: 200,
    backgroundColor: '#fff',
    // position:'absolute',
    // top:40

  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  SingleSliderMainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 15,
  },

  RangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: Devicewidth / 1.15,
    marginTop: 5
    // backgroundColor:"pink"
  }
})

const mapDispatchToProps = dispatch => {
  return {
      onUpdateLocation: (val) => dispatch({type: 'LOCATION_SELECTED', payload: val}),
      onSliderUpdate: (val) => dispatch({type: STORE_SLIDER_DISTANCE, payload: val}),
  }
}

const mapStateToProps = state => {
  return {
      savedLocation: state.savedLocation,
      sliderDistance: state.sliderDistance
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapModal);
