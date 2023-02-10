import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Location } from '@angular/common';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ApiService } from 'src/app/services/api-service/api.service';
import { NetworkService } from 'src/app/services/geo-service/network.service';
declare var $: any;

//const steps = [1609, 8046, 16093, 32186, 80467, 160934, 321869, 804672];

const steps = [1, 5, 10, 20, 50, 100, 200, 500];
const zoomLevels = [13, 11, 10, 9, 8, 7, 6, 4];

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})


export class LocationComponent implements OnInit {
  @Input() locationReason: string;
  action = "setUserLocation";
  title: string = 'AGM project';
  latitude: number=0.00;
  longitude: number=0.00;
  zoom: number = 4;
  userAddress: string;
  selectedRadius: number = 500;
  selectedRadiusCircle: number = Math.round((500 * 1.60934)*1000);
  customSteps: number;
  private geoCoder;
  fillColor = 'red';
  exradius: number = 7;
  initialRadius: number = 500;
  // locationReason: string;
  distanceUnit: string;
  country: string;
  locality: string;
  userCurrentAddress: string = "";
  isPlaceChanged = false;
  wantToSetCurrentLocation = false;
  @ViewChild('searchAddress')
  public searchElementRef: ElementRef;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public _location: Location,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private networkService: NetworkService
  ) {

  }


  ngOnInit() {
    this.networkService.onSelectedLocationAddress.subscribe((action) => {
      this.action = action;
      if (localStorage.getItem("currentAddress") != null) {
        this.userCurrentAddress = localStorage.getItem("currentAddress");
      }
      this.userAddress = localStorage.getItem("address");
      this.latitude = parseFloat(localStorage.getItem("latitude"));
      this.longitude = parseFloat(localStorage.getItem("longitude"));

      if (this.latitude != null && this.latitude != undefined && this.latitude.toString() != '') {
        this.latitude = parseFloat(localStorage.getItem("latitude"));
        this.longitude = parseFloat(localStorage.getItem("longitude"));
        this.exradius = steps.indexOf(parseInt(localStorage.getItem("radius")))
        this.selectedRadius = steps[this.exradius]
        this.getAddress(this.latitude, this.longitude);
      }
    });

    this.ngAfterContentInit1();
  }

  // watchSlider($event) {
  //   this.zoom = zoomLevels[$event.target.value];
  //   this.customSteps = steps[this.exradius];
  //   this.selectedRadiusCircle = Math.round((this.customSteps * 1.60934)*1000);
  //   this.selectedRadius = this.customSteps;
  // }


  btnSearchCategory(getValue) {}

  reloadMap() {
    this.ngAfterContentInit1();
    if (localStorage.getItem("locality") != null) {
      this.locality = localStorage.getItem("locality");
    }
  }
  async ngAfterContentInit1() {
    // this.selectedRadius = this.selectedRadius;
    this.customSteps = steps[this.exradius];
    console.log("this.customSteps init===",this.customSteps)
    try {
      //load Places Autocomplete
      await this.mapsAPILoader.load().then(() => {
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder;
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
        autocomplete.addListener("place_changed", () => {
          this.isPlaceChanged = true;
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            //set latitude, longitude and zoom
            this.latitude = parseFloat(place.geometry.location.lat().toString());
            this.longitude = parseFloat(place.geometry.location.lng().toString());
            //this.zoom = 12;
            this.getAddress(this.latitude, this.longitude);
          });
        });
        let userDetails = JSON.parse(localStorage.getItem('userDetails'));
        if (userDetails != null && userDetails.distance_unit) {
          this.distanceUnit = userDetails.distance_unit == "Miles" ? "miles" : "km";
        } else {
          this.distanceUnit = "miles"
        }
      });
    } catch (e) {
      console.log("Error:-", e)
    }
  }
  // Get Current Location Coordinates
  private async setCurrentLocation() {
    try {
      if ('geolocation' in navigator) {
        await navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = parseFloat(position.coords.latitude.toString());
          this.longitude = parseFloat(position.coords.longitude.toString());
          // this.zoom = 8;
          this.getAddress(this.latitude, this.longitude, 'currentLocation');
        });
      }
    } catch (e) {
      console.log("Error:-", e)
    }
  }


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  async getAddress(latitude, longitude, action = "changedLocation") {
    await this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      this.isPlaceChanged = false;
      if (status === 'OK') {
        if (results[0]) {
          console.log(results);
          //this.zoom = 12;
          this.userAddress = results[0].formatted_address;
          this.getCountry(results[0].address_components);
          this.getLocality(results[0].address_components);

          /* When locality not set then we assume that user want to set 
          current location or first time load the page
          and will set current location */ 
          if (localStorage.getItem("locality") == null || this.wantToSetCurrentLocation) {
            this.wantToSetCurrentLocation=false;
            //localStorage.setItem("currentAddress", this.userAddress); //Important this value never should update anywhere else
            this.userCurrentAddress = this.userAddress;
            this.setLocation();
          }

          if (action == 'currentLocation') {
            localStorage.setItem("currentAddress", this.userAddress); //Important this value never should update anywhere else
          }
          // if(this.wantToSetCurrentLocation){
             
          //    this.setLocation();
          // }

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }


  getCountry(address_components) {
    for (let i = 0; i < address_components.length; i++) {
      if (address_components[i].types[0] == 'country') {
        this.country = address_components[i].long_name;
      }
    }
  }

  getLocality(address_components) {
    for (let i = 0; i < address_components.length; i++) {
      if (address_components[i].types[0] == 'locality') {
        this.locality = address_components[i].long_name;
      }
    }
  }
  centerChange($event) {
    console.log($event);
  }


  /** Function is used to initialize the slider with custom steps
 */
  watchSlider($event) {
    this.zoom = zoomLevels[$event.target.value];
    this.customSteps = steps[this.exradius];
    this.selectedRadiusCircle = Math.round((this.customSteps * 1.60934)*1000);
    this.selectedRadius = this.customSteps;
  }



  /** Function is used to change radius of circle from which area users will get products
   */
  radiusChange() {
    setTimeout(() => {
      this.selectedRadius = Math.round(this.customSteps / 1.60934);
    }, 1000);
  }

  /** Function is used to update user details on localStorage
   */
  updateUserDetails() {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails != null) {
      userDetails.address = this.userAddress;
      userDetails.country = this.country;
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    }
  }


  setYourCurrentLocation() {
    this.wantToSetCurrentLocation=true;
    if(this.action == "setUserLocation"){
      localStorage.removeItem("locality");
    }
    this.setCurrentLocation();
  }

  /** Function is used to set location details for user
 */
  async setLocation() {
    if (this.action == "setUserLocation") {
      localStorage.setItem('radius', (this.customSteps).toString());
      this.networkService.setLatLong(this.latitude, this.longitude);
      this.networkService.setCountry(this.country);
      this.networkService.setAddress(this.userAddress);
      this.updateUserDetails();

      this.networkService.setLocality(this.locality);
    } else {
      let productAddress = {
        address: this.userAddress,
        country: this.country,
        locality: this.locality,
        latitude: this.latitude,
        longitude: this.longitude
      }
      this.networkService.setProductAddress(productAddress);
    }
    this.closeLoc();
  }

  /** Function is used to close modal page
 */
  closeLoc() {
    $('#location-alert').hide();
    // this._location.back();
  }

  /** Function is used to update user address
 */
  updateUserAddress() {
    //this.loaderService.presentLoader('Please wait....');
    let geometry = {
      coordinates: [this.longitude, this.latitude]
    }
    let location = {
      address: this.userAddress,
      geometry: geometry
    }
    this.apiService.postX('app_seller/useredit', location)
      .subscribe((res) => {
        // this.loaderService.dismiss();
        if (res.success) {
          localStorage.setItem("userDetails", JSON.stringify(res.data));
          this.closeLoc();
          this.toastService.presentToast('Address updated');
        } else {
          this.toastService.presentToast('Failed to update address');
        }
      }, error => {
        // this.loaderService.dismiss();
        this.toastService.presentToast(error);
      });
  }

  add3Dots(string, limit) {
    //console.log("umaaaaaaaaaaaaaaaaaaaaaaaaaaa",string);
    var dots = "...";
    if (string.length > limit) {
      // you can also use substr instead of substring
      string = string.substring(0, limit) + dots;
    }
    return string;
  }
}
