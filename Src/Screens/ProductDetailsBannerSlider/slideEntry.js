import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './slideEntryStyle';

export const SliderEntry = props => {
  const { imageName, parallax, parallaxProps,index } = props;
  const onPress = async (index) => {
    props.getItemIt(index)
  }
  return (

    <TouchableOpacity
      activeOpacity={1}
      style={styles.slideInnerContainer}
      onPress={() => onPress(index)}
    >
      <View style={styles.shadow} />
      <View style={styles.imageContainer}>
        <ParallaxImage
          source={{ uri: imageName }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.35}
          showSpinner={true}
          spinnerColor={'rgba(0, 0, 0, 0.25)'}
          {...parallaxProps}
        />
        <View style={styles.radiusMask} />
      </View>

    </TouchableOpacity>

  );
}

export const SliderEntry1 = props => {
  const { imageName, title, parallax, parallaxProps, onClick } = props;

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.slideInnerContainer}
        onPress={() => onPress(index)}
      >
        <View style={styles.shadow} />
        <View style={styles.imageContainer}>
          <ParallaxImage
           source={{ uri: imageName }}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.35}
            showSpinner={true}
            spinnerColor={'rgba(0, 0, 0, 0.25)'}
            {...parallaxProps}
          />
          <View style={styles.radiusMask} />
        </View>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}
