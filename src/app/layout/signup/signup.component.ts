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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  public loggedIn: boolean;
  public socialUser: SocialUser;
  public loginType: string = '';
  error_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'minlength', message: 'Email length.' },
      { type: 'maxlength', message: 'Email length.' },
      { type: 'pattern', message: 'Please enter a valid email address.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length should be 6 minimum.' },
      { type: 'maxlength', message: 'Password length should be 20 maximum.' }
    ],
    'confirmpassword': [
      { type: 'required', message: 'Confirm Password is required.' },
      { type: 'minlength', message: 'Password length should be 6 minimum.' },
      { type: 'maxlength', message: 'Password length should be 20 maximum.' }
    ]
  }
  access_token: string;
  id: string;
  constructor(
    private socialAuthService: SocialAuthService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
  ) { 
    window.scroll(0,0);
    this.resetForm();
  }

  ngOnInit() {
  }


    /* ========== signup form validation rules ============================= +*/
    resetForm() {
      this.signupForm = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20)
        ])),
        confirmpassword: new FormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20)
        ])),
        // geometry: new FormControl('', Validators.compose([
        //   Validators.required
        // ]))
      }, {
        validators: this.password.bind(this)
      });
      //this.getGeometry();
    }
    password(formGroup: FormGroup) {
      const { value: password } = formGroup.get('password');
      const { value: confirmPassword } = formGroup.get('confirmpassword');
      return password === confirmPassword ? null : { passwordNotMatch: true };
    }

    async userSignup(data) {
      if (this.signupForm.valid) {
        await this.loaderService.presentLoader('Please wait....');
        this.apiService.post('app/registration', data).subscribe((response) => {
          this.loaderService.dismiss();
          if (response.success) {
            this.toastService.presentToast('Registration successful, please check your email to activate the account');
            this.resetForm();
            this.router.navigate(['signin']);
          } else {
            this.toastService.presentToast(response.message);
          }
        }, error => {
          this.loaderService.dismiss();
          this.toastService.presentToast(error.message);
        });
      }
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
        this.authService.login(response.data, response.data.token);
      } else {
        this.toastService.presentToast(response.message);
        if (login_type == 'Facebook') {
          this.logout();
        } else if (login_type == 'Google') {
          this.logout();
        }
      }
    }, error => {
      this.loaderService.dismiss();
      this.toastService.presentToast(error.error.message);
    });
  }


  registerSocialAuth(){
    this.socialAuthService.authState.subscribe((user:any) => {
      this.loggedIn = (user != null);
      if(user!=null){
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
    this.socialAuthService.signOut();
  }
}
