import { Injectable } from '@angular/core';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { BehaviorSubject, Subject, Observable} from 'rxjs';
//import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private fullAddress = new Subject<any>();
  private infoGeoLat = new BehaviorSubject(0);
  currentLat = this.infoGeoLat.asObservable();
  private infoGeoLong = new BehaviorSubject(0);
  currentLong = this.infoGeoLong.asObservable();
  
  private localityChanges = new BehaviorSubject(localStorage.getItem("locality"));
  currentLocality = this.localityChanges.asObservable();

  //select product address 

  private selectProductAddress = new BehaviorSubject(null);
  public onSelectProductAddress = this.selectProductAddress.asObservable();

///

/* when click on select map in header send the current address to location component */

    public selectedLocationAddress: Subject<any> = new Subject<any>();
    public onSelectedLocationAddress: Observable<any> = this.selectedLocationAddress.asObservable();


/* when click on select map in header send the current address to location component */

//When show thepayment dialog send the product data
public selectedProductForSellFaster: Subject<any> = new Subject<any>();
public onSelectedProductForSellFaster: Observable<any> = this.selectedProductForSellFaster.asObservable();

// On successBost/reacttivate reload the page
public paymentCompletedForSellFaster: Subject<any> = new Subject<any>();
public onPaymentCompletedForSellFaster: Observable<any> = this.paymentCompletedForSellFaster.asObservable();


public headerSearchData: Subject<any> = new Subject<any>();
public onHeaderSearch: Observable<any> = this.headerSearchData.asObservable();

//When click go button this will set the current location
public setCurrentLocation: Subject<any> = new Subject<any>();
public onSetCurrentLocation: Observable<any> = this.setCurrentLocation.asObservable();

/* */

/* when upload profile picture it will show in header too*/

public updateProfilePicture: Subject<any> = new Subject<any>();
public onUpdateProfilePicture: Observable<any> = this.updateProfilePicture.asObservable();


/* */


/* */
  
  //Geocoder configuration
  // geoencoderOptions: NativeGeocoderOptions = {
  //   useLocale: true,
  //   maxResults: 5
  // };

  constructor(
    // private geolocation: Geolocation,
    // private nativeGeocoder: NativeGeocoder,
    // private platform: Platform
  ) { }

  /** Function is used to return latitude and longitude
   */
  getLatLong() {
    return ({ latitude: localStorage.getItem("latitude"), longitude: localStorage.getItem("longitude") });
  }

  setProductAddress(productData){
    this.selectProductAddress.next(productData)
  }
  /** Function is used to set latitude and longitude
   * @param  {} lat
   * @param  {} lng
   */
  setLatLong(lat, lng) {
    this.infoGeoLat.next(lat);
    this.infoGeoLong.next(lng);
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lng);
  }

  /** Function is used to get product locality
   */
  getLocality() {
    return localStorage.getItem("locality")
  }

  /** Function is used to set product locality
   * @param  {string} locality
   */
  setLocality(locality: string) {
    localStorage.setItem("locality", locality);
    this.localityChanges.next(locality)
  }

  /** Function is used to get product country
   */
  getCountry() {
    return localStorage.getItem("country")
  }

  /** Function is used to set product country
   * @param  {string} country
   */
  setCountry(country: string) {
    localStorage.setItem("country", country);
  }

  /** Function is used to set product address
   * @param  {string} address
   */
  setAddress(address: string) {
    localStorage.setItem("address", address);
  }

  /** Function is used to display product latitude and longitude
   * @param  {} lattitude
   * @param  {} longitude
   */
  getAddressFromCoords(lattitude, longitude) { }

  /** Function is used to get current coordinates of device
   */
  getGeolocation() {
    // this.geolocation.getCurrentPosition({ enableHighAccuracy: false }).then((resp) => {
    //   this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
    // }).catch((error) => { });
  }

  /** Function is used for geocoder method to fetch address from coordinates passed as arguments
   * @param  {} latitude
   * @param  {} longitude
   */
  getGeoencoder(latitude, longitude) {
    // this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
    //   .then((result: NativeGeocoderResult[]) => {
    //     this.setLatLong(latitude, longitude);
    //     this.setLocality(result[0].locality);
    //     this.setCountry(result[0].countryName);
    //     this.setAddress(result[0].postalCode + ', ' + result[0].locality + ', ' + result[0].administrativeArea + ', ' + result[0].countryName);
    //     // this.fullAddress.next(this.generateAddress(result[0]));
    //   });
  }

  /** Function is called to return Comma saperated address
   * @param  {} addressObj
   */
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    this.setAddress(address.slice(0, -2));
    return address.slice(0, -2);
  }
  /** Function is used to get postal code from latitude and longitude to set along with address
   * @param  {number} latitude
   * @param  {number} longitude
   * @returns Promise
   */
  getPostalCode(latitude: number, longitude: number): Promise<any> {
   // if (this.platform.is('cordova')) {
      return new Promise(resolve => {
        // this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
        //   .then((result: NativeGeocoderResult[]) => {
        //     resolve(result[0].postalCode);
        //   });
      });
    //}
  }
  //Start location update watch
  // watchLocation() {
  //   this.isWatching = true;
  //   this.watchLocationUpdates = this.geolocation.watchPosition();
  //   this.watchLocationUpdates.subscribe((resp) => {
  //     this.geoLatitude = resp.coords.latitude;
  //     this.geoLongitude = resp.coords.longitude;
  //     this.getGeoencoder(this.geoLatitude, this.geoLongitude);
  //   });
  // }

  //Stop location update watch
  // stopLocationWatch() {
  //   this.isWatching = false;
  //   this.watchLocationUpdates.unsubscribe();
  // }

}
