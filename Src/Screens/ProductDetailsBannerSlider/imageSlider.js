import React,{ Component } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text
} from 'react-native';
import Carousel, { Pagination ,ParallaxImage} from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './slideEntryStyle'
import { SliderEntry } from './slideEntry';
import styles from './indexStyle';
import { ENTRIES1 } from './entries'
import styles1 from './slideEntryStyle';

const SLIDER_1_FIRST_ITEM = 0;


export default class ImageSlider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      BannerResponse:{}
    }
  }
  state = this.state;
 

  componentDidMount() {
    // this.showBannerImage()
  }

//    async showBannerImage() {

//     //api call...................

//     connectionrequest().then(result => {
//       var self = this;
//        getApiforWithoutHeader('wp-json/wl/v1/home_banners')
//         .then(function (response) {
//           // handle success
//           //console.log("response==>"+JSON.stringify(response.data));
//           self.setState({
//             BannerResponse:response.data
//           })
//         })
//         .catch(function (error) {
//           // handle error
//           //console.log(error);
//         })

//     }).catch(error => {
//       //console.log("error hapened-->" + error)
//     //  return(
//     //    <View>
//     //      <Text>No Internet Connection</Text> 
//     //    </View>
//     //  )
//     });
//   }
  // anotherItem = async () => {
  //   alert('agerPage')
  // }

  _renderItemWithParallax({ item, index }, parallaxProps,props) {

    return (
      // <SliderEntry
      //   imageName={item.illustration}
      //   title={item.title}
      //   parallax={true}
      //   parallaxProps={parallaxProps}
      //   index={index}
      //   getItemIt = {(index) => getItem(index)}
      // >
      //   <TouchableOpacity onPress={//console.log("singleitem log press")}/>
      //   </SliderEntry>
      <TouchableOpacity
      activeOpacity={1}
      style={styles1.slideInnerContainer}
     onPress={()=>this.calling()}
    >
      <View style={styles1.shadow} />
      <View style={styles1.imageContainer}>
        <Image
          source={{ uri: item.illustration }}
          containerStyle={styles1.imageContainer}
          style={styles1.image}
          // parallaxFactor={0.35}
          // showSpinner={true}
          // spinnerColor={'rgba(0, 0, 0, 0.25)'}
          // {...parallaxProps}
        />
        <View style={styles1.radiusMask} />
      </View>

    </TouchableOpacity>
    );
  }
  calling(){
    //console.log("calling fnc")
  }
  render() {
    
    const { slider1ActiveSlide } = this.state
    return (
      <View style={styles.exampleContainer} >
        <Carousel
          ref={c => this._slider1Ref = c}
          data={this.props.imageData}
          renderItem={this._renderItemWithParallax}
          // getAnother={this.calling}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          activeSlideAlignment={'center'}
          inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={this.props.autoslide === true ? true : false}
          loopClonesPerSide={2}
          autoplay={this.props.autoslide === true ? true : false}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />
          <Pagination
            dotsLength={this.props.imageData.length}
            activeDotIndex={slider1ActiveSlide}
            containerStyle={styles.paginationContainer}
            dotColor={'#000'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={"#E1E1E1"}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.8}
            carouselRef={this._slider1Ref}
            tappableDots={!!this._slider1Ref}
            activeAnimationType={'spring'}

          />




      </View>
    );
  }

}
