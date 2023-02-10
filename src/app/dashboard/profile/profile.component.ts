import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/services/validation-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, Validators, FormControl, AbstractControl, FormBuilder } from '@angular/forms';

export class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl) {
    let password = control.get('newPassword').value;
    let confirmPassword = control.get('confirmPassword').value;
    if (password != confirmPassword) {
      control.get('confirmPassword').setErrors({ ConfirmPassword: true });
    }
    else {
      return null;
    }
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;
  changePasswordForm: FormGroup;
  profleForm: FormGroup;
  formShowDiv: boolean = false;
  paramsData: any;
  userDetails: any;
  error_messages = {
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length shoud be 6 minimum.' },
      { type: 'maxlength', message: 'Password length shoud be 20 maximum.' }
    ],
    'confirmpassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length shoud be 6 minimum.' },
      { type: 'maxlength', message: 'Password length shoud be 20 maximum.' }
    ]
  }

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private _Activatedroute: ActivatedRoute
    ) { 
      let accessTokenDesihub = JSON.parse(localStorage.getItem("accessTokenDesihub"));
      if (accessTokenDesihub == null) {
        sessionStorage.clear();
        localStorage.removeItem("accessTokenDesihub");
        localStorage.removeItem("access");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        this.router.navigate(['/login']);
      } else if( accessTokenDesihub != null){
        let userId = JSON.parse(localStorage.getItem("userId"));
        let userRole = JSON.parse(localStorage.getItem("userRole"));
        sessionStorage.setItem("accessToken", accessTokenDesihub);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userRole", userRole);

        this._Activatedroute.params.subscribe((param)=>{
          // this.propertyTypeId = param.id;
          this.paramsData = param.id;
          if(this.paramsData == '1' && userRole == 'super_admin') {
            this.getUserDetails();
          } else if(this.paramsData == '1' && userRole != 'super_admin') { 
            this.router.navigate(['dashboard/home']);
          }
          console.log("param===",param.id)
        })

      }
    }

  ngOnInit() {
    let userRole = sessionStorage.getItem("userRole");
    let accessPermission = JSON.parse(localStorage.getItem("access"));
    if(userRole == 'admin' && accessPermission.change_password != false) {
      this.formShowDiv = true;
      this.resetForm();
    } else if(userRole == 'super_admin') {
      this.formShowDiv = true;
      this.resetForm();
    } else {
      this.router.navigate(['login']);
    }
  }

  createProfileForm(data){
    this.profleForm = this.formBuilder.group({
      email: [data && data.email ? data.email : '', Validators.required],
      username: [data && data.username ? data.username : '', Validators.required]
    })
  }

  submitUpdateProfile() {
    console.log("profleForm====",this.profleForm.value);
    if (this.profleForm.valid) {
      if (this.apiService.tokenCheck()) {
        this.apiService.postService('updateAdminAndSuperAdminDetails', this.profleForm.value).subscribe((res) => {
          if (res.success) {
            this.successDiv = true;
            // this.profleForm.reset();
            this.message = res.message;
          } else {
            this.errorDiv = true;
            this.message = res.message;
          }
        });
      }
    }
  }

  getUserDetails() {
    this.apiService.getService('app_seller/userdetail', '').subscribe((res) => {
      if (res.success) {
        this.userDetails = res.data;
        this.createProfileForm(this.userDetails);
        console.log("profile data===",res.data);
      } else {
        this.errorDiv = true;
        this.message = res.error.message;
      }
    });
  }

  /* ========== Change Password form validation rules ============================= +*/
  resetForm() {
    this.changePasswordForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ])),
      confirmpassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]))
    }, {
      validators: this.password.bind(this)
    });
  }
  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmpassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  // this.changePasswordForm = this.formBuilder.group({
  //   // oldPassword: new FormControl('', Validators.compose([
  //   //   Validators.required])),
  //   newPassword: new FormControl('', Validators.compose([
  //     Validators.required])),
  //   confirmPassword: new FormControl('', Validators.compose([
  //     Validators.required]))
  // });

  /* ========== Change Password form validation rules ============================= -*/

  changePassword(getValue) {
    if (this.changePasswordForm.valid) {
      if (this.apiService.tokenCheck()) {
        this.apiService.postService('change_password', { password: getValue.newPassword }).subscribe((res) => {
          if (res.success) {
            this.successDiv = true;
            this.message = res.message;
          } else {
            this.errorDiv = true;
            this.message = res.error.message;
          }
        });
      }
    }
  }
  close() {
    this.router.navigate(['dashboard/home']);
  }

  // close error/ success message div
  closeMessageDiv() {
    this.errorDiv = false;
    this.successDiv = false;
  }
}
