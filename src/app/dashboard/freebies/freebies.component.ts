import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ValidationService } from 'src/app/services/validation-service.service';

@Component({
  selector: 'app-freebies',
  templateUrl: './freebies.component.html',
  styleUrls: ['./freebies.component.css']
})
export class FreebiesComponent implements OnInit {

  // searchErrDiv: boolean = false;
  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  searchInput: any = '';
  // searchCancelToggle: boolean = true;

  freebiesImageUrl: any;
  getFreebiesDetails: any = [];
  categoryArray: any;
  collection: any = [];
  p: number = 1;

  freebiesListDiv: boolean = true;
  isEditDiv: boolean = false;

  editFreebiesList: any;
  showHideCountry: boolean;

  constructor(
    private router: Router, 
    private validationService: ValidationService,
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
      } else if( accessTokenDesihub != null){
        let userId = JSON.parse(localStorage.getItem("userId"));
        let userRole = JSON.parse(localStorage.getItem("userRole"));
        sessionStorage.setItem("accessToken", accessTokenDesihub);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userRole", userRole);
        this.showHideCountry = this.validationService.roleValidation();
      }
  }

  ngOnInit() {
    let userRole = sessionStorage.getItem("userRole");
    let accessPermission = JSON.parse(localStorage.getItem("access"));
    if(userRole == 'admin' && accessPermission.manage_commercial != false) {
      this.tokenVerifyWithFreebiesList();
    } else if(userRole == 'super_admin') {
      this.tokenVerifyWithFreebiesList();
    } else {
      this.router.navigate(['login']);
    }
  }

  tokenVerifyWithFreebiesList() {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('all_freebies_new', '').subscribe((response) => {
        // console.log("get freebies ", response)
        if (response.success) {
          this.getFreebiesDetails = response.data.product;
          this.freebiesImageUrl = response.data.productImageUrl;
          this.categoryArray = response.data.category_array;
          this.pagination(this.getFreebiesDetails.length);
        }
      });
      this.apiService.getService('category_list/freebies', '').subscribe((response) => {
        console.log("get cat ", response)
        if (response.success) {
          this.categoryArray = response.data.category;
        }
      });
    }
  }

  getIndex(i){
    let sum = ((this.p - 1)*5) + (i+1);
    return sum;
  }

  pagination(length) {
    for (let i = 1; i <= length; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  // close error/ success message div
  closeMessageDiv() {
    // this.freebiesListDiv = true;
    // this.isEditDiv = false;
    // this.searchErrDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }

  /// search Freebies related ////
  // searchFreebies() {
  //   if (this.searchInput != '') {
  //     this.searchCancelToggle = false;
  //     this.apiService.postService('search_freebies', { 'search_value': this.searchInput }).subscribe((res) => {
  //       // console.log("search",res)
  //       if (res.success) {
  //         this.getFreebiesDetails = res.data;
  //         this.pagination(this.getFreebiesDetails.length);
  //       } else {
  //         this.searchErrDiv = true;
  //         this.message = res.message;
  //       }
  //     }, error => {
  //       this.searchErrDiv = true;
  //       this.message = 'Error occur!!';
  //     });
  //   } else {
  //     this.searchErrDiv = true;
  //     this.message = 'Enter Search Input!!';
  //   }
  // }
  // cancelSearchFreebies() {
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

  /// edit freebies related ////
  startEdit(getfreebies) {
    this.freebiesListDiv = false;
    this.isEditDiv = true;
    this.editFreebiesList = getfreebies;
  }
  closeEdit() {
    this.freebiesListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.ngOnInit();
  }
  editFreebiesDetails(editFreebiesList) {
    if (editFreebiesList.product_name != '' && editFreebiesList.product_description != '' &&
      editFreebiesList.seller_phone != '' && editFreebiesList.seller_phone.length >= 10) {
      this.apiService.putService('freebies', editFreebiesList).subscribe((res) => {
        if (res.success == true) {
          this.successDiv = true;
          this.message = res.message;
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
  /// end ///

  /// delete freebies related ////
  startDelete(getFreebies) {
    if (confirm("Are you Sure? Delete this freebies...")) {
      this.apiService.deleteService('freebies' + '/' + getFreebies._id, '').subscribe((res) => {
        // console.log("del freebies",res)
        if (res.success) {
          this.successDiv = true;
          this.message = res.message;
          this.ngOnInit();
        } else {
          this.errorDiv = true;
          this.message = res.message;
        }
      }, error => {
        this.errorDiv = true;
        this.message = 'Error occur!!';
      });
    }
  }
  /// end ///

}
