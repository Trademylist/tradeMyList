import { StyleSheet, } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: 'red',
    background2: 'red'
};

export default StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,

    },
    scrollview: {
        flex: 1
    },
    exampleContainer: {
        // paddingVertical:2
        paddingTop:10,
        justifyContent:'center',
        // backgroundColor:"blue"
    },
    slider: {
        overflow: 'visible', // for custom animations
    },
    sliderContentContainer: {
        // paddingVertical: 10 // for custom animation
        // height:'100%',
        // width:"100%",
        // resizeMode:'contain',
        // backgroundColor:"grey"
    },
    paginationContainer: {
        height:30,
        width:20,
        alignItems:'center',
        alignSelf:"center",
        position:'absolute',
        bottom:-40,
        // backgroundColor:"green"
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        padding: 2,
        backgroundColor: 'rgba(128, 128, 128, 0.92)'
    },
    container1: {
        flex: 1,
        // paddingTop: 56,
        backgroundColor: '#ffffff',

    },

});
