import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Image, TextInput, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getStateFromPath } from '@react-navigation/native';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomMarker from '../../Component/MultiSlider/index'
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {connect} from 'react-redux';

const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const ASPECT_RATIO = Devicewidth / Deviceheight;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const axios = require('axios');
//const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';
// const API_KEY = 'AIzaSyCZ9kuVUyhZxeFR3cPnebauMlffVOhoM1Y'
const API_KEY = 'AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4'
  
class MapModal extends Component {  

  constructor(props) {
    super(props)
    this.state = {
      sliderOneChanging: false,
      sliderOneValue: [],
      slider1value: 0,
      isShowingResults: false,
      searchResults: [],
      locationNow: '',
      region: {
        latitude: '',
        longitude: '',
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      lat: '',
      lng: '',
      country: "India",
      // marginMap: 1,

    }
    // this.goToInitialRegion.bind(this)
  }



  async componentDidMount() {
    // console.log("innnn mount");
    // this.HandelReload();
    this.getAllData();
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const {lat, lng} = prevState;
    const {latitude, longitude} = JSON.parse(await AsyncStorage.getItem('UserLocation'));
    if((latitude != lat) || (longitude != lng)){
      this.getAllData();
    }
  }

  getAllData = async () => {
    const value = JSON.parse(await AsyncStorage.getItem('MapSliderValue'))
    if (value != null) {
      this.setState({
        slider1value: value,
        sliderOneValue: [value]
      })
    }
    else {
      this.setState({
        slider1value: 500,
        sliderOneValue: [500]
      })
    }
    this.locationFinder();
  }

  // HandelReload() {
  //   this.props.navigation.addListener('focus', async () => {
  //     this.getAllData();
  //   })
  // }

  onFocus = async () => {
    this.setState({
      locationNow: ''
    })
  }

  // goToInitialLocation = () => {
  //     let initialRegion = Object.assign({}, this.state.initialRegion);
  //     initialRegion["latitudeDelta"] = 0.005;
  //     initialRegion["longitudeDelta"] = 0.005;
  //     this.mapView.animateToRegion(initialRegion, 2000);
  //   }

  locationFinder = async () => {
    const UserLocation = JSON.parse(await AsyncStorage.getItem('UserLocation'))
    //console.log("UserLoaction ****** "+JSON.stringify(UserLocation))
    // console.log("my location",UserLocation);
    if (UserLocation !== null) {
      const latitude = UserLocation.latitude;
      const longitude = UserLocation.longitude;
      let region = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 6,
        longitudeDelta: 6
      };
      this.setState({
        initialRegion: region,
        lat: latitude,
        lng: longitude
      });

      Geocoder.from(latitude, longitude)
        .then(json => {
          // //console.log('my required res at map modal for country',json.results[0])
          var area = json.results[0].address_components[1].long_name;
          var state = json.results[0].address_components[2].long_name;
          var pin = json.results[0].address_components[4].long_name;
          var location = pin + "," + area + "," + state
          var country = json.results[0].address_components[6].long_name
        //  alert(pin+","+area+","+state)
          this.setState({
            locationNow: location,
            country: country
          })
          //SetLocationNow(pin + "," + area + "," + state)
          //this.getlocationProduct(latitude, longitude, country)
        })
    }
    else {
      Geolocation.getCurrentPosition(
        info => {
          const { coords } = info
          const latitude = coords.latitude
          const longitude = coords.longitude
          let region = {
            latitude: parseFloat(coords.latitude),
            longitude: parseFloat(coords.longitude),
            latitudeDelta: 6,
            longitudeDelta: 6
          };
          this.setState({
            initialRegion: region,
            lat: longitude,
            lng: longitude,
          });

          Geocoder.from(latitude, longitude)
            .then(json => {
              // //console.log('my required res at map modal for country',json.results[0])
              var area = json.results[0].address_components[1].long_name;
              var state = json.results[0].address_components[2].long_name;
              var pin = json.results[0].address_components[4].long_name;
              var location = pin + "," + area + "," + state
              var country = json.results[0].address_components[6]!==undefined?json.results[0].address_components[6].long_name:""
              //alert(pin+","+area+","+state)
              this.setState({
                locationNow: location,
                country: country
              })
              //SetLocationNow(pin + "," + area + "," + state)
              //this.getlocationProduct(latitude, longitude, country)
            })
          // .catch(error => console.warn(error));
        },
        error => console.log(error),
        {
          enableHighAccuracy: false,
          timeout: 2000,
          maximumAge: 3600000
        }
      )
    }

  }

