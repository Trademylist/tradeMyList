import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default class Loading extends Component {
    render(){
        return(
            <>
                <View style={styles.Container}>
                    <ActivityIndicator color={'#383ebd'} size={'large'}/>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }
})