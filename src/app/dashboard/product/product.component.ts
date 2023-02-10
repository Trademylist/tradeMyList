import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ValidationService } from 'src/app/services/validation-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  searchInput: any = '';

  productImageUrl: any;
  getProductDetails: any = [];
  categoryArray: any;
  collection: any = [];
  p: number = 1;

  productListDiv: boolean = true;
  isEditDiv: boolean = false;

  editProductList: any;
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
    if(userRole == 'admin' && accessPermission.manage_product != false) {
      this.tokenVerifyWithProductList();
    } else if(userRole == 'super_admin') {
      this.tokenVerifyWithProductList();
    } else {
      this.router.navigate(['login']);
    }

    // if (this.apiService.tokenCheck()) {
    //   this.apiService.getService('all_product', '').subscribe((response) => {
    //     if (response.success) {
    //       this.getProductDetails = response.data.product;
    //       this.productImageUrl = response.data.productImageUrl;
    //       this.categoryArray = response.data.categoryArray;
    //       this.pagination(this.getProductDetails.length)
    //     }
    //   })
    //   this.apiService.getService('category_list/product', '').subscribe((response) => {
    //     if (response.success) {
    //       this.categoryArray = response.data.category;
    //     }
    //   }, err => {
    //     console.log("get cat err", err)

    //   })
    // }
  }

  getIndex(i){
    let sum = ((this.p - 1)*5) + (i+1);
    return sum;
  }

  tokenVerifyWithProductList() {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('all_product_new', '').subscribe((response) => {
        // console.log("get product ", response)
        if (response.success) {
          this.getProductDetails = response.data.product;
          this.productImageUrl = response.data.productImageUrl;
          this.categoryArray = response.data.categoryArray;
          this.pagination(this.getProductDetails.length)
        }
      })
      this.apiService.getService('category_list/product', '').subscribe((response) => {
        // console.log("get cat ", response)
        if (response.success) {
          this.categoryArray = response.data.category;
        }
      }, err => {
        console.log("get cat err", err)

      })
    }
  }

  pagination(length) {
    for (let i = 1; i <= length; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  // close error/ success message div
  closeMessageDiv() {
    // this.productListDiv = true;
    // this.isEditDiv = false;
    // this.searchErrDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }

  /// search product related ////
  // searchProduct() {
  //   if (this.searchInput != '') {
  //     this.searchCancelToggle = false;
  //     this.apiService.postService('search_product', { 'search_value': this.searchInput }).subscribe((res) => {
  //       // console.log("search",res)
  //       if (res.success) {
  //         this.getProductDetails = res.data;
  //         this.pagination(this.getProductDetails.length)
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
  // cancelSearchProduct() {
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

  /// edit product related ////
  startEdit(getProduct) {
    // console.log(getProduct)
    this.productListDiv = false;
    this.isEditDiv = true;
    this.editProductList = getProduct;
  }
  closeEdit() {
    this.productListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.ngOnInit();
  }
  editProductDetails(editProductList) {
    if (editProductList.product_name != '' && editProductList.product_description != '' &&
      editProductList.product_price != null && editProductList.product_price != '' &&
      editProductList.product_price != 0 &&
      editProductList.seller_phone != '' && editProductList.seller_phone.length >= 10) {
      // console.log(editProductList)
      this.apiService.putService('product', editProductList).subscribe((res) => {
        if (res.success == true) {
          this.successDiv = true;
          this.message = res.message;
          // this.ngOnInit();
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
  startDelete(getProduct) {
    if (confirm("Are you Sure? Delete this product...")) {
      this.apiService.deleteService('product' + '/' + getProduct._id, '').subscribe((res) => {
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
