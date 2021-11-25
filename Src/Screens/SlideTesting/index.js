import React, { Component } from 'react'
import { AppRegistry, Animated, Easing, View, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Text } from 'react-native'
import ImageView from "react-native-image-viewing";

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
const DISMISS_MODAL_THRESHOLD = 150

const images = [
  {
    uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
  },
  {
    uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
  },
  {
    uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
  },
];

export default class SlideTesting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageVisible:true,
    }
  }
  state = this.state;
    //ZOOM VIEW

    setIsVisible = () => {
      this.setState({
        imageVisible:false
      })
    }
  
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginTop: 40,
                }}
            >
                <ImageView
                  images={images}
                  imageIndex={0}
                  visible={this.state.imageVisible}
                  onRequestClose={() => this.setIsVisible()}
                />
            </View>
        )
    }
}




