import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ValidationService } from 'src/app/services/validation-service.service';

@Component({
  selector: 'app-offer-discount-admin',
  templateUrl: './offer-discount-admin.component.html',
  styleUrls: ['./offer-discount-admin.component.css']
})
export class OfferDiscountAdminComponent implements OnInit {

  // searchErrDiv: boolean = false;
  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  searchInput: any = '';
  // searchCancelToggle: boolean = true;

  getOfferDiscountDetails: any = [];
  offerDiscountImageUrl: any;
  categoryArray: any;
  collection: any = [];
  p: number = 1;

  OfferDiscountListDiv: boolean = true;
  isAddDiv: boolean = false;
  isEditDiv: boolean = false;

  newOfferDiscountList: any = {
    offer_name: '', offer_category: '', offer_description: '',
    offer_image: '', seller_phone: '', owner_type: 'admin'
  };

  editOfferDiscountList: any;
  showHideCountry: boolean;

  constructor(private apiService: ApiService, private validationService: ValidationService, ) {
    this.showHideCountry = this.validationService.roleValidation();
  }

  ngOnInit() {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('all_offer', '').subscribe((response) => {
        // console.log("get offer ", response)
        if (response.success) {
          this.getOfferDiscountDetails = response.data.offer;
          this.offerDiscountImageUrl = response.data.offerImageUrl;
          this.pagination(this.getOfferDiscountDetails.length)
        }
      });
      this.apiService.getService('category_list/offer_admin', '').subscribe((response) => {
        // console.log("get cat ", response)
        if (response.success) {
          this.categoryArray = response.data.category;
        }
      });
    }
  }

  pagination(length) {
    for (let i = 1; i <= length; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  // close error/ success message div
  closeMessageDiv() {
    // this.OfferDiscountListDiv = true;
    // this.isAddDiv = false;
    // this.isEditDiv = false;
    // this.searchErrDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }

  /// search OfferDiscount related ////
  // searchOfferDiscount() {
  //   if (this.searchInput != '') {
  //     this.searchCancelToggle = false;
  //     this.apiService.postService('search_offer', { 'search_value': this.searchInput }).subscribe((res) => {
  //       // console.log("search",res)
  //       if (res.success) {
  //         this.getOfferDiscountDetails = res.data;
  //         this.pagination(this.getOfferDiscountDetails.length)
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
  // cancelSearchOfferDiscount() {
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

  // add new OfferDiscount 
  addNew() {
    this.OfferDiscountListDiv = false;
    this.isAddDiv = true;
  }
  closeAdd() {
    this.OfferDiscountListDiv = true;
    this.isAddDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.newOfferDiscountList.offer_image = '';
    this.newOfferDiscountList.offer_name = '';
    this.newOfferDiscountList.offer_category = '';
    this.newOfferDiscountList.offer_description = '';
    this.newOfferDiscountList.seller_phone = '';
    this.ngOnInit();
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.newOfferDiscountList.offer_image = event.target.result;
      }
    }
  }
  addOfferDiscountDetails() {
    if (this.newOfferDiscountList.offer_image != '' &&
      this.newOfferDiscountList.offer_name != '' &&
      this.newOfferDiscountList.offer_category != '' &&
      this.newOfferDiscountList.offer_description != '' &&
      this.newOfferDiscountList.seller_phone != '' && this.newOfferDiscountList.seller_phone.length == 10) {
      this.apiService.postService('offer', this.newOfferDiscountList).subscribe((res) => {
        // console.log("add res", res);
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
    } else {
      this.errorDiv = true;
      this.message = 'All fields required!!';
    }

  }
  // end

  /// edit OfferDiscount related ////
  startEdit(getValue) {
    this.OfferDiscountListDiv = false;
    this.isEditDiv = true;
    this.editOfferDiscountList = getValue;
  }
  closeEdit() {
    this.OfferDiscountListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.ngOnInit();
  }
  editOfferDiscountDetails(getValue) {
    if (getValue.offer_name != '' &&
      getValue.offer_category != '' &&
      getValue.offer_description != '' &&
      getValue.seller_phone != '') {
      this.apiService.putService('offer', getValue).subscribe((res) => {
        // console.log("update res", res);
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
    } else {
      this.errorDiv = true;
      this.message = 'All fields required!!';
    }
  }
  /// end ///

  /// delete OfferDiscount related ////
  startDelete(getValue) {
    if (confirm("Are you Sure? Delete this banner...")) {
      this.apiService.deleteService('offer' + '/' + getValue._id, '').subscribe((res) => {
        // console.log("delete res", res);
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
