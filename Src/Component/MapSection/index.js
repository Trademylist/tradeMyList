import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
const { width: WIDTH } = Dimensions.get('window');
const Devicewidth = Dimensions.get('window').width;
const Deviceheight = Dimensions.get('window').height;
const ASPECT_RATIO = Devicewidth / Deviceheight;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const MapSection = (props) => {
    return(
        <MapView
        style={{ height: "100%", width: "100%" }}
        showsMyLocationButton={false}
        showsUserLocation={false}
        minZoomLevel={10}
        initialRegion={{
            latitude: parseFloat(props.lat),
            longitude: parseFloat(props.lng),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }}
    >
        <Marker
            coordinate={{
                latitude: props.lat ? props.lat : 22.841202,
                longitude: props.lng ? props.lng : 88.35488389999999,
            }}
        />
    </MapView>
    )
}

export default MapSection;