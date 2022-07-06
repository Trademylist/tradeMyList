import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ProductList from '../Screens/ProductList';
import CommercialList from '../Screens/Commercial';
import Chatter from "../Screens/Chatter"
import MyListing from "../Screens/MyListing"
import MyListingMenu from "../Screens/MyListingMenu"
import AllReview from "../Screens/AllReview"
import BlockList from "../Screens/BlockList"
import NotificationSettings from "../Screens/NotificationSettings"
import EditEmail from "../Screens/EditEmail"
import ChangePassword from "../Screens/ChangePassword"
import TermsCondition from "../Screens/Terms&Condition"
import PrivacyPolicy from "../Screens/PrivacyPolicy"
import Help from "../Screens/Help"
import HelpOption from "../Screens/HelpOption"
import SubmitRequest from "../Screens/SubmitRequest"
import ProductDetails from "../Screens/ProductDetails"
import CatProductList from '../Screens/CatProductList';
import Logout from '../Screens/Logout';
import listingDetails from '../Screens/ListingDetails'
import commerciallistingDetails from '../Screens/CommercialListingDetails'
import EditName from '../Screens/EditName'
import ChatDetails from '../Screens/ChatDetails'
import SellerDetails from '../Screens/SellerDetails'
import SelectBuyer from "../Screens/SelectBuyer"
import ReviewExperience from "../Screens/ReviewExperience"
import SlideTesting from '../Screens/SlideTesting';
import Menu from "../Screens/Menu"
const Stack = createStackNavigator();


export default class AuthNavigator extends Component {
    render() {
        return (
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                {/* <Stack.Screen name="slidetest" component={SlideTesting} initialRouteName="slidetest"  />
                <Stack.Screen name="productList" component={ProductList}   /> */}
                <Stack.Screen name="productList" component={ProductList} initialRouteName="productList"  />
                <Stack.Screen name="commercialList" component={CommercialList} />
                <Stack.Screen name="chatter" component={Chatter} />
                <Stack.Screen name="myListing" component={MyListing} />
                <Stack.Screen name="myListingMenu" component={MyListingMenu} />
                <Stack.Screen name="allReview" component={AllReview} />
                <Stack.Screen name="blockList" component={BlockList} />
                <Stack.Screen name="notificationSettings" component={NotificationSettings} />
                <Stack.Screen name="editEmail" component={EditEmail} />
                <Stack.Screen name="changePassword" component={ChangePassword} />
                <Stack.Screen name="termsCondition" component={TermsCondition} />
                <Stack.Screen name="privacyPolicy" component={PrivacyPolicy} />
                <Stack.Screen name="help" component={Help} />
                <Stack.Screen name="helpOption" component={HelpOption} />
                <Stack.Screen name="submitRequest" component={SubmitRequest} />
                <Stack.Screen name="productDetails" component={ProductDetails} />
                <Stack.Screen name="catproductList" component={CatProductList} />
                <Stack.Screen name="logout" component={Logout} />
                <Stack.Screen name="listingDetails" component={listingDetails} />
                <Stack.Screen name="commerciallistingDetails" component={commerciallistingDetails} />
                <Stack.Screen name="editName" component={EditName} />
                <Stack.Screen name="chatDetails" component={ChatDetails} />
                <Stack.Screen name="sellerDetails" component={SellerDetails} />
                <Stack.Screen name="selectBuyer" component={SelectBuyer} />
                <Stack.Screen name="reviewExperience" component={ReviewExperience} />
                <Stack.Screen name="menu" component={Menu} />
            </Stack.Navigator>
        );
    }
}