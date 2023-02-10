import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api-service/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  askOTP = 0;
  checkOTP = 0;
  enterPassword = 0;
  email: string;
  public forgetPasswordForm: FormGroup;
  public confirmCodeForm: FormGroup;
  public newPasswordForm: FormGroup;
  public type: string = 'password';
  public confirmType: string = "password";
  public showPass: boolean = false;
  public showConfirmPass: boolean = false;
  error_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'minlength', message: 'Email length.' },
      { type: 'maxlength', message: 'Email length.' },
      { type: 'pattern', message: 'Please enter a valid email address.' }
    ],
    'code': [
      { type: 'required', message: 'Code is required.' },
    ],
    'newPassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length shoud be 6 minimum.' },
      { type: 'maxlength', message: 'Password length shoud be 20 maximum.' }
    ],
    'confirmPassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length shoud be 6 minimum.' },
      { type: 'maxlength', message: 'Password length shoud be 20 maximum.' }
    ],
  }

  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private location: Location,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private utilityService: UtilityService
  ) { }

  ngOnInit() { 
    this.onEnter()
  }

  onEnter() {
    this.resetForm();
    this.resetConfirmationCode();
    this.resetNewPasswordForm();
    this.commonDivShowHide(1, 0, 0)
  }

  /* ========== forget Password form validation rules ============================= +*/
  resetForm() {
    this.forgetPasswordForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  resetConfirmationCode() {
    this.confirmCodeForm = this.formBuilder.group({
      code: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  resetNewPasswordForm() {
    this.newPasswordForm = this.formBuilder.group({
      newPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]))
    }, {
      validators: this.password.bind(this)
    });
  }
  password(formGroup: FormGroup) {
    const { value: newPassword } = formGroup.get('newPassword');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return newPassword === confirmPassword ? null : { passwordNotMatch: true };
  }

  /* ========== forget Password form validation rules ============================= -*/
  goBack() {
    this.location.back();
  }

  commonDivShowHide(arg1, arg2, arg3) {
    this.askOTP = arg1;
    this.checkOTP = arg2;
    this.enterPassword = arg3;
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  showConfirmPassword() {
    this.showConfirmPass = !this.showConfirmPass;
    if (this.showConfirmPass) {
      this.confirmType = 'text';
    } else {
      this.confirmType = 'password';
    }
  }

  async forgetPassword(getValue) {
    if (this.forgetPasswordForm.valid) {
      await this.loaderService.presentLoader('Please wait....');
      this.apiService.post('app_user/send_verification', getValue).subscribe((response) => {
        this.loaderService.dismiss();
        if (response.success) {
          this.toastService.presentToast(response.message);
          this.email = getValue.email;
          this.resetForm();
          this.commonDivShowHide(0, 1, 0);
        } else {
          this.toastService.presentToast(response.message);
        }
      }, error => {
        this.loaderService.dismiss();
        this.toastService.presentToast(error.error.message);
      });
    }
  }

  async checkConfirmationCode(getValue) {
    if (this.confirmCodeForm.valid) {
      await this.loaderService.presentLoader('Please wait....');
      let data = {
        email: this.email,
        code: getValue.code
      }
      this.apiService.post('app_user/check_verification', data).subscribe((response) => {
        this.loaderService.dismiss();
        if (response.success) {
          this.toastService.presentToast(response.message);
          this.resetNewPasswordForm();
          this.commonDivShowHide(0, 0, 1);
        } else {
          this.toastService.presentToast(response.message);
        }
      }, error => {
        this.loaderService.dismiss();
        this.toastService.presentToast(error.error.message);
      });
    }
  }

  async newPassword(getValue) {
    if (this.newPasswordForm.valid) {
      await this.loaderService.presentLoader('Please wait....');
      let data = {
        email: this.email,
        password: getValue.newPassword
      }
      this.apiService.post('app_user/change_password', data).subscribe((response) => {
        this.loaderService.dismiss();
        if (response.success) {
          this.toastService.presentToast(response.message);
          this.resetNewPasswordForm();
          this.router.navigate(['signin']);
        } else {
          this.toastService.presentToast(response.message);
        }
      }, error => {
        this.loaderService.dismiss();
        this.toastService.presentToast(error.error.message);
      });
    }
  }

}
