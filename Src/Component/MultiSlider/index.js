import React from 'react';
import { StyleSheet, Image,View,Text } from 'react-native';

class CustomMarker extends React.Component {
  render() {
    return (
      <View style={styles.Container}>
         <View style={styles.subContainer}/> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor:"#fff",
    width:20,
    height:20,
   borderRadius:10,
   alignContent:"center",
   alignItems:"center",
   justifyContent:"center"
  },
  subContainer:{

    backgroundColor:"#232428",
    width:18,
    height:18,
   borderRadius:8,
   alignContent:"center",
   alignItems:"center"
  }
});

export default CustomMarker;