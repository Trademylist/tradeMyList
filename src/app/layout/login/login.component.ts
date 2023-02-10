import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api-service/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
// import { OtpVerificationPage } from 'src/app/shared/modal/otp-verification/otp-verification.page';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angularx-social-login";
import { JsonPipe } from '@angular/common';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public apiErrorMessage="";
  public loggedIn: boolean;
  public socialUser: SocialUser;
  public loginType: string = '';
  public error_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'minlength', message: 'Email length.' },
      { type: 'maxlength', message: 'Email length.' },
      { type: 'pattern', message: 'Please enter a valid email address.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length shoud be 6 minimum.' },
      { type: 'maxlength', message: 'Password length shoud be 20 maximum.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone number is required.' }
      // { type: 'pattern', message: 'Phone number should be numeric' }
    ]
  };
  public type: string = 'password';
  public showPass: boolean = false;
  public emailLoginForm: FormGroup;
  public phoneLoginForm: FormGroup;
  public previousNumber: string;
  public socialLoginStatus: boolean=  false;

  constructor(
    private socialAuthService: SocialAuthService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private eventEmitterService: EventEmitterService
  ) {
    window.scroll(0,0);
   this.eventEmitterService.event.subscribe(() => {   
    this.logout();
    });
   }

  ngOnInit() {
    //this.loaderService.present();
    this.resetEmailForm();
  }

  // ionViewWillEnter() {
  //   this.activatedRoute.params.subscribe(params => {
  //     this.loginType = params.login_type;
  //     if (this.loginType == 'email') {
  //       this.resetEmailForm();
  //     } else if (this.loginType == 'phone') {
  //       this.resetPhoneForm();
  //     }
  //   });
  // }

  goBack() {
    this.router.navigate(['login']);
  }

  /* ========== Login form validation rules ============================= +*/
  resetEmailForm() {
    this.emailLoginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]))
    });
  }

  resetPhoneForm() {
    this.phoneLoginForm = this.formBuilder.group({
      countryCode: new FormControl(''),
      phone: new FormControl('', Validators.compose([
        Validators.required
        // Validators.pattern('^[0-9]{7,14}$')
      ]))
    }
    // , {
    //   validators: this.number.bind(this)
    // }
    );
   
  }

  number(formGroup: FormGroup) {
    let regex = /^[0-9]{7,14}$/;
    const { value: number } = formGroup.get("phone");
    return regex.test(number) === true ? null : { numberNotCorrect: true };
  }
  /* ========== Login form validation rules ============================= -*/

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  async emailLogin(data) {
    if (this.emailLoginForm.valid) {
      await this.loaderService.presentLoader('Please wait....');
      this.apiService.post('app/login', data).subscribe((response) => {
        if (response.success) {
          this.loaderService.dismiss();
          this.resetEmailForm();
          this.authService.login(response.data, response.data.token);
          this.toastService.presentToast(response.message);
        } else {
          this.loaderService.dismiss();
          this.apiErrorMessage = response.message;
          this.toastService.presentErrorToast(response.message);
        }
      }, error => {
        this.loaderService.dismiss();
        this.apiErrorMessage = error.error.message;
        this.toastService.presentErrorToast(error.error.message);
      });
    }
  }
  /** Function is used to open number verification modal page
   * @param  {} userNumber
   */
  async showVerificationModal(userNumber) {
    // const modal = await this.modalController.create({
    //   component: OtpVerificationPage,
    //   cssClass: 'otp-modal-css',
    //   componentProps: {
    //     number: userNumber.countryCode + userNumber.phone
    //   }
    // });
    // modal.onDidDismiss()
    //   .then((data) => {
    //     const user = data['data'];
    //     if (user.response != undefined) {
    //       this.resetPhoneForm();
    //       this.authService.login(user.response, user.response.token);
    //     }
    //   });
    // await modal.present();
  }
  /** Function is used to navigate to forgot password page
   */
  goForgetPassword() {
    this.router.navigate(['login/login-with/forget-password']);
  }

  /** Function is used to log into app after facebook or google login has been done
   * @param  {string} email
   * @param  {string} username
   * @param  {string} login_type
   * @param  {string} socialId
   */
  async socialLogin(email: string, username: string, login_type: string, socialId: string) {
    let data = {
      email: email,
      username: username,
      //notification_token: this.firebaseService.getToken(),
      login_type: login_type,
      socialId: socialId
    }
    await this.loaderService.presentLoader('Please wait....');
    this.apiService.post('app/social_login', data).subscribe((response) => {
      this.loaderService.dismiss();
      if (response.success) {
        localStorage.setItem('login_type', login_type);
        response.data.image = this.socialUser.photoUrl;
        this.authService.login(response.data, response.data.token);
        this.toastService.presentToast(response.message);
      } else {
        this.apiErrorMessage = response.message;
        this.toastService.presentErrorToast(response.message);
        if (login_type == 'Facebook') {
          this.logout();
        } else if (login_type == 'Google') {
          this.logout();
        }
      }
    }, error => {
      this.loaderService.dismiss();
      this.apiErrorMessage = error.error.message;
      this.toastService.presentErrorToast(error.error.message);
    });
  }


  registerSocialAuth(){
    this.socialAuthService.authState.subscribe((user:any) => {
      this.loggedIn = (user != null);
      if(user != null && this.socialLoginStatus == false){
        console.log(user);
        this.socialLoginStatus = true;
        this.socialUser = user;
        this.socialLogin(this.socialUser.email, this.socialUser.name, this.loginType, this.socialUser.id)
      }

    });
  }
  
  signInWithGoogle(): void {
    this.loginType = 'Google';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.registerSocialAuth();
  }

  signInWithFB(): void {
    this.loginType = 'Facebook';
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.registerSocialAuth();
  }

  logout(): void {
    this.socialAuthService.signOut().then((data) => {
      this.socialLoginStatus = false;
      sessionStorage.clear();
      this.router.navigate(['/home-page']);
    }).catch((err) => {
      console.log("err===",err)
    })
  }

  // getLocation() {
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     let options: NativeGeocoderOptions = {
  //       useLocale: true,
  //       maxResults: 5
  //     };
  //     this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
  //       .then((result: NativeGeocoderResult[]) => {
          
  //         this.getCountryCode(result[0].countryName);
  //       })
  //       .catch((error: any) => {});
  //   }).catch((error) => {});
  // }


  getCountryCode(country) {
    if (country == "USA" || country == "Canada") {
      this.phoneLoginForm.controls["countryCode"].setValue("+1");
      this.loaderService.dismiss();
    } else if (country == "India") {
      this.phoneLoginForm.controls["countryCode"].setValue("+91");
      this.loaderService.dismiss();
    }
  }
  goSignup() {
    this.router.navigate(['login/login-with/signup']);
  }

}