  geturrentSituation = async (searchText) => {
    if (searchText !== '') {
      await axios
        .request({
          method: 'post',
          url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${searchText}`,
        })
        .then(response => {
          // //console.log(response.data.predictions)

          this.setState({
            isShowingResults: true,
            searchResults: response.data.predictions,
            // locationNow: searchText 
          })
        })
        .catch((e) => {
          // //console.log(e.response);
        });
    } else {
      this.setState({
        isShowingResults: false
      })
    }
  }

  searchLocation = async (searchText) => {
    this.setState({
      locationNow: searchText
    })
    await this.geturrentSituation(searchText)
  }

  getupdateAddress = async (item) => {
    await axios
      .request({
        method: 'post',
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${item.description}&key=${API_KEY}`,
      })
      .then(response => {

        const lat = response.data.results[0].geometry.location.lat
        const lng = response.data.results[0].geometry.location.lng
        var CountryString = response.data.results[0].formatted_address
        var SplitedCountry = CountryString.split(" ")
        var MyCountry = SplitedCountry[SplitedCountry.length - 1]

        let region = {
          latitude: parseFloat(response.data.results[0].geometry.location.lat),
          longitude: parseFloat(response.data.results[0].geometry.location.lng),
          latitudeDelta: 6,
          longitudeDelta: 6
        };
        this.map.animateToRegion({
          ...this.state.initialRegion,
          latitude: parseFloat(response.data.results[0].geometry.location.lat),
          longitude: parseFloat(response.data.results[0].geometry.location.lng),
        });
        this.setState({
          initialRegion: region,
          lat: parseFloat(response.data.results[0].geometry.location.lat),
          lng: parseFloat(response.data.results[0].geometry.location.lng),
          locationNow: item.description,
          isShowingResults: false,
          searchResults: [],
          country: MyCountry

        });
        let LocationObj = {
          latitude: this.state.lat,
          longitude: this.state.lng
        }
        AsyncStorage.setItem('UserLocation', JSON.stringify(LocationObj))
        // // SetLat(lat)
        // // SetLng(lng)
        // // SetSearchResults([])
        // // SetIsShowingResults(false)
        // // SetLocationNow(searchText)
        // // // SetIsShowingResults(true)
        // // // SetSearchResults(response.data.predictions)
      })
      .catch((e) => {
        // //console.log(e.response);
      });
  }

  // componentDidUpdate(prevState) {
  //     if (this.state.initialRegion !== prevProps.initialRegion) {
  //         this.getCartItem(this.props.CartProducts.cartItem)
  //     }
  // }

  sliderOneValuesChangeStart = () => {
    this.setState({
      sliderOneChanging: true
    })
  };

  sliderOneValuesChange = values => {
    this.map.animateToRegion({
      ...this.state.initialRegion,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    });
    this.setState(prevState => {
      return {
        initialRegion: {
          ...prevState.initialRegion,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        },
        locationChosen: true
      };
    });
    // //console.log("hellotune:", values)
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      sliderOneValue: newValues
    })
    const slider1value = this.state.sliderOneValue
    AsyncStorage.setItem('MapSliderValue', JSON.stringify(newValues))
    this.setState({
      slider1value: slider1value
    })
  };

  sliderOneValuesChangeFinish = () => {
    this.setState({
      sliderOneChanging: false
    })
  };
  HandelBack = () => {
    // this.setState({ marginMap: 1 })
    this.props.onPressClose()
  }
  getCurrentLocation=()=>{
    Geolocation.getCurrentPosition(pos=>{
     //alert("lat"+pos.coords.latitude+"lng"+pos.coords.longitude)
     this.setState({lat:pos.coords.latitude,
                    lng:pos.coords.longitude})
                    this.getAddressByLatANDLng(pos.coords.latitude,pos.coords.longitude)
    },err=>{
      //console.log(err);
      alert("Feteching the Position failed ,please pick one manually !")
  }
  )
  
      
  }
  getAddressByLatANDLng=(latitude,longitude)=>{
    //console.log("Get address ***"+latitude+","+latitude)
    axios
    .request({
        method: 'post',
        'Content-Type': 'application/json',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
    })
    .then(response => {
      //console.log("Success")
      //console.log(response)
      const lat = response.data.results[0].geometry.location.lat
      const lng = response.data.results[0].geometry.location.lng
      var CountryString = response.data.results[0].formatted_address
    //  alert(CountryString)
      var SplitedCountry = CountryString.split(" ")
      var MyCountry = SplitedCountry[SplitedCountry.length - 1]

      let region = {
        latitude: parseFloat(response.data.results[0].geometry.location.lat),
        longitude: parseFloat(response.data.results[0].geometry.location.lng),
        latitudeDelta: 6,
        longitudeDelta: 6
      };
      this.map.animateToRegion({
        ...this.state.initialRegion,
        latitude: parseFloat(response.data.results[0].geometry.location.lat),
        longitude: parseFloat(response.data.results[0].geometry.location.lng),
      });
      this.setState({
        initialRegion: region,
        lat: parseFloat(response.data.results[0].geometry.location.lat),
        lng: parseFloat(response.data.results[0].geometry.location.lng),
        locationNow: CountryString,
        isShowingResults: false,
        searchResults: [],
        country: MyCountry

      });
      let LocationObj = {
        latitude: latitude,
        longitude: longitude
      }
      AsyncStorage.setItem('UserLocation', JSON.stringify(LocationObj))
    })
    .catch(err => {
        //console.log(err.data)
    })
  }
  render() {
    // console.log("my lat required", this.state.lat);
    // console.log("my lng required", this.state.lng);
    //console.log("my initialRegion required", this.state.initialRegion);
    return (
      // <TouchableWithoutFeedback onPress={() => 
      //   Keyboard.dismiss()
      //   }>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalProps}
          onRequestClose={() => {
            modalVisible(!modal)
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalBody}>
              {/* <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'> */}
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
                  region={this.state.initialRegion}
                  followUserLocation={true}
                  ref={ref => this.map = ref}
                  zoomEnabled={true}
                  showsUserLocation={true}
                  // showsMyLocationButton={true}
                  // onMapReady={this.goToInitialRegion.bind(this)}
                  // onMapReady={() => { this.setState({ marginMap: 0 }) }}
                  initialRegion={this.state.initialRegion}>
                  {this.state.lat !== '' && this.state.lng !== '' ?
                    <Marker
                      coordinate={{
                        latitude: parseFloat(this.state.lat),
                        longitude: parseFloat(this.state.lng),
                      }}
                    />
                    :
                    null
                  }
                </MapView>

                <View style={{ height: Deviceheight / 2.2, width: Devicewidth / 1.18, alignItems: "center", justifyContent: 'center', position: "absolute", top: 20, }}>

                  <View style={styles.inputContainer}>
                    <View style={styles.inputContainer1}>
                      <FontAwesomeIcon name='search' style={{ color: '#ccc', fontSize: 20, position: 'absolute', left: 5, top: 10, padding: 5, height: 32, }} />

                      <TextInput
                        placeholder={'Search'}
                        placeholderTextColor={'#acacac'}
                        style={styles.Input}
                        autoCapitalize="none"
                        value={this.state.locationNow}
                        // caretHidden={true}
                        // contextMenuHidden={true}
                        // disableFullscreenUI={true}
                        onTouchStart={this.onFocus}
                        onPressOut={true}
                        onChangeText={(text) => this.searchLocation(text)}
                      >
                      </TextInput>
                    </View>
                  </View>
                  <View style={{ alignItems: 'center', alignSelf: 'center', justifyContent: 'center', width: Devicewidth - 50, height: 250, }}>
                    {this.state.isShowingResults && (
                      <FlatList
                        keyboardShouldPersistTaps='always'
                        data={this.state.searchResults}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity
                              style={styles.resultItem}
                              onPress={() => this.getupdateAddress(item)
                                // this.setState({
                                //     searchKeyword: item.description,
                                //     isShowingResults: false,
                                // })
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
                style={{ backgroundColor: "#fff", alignItems: "center", justifyContent: "center", height: Deviceheight / 20, width: Devicewidth / 10, position: "absolute", top: 120, right: 30, borderRadius: 360,elevation:10, }}>
                  <Ionicons name='md-locate' size={30} color={"#2d3d53"} />
                </TouchableOpacity>


              </View>
              <View style={styles.RangeContainer}>
                <Text style={{ fontFamily:"Roboto-Bold" , fontWeight: 'bold', fontSize: 12 }}>{this.state.slider1value?this.state.slider1value:0}{this.state.country == 'USA' ? ' miles' : ' km'}</Text>
                <View style={styles.SingleSliderMainContainer}>
                  <MultiSlider
                    values={this.state.sliderOneValue}
                    sliderLength={Devicewidth / 1.6}
                    onValuesChangeStart={this.sliderOneValuesChangeStart}
                    onValuesChange={this.sliderOneValuesChange}
                    onValuesChangeFinish={this.sliderOneValuesChangeFinish}
                    customMarker={CustomMarker}
                    min={0}
                    max={500}
                    step={1}
                    selectedStyle={{ backgroundColor: "#232427" }}
                    snapped
                  />
                </View>
                <Text style={{ fontFamily:"Roboto-Bold" , fontWeight: 'bold', fontSize: 12 }}>500{this.state.country == 'USA' ? ' miles' : ' km'}</Text>
              </View>

              <View style={{ width: Devicewidth / 1.05, height: Deviceheight / 14, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', }}>
                <TouchableOpacity style={{ width: Devicewidth / 1.1, height: Deviceheight / 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: "#ff6801", borderRadius: 20 }} onPress={() => this.props.updateLocation(this.state.lat, this.state.lng,this.state.sliderOneValue)} >
                  <Text style={{ fontFamily:"Roboto-Bold" , color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Set Location</Text>

                </TouchableOpacity>

              </View>
              {/* </ScrollView> */}
            </View>
          </View>
        </Modal>
      </View>
      // </TouchableWithoutFeedback>
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
    backgroundColor: ' rgba(0,0,0,0.8)'
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
    height: Deviceheight / 11.5,
    borderRadius: 10,
    justifyContent: 'center',
    elevation: 5
  },
  inputContainer1: {
    marginTop: 5,
    backgroundColor: '#fff',
    // zIndex:10,
    width: Devicewidth / 1.25,
    height: Deviceheight / 14,
    borderRadius: 10,
    justifyContent: 'center',
    elevation: 10
  },
  Input: {
    marginLeft: 30,
    width: Devicewidth / 1.4,
    height: Deviceheight / 14,
    borderRadius: 10,
    fontSize: 14,
    paddingLeft: 15,
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
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  SingleSliderMainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // width: Devicewidth / 1.7,
    paddingHorizontal: 15,
    // backgroundColor:"pink"
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
  }
}

const mapStateToProps = state => {
  return {
      savedLocation: state.savedLocation,
      categoryList : state.categoryList,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapModal);