import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ApiService } from 'src/app/services/api.service';

declare var $: any;

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {

  // searchErrDiv: boolean = false;
  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  searchInput: any = '';
  // searchCancelToggle: boolean = true;
  sellerListDiv: boolean = true;
  isEditDiv: boolean = false;

  getUserDetails: any = [];
  collection: any = [];
  p: number = 1;

  // editUserForm: any = {
  //   id: '', email: '', status: ''
  // }
  editUserForm: any;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    let accessTokenDesihub = JSON.parse(localStorage.getItem("accessTokenDesihub"));
    if (accessTokenDesihub == null) {
      sessionStorage.clear();
      localStorage.removeItem("accessTokenDesihub");
      localStorage.removeItem("access");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      this.router.navigate(['/login']);
    } else if (accessTokenDesihub != null) {
      let userId = JSON.parse(localStorage.getItem("userId"));
      let userRole = JSON.parse(localStorage.getItem("userRole"));
      sessionStorage.setItem("accessToken", accessTokenDesihub);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userRole", userRole);
    }
   }

  ngOnInit() {
    let userRole = sessionStorage.getItem("userRole");
    let accessPermission = JSON.parse(localStorage.getItem("access"));
    if(userRole == 'admin' && accessPermission.manage_seller != false) {
      this.tokenVerifyWithUserList();
    } else if(userRole == 'super_admin') {
      this.tokenVerifyWithUserList();
    } else {
      this.router.navigate(['login']);
    }
  }

  tokenVerifyWithUserList(){
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('users', '').subscribe((response) => {
        // console.log("get user ", response)
        if (response.success == true) {
          this.getUserDetails = response.data;
          this.pagination(this.getUserDetails.length)
        }
      })
    }
  }

  pagination(length) {
    for (let i = 1; i <= length; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  getIndex(i){
    let sum = ((this.p - 1)*5) + (i+1);
    return sum;
  }

  // close error/ success message div
  closeMessageDiv() {
    this.sellerListDiv = true;
    this.isEditDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }

  /// edit user related ////
  // searchUser() {
  //   if (this.searchInput != '') {
  //     this.searchCancelToggle = false;
  //     if (this.apiService.tokenCheck()) {
  //       this.apiService.postService('search_user', { 'search_value': this.searchInput }).subscribe((res) => {
  //         // console.log(res)
  //         if (res.success) {
  //           this.getUserDetails = res.data;
  //           this.pagination(this.getUserDetails.length)
  //         } else {
  //           this.searchErrDiv = true;
  //           this.message = res.message;
  //         }
  //       }, error => {
  //         this.searchErrDiv = true;
  //         this.message = 'Error occur!!';
  //       });
  //     }
  //   } else {
  //     this.searchErrDiv = true;
  //     this.message = 'Enter Search Input!!';
  //   }
  // }
  // cancelSearchUser() {
  //   this.searchInput = '';
  //   this.searchCancelToggle = true;
  //   this.searchErrDiv = false;
  //   this.message = '';
  //   this.ngOnInit();
  // }
  // searchInputkeyDown() {
  //   if (this.searchInput == '') {
  //     this.searchCancelToggle = true;
  //     this.searchErrDiv = false;
  //     this.message = '';
  //     this.ngOnInit();
  //   }
  // }
  /// end ///

  // Edit User ///
  startEdit(getValue) {
    // this.editUserForm.id = user._id;
    // this.editUserForm.email = user.email;
    // this.editUserForm.status = user.status;

    this.sellerListDiv = false;
    this.isEditDiv = true;
    this.editUserForm = getValue;
  }
  closeEdit() {
    this.sellerListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.editUserForm = [];
    this.ngOnInit();
  }
  editUser(getValue) {
    if (this.apiService.tokenCheck()) {
      this.apiService.putService('user' , getValue).subscribe((res) => {
        if (res.success == true) {
          this.successDiv = true;
          this.message = res.message;
          this.ngOnInit();
        } else {
          this.errorDiv = true;
          this.message = res.message;
        }
      }, error => {
        this.errorDiv = true;
        this.message = error.message;
      });
    }
  }
  clearEditUserDetailsForm() {
    this.editUserForm.id = '';
    this.editUserForm.email = '';
    this.editUserForm.status = '';
    // this.searchErrDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
    this.message = '';
  }
  // End Edit User // 

  // Csv file download for seller //
  downloadCSVFIle(){
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('download_seller', '').subscribe((res) => {
        if (res["success"] == true) {
          window.open(res["csvFilePath"], "_blank");
        }
      })
    }
  }
// end csv file download function // 
}
