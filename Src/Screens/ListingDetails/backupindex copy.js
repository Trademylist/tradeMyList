import React, { Component } from 'react';
import {KeyboardAvoidingView,View, Text, Image, ScrollView, TextInput, StyleSheet, Dimensions, FlatList, TouchableOpacity, Alert, Platform, PermissionsAndroid, ActivityIndicator, ToastAndroid, StatusBar, BackHandler, SafeAreaView } from 'react-native';
import Header from "../../Component/HeaderBack"
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-community/async-storage';
import CustomMarker from '../../Component/MultiSlider/index'
import ImagePicker from 'react-native-image-crop-picker';
import ImageOptionModal from '../../Component/Image/index';
import AdditionalImageOption from '../../Component/AdditionalImage';
import CarMakeModal from "../../Component/CarMakeModal"
import CarModelModal from "../../Component/CarModelModal" 
import CarTrimModal from "../../Component/CarTrimModal"
import CatagoryModal from "../../Component/Catagorymodal"
import MapModal from '../../Component/MapModal';
import HeaderBackModal from '../../Component/ProductUploadBackModal';
import {
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
const axios = require('axios');
import {connect} from 'react-redux';
import {RNS3} from "react-native-s3-upload/src/RNS3";

const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
//const API_KEY = 'AIzaSyCPCwSH6Wtnu0dAJUapPeU2NWTwCmlNQhY';
const API_KEY = 'AIzaSyCZ9kuVUyhZxeFR3cPnebauMlffVOhoM1Y'



const Data = [
    {
        id:1, key: '0',
    },
    {
        id:2, key: '1',
    },
    {
        id:3, key: '2',
    },
    {
        id:4, key: '3',
    },
    {
        id:5, key: '4',
    },
    {
        id:6, key: '5',
    },
    {
        id:7, key: '6',
    },
    {
        id:8, key: '7',
    },
    {
        id:9, key: '8',
    },
];
class ListingDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sliderOneChanging: false,
            sliderOneValue: 1990,
            slider1value: 1990,
            sliderTwoChanging: false,
            sliderTwoValue: 1,
            slider2value: 1,
            ProfileImage: '',
            ImageOptionVisible: false,
            coverImage: '',
            AdditionalImages: [],
            AdditionalIndex: '',
            AdditionalOptionVisible: false,
            CarMake: '',
            CarModel: '',
            CarTrim: '',
            CarMakeStatus: false,
            CarModelStatus: false,
            CarTrimStatus: false,
            selectedProdCategory: '',
            TypeOfhousingListing: '',
            TypeofhousingProperty: '',
            noofBedrooms: '',
            noofBathRooms: '',
            Jobname: '',
            Productname: '',
            ProductnameLength: 0,
            Productprice: '',
            Jobtype: '',
            ProductDescription: '',
            ProductDescriptionLength: 0,
            JobDescription: '',
            lat: '',
            lng: '',
            sellerAddress: '',
            CatagoryModalVisibal: false,
            sellerType: '',
            TransMission: '',
            categoryList: [],
            categoryImgLink: '',
            ImageSpinnerVisible: false,
            AdditionalImageSpinnerVisible: false,
            mapVisible: false,
            Submitloder: false,
            currency: '',
            country: '',
            ImageLoadingState: [],
            HeaderBackModalStatus: false
        }
        this.bucketOptions = {
            keyPrefix: "uploads/",
            bucket: "magclubbucket",
            region: "us-east-1",
            accessKey: "AKIAI2XID245DD7OSKQA",
            secretKey: "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",
            successActionStatus: 201};

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    state = this.state

    getProductDetails = async (ProdId) => {
        console.log("my ProdId at get product details", ProdId)

        await axios.get("https://trademylist.com:8936/app_user/product/" + ProdId)
            .then(response => {
                console.log("my product details res", response.data.data.product)
                if (response.data.data.product.category === 'Car') {
                    let carmake, carmodel, sellerType, transmission, CarTrim, unit;
                    response.data.data.product.sub_category.map((subdata, subindex) => {
                        if (subdata.key === 'make') {
                            carmake = subdata.value
                        }
                        if (subdata.key === 'model') {
                            carmodel = subdata.value
                        }
                        if (subdata.key === 'seller') {
                            sellerType = subdata.value
                        }
                        if (subdata.key === 'transmission') {
                            transmission = subdata.value
                        }
                        if (subdata.key === 'trim') {
                            CarTrim = subdata.value
                        }
                        if (subdata.key === 'key') {
                            unit = subdata.value
                        }
                        return true
                    })
                    let Year, Mileage
                    response.data.data.product.sub_category_number.map((sub_numberdata, sub_numberindex) => {
                        if (sub_numberdata.key === 'year') {
                            Year = (sub_numberdata.value>0)?sub_numberdata.value:1
                        }
                        if (sub_numberdata.key === 'range') {
                            Mileages = sub_numberdata.value.split(" ");
                            console.log('hii',Mileages)
                            Mileage = (Mileages[0]>0)?Mileages[0]:1
                        }
                        return true
                    })
                    console.log("my yearr and milage", Year, Mileage)

                    this.setState({
                        CarMake: carmake,
                        CarModel: carmodel,
                        CarTrim: CarTrim,
                        sellerType: sellerType,
                        TransMission: transmission,
                        unit: unit,
                        slider1value: Year,
                        sliderOnevalue: Year,
                        slider2value: Mileage,
                        sliderTwoValue: Mileage
                    })

                }
                if (response.data.data.product.category === 'Housing') {
                    let typeList, typeProperty, bedRooms, bathRooms;
                    response.data.data.product.sub_category.map((subdata, subindex) => {
                        if (subdata.key === 'typeList') {
                            typeList = subdata.value
                        }
                        if (subdata.key === 'propertyType') {
                            typeProperty = subdata.value
                        }
                        if (subdata.key === 'bedRoomNo') {
                            bedRooms = subdata.value
                        }
                        if (subdata.key === 'bathRoomNo') {
                            bathRooms = subdata.value
                        }
                        return true
                    })

                    response.data.data.product.sub_category_number.map((noData, noIndex) => {
                        if (noData.key === 'bedRoomNo') {
                            bedRooms = noData.value
                        }
                        if (noData.key === 'bathRoomNo') {
                            bathRooms = noData.value
                        }
                    })


                    this.setState({
                        TypeOfhousingListing: typeList,
                        TypeofhousingProperty: typeProperty,
                        noofBedrooms: bedRooms,
                        noofBathRooms: bathRooms,

                    })
                }

                if (response.data.data.product.category === 'Jobs') {
                    let TypeofJob;
                    response.data.data.product.sub_category.map((subdata, subindex) => {
                        if (subdata.key === 'type_of_job') {
                            TypeofJob = subdata.value
                        }
                    })
                    this.setState({
                        Jobtype: TypeofJob,
                        JobDescription: response.data.data.product.product_description,
                        Jobname: response.data.data.product.product_name
                    })
                }
                this.setState({
                    selectedProdCategory: response.data.data.product.category,
                    coverImage: response.data.data.product.cover_thumb,
                    AdditionalImages: response.data.data.product.image,
                    Productname: response.data.data.product.product_name,
                    ProductDescription: response.data.data.product.product_description,
                    Productprice: response.data.data.product.product_price,
                    sellerAddress: response.data.data.product.address,
                    lat: response.data.data.product.geometry.coordinates[1],
                    lng: response.data.data.product.geometry.coordinates[0],
                    currency: response.data.data.product.currencyCode,
                    country: response.data.data.product.country
                })
            })
            .catch(error => {
                //console.log(error.data)
            })
    }
    getcategory = async (data) => {
        await axios.get("https://trademylist.com:8936/app_user/category_list/" + data)
            .then(response => {
                this.setState({
                    categoryList: response.data.data.category,
                    categoryImgLink: response.data.data.categoryImageUrl
                })
            })
            .catch(error => {
                //console.log(error.data)
            })
    }

    selectedCat = async (catName) => {
        this.setState({
            CatagoryModalVisibal: false,
            selectedProdCategory: catName
        })
    }

    componentDidMount() {
        this.getDetails();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.HandelBack()
        return true;
    }

    getDetails = async () => {
        const UserLocation = JSON.parse(await AsyncStorage.getItem('UserLocation'))
        const data = 'product'
        this.getcategory(data)
        if (this.props.route.params.productId !== undefined) {
            this.getProductDetails(this.props.route.params.productId)
        } else {
            this.setState({
                selectedProdCategory: this.props.route.params.category
            })
            this.setState({
                lat: this.props.savedLocation.latitude,
                lng: this.props.savedLocation.longitude,
                sellerAddress: this.props.savedLocation.wholeAddress
            })
            this.getCurrency(this.props.savedLocation.country)
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.savedLocation.latitude && this.props.savedLocation.latitude &&
            ((this.props.savedLocation.latitude != prevProps.savedLocation.latitude) || (this.props.savedLocation.longitude != prevProps.savedLocation.longitude) || (this.props.sliderDistance != prevProps.sliderDistance))){
                this.setState({
                    lat: this.props.savedLocation.latitude,
                    lng: this.props.savedLocation.longitude,
                    sellerAddress: this.props.savedLocation.wholeAddress
                })
                this.getCurrency(this.props.savedLocation.country)
            }
    }


    getCurrency = async (country) => {
        //console.log("contry berfore ", country)
        const object =
        {
            country: country
        }
        await axios.post("https://trademylist.com:8936/app_user/currency", object)
            .then(response => {
                //console.log('getCurrency', response);
                if (response.data.success) {
                    this.setState({
                        currency: response.data.code,
                        country: country
                    })
                }
            })
    }
    getUpdatelocProd = async () => {
        // this.GetLATLANG(lat, lng)
        this.setState({
            mapVisible: false
        })
    }
    sliderOneValuesChangeStart = () => {
        this.setState({
            sliderOneChanging: true,
        });
    };

    sliderOneValuesChange = values => {
        //console.log("hellotune:", values)
        let newValues = [0];
        newValues = values[0];
        this.setState({
            sliderOneValue: newValues,
        });
        const slider1value = this.state.sliderOneValue
        this.setState({ slider1value })
    };

    sliderOneValuesChangeFinish = () => {
        this.setState({
            sliderOneChanging: false,
        });
    };

    sliderTwoValuesChangeStart = () => {
        this.setState({
            sliderTwoChanging: true,
        });
    };

    sliderTwoValuesChange = values => {
        //console.log("hellotune2:", values[0])
        let newValues = [0];
        newValues = values[0];
        this.setState({
            sliderTwoValue: newValues,
        });
        const slider2value = this.state.sliderTwoValue
        this.setState({ slider2value })
    };

    sliderTwoValuesChangeFinish = () => {
        this.setState({
            sliderTwohanging: false,
        });
    };

    selectImage = () => {
        this.setState({
            ImageOptionVisible: true
        })
    }
    closeImageOptionModal = () => {
        this.setState({
            ImageOptionVisible: false
        })
    }

    closeaddModal = () => {
        this.setState({
            AdditionalOptionVisible: false
        })
    }


    requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                // console.warn(err);
                return false;
            }
        } else return true;
    };

    requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                // console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    getFileFromGallery = async (data) => {
        this.setState({ImageOptionVisible: false});
        let options = {
            mediaType: data,
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            rotation : 360
        };
        launchImageLibrary(options, (response) => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                // alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }

            this.uploadFileToS3(response, false);
            // this.getImageuploadGallery(response)
            this.setState({
                ImageSpinnerVisible: true
            })
        });
    }

    getImageuploadGallery = async (image) => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                let data = new FormData();
                const img = {
                    name: Math.floor(Math.random() * 100000000 + 1) + ".jpg",
                    type: image.type,
                    uri: image.uri
                }
                console.log("my IMG 3",JSON.stringify(img));
                data.append('file', img);
                await axios.post("https://trademylist.com:8936/app_seller/upload", data, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        this.setState({
                            coverImage: response.data.data.image,
                            ImageOptionVisible: false,
                            ImageSpinnerVisible: false
                        })
                    })
                    .catch(error => {
                        console.log('errr', error)
                    })
                // setFilePath(response);

            }
        } catch (e) {
            // error reading value
        }
    }

    getImageupload = async (image) => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                let data = new FormData();
                const img = {
                    name: Math.floor(Math.random() * 100000000 + 1) + ".jpg",
                    type: image.mime,
                    uri: image.path
                }
                data.append('file', img);
                axios.post("https://trademylist.com:8936/app_seller/upload", data, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                .then(response => {
                    this.setState({
                        coverImage: response.data.data.image,
                        ImageOptionVisible: false,
                        ImageSpinnerVisible: false
                    })
                })
                .catch(error => {
                    console.log('errr', error)
                })
                // setFilePath(response);

            }
        } catch (e) {
            console.log('e', e)
            // error reading value
        }
    }


    getImageaddupload = async (response) => {
        const { ImageLoadingState, AdditionalIndex } = this.state
        var h = AdditionalIndex
        var imagestate = []
        for (var k = 0; k < response.length; k++) {
            imagestate.push(h)
            h++
        }
        this.setState({
            AdditionalImageSpinnerVisible: true,
            ImageLoadingState: imagestate
        })
        //console.log("in fnc");
        try {
            const { AdditionalImages, AdditionalIndex } = this.state;
            let allImages = AdditionalImages
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            //console.log(value.token);
            if (value !== null) {

                //seller can only upload max 10 images for a product
                // let MyLength = 10
                var j = AdditionalIndex
                let MyLength = response.length
                for (var i = 0; i < MyLength; i++) {
                    let data = new FormData();
                    const img =
                    {
                        name: Math.floor(Math.random() * 100000000 + 1) + ".jpg",
                        type: response[i].mime,
                        uri: response[i].path
                    }
                    //console.log("my img", img);
                    data.append('file', img);
                    await axios.post("https://trademylist.com:8936/app_seller/upload", data, {
                        headers: {
                            'x-access-token': value.token,
                        }
                    })
                        .then(response => {
                            AdditionalImages[j] = response.data.data.image
                        })
                        .catch(error => {
                            //console.log(error.data)
                        })
                    j++
                }
                this.setState({
                    AdditionalImages,
                    AdditionalImageSpinnerVisible: false,
                })


                // await axios.post("https://trademylist.com:8936/app_seller/upload", MyObject, {
                //             headers: {
                //                 'x-access-token': value.token,
                //             }
                //         })
                //             .then(response => {
                //                 //console.log('my res',response)
                //                 if (allImages.length > 0) {
                //                     allImages.push(response.data.data.image)
                //                 } else {
                //                     allImages[AdditionalIndex] = response.data.data.image
                //                 }
                //                 // setFilePath(response);
                //                 this.setState({
                //                     AdditionalImages: allImages,
                //                     AdditionalImageSpinnerVisible: false,
                //                 })

                //         //console.log("My Additional Images",this.state.AdditionalImages)
                //             })
                //             .catch(error => {
                //                 //console.log(error.data)
                //             })
                //         setFilePath(response);

            }
        } catch (e) {
            // error reading value
        }
    }

    getAddFileFromGallery = async () => {
        this.setState({
            AdditionalOptionVisible: false
        })
        this.selectImageGallery()
    }

    getaddCaptureFromCamera = async (data) => {
        this.selectImageCamera()
    }

    getCaptureFromCamera = async () => {
        ImagePicker.openCamera({
            multiple: false,
        }).then(image => {
            this.setState({ImageOptionVisible: false});
            let file = {
                uri: image.path,
                fileName: image.path.replace(/^.*[\\\/]/, ''),
                type: image.mime
            }
            this.uploadFileToS3(file, false);
            // this.getImageupload(image)
            this.setState({
                ImageSpinnerVisible: true
            })
            // this.getImageaddupload(image)
            //console.log("my image from camera", image);
        });
        // let options = {
        //     mediaType: data,
        //     maxWidth: 300,
        //     maxHeight: 550,
        //     quality: 1,
        //     videoQuality: 'low',
        //     durationLimit: 30, //Video max duration in seconds
        //     saveToPhotos: true,
        //     // rotation : 90
        // };
        // let isCameraPermitted = await this.requestCameraPermission();
        // let isStoragePermitted = await this.requestExternalWritePermission();
        // if (isCameraPermitted && isStoragePermitted) {
        //     launchCamera(options, (response) => {
        //         //console.log('Response = ', response);

        //         if (response.didCancel) {
        //             // alert('User cancelled camera picker');
        //             return;
        //         } else if (response.errorCode == 'camera_unavailable') {
        //             alert('Camera not available on device');
        //             return;
        //         } else if (response.errorCode == 'permission') {
        //             alert('Permission not satisfied');
        //             return;
        //         } else if (response.errorCode == 'others') {
        //             alert(response.errorMessage);
        //             return;
        //         }
                // this.getImageupload(response)
                // this.setState({
                //     ImageOptionVisible: false,
                //     ImageSpinnerVisible: true
                // })
            // });
        // }
    }

    selectAdditionalImage = async (itemindex) => {
        const { AdditionalImages } = this.state;
        let imagesList = AdditionalImages;
        this.setState({
            // AdditionalOptionVisible: true,
            AdditionalIndex: itemindex,
            AdditionalOptionVisible: true

        })
        // Alert.alert(
        //     "Upload Image",
        //     "Select a Photo..",
        //     [
        //         {
        //             text: "Cancel",
        //             onPress: () => //console.log("Cancel Pressed"),
        //             style: "cancel"
        //         },
        //         {
        //             text: "Gallery",
        //             onPress: () => this.selectImageGallery()
        //         },
        //         {
        //             text: "Camera", onPress: () => this.selectImageCamera()
        //         },

        //     ],
        //     { cancelable: false }
        // );
    }



    selectImageGallery() {
        let options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            rotation : 360
        };
        launchImageLibrary(options, (response) => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                // alert('User cancelled camera picker');
                return;
            } else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }

            this.uploadFileToS3(response, true);
        });
    }

    selectImageCamera() {
        ImagePicker.openCamera({
            cropping: false,
        }).then(image => {
            this.setState({
                AdditionalOptionVisible: false
            })
            let array = [image];
            this.uploadFileToS3(array, true);
            // this.getImageaddupload(array)
            //console.log("my image from camera", image);
        });
    }

    HandelImageCross = async (ImageFile, fromWhere, ImageIndex) => {
        //console.log("in fnc");
        //console.log("Image File", ImageFile);
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {
                const img = {
                    "file": ImageFile
                }
                //console.log("token", value.token);
                //console.log("Image data", img);
                await axios.post("https://trademylist.com:8936/app_seller/unlink", img, {
                    headers: {
                        'x-access-token': value.token,
                    }
                })
                    .then(response => {
                        if (fromWhere == "cover") {
                            this.setState({
                                coverImage: ''
                            })
                        }
                        else {
                            var MyAllImage = this.state.AdditionalImages
                            MyAllImage.splice(ImageIndex, 1)
                            this.setState({ AdditionalImages: MyAllImage })
                        }


                        //console.log("delete image response", response)
                    })
                    .catch(error => {
                        //console.log(error.data)
                    })
                // setFilePath(response);

            }
        } catch (e) {
            // error reading value
        }
    }
    OpenCarMakeModal = () => {
        this.setState({
            CarMakeStatus: true
        })
    }
    closeCarMakeModal = () => {
        this.setState({
            CarMakeStatus: false
        })
    }

    OpenCarModelModal = () => {
        const { CarMake } = this.state;
        if (CarMake !== '') {
            this.setState({
                CarModelStatus: true
            })
        }
    }
    closeCarModelModal = () => {
        this.setState({
            CarModelStatus: false
        })
    }
    OpenCarTrimModal = () => {
        const { CarModel } = this.state;
        if (CarModel !== '') {
            this.setState({
                CarTrimStatus: true
            })
        }
    }
    closeCarTrimModal = () => {
        this.setState({
            CarTrimStatus: false
        })
    }

    submitProd = async () => {
        try {
            const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
            if (value !== null) {

                this.setState({
                    Submitloder: true
                })
                console.log('state ',this.state)
                const { coverImage, AdditionalImages, Productname, Productprice, ProductDescription, lat, lng, sellerAddress, selectedProdCategory, Jobname, JobDescription, Jobtype, TypeofhousingProperty, TypeOfhousingListing, noofBedrooms, noofBathRooms, CarMake, CarModel, CarTrim, sellerType, TransMission, slider1value, slider2value, currency, country } = this.state;
                let Data = {}
                const coordinatesDiff = [
                    lng,
                    lat,
                ];
                if (selectedProdCategory === 'Jobs') {
                    Data = {
                        "address": sellerAddress,
                        "category": selectedProdCategory,
                        "country": country,
                        "currencyCode": currency,
                        "product_description": JobDescription,
                        "product_name": Jobname,
                        "type_of_job": Jobtype,
                        "product_type": 'Product',
                        "cover_thumb": coverImage,
                        "image": AdditionalImages,
                        'geometry': {
                            "coordinates": coordinatesDiff
                        }
                    }
                } else if (selectedProdCategory === 'Housing') {
                    Data = {
                        "address": sellerAddress,
                        "category": selectedProdCategory,
                        "country": country,
                        "currencyCode": currency,
                        "product_description": ProductDescription,
                        "product_name": Productname,
                        "product_price": Productprice,
                        "product_type": 'Product',
                        "propertyType": TypeofhousingProperty,
                        "typeList": TypeOfhousingListing,
                        "bedRoomNo": noofBedrooms,
                        "bathRoomNo": noofBathRooms,
                        "cover_thumb": coverImage,
                        "image": AdditionalImages,
                        'geometry': {
                            "coordinates": coordinatesDiff
                        }
                    }
                } else if (selectedProdCategory === 'Car') {
                    Data = {
                        "address": sellerAddress,
                        "category": selectedProdCategory,
                        "country": country,
                        "currencyCode": currency,
                        "product_description": ProductDescription,
                        "product_name": Productname,
                        "product_price": Productprice,
                        "product_type": 'Product',
                        "make": CarMake,
                        "model": CarModel,
                        "trim": CarTrim,
                        "range": this.state.slider2value,
                        "seller": sellerType,
                        "transmission": TransMission,
                        "year": this.state.slider1value,
                        "cover_thumb": coverImage,
                        "image": AdditionalImages,
                        'geometry': {
                            "coordinates": coordinatesDiff
                        }
                    }
                }
                else {
                    Data = {
                        "address": sellerAddress,
                        "category": selectedProdCategory,
                        "country": country,
                        "currencyCode": currency,
                        "product_description": ProductDescription,
                        "product_name": Productname,
                        "product_price": Productprice,
                        "product_type": 'Product',
                        "cover_thumb": coverImage,
                        "image": AdditionalImages,
                        'geometry': {
                            "coordinates": coordinatesDiff
                        }
                    }
                }
                if (this.props.route.params.productId !== undefined) {
                    const ProdId = this.props.route.params.productId;
                    console.log('submit data ', Data);
                    await axios.put("https://trademylist.com:8936/app_seller/product/" + ProdId, Data, {
                        headers: {
                            'x-access-token': value.token,
                        }
                    })
                        .then(response => {
                            //console.log("my product upload successfull response", response);
                            this.setState({
                                Submitloder: false
                            })
                            ToastAndroid.showWithGravity(
                                "Product Successfully Updated",
                                ToastAndroid.SHORT,
                                ToastAndroid.BOTTOM,
                            );
                            this.props.navigation.navigate('productList', { "process": 'Product' })
                        })
                        .catch(error => {
                            //console.log(error.data)
                        })
                } else {
                    await axios.post("https://trademylist.com:8936/app_seller/product", Data, {
                        headers: {
                            'x-access-token': value.token,
                        }
                    })
                        .then(response => {
                            if (response.data.success) {
                                //console.log("my product upload successfull response", response);

                                this.setState({
                                    Submitloder: false
                                })
                                ToastAndroid.showWithGravity(
                                    "Product Successfully added",
                                    ToastAndroid.SHORT,
                                    ToastAndroid.BOTTOM
                                );
                                this.props.navigation.navigate('productList', { "process": 'Product' })
                            }
                        })
                        .catch(error => {
                            //console.log(error.data)
                        })
                }

            } else {
                // alert('login Modal')
            }
        } catch (e) {
            // error reading value
        }
    }

    OpenCatagoryModal = () => {
        this.setState({
            CatagoryModalVisibal: true
        })
    }
    closeCatagoryModal = () => {
        this.setState({
            CatagoryModalVisibal: false
        })
    }

    selectcarMake = async (makedata) => {
        this.setState({
            CarMakeStatus: false,
            CarMake: makedata
        })
    }

    selectcarModal = async (modelData) => {
        this.setState({
            CarModelStatus: false,
            CarModel: modelData
        })
    }

    selectcarTrim = async (trimData) => {
        this.setState({
            CarTrimStatus: false,
            CarTrim: trimData
        })
    }
    handelMap = () => {
        this.setState({
            mapVisible: true
        })
    }
    closeModal = async () => {
        this.setState({
            mapVisible: false
        })
    }
    HandelBack = () => {
        this.setState({
            HeaderBackModalStatus: true
        })
    }
    closeHeaderBackModal = () => {
        this.setState({
            HeaderBackModalStatus: false
        })
    }
    uploadFileToS3 = async (response, isAdditionalImage) => {
        if(isAdditionalImage) {
            const { ImageLoadingState, AdditionalIndex } = this.state
            var h = AdditionalIndex
            var imagestate = []
            imagestate.push(h)
            h++
            this.setState({
                AdditionalImageSpinnerVisible: true,
                ImageLoadingState: imagestate
            })
            // //console.log("in fnc");
            try {
                const { AdditionalImages, AdditionalIndex } = this.state;
                const value = await JSON.parse(await AsyncStorage.getItem('UserData'))
                if (value !== null) {
                    var j = AdditionalIndex
                    const formattedFile = {
                        uri: response.uri,
                        name: (new Date().getTime()) + response.fileName,
                        type: response.type
                    }
                    await RNS3.put(formattedFile, this.bucketOptions).then(response => {
                        if (response.status !== 201) {
                            throw new Error("Failed to upload to S3");
                        } else {
                            AdditionalImages[j] = response.body.postResponse.location;
                        }
                    });
                    j++
                }
                this.setState({
                    AdditionalImages,
                    AdditionalImageSpinnerVisible: false,
                })
            } catch (e) {}
        } else {
            const formattedFile = {
                uri: response.uri,
                name: (new Date().getTime()) + response.fileName,
                type: response.type
            }
            RNS3.put(formattedFile, this.bucketOptions).then(response => {
                if (response.status !== 201) {
                    throw new Error("Failed to upload to S3");
                } else {
                    this.setState({
                        coverImage: response.body.postResponse.location,
                        ImageOptionVisible: false,
                        ImageSpinnerVisible: false,
                    });
                }
            });
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.Container}>
                <View style={styles.HeaderContainer}>
                    <StatusBar backgroundColor="#000000" />
                    <View style={styles.HeadrIconContainer}>
                        <TouchableOpacity onPress={() => this.HandelBack()} style={{
                            height: Deviceheight / 50,
                            width: Devicewidth / 25, alignItems: "center", justifyContent: "center", alignSelf: "center", marginLeft: 20, marginBottom: 5,
                        }}>
                            <Image source={require("../../Assets/BackIconLeft.png")} style={{ height: "100%", width: "100%" }}></Image>
                        </TouchableOpacity>
                        <Text style={{ fontFamily:"Roboto-Bold" , color: '#434343', fontSize: 20, lineHeight: 20, fontWeight: 'bold', textAlign: 'left', marginLeft: 20}}>Listing Details</Text>
                    </View>
                </View>
                <HeaderBackModal
                    modalProps={this.state.HeaderBackModalStatus}
                    onPressClose={() => this.closeHeaderBackModal()}
                    Process="general"
                    navigation={this.props.navigation}
                ></HeaderBackModal>
                <ImageOptionModal
                    modalProps={this.state.ImageOptionVisible}
                    onPressClose={() => this.closeImageOptionModal()}
                    getchooseFile={this.getFileFromGallery}
                    getcaptureFile={this.getCaptureFromCamera}
                    navigation={this.props.navigation}
                ></ImageOptionModal>

                <AdditionalImageOption
                    modalProps={this.state.AdditionalOptionVisible}
                    onPressClose={() => this.closeaddModal()}
                    getchooseFileData={this.getAddFileFromGallery}
                    getcaptureFileData={this.getaddCaptureFromCamera}
                    navigation={this.props.navigation}
                >
                </AdditionalImageOption>

                <CarMakeModal
                    modalProps={this.state.CarMakeStatus}
                    onPressClose={() => this.closeCarMakeModal()}
                    selectedMake={this.state.CarMake}
                    makeCategory={this.state.selectedProdCategory}
                    getcarmake={this.selectcarMake}
                    navigation={this.props.navigation}
                >
                </CarMakeModal>
                <CarModelModal
                    modalProps={this.state.CarModelStatus}
                    onPressClose={() => this.closeCarModelModal()}
                    selectedMake={this.state.CarMake}
                    makeCategory={this.state.selectedProdCategory}
                    selectedModel={this.state.CarModel}
                    getcarmodel={this.selectcarModal}
                    navigation={this.props.navigation}
                >
                </CarModelModal>
                <CarTrimModal
                    modalProps={this.state.CarTrimStatus}
                    onPressClose={() => this.closeCarTrimModal()}
                    selectedModal={this.state.CarModel}
                    makeCategory={this.state.selectedProdCategory}
                    selectedTrim={this.state.CarTrim}
                    getcartrim={this.selectcarTrim}
                    navigation={this.props.navigation}
                >
                </CarTrimModal>
                <CatagoryModal
                    modalProps={this.state.CatagoryModalVisibal}
                    onPressClose={() => this.closeCatagoryModal()}
                    categoryList={this.state.categoryList}
                    categoryImg={this.state.categoryImgLink}
                    selectedProdCat={this.state.selectedProdCategory}
                    getCategory={this.selectedCat}
                    navigation={this.props.navigation}
                >
                </CatagoryModal>
                <MapModal
                    modalProps={this.state.mapVisible}
                    onPressClose={() => this.closeModal()}
                    updateLocation={this.getUpdatelocProd}
                    navigation={this.props.navigation}
                ></MapModal>
                {this.state.Submitloder == true ?
                    <ActivityIndicator style={{ alignSelf: "center", marginTop: Deviceheight / 3  }} animating={this.state.loder} color={"#383ebd"} size="large" />
                    :
                    <>
                    <ScrollView
                        keyboardShouldPersistTaps='always' contentContainerStyle={{ width: Devicewidth, alignSelf: 'center' }}>
                        <View style={{ flexDirection: "row", alignItems: "center", alignSelf: "center", justifyContent: 'center', width: Devicewidth, marginTop: 15 }}>

                            {/* For cover image */}
                            <TouchableOpacity
                                onPress={() => this.selectImage()}
                                style={styles.ProfileImageMainContainer}>
                                {this.state.ImageSpinnerVisible == true ?
                                    <ActivityIndicator animating={this.state.ImageSpinnerVisible} color={"#383ebd"} size="large" />
                                    :
                                    this.state.coverImage ?
                                    <>
                                        <Image style={{ height: '100%', width: '100%', resizeMode: 'cover' }} source={{ uri: this.state.coverImage }} />
                                        <TouchableOpacity onPress={() => this.HandelImageCross(this.state.coverImage, "cover", null)} style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 50, width: Devicewidth / 25, marginTop: 10, backgroundColor: "#fff", position: "absolute", borderRadius: 360, top: -8, right: 3 }}>
                                            <Image source={require('../../Assets/Cross.png')} style={{ width: "70%", height: "70%", resizeMode: 'contain', }}></Image>
                                        </TouchableOpacity>
                                    </>
                                    :
                                    (this.state.selectedProdCategory == "Jobs" || this.state.selectedProdCategory == "Services") ?
                                    <>
                                        <Image style={{ height: '100%', width: '100%', resizeMode: 'cover' }} source={{ uri: this.state.selectedProdCategory == "Jobs" ? "https://trademylist.com:8936/jobs.jpg" : "https://trademylist.com:8936/services.jpg" }} />
                                        {/* <TouchableOpacity onPress={() => this.HandelImageCross(this.state.coverImage, "cover", null)} style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 50, width: Devicewidth / 25, marginTop: 10, backgroundColor: "#fff", position: "absolute", borderRadius: 360, top: -8, right: 3 }}>
                                            <Image source={require('../../Assets/Cross.png')} style={{ width: "70%", height: "70%", resizeMode: 'contain', }}></Image>
                                        </TouchableOpacity> */}
                                    </>
                                    :
                                    <Text style={styles.Plus}>+</Text>
                                }
                                <View style={{ backgroundColor: "grey", alignSelf: "center", alignItems: "center", justifyContent: "center", position: "absolute", padding: 3, borderRadius: 5, bottom: 3 }}>
                                    <Text style={{ fontFamily:"Roboto-Bold" , color: "#fff", fontSize: 10, textAlign: 'center' }}>Cover Image</Text>
                                </View>
                            </TouchableOpacity>

                            {/* For additional Image */}
                            <View style={styles.FlatListContainer}>
                                <FlatList
                                    data={Data}
                                    scrollEnabled={true}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity style={styles.AdditionalImageMainContainer} onPress={() => this.selectAdditionalImage(index)}>
                                            {this.state.AdditionalImageSpinnerVisible == true && this.state.ImageLoadingState.indexOf(index) !== -1 ?
                                                <ActivityIndicator animating={this.state.AdditionalImageSpinnerVisible} color={"#383ebd"} size="large" />
                                                :
                                                this.state.AdditionalImages[index]
                                                    ?
                                                    <>
                                                        <Image style={{ height: '100%', width: '100%', resizeMode: 'cover' }} source={{ uri: this.state.AdditionalImages[index] }} />
                                                        <TouchableOpacity onPress={() => this.HandelImageCross(this.state.AdditionalImages[index], "additional", index)} style={{ alignItems: 'center', justifyContent: 'center', height: Deviceheight / 50, width: Devicewidth / 25, marginTop: 10, backgroundColor: "#fff", position: "absolute", borderRadius: 360, top: -8, right: 3 }}>
                                                            <Image source={require('../../Assets/Cross.png')} style={{ width: "70%", height: "70%", resizeMode: 'contain', }}></Image>
                                                        </TouchableOpacity>
                                                    </>
                                                    :
                                                    <Text style={styles.Plus}>+</Text>
                                            }


                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={item => item.id.toString()}
                                />
                            </View>
                        </View>

                        {
                            this.state.selectedProdCategory === 'Jobs'
                                ?
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder={'Job name'}
                                        placeholderTextColor={'#000'}
                                        style={styles.Input}
                                        onChangeText={(val) => this.setState({
                                            Jobname: val,
                                            ProductnameLength: val.length
                                        })}
                                        value={this.state.Jobname}
                                    >
                                    </TextInput>
                                    <View style={{
                                        height: Deviceheight / 28, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", backgroundColor: "#b2b2b2", padding: 2, position: 'absolute', right: 10, bottom: 15, borderRadius: 2
                                    }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#fff", fontSize: 18, textAlign: "center", }}>{this.state.ProductnameLength}/80</Text>
                                    </View>
                                </View>
                                :
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder={this.state.selectedProdCategory != 'Services'?'Productd name':'Service name'}
                                        placeholderTextColor={'#000'}
                                        style={styles.Input}
                                        onChangeText={(val) => this.setState({
                                            Productname: val,
                                            ProductnameLength: val.length
                                        })}
                                        value={this.state.Productname}
                                    >
                                    </TextInput>
                                    <View style={{
                                        height: Deviceheight / 28, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", backgroundColor: "#b2b2b2", padding: 2, position: 'absolute', right: 10, bottom: 15, borderRadius: 2
                                    }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#fff", fontSize: 18, textAlign: "center", }}>{this.state.ProductnameLength}/80</Text>
                                    </View>
                                </View>

                        }

                        <TouchableOpacity onPress={() => this.OpenCatagoryModal()} style={styles.inputContainer}>
                            <View style={styles.CatagoryContainer}>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 14, color: '#000', marginTop: 5, marginBottom: 5, width: Devicewidth / 1.2, }}>Select Category</Text>
                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: "#000", width: Devicewidth / 1.2, }}>{this.state.selectedProdCategory}</Text>
                            </View>
                        </TouchableOpacity>

                        {
                            this.state.selectedProdCategory === 'Car'
                                ?
                                <>
                                    <TouchableOpacity onPress={() => this.OpenCarMakeModal()} style={styles.DescContainer}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 5, marginBottom: 5 }}>{this.state.CarMake === '' ? 'Make' : this.state.CarMake}</Text>
                                        <Icon name="angle-right" size={30} color="#7f818e" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => this.OpenCarModelModal()}
                                        style={styles.DescContainer}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 5, marginBottom: 5 }}>{this.state.CarModel === '' ? 'Model' : this.state.CarModel}</Text>
                                        <Icon name="angle-right" size={30} color="#7f818e" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => this.OpenCarTrimModal()}
                                        style={styles.DescContainer}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 5, marginBottom: 5 }}>{this.state.CarTrim === '' ? 'Trim' : this.state.CarTrim}</Text>
                                        <Icon name="angle-right" size={30} color="#7f818e" />
                                    </TouchableOpacity>

                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Seller</Text>
                                    <View style={styles.SellerContainer}>
                                        <TouchableOpacity style={[styles.SingleSeller, this.state.sellerType === 'Individual' ? styles.active : '']} onPress={() => this.setState({ sellerType: 'Individual' })}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.sellerType === "Individual" ? '#fff' : '#000', textAlign: 'center', marginTop: 6 }}>Individual</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.SingleSeller, this.state.sellerType === 'Dealer' ? styles.active : '']} onPress={() => this.setState({ sellerType: 'Dealer' })}>
                                            <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: '#000', textAlign: "center", marginTop: 6 }}>Dealer</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Year</Text>
                                    {this.state.slider1Value == 0 ?
                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 5, marginBottom: 5, paddingLeft: 20 }}>Any Year</Text>
                                        :
                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 5, marginBottom: 5, paddingLeft: 20 }}>{this.state.slider1value}</Text>
                                    }

                                    {/* {/ implement slider here /} */}
                                    <View style={styles.SingleSliderMainContainer}>
                                        <MultiSlider
                                            values={[this.state.slider1value]}
                                            sliderLength={Devicewidth / 1.18}
                                            onValuesChangeStart={this.sliderOneValuesChangeStart}
                                            onValuesChange={this.sliderOneValuesChange}
                                            onValuesChangeFinish={this.sliderOneValuesChangeFinish}
                                            customMarker={CustomMarker}
                                            min={1990}
                                            max={2022}
                                            step={1}
                                            selectedStyle={{ backgroundColor: "#232427" }}
                                            snapped
                                        />
                                    </View>

                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Mileage</Text>
                                    {this.state.slider2value == 0 ?
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 5, marginBottom: 5, paddingLeft: 20 }}>{this.state.country == 'United States' ? ' miles' : ' km'}</Text>
                                    :
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 5, marginBottom: 5, paddingLeft: 20 }}>{this.state.slider2value} </Text>
                                    }
                                    {/* {/ implement slider here /} */}
                                    <View style={styles.SingleSliderMainContainer}>
                                        <MultiSlider
                                            values={[this.state.slider2value]}
                                            sliderLength={Devicewidth / 1.18}
                                            onValuesChangeStart={this.sliderTwoValuesChangeStart}
                                            onValuesChange={this.sliderTwoValuesChange}
                                            onValuesChangeFinish={this.sliderTwoValuesChangeFinish}
                                            customMarker={CustomMarker}
                                            min={1}
                                            max={200000}
                                            step={1}
                                            selectedStyle={{ backgroundColor: "#232427" }}
                                            snapped
                                        />
                                    </View>

                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Transmission</Text>
                                    <View style={styles.TransmissionContainer}>
                                        <TouchableOpacity style={[styles.SingleTransmission, this.state.TransMission === 'Manual' ? styles.active : '']} onPress={() => this.setState({ TransMission: 'Manual' })}>
                                            <TouchableOpacity style={styles.transmission} >
                                                <Image source={require("../../Assets/Manual.png")} style={{ height: "100%", width: "100%" }}></Image>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 13, color: this.state.TransMission === 'Manual' ? '#fff' : '#000', textAlign: 'center', }}>Manual</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.SingleTransmission, this.state.TransMission === 'Automatic' ? styles.active : '']} onPress={() => this.setState({ TransMission: 'Automatic' })}>
                                            <TouchableOpacity style={styles.transmission}  >
                                                <Image source={require("../../Assets/Automatic.png")} style={{ height: "95%", width: "70%" }}></Image>
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 13, color: this.state.TransMission === 'Automatic' ? '#fff' : '#000', textAlign: "center", }}>Automatic</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                                :
                                this.state.selectedProdCategory === 'Housing'
                                    ?
                                    <>
                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Type Of Listing</Text>
                                        <View style={styles.TransmissionContainer}>
                                            <TouchableOpacity style={[styles.SingleTransmission, this.state.TypeOfhousingListing === 'rent' ? styles.active : '']} onPress={() => this.setState({ TypeOfhousingListing: 'rent' })}>
                                                <TouchableOpacity style={{
                                                    height: Deviceheight / 34,
                                                    width: Devicewidth / 17, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                                                }} onPress={() => this.setState({ TypeOfhousingListing: 'rent' })}>
                                                    <Image source={require("../../Assets/Manual.png")} style={{ height: "80%", width: "80%" }}></Image>
                                                </TouchableOpacity>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.TypeOfhousingListing === 'rent' ? '#fff' : '#000', textAlign: 'center', }}>For Rent</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.SingleTransmission, this.state.TypeOfhousingListing === 'sell' ? styles.active : '']} onPress={() => this.setState({ TypeOfhousingListing: 'sell' })}>
                                                <TouchableOpacity style={{
                                                    height: Deviceheight / 36,
                                                    width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                                                }} onPress={() => this.setState({ TypeOfhousingListing: 'sell' })}>
                                                    <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                                                </TouchableOpacity>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.TypeOfhousingListing === 'sell' ? '#fff' : '#000', textAlign: "center", }}>For Sell</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>Type Of Property</Text>
                                        <View style={styles.TransmissionContainerProperty}>
                                            <TouchableOpacity style={[styles.SingleTransmission, this.state.TypeofhousingProperty === 'Appartment' ? styles.active : '']} onPress={() => this.setState({ TypeofhousingProperty: 'Appartment' })}>
                                                <View style={{
                                                    height: Deviceheight / 34,
                                                    width: Devicewidth / 17, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                                                }}>
                                                    <Image source={require("../../Assets/Manual.png")} style={{ height: "80%", width: "80%" }}></Image>
                                                </View>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.TypeofhousingProperty === 'Appartment' ? '#fff' : '#000', textAlign: 'center', }}>Appartment</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.SingleTransmission, this.state.TypeofhousingProperty === 'Room' ? styles.active : '']} onPress={() => this.setState({ TypeofhousingProperty: 'Room' })}>
                                                <TouchableOpacity style={{
                                                    height: Deviceheight / 36,
                                                    width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                                                }} onPress={() => this.setState({ TypeofhousingProperty: 'Room' })}>
                                                    <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                                                </TouchableOpacity>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.TypeofhousingProperty === 'Room' ? '#fff' : '#000', textAlign: "center", }}>Room</Text>
                                            </TouchableOpacity>


                                            <TouchableOpacity style={[styles.SingleTransmission, this.state.TypeofhousingProperty === 'House' ? styles.active : '']} onPress={() => this.setState({ TypeofhousingProperty: 'House' })}>
                                                <TouchableOpacity style={{
                                                    height: Deviceheight / 36,
                                                    width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                                                }} onPress={() => this.setState({ TypeofhousingProperty: 'House' })}>
                                                    <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                                                </TouchableOpacity>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.TypeofhousingProperty === 'House' ? '#fff' : '#000', textAlign: "center", }}>House</Text>
                                            </TouchableOpacity>

                                        </View>
                                        <View style={styles.TransmissionContainer}>


                                            <TouchableOpacity style={[styles.SingleTransmission, this.state.TypeofhousingProperty === 'Commercial' ? styles.active : '']} onPress={() => this.setState({ TypeofhousingProperty: 'Commercial' })}>
                                                <TouchableOpacity style={{
                                                    height: Deviceheight / 36,
                                                    width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                                                }} onPress={() => this.setState({ TypeofhousingProperty: 'Commercial' })}>
                                                    <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                                                </TouchableOpacity>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.TypeofhousingProperty === 'Commercial' ? '#fff' : '#000', textAlign: "center", }}>Commercial</Text>
                                            </TouchableOpacity>


                                            <TouchableOpacity style={[styles.SingleTransmission, this.state.TypeofhousingProperty === 'Other' ? styles.active : '']} onPress={() => this.setState({ TypeofhousingProperty: 'Other' })}>
                                                <TouchableOpacity style={{
                                                    height: Deviceheight / 36,
                                                    width: Devicewidth / 18, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 5
                                                }} onPress={() => this.setState({ TypeofhousingProperty: 'Other' })}>
                                                    <Image source={require("../../Assets/Automatic.png")} style={{ height: "90%", width: "60%" }}></Image>
                                                </TouchableOpacity>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.TypeofhousingProperty === 'Other' ? '#fff' : '#000', textAlign: "center", }}>Other</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>No Of Bedrooms</Text>
                                        <View style={styles.TransmissionsmallContainerBedroom}>
                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBedrooms === 1 ? styles.active : '']} onPress={() => this.setState({ noofBedrooms: 1 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBedrooms === 1 ? '#fff' : '#000', textAlign: "center", }}>1</Text>
                                            </TouchableOpacity>


                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBedrooms === 2 ? styles.active : '']} onPress={() => this.setState({ noofBedrooms: 2 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBedrooms === 2 ? '#fff' : '#000', textAlign: "center", }}>2</Text>
                                            </TouchableOpacity>


                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBedrooms === 3 ? styles.active : '']} onPress={() => this.setState({ noofBedrooms: 3 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBedrooms === 3 ? '#fff' : '#000', textAlign: "center", }}>3</Text>
                                            </TouchableOpacity>


                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBedrooms === 4 ? styles.active : '']} onPress={() => this.setState({ noofBedrooms: 4 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBedrooms === 4 ? '#fff' : '#000', textAlign: "center", }}>4</Text>
                                            </TouchableOpacity>

                                        </View>

                                        <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 16, color: '#000', marginTop: 20, marginBottom: 5, paddingLeft: 15 }}>No Of Bathrooms</Text>
                                        <View style={styles.TransmissionsmallContainerBathroom}>

                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBathRooms === 1 ? styles.active : '']} onPress={() => this.setState({ noofBathRooms: 1 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBathRooms === 1 ? '#fff' : '#000', textAlign: "center", }}>1</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBathRooms === 1.5 ? styles.active : '']} onPress={() => this.setState({ noofBathRooms: 1.5 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBathRooms === 1.5 ? '#fff' : '#000', textAlign: "center", }}>1.5</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBathRooms === 2 ? styles.active : '']} onPress={() => this.setState({ noofBathRooms: 2 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBathRooms === 2 ? '#fff' : '#000', textAlign: "center", }}>2</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBathRooms === 2.5 ? styles.active : '']} onPress={() => this.setState({ noofBathRooms: 2.5 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBathRooms === 2.5 ? '#fff' : '#000', textAlign: "center", }}>2.5</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBathRooms === 3 ? styles.active : '']} onPress={() => this.setState({ noofBathRooms: 3 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBathRooms === 3 ? '#fff' : '#000', textAlign: "center", }}>3</Text>
                                            </TouchableOpacity>

                                        </View>
                                        <View style={styles.TransmissionsmallContainer}>
                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBathRooms === 3.5 ? styles.active : '']} onPress={() => this.setState({ noofBathRooms: 3.5 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.sellerType === "Individual" ? '#fff' : '#000', textAlign: "center", }}>3.5</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.SinglesmallTransmission, this.state.noofBathRooms === 4 ? styles.active : '']} onPress={() => this.setState({ noofBathRooms: 4 })}>
                                                <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 13, color: this.state.noofBathRooms === 4 ? '#fff' : '#000', textAlign: "center", }}>4+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                    :
                                    null
                        }
                        {
                            this.state.selectedProdCategory === 'Jobs' &&
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder={'Type Of Job'}
                                        placeholderTextColor={'#000'}
                                        style={styles.Input}
                                        onChangeText={(val) => this.setState({
                                            Jobtype: val
                                        })}
                                        value={this.state.Jobtype}
                                    >
                                    </TextInput>
                                </View>
                        }
                        {
                            this.state.selectedProdCategory != 'Jobs' && this.state.selectedProdCategory != 'Freebies' && this.state.selectedProdCategory != 'Services' &&
                            <View style={styles.PriceinputContainer}>
                                {this.state.Productprice != '' ?
                                                     <KeyboardAvoidingView
                                                     behavior="position"
                                                     keyboardVerticalOffset="100"
                                                     enabled>
                                    <Text style={{ fontFamily:"Roboto-Bold" , fontSize: 15, color: "#000", textAlign: "left", alignSelf: "center" }}>{this.state.currency == "INR" ? "???" : this.state.currency == "USD" ? "$" : `${this.state.currency}`} </Text></KeyboardAvoidingView> 
                                    :
                                    null
                                }
                                <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset="100"
        enabled>
                                <TextInput autoFocus={true} 
                                    placeholder={`Price ( ${this.state.currency == "INR" ? "???" : this.state.currency == "USD" ? "$" : `${this.state.currency}`})`}
                                    placeholderTextColor={'#000'}
                                    style={this.state.Productprice == '' ? styles.PriceInput : styles.PriceInputSelect}
                                    keyboardType={'numeric'}
                                    onChangeText={(val) => this.setState({
                                        Productprice: val
                                    })}
                                    value={this.state.Productprice.toString()}
                                >
                                </TextInput>
                                </KeyboardAvoidingView> 

                            </View>
                        }

                        <View style={styles.Address}>
                            <TouchableOpacity onPress={() => this.handelMap()} style={{ flexDirection: "row", width: Devicewidth / 1.2, height: Deviceheight / 20, alignItems: "center", alignSelf: "center", backgroundColor: "#fff", borderRadius: 10, elevation: 2 }}>
                                <View style={styles.SearchIcon} >
                                    <Image source={require("../../Assets/SearchIcon.png")} style={{ height: "50%", width: "50%" }}></Image>
                                </View>
                                <Text style={styles.SearchContainer} numberOfLines={1}>{this.state.sellerAddress.length < 35 ? `${this.state.sellerAddress}`  : `${this.state.sellerAddress.substring(0, 35)}...`}</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.selectedProdCategory === 'Jobs'
                                ?
                                <View style={styles.ProductDescContainer}>
                                    <TextInput
                                        maxLength={1500}
                                        placeholder={'Job description'}
                                        placeholderTextColor={'#000'}
                                        style={styles.ProductDesc}
                                        onChangeText={(val) => this.setState({
                                            JobDescription: val,
                                            ProductDescriptionLength: val.length
                                        })}
                                        value={this.state.JobDescription}
                                    >
                                    </TextInput>
                                    <View style={{
                                        height: Deviceheight / 28, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", backgroundColor: "#b2b2b2", padding: 2, position: 'absolute', right: 10, bottom: 10, borderRadius: 2
                                    }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#fff", fontSize: 18, textAlign: "center", }}>{this.state.ProductDescriptionLength}/1500</Text>
                                    </View>
                                </View>
                                :
                                <View style={styles.ProductDescContainer}>
                                    <TextInput
                                        maxLength={1500}
                                        placeholder={ this.state.selectedProdCategory != 'Services'?'Product description':'Service description'}
                                        placeholderTextColor={'#000'}
                                        style={styles.ProductDesc}
                                        onChangeText={(val) => this.setState({
                                            ProductDescription: val,
                                            ProductDescriptionLength: val.length
                                        })}
                                        value={this.state.ProductDescription}
                                    >
                                    </TextInput>
                                    <View style={{
                                        height: Deviceheight / 28, alignItems: "center", justifyContent: "center", alignSelf: "flex-end", backgroundColor: "#b2b2b2", padding: 2, position: 'absolute', right: 10, bottom: 10, borderRadius: 2
                                    }}>
                                        <Text style={{ fontFamily:"Roboto-Bold" , color: "#fff", fontSize: 18, textAlign: "center", }}>{this.state.ProductDescriptionLength}/1500</Text>
                                    </View>
                                </View>
                        }
                        {
                            this.state.selectedProdCategory == "Jobs" &&
                            (
                                this.state.coverImage == '' || this.state.Jobname == '' || this.state.Jobtype == '' || this.state.sellerAddress == '' || this.state.JobDescription == '' ?
                                <View style={styles.btnContainer} >
                                    <Text style={styles.btnText} >{this.props.route.params.productId !== undefined ? 'Update' : 'Submit'}</Text>
                                </View>
                                :
                                <TouchableOpacity style={styles.btnContainer1} onPress={this.submitProd} >
                                    <Text style={styles.btnText} >{this.props.route.params.productId !== undefined ? 'Update' : 'Submit'}</Text>
                                </TouchableOpacity>
                            )
                        }
                        {
                            this.state.selectedProdCategory != "Jobs" && this.state.selectedProdCategory != "Freebies" && this.state.selectedProdCategory != "Services" &&
                            (
                                this.state.coverImage == '' || this.state.Productname == '' || this.state.Productprice == '' || this.state.sellerAddress == '' || this.state.ProductDescription == '' ?
                                <View style={styles.btnContainer} >
                                    <Text style={styles.btnText} >{this.props.route.params.productId !== undefined ? 'Update' : 'Submit'}</Text>
                                </View>
                                :
                                <TouchableOpacity style={styles.btnContainer1} onPress={this.submitProd} >
                                    <Text style={styles.btnText} >{this.props.route.params.productId !== undefined ? 'Update' : 'Submit'}</Text>
                                </TouchableOpacity>
                            )
                        }
                        {
                            this.state.selectedProdCategory == "Freebies" &&
                            (
                                this.state.coverImage == '' || this.state.Productname == '' || this.state.sellerAddress == '' || this.state.ProductDescription == '' ?
                                <View style={styles.btnContainer} >
                                    <Text style={styles.btnText} >{this.props.route.params.productId !== undefined ? 'Update' : 'Submit'}</Text>
                                </View>
                                :
                                <TouchableOpacity style={styles.btnContainer1} onPress={this.submitProd} >
                                    <Text style={styles.btnText} >{this.props.route.params.productId !== undefined ? 'Update' : 'Submit'}</Text>
                                </TouchableOpacity>
                            )
                        }

