import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  public error_messages = {
    'currPassword': [
      { type: 'required', message: 'Current password is required.' },
      { type: 'minlength', message: 'Password length shoud be 6 minimum.' },
      { type: 'maxlength', message: 'Password length shoud be 20 maximum.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length shoud be 6 minimum.' },
      { type: 'maxlength', message: 'Password length shoud be 20 maximum.' }
    ],
    'confirmpassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password length shoud be 6 minimum.' },
      { type: 'maxlength', message: 'Password length shoud be 20 maximum.' }
    ],
    'address': [
      { type: 'required', message: 'Address is required.' },
    ],
    'name': [
      { type: 'required', message: 'Name is required.' },
    ],
    'bio': [
      { type: 'required', message: 'Bio is required.' },
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Email is not valid' }
    ],
    'number': [
      { type: 'required', message: 'Phone number is required.' },
      { type: 'pattern', message: 'Phone number should be numeric and start with +' }
    ]
  }

  public loggedUser: any = {};
  public pageTitle: string = "";
  public task: string = '';
  public changePasswordForm: FormGroup;
  public changeLocationForm: FormGroup;
  public userDistanceUnit: string = 'Miles';
  public changeNameForm: FormGroup;
  public changeBioForm: FormGroup;
  public bioPlaceholder: string = "Add a bio that describes who you are. Share what you're interested in for a fun fact about yourself.";
  public changeEmailForm: FormGroup;
  public previousEmail: string;
  public changeNumberForm: FormGroup;
  public previousNumber: string;
  public numberVerified: number = 0;

  public push: any = {};
  public email: any = {};

  public showMorePush: boolean = false;
  public showMoreEmail: boolean = false;
  public showMoreChat: boolean = false;

  public allEmailEnable: boolean = false;
  public allNotificationEnable: boolean = false;
  public allChatEnable: boolean = false;

  public blockList: Array<any> = [];
  public myReviews: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    public zone: NgZone,
    private location: Location,
    private router: Router
  ) { }
  ngOnInit() {
    this.onEnter();
  }
  /** Function is called when the page view is initialized
  */
 onEnter() {
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    this.activatedRoute.params.subscribe(params => {
      this.task = params.task;
      if (params.task == 'changeName') {
        this.pageTitle = "Change name"
        this.resetNameForm();
        this.changeNameForm.controls["name"].setValue(params.data && (params.data == 'null' || params.data == null) ? 'Trade User'  : params.data);
      } else if (params.task == 'changeEmail') {
        this.pageTitle = "Change email";
        this.resetEmailForm();
        this.changeEmailForm.controls["email"].setValue(params.data && params.data != null ? params.data : '');
        this.previousEmail = params.data;
      } else if (params.task == 'changeNumber') {
        this.pageTitle = "Change number";
        this.resetNumberForm();
        this.changeNumberForm.controls["number"].setValue(params.data && params.data != null ? params.data : '');
        this.previousNumber = params.data;
        this.checkNumberVerification();
      } else if (params.task == 'changeBio') {
        this.pageTitle = "About me"
        this.resetBioForm();
        this.changeBioForm.controls["bio"].setValue(params.data && params.data != null ? params.data : '');
      } else if (params.task == 'changeDistance') {
        this.pageTitle = "Change distance unit";
        this.userDistanceUnit = params.data;
      } else if (params.task == 'changePassword') {
        this.pageTitle = "Change password"
        this.resetPasswordForm();
      } else if (params.task == 'myReviews') {
        this.pageTitle = "My reviews";
        this.getReviewList();
      } else if (params.task == 'myBlockList') {
        this.pageTitle = "Block list";
        this.getBlockList();
      } else if (params.task == 'notificationSettings') {
        this.pageTitle = "Notifications";
        this.getNotificationSettings();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  /* ========== Change Name form validation rules ============================= +*/
  resetNameForm() {
    this.changeNameForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  /** Function is used to reset email form of user along with validation rules
   */
  resetEmailForm() {
    this.changeEmailForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  /** Function is used to reset number form of user and along with validation rules
   */
  resetNumberForm() {
    this.changeNumberForm = this.formBuilder.group({
      number: new FormControl('', Validators.compose([
        Validators.required
      ]))
    }, {
      validators: this.number.bind(this)
    });
  }

  number(formGroup: FormGroup) {
    let regex = /^\+[1-9]{1}[0-9]{7,14}$/;
    const { value: number } = formGroup.get("number");
    return regex.test(number) === true ? null : { numberNotCorrect: true };
  }

  /** Function is used to check whether user phone number is verified and display message on page according to that 
   */
  checkNumberVerification() {
    if (!this.changeNumberForm.valid) {
      this.numberVerified = 0;
    } else {
      if (this.previousNumber != null && this.previousNumber == this.changeNumberForm.value.number) {
        this.numberVerified = 1;
      } else {
        this.numberVerified = 2;
      }
    }
  }

  /** Function is used to reset bio form of user and along with validation rules
   */
  resetBioForm() {
    this.changeBioForm = this.formBuilder.group({
      bio: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  /* ========== Change Password form validation rules ============================= +*/
  resetPasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      currPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
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
  /* ========== Change Password form validation rules ============================= +*/


  /** Function is used to get notification toggle data
   */
  getNotificationSettings() {
    this.loaderService.presentLoader('Please wait....');
    this.apiService.getX('app_seller/userdetail')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.email = res.data.notification.email;
          this.push = res.data.notification.push;
          this.allEmailSelected();
          this.allNotificationSelected();
          this.allChatSelected();
        } else {
          this.toastService.presentToast(res.message);
        }
      }, error => {
        this.toastService.presentToast(error);
        this.loaderService.dismiss();
      });
  }

  /** Function is used to toggle all email notifications
  */
  allEmailSelected() {
    if (
      this.email.expired_product == true &&
      this.email.user_visit_product == true &&
      this.email.review == true &&
      this.email.expired_favorite_product == true &&
      this.email.delete_favorite_product == true &&
      this.email.soldOut_favorited_product == true &&
      this.email.image_change_favorited_product == true &&
      this.email.price_change_favorited_product == true &&
      this.email.description_change_favorited_product == true
    ) {
      this.allEmailEnable = true;
    } else {
      this.allEmailEnable = false;
    }
  }

  /** Function is used to toggle all push notifications
   */
  allNotificationSelected() {
    if (
      this.push.expired_product == true &&
      this.push.user_visit_product == true &&
      this.push.review == true &&
      this.push.expired_favorite_product == true &&
      this.push.delete_favorite_product == true &&
      this.push.soldOut_favorited_product == true &&
      this.push.image_change_favorited_product == true &&
      this.push.price_change_favorited_product == true &&
      this.push.description_change_favorited_product == true
    ) {
      this.allNotificationEnable = true;
    } else {
      this.allNotificationEnable = false;
    }
  }

  /** Function is used to toggle all chat notifications
   */
  allChatSelected() {
    if (
      this.email.chat == true &&
      this.push.chat == true
    ) {
      this.allChatEnable = true;
    } else {
      this.allChatEnable = false;
    }
  }

  /** Function is used to change the password of user
  * @param  {} getValue
  */
  changePassword(getValue) {
    if (this.changePasswordForm.valid) {
      this.loaderService.presentLoader('Please wait....');
      let data = {
        'current_password': getValue.currPassword, 
        'password': getValue.password
      }
      this.apiService.postX('app_seller/change_password', data)
        .subscribe((res) => {
          this.loaderService.dismiss();
          if (res.success) {
            this.resetPasswordForm();
            this.goBack();
            this.toastService.presentToast(res.message);
          } else {
            this.toastService.presentToast(res.message);
          }
        }, error => {
          this.toastService.presentToast(error);
          this.loaderService.dismiss();
        });
    }
  }

  /** Function is used to change the name of the user to be displayed on app
   * @param  {} getValue
   */
  changeName(getValue) {
    if (this.changeNameForm.valid) {
      this.loaderService.presentLoader('Please wait....');
      this.apiService.postX('app_seller/useredit', { 'username': getValue.name })
        .subscribe((res) => {
          this.loaderService.dismiss();
          if (res.success) {
            this.resetNameForm();
            let user = JSON.parse(localStorage.getItem("userDetails"))
            user.username = getValue.name;
            localStorage.setItem("userDetails", JSON.stringify(user));
            this.goBack();
            this.toastService.presentToast(res.message);
          } else {
            this.toastService.presentToast(res.message);
          }
        }, error => {
          this.toastService.presentToast(error);
          this.loaderService.dismiss();
        });
    }
  }

  /** Function is used to change the bio of user
   * @param  {} getValue
   */
  changeBio(getValue) {
    if (this.changeBioForm.valid) {
      this.loaderService.presentLoader('Please wait....');
      this.apiService.postX('app_seller/useredit', { 'bio': getValue.bio })
        .subscribe((res) => {
          this.loaderService.dismiss();
          if (res.success) {
            this.resetNameForm();
            let user = JSON.parse(localStorage.getItem("userDetails"))
            user.bio = getValue.bio;
            localStorage.setItem("userDetails", JSON.stringify(user));
            this.goBack();
            this.toastService.presentToast(res.message);
          } else {
            this.toastService.presentToast(res.message);
          }
        }, error => {
          this.toastService.presentToast(error);
          this.loaderService.dismiss();
        });
    }
  }

  /** Function is used to change the email of logged in user
   * @param  {} getValue
   */
  changeEmail(getValue) {
    if (this.changeEmailForm.valid) {
      this.loaderService.presentLoader('Please wait....');
      this.apiService.postX('app_seller/useredit', { 'email': getValue.email })
        .subscribe((res) => {
          this.loaderService.dismiss();
          if (res.success) {
            this.resetNameForm();
            let user = JSON.parse(localStorage.getItem("userDetails"))
            user.email = getValue.email;
            localStorage.setItem("userDetails", JSON.stringify(user));
            this.goBack();
            this.toastService.presentToast(res.message);
          } else {
            this.toastService.presentToast(res.message);
          }
        }, error => {
          this.toastService.presentToast(error);
          this.loaderService.dismiss();
        });
    }
  }

  /** Function is used to change the users distance unit
   * @param  {} unit
   */
  changeDistance(unit) {
    this.loaderService.presentLoader('Please wait....');
    this.apiService.postX('app_seller/useredit', { 'distance': unit })
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.resetNameForm();
          let user = JSON.parse(localStorage.getItem("userDetails"))
          user.distance_unit = unit;
          localStorage.setItem("userDetails", JSON.stringify(user));
          this.goBack();
          this.toastService.presentToast(res.message);
        } else {
          this.toastService.presentToast(res.message);
        }
      }, error => {
        this.toastService.presentToast(error);
        this.loaderService.dismiss();
      });
  }

  /** Function is used to check all notification toggle settings
   */
  checkSettings() {
    this.allNotificationSelected();
    this.allEmailSelected();
    this.allChatSelected();
    this.updateNotificationSettings();
  }

  /** Function is used to update the notification toggle settings
   */
  updateNotificationSettings() {
    let data = {
      notification: {
        email: this.email,
        push: this.push
      }
    };
    this.loaderService.presentLoader('Please wait....');
    this.apiService.postX('app_seller/useredit', data)
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          if (res.data.token) {
            localStorage.setItem('accessToken', res.data.token);
          }
        } else {
          this.toastService.presentToast(res.message);
        }
      }, error => {
        this.toastService.presentToast(error);
        this.loaderService.dismiss();
      });
  }

  /** Function is used to check notification toggle for email
   */
  toggleAllEmail() {
    if (this.allEmailEnable) {
      this.email.expired_product = true;
      this.email.user_visit_product = true;
      this.email.review = true;
      this.email.expired_favorite_product = true;
      this.email.delete_favorite_product = true;
      this.email.soldOut_favorited_product = true;
      this.email.image_change_favorited_product = true;
      this.email.price_change_favorited_product = true;
      this.email.description_change_favorited_product = true;
    } else {
      this.email.expired_product = false;
      this.email.user_visit_product = false;
      this.email.review = false;
      this.email.expired_favorite_product = false;
      this.email.delete_favorite_product = false;
      this.email.soldOut_favorited_product = false;
      this.email.image_change_favorited_product = false;
      this.email.price_change_favorited_product = false;
      this.email.description_change_favorited_product = false;
    }
    this.updateNotificationSettings();
  }

  /** Function is used to check notification toggle for push notifications
   */
  toggleAllNotification() {
    if (this.allNotificationEnable) {
      this.push.expired_product = true;
      this.push.user_visit_product = true;
      this.push.review = true;
      this.push.expired_favorite_product = true;
      this.push.delete_favorite_product = true;
      this.push.soldOut_favorited_product = true;
      this.push.image_change_favorited_product = true;
      this.push.price_change_favorited_product = true;
      this.push.description_change_favorited_product = true;
    } else {
      this.push.expired_product = false;
      this.push.user_visit_product = false;
      this.push.review = false;
      this.push.expired_favorite_product = false;
      this.push.delete_favorite_product = false;
      this.push.soldOut_favorited_product = false;
      this.push.image_change_favorited_product = false;
      this.push.price_change_favorited_product = false;
      this.push.description_change_favorited_product = false;
    }
    this.updateNotificationSettings();
  }

  /** Function is used to check notification toggle for user chats
   */
  toggleAllChat() {
    if (this.allChatEnable) {
      this.email.chat = true;
      this.push.chat = true;
    } else {
      this.email.chat = false;
      this.push.chat = false;
    }
    this.updateNotificationSettings();
  }

  getBlockList() {
    this.loaderService.presentLoader();
    this.apiService.getX('app_seller/block_user').subscribe(resp => {
      this.loaderService.dismiss();
      if (resp.success) {
        this.blockList = resp.data;
      }
    }, error => {
      this.loaderService.dismiss();
    });
  }

  getReviewList() {
    this.loaderService.presentLoader();
    this.apiService.postX('app_seller/get_review', { "user_id": this.loggedUser.userid }).subscribe(res => {
      this.loaderService.dismiss();
      if (res.success) {
        this.myReviews = res.data.review_details;
      }
    }, error => {
      this.loaderService.dismiss();
    });
  }

  /** Function is used to unblock users
   * @param  {string} userId
   */
  unblockUser(userId: string) {
    this.loaderService.presentLoader();
    this.apiService.postX('app_seller/unblock_user', { block_user_id: userId }).subscribe(resp => {
      this.loaderService.dismiss();
      if (resp.success) {
        let user = this.blockList.findIndex(list => list._id == userId);
        this.blockList.splice(user, 1);
      } else {
        this.toastService.presentToast('Failed to unblock user');
      }
    }, error => {
      this.toastService.presentToast('Failed to unblock user');
      this.loaderService.dismiss();
    });
  }
  goToUserDetails(user) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "sender_id": user.sender_id,
      }
    };
    this.router.navigate(['trade/user/product-seller-details'], navigationExtras);
  }
}