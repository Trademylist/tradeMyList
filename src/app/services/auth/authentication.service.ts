import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { Storage } from '@ionic/storage';
// import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor(
    private router: Router
  ) {

    this.ifLoggedIn();

  }

  ifLoggedIn() {
    let token = localStorage.getItem("accessToken");
    // let token = userDtls != null ? userDtls.token : false;
    if (token) {
      this.authState.next(true);
    } else {
      this.authState.next(false);
    }
  }

  login(userDetails, token) {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    localStorage.setItem("accessToken", token);
    this.authState.next(true);
    this.router.navigateByUrl('/home-page');
  }

  logout() {
    this.clearLocalStorageButLocation();
    //localStorage.clear();
    this.router.navigate(['signin']);
    this.authState.next(false);

  }
/**
 * If user has selected the address then after logout this will be continue in localstorage
 */
clearLocalStorageButLocation(){
    const locality = localStorage.getItem("locality");
    const address = localStorage.getItem("address");
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");

    const country = localStorage.getItem("country");
    const radius = localStorage.getItem("radius");

    localStorage.clear();

    localStorage.setItem("locality",locality);
    localStorage.setItem("address",address);
    localStorage.setItem("latitude",latitude);
    localStorage.setItem("longitude",longitude);
    localStorage.setItem("country",country);
    localStorage.setItem("radius",radius);
  }

  isAuthenticated() {
    return this.authState.value;
  }

  getUserId() {
    let userDtls = JSON.parse(localStorage.getItem("userDetails"));
    if (userDtls != null)
      return userDtls.userid;
    else
      return false
  }

  tokenCheck() {
    // let userDtls = JSON.parse(localStorage.getItem("userDetails"));
    // let token = userDtls != null ? userDtls.token : false;
    let token = localStorage.getItem("accessToken");
    if (token) {
      return true;
    } else {
      return false;
    }
  }
}