{
                            this.state.selectedProdCategory == "Services" &&
                            (
                                this.state.Productname == '' || this.state.sellerAddress == '' || this.state.ProductDescription == '' ?
                                <View style={styles.btnContainer} >
                                    <Text style={styles.btnText} >{this.props.route.params.productId !== undefined ? 'Update' : 'Submit'}</Text>
                                </View>
                                :
                                <TouchableOpacity style={styles.btnContainer1} onPress={this.submitProd} >
                                    <Text style={styles.btnText} >{this.props.route.params.productId !== undefined ? 'Update' : 'Submit'}</Text>
                                </TouchableOpacity>
                            )
                        }

                    </ScrollView>
                    </>
                }
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    Container: {

        backgroundColor: '#FFF'
    },
    ProfileImageMainContainer: {
        // marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: Deviceheight / 10,
        width: Devicewidth / 5,
        alignSelf: 'flex-start',
        // marginLeft: 20,
        borderColor: '#ffa500',
        borderWidth: 0.6,
        // backgroundColor:'green'
    },
    AdditionalImageMainContainer: {
        // marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: Deviceheight / 10,
        width: Devicewidth / 5,
        alignSelf: 'flex-start',
        borderColor: '#d9d9d9',
        borderWidth: 0.6,
        marginRight: 15
        // backgroundColor:'green'
    },
    Plus: {
        color: "#b3b3b3",
        fontSize: 40,
        textAlign: 'center',
    },
    FlatListContainer: {
        width: Devicewidth / 1.3,
        height: Deviceheight / 10,
        alignItems: 'center',
        // marginBottom: 10,
        paddingLeft: 12,
        // backgroundColor: 'grey'
    },
    inputContainer: {
        marginTop: 20,
        // backgroundColor: '#f5f5f5',
        width: Devicewidth / 1.02,
        height: Deviceheight / 13,
        justifyContent: 'center',
        borderRadius: 10
    },
    Input: {
        width: Devicewidth / 1.10,
        height: Deviceheight / 13,
        fontSize: 15,
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        borderRadius: 10,
        paddingLeft: 20,
    },
    PriceinputContainer: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#fbfbfb',
        width: Devicewidth / 1.10,
        height: Deviceheight / 13,
        justifyContent: 'center',
        borderRadius: 10,
        flexDirection: "row"
    },
    PriceInput: {
        width: Devicewidth / 1.10,
        height: Deviceheight / 13,
        fontSize: 15,
        backgroundColor: '#fbfbfb',
        alignSelf: 'flex-start',
        borderRadius: 10,
        paddingLeft: 20,
    },
    PriceInputSelect: {
        width: Devicewidth / 1.3,
        height: Deviceheight / 13,
        fontSize: 15,
        backgroundColor: '#fbfbfb',
        alignSelf: 'flex-start',
        borderRadius: 10,
        paddingLeft: 10,
    },
    ProductDescContainer: {
        marginTop: 20,
        backgroundColor: '#fff',
        width: Devicewidth,
        height: Deviceheight / 8,
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 10
    },
    ProductDesc: {
        width: Devicewidth / 1.10,
        height: Deviceheight / 8,
        fontSize: 15,
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        borderRadius: 10,
        paddingLeft: 20,
    },
    Address: {
        width: Devicewidth / 1.10,
        height: Deviceheight / 13,
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    CatagoryContainer: {
        // borderWidth: 1,
        width: Devicewidth / 1.10,
        // height: Deviceheight / 13,
        paddingVertical: 10,
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        borderRadius: 10,
        paddingLeft: 20,
        paddingTop: 5
    },
    DescContainer: {
        width: Devicewidth / 1.10,
        height: Deviceheight / 22,
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        borderRadius: 10,
        paddingLeft: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 15,
        marginTop: 20
    },
    SellerContainer: {
        width: Devicewidth / 2,
        height: Deviceheight / 24,
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderRadius: 10,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 15,
        marginTop: 5
    },
    SingleSeller: {
        width: Devicewidth / 5,
        height: Deviceheight / 24,
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    SingleSliderMainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: Devicewidth / 1.15,
    },
    TransmissionContainer: {
        width: Devicewidth / 2,
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
    SingleTransmission: {
        width: Devicewidth / 5,
        height: Deviceheight / 10,
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        borderRadius: 360,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        margin: 5

    },
    SinglesmallTransmission: {
        width: Devicewidth / 9,
        height: Deviceheight / 17,
        backgroundColor: '#fbfbfb',
        alignSelf: 'center',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        margin: 5
    },
    SearchContainer: {
        borderRadius: 5,
        width: Devicewidth / 1.2,
        marginLeft: 15,
        alignSelf: 'center',
        justifyContent: "flex-end",
        fontSize: 14,
        overflow: 'hidden'
    },
    SearchIcon: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: Deviceheight / 24,
        width: Devicewidth / 12,
    },
    btnContainer: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 18,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#ffcdac",
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
        alignSelf: 'center'
    },
    btnContainer1: {
        width: Devicewidth / 1.05,
        height: Deviceheight / 18,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#ff6801",
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
        alignSelf: 'center'
    },
    btnText: {
        fontSize: 14,
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    },
    active: {
        backgroundColor: '#bdbdbd',
        color: 'white'
    },
    transmission: {
        height: Deviceheight / 34,
        width: Devicewidth / 17,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 5
    },
    HeaderContainer: {
        alignSelf: 'center',
        width: Devicewidth,
        height: Deviceheight / 14,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        elevation: 1
    },
    HeadrIconContainer: {
        width: Devicewidth,
        height: Deviceheight / 12,
        // justifyContent: "space-between",
        flexDirection: "row",
        alignItems: 'center'
    },
})

const mapStateToProps = state => {
    return {
        savedLocation: state.savedLocation,
        sliderDistance: state.sliderDistance
    }
}

export default connect(mapStateToProps, null)(ListingDetails);
