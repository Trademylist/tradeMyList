import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from 'src/app/services/api-service/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UtilityService, OnEnter } from 'src/app/services/utility/utility.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NetworkService } from '../../../services/geo-service/network.service';

export interface FileHandle {
  file: File,
  url: SafeUrl
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  public userDetails: any = {};
  private subscription: Subscription;
  public myReviews: Array<any> = [];
  public loggedUser: any = {};
  public myReviewToggled: boolean = false;
  public profilePic: string;
  constructor(
    private toastService: ToastService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private utilityService: UtilityService,
    private authService: AuthenticationService,
    private zone: NgZone,
    private networkService:NetworkService
  ) { }

  public async ngOnInit(): Promise<void> {
    //await this.onEnter();
    this.getUserDetails();
  }


  public ngOnDestroy(): void {

  }

  goBack() {
    this.router.navigate(['app/product']);
  }

  getUserDetails() {
    this.loaderService.present();
    this.apiService.getX('app_seller/userdetail')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.userDetails = res.data;
          localStorage.setItem('userDetails', JSON.stringify(this.userDetails));
          this.apiService.postX('app_seller/get_review', { "user_id": this.userDetails.userid }).subscribe(res => {
            if (res.success) {
              this.myReviews = res.data.review_details;
            }
          });
        }
      }, error => {
        setTimeout(() => {
          this.loaderService.dismiss();
        }, 500);
      });
  }

  profileSettings(task, data) {

    window.scrollTo({ top: 0});

    let routePath = "trade/user"
    if (task == 'changeName') {
      this.router.navigate([routePath+'/profile-details', { "task": task, "data": data }]);

    } else if (task == 'myLocation') {
      this.utilityService.setData('id', 'userAddress');
      this.router.navigate(['app/location/id']);

    } else if (task == 'changeEmail') {
      this.router.navigate([routePath+'/profile-details', { "task": task, "data": data }]);

    } else if (task == 'changeNumber') {
      this.router.navigate([routePath+'/profile-details', { "task": task, "data": data }]);

    } else if (task == 'changeBio') {
      this.router.navigate([routePath+'/profile-details', { "task": task, "data": data }]);

    } else if (task == 'myReviews') {
      this.router.navigate([routePath+'/profile-details', { "task": task, "data": data }]);

    } else if (task == 'myListings') {
      this.router.navigate(['app/my-listing/product']);

    } else if (task == 'changeDistance') {
      this.router.navigate([routePath+'/profile-details', { "task": task, "data": data }]);

    } else if (task == 'notificationSettings') {
      this.router.navigate([routePath+'/profile-details', { "task": task }]);

    } else if (task == 'changePassword') {
      this.router.navigate([routePath+'/profile-details', { "task": task }]);

    } else if (task == 'myBlockList') {
      this.router.navigate([routePath+'/profile-details', { "task": task }]);

    }
  }



  /**
 * handle file from browsing
 */
  fileHandler(event) {
    let files: FileHandle[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({ file, url });
    }

    this.prepareProfilePic(files);
  }

  /**
 * Convert Files list to normal array list
 * @param files (Files List)
 */
  prepareProfilePic(files: Array<any>) {

    this.profilePic = "";
    let item = files[0];
    item.process = 0;
    this.profilePic = item.url;;
    console.log(item);
    // for (const item of files) {
    //   console.log(item);
    //   item.progress = 0;
    //   this.coverImage.push(item);
    // }
    this.uploadImageData(item.file, item.file.type.slice(6, 10));
    //this.uploadFilesSimulator(0);
  }

  /** Function is used to upload picture
   * @param  {} getImgData
   */
  uploadImageData(getImgData, fileDataType) {
    if (getImgData != '') {
      this.loaderService.presentLoader('Please wait....');
      let today: any = new Date();
      let fileNameSet: string = 'trade_' + today.getTime() + '.' + fileDataType;
      const frmData = new FormData();
      frmData.append('file', getImgData, fileNameSet);
      this.apiService.uploadFile('app_seller/profileupload', frmData)
        .subscribe((res) => {
          this.loaderService.dismiss();
          if (res.success) {
            this.zone.run(() => {
              this.userDetails.image = res.data.image;
              this.userDetails.path = res.data.path;
              localStorage.setItem("userDetails", JSON.stringify(this.userDetails));
              this.networkService.updateProfilePicture.next(this.userDetails.image);
            });
            this.toastService.presentToast('Profile image updated successfully');
          } else {
            this.toastService.presentErrorToast('Profile image not uploaded');
          }
        }, error => {
          this.loaderService.dismiss();
          this.toastService.presentToast('Profile image not uploaded');
        });
    }
  }

  goCMS(type) {
    this.router.navigate(['app/cms', type]);
  }

  // logout() {
  //   // if (localStorage.getItem('login_type') == 'Google') {
  //   //   this.googlePlus.logout();
  //   // } else if (localStorage.getItem('login_type') == 'Facebook') {
  //   //   this.fb.logout();
  //   // }
  //   this.authService.logout();
  // }
}