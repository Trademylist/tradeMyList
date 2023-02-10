import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ValidationService } from 'src/app/services/validation-service.service';
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})

export class AdvertisementComponent implements OnInit {

  passing_param: any;
  displayAdvertiseName: any;

  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  adListDiv: boolean = true;
  isAddDiv: boolean = false;
  isEditDiv: boolean = false;

  showHideCountry: boolean;

  searchInput: any = '';

  getAdDetails: any = [];
  advertisementImageUrl: any;
  collection: any = [];
  p: number = 1;

  newAdList: any = {
    ad_title: '', ad_category: '', ad_type: 'None', AdMob: '', ad_link: '', ad_image: '', ad_country: ''
  };
  submitForm: boolean = false;

  file: File = null;

  editAdList: any;

  countryList: any = [];
  countryArray: any = [];
  dropdownSettings = {};

  constructor(private apiService: ApiService, private validationService: ValidationService,
    private _Activatedroute: ActivatedRoute) {
    this.showHideCountry = this.validationService.roleValidation();
  }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => {
      this.passing_param = params.get('id');
      // console.log(this.passing_param)
      if (this.passing_param == 1) {
        this.displayAdvertiseName = "Manage Product Advertisement"
        this.newAdList.ad_category = "product";
        this.getAdvertisement('product', 'product')
      } else if (this.passing_param == 2) {
        this.displayAdvertiseName = "Manage Freebies Advertisement"
        this.newAdList.ad_category = "freebies";
        this.getAdvertisement('freebies', 'freebies')
      } else if (this.passing_param == 3) {
        this.displayAdvertiseName = "Manage Offer Advertisement"
        this.newAdList.ad_category = "offer";
        this.getAdvertisement('offer', 'offer')
      } else if (this.passing_param == 4) {
        this.displayAdvertiseName = "Manage Vacancy Advertisement"
        this.newAdList.ad_category = "vacancy";
        this.getAdvertisement('vacancy', 'vacancy')
      }
    });
    this.dropdownSettings = {
      singleSelection: true,//false/true
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      disabled: !this.showHideCountry
    };
  }

  getAdvertisement(getValue, no) {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('all_ad/' + getValue, '').subscribe((response) => {
        // console.log("get all ad ", response)
        if (response.success) {
          this.getAdDetails = response.data.ad;
          this.advertisementImageUrl = response.data.adImageUrl;
          this.pagination(this.getAdDetails.length)
        }
      })
      this.apiService.getService('all_country', '').subscribe((response) => {
        console.log("get country", response.data)
        if (response.success) {
          this.countryList = response.data;
        }
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
    // this.adListDiv = true;
    // this.isAddDiv = false;
    // this.isEditDiv = false;
    // this.searchErrDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }
  addNew() {
    this.adListDiv = false;
    this.isAddDiv = true;
  }
  closeAdd() {
    this.adListDiv = true;
    this.isAddDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.newAdList.ad_image = '';
    this.newAdList.ad_title = '';
    this.newAdList.ad_category = '';
    this.newAdList.ad_link = '';
    this.newAdList.AdMob = '';
    this.newAdList.ad_type = 'None';
    this.newAdList.isBlock = false;
    this.countryList = [];
    this.countryArray = [];
    this.ngOnInit();
  }
  adTypeChange(value) {
    if (value == "AdMob") {
      this.newAdList.ad_image = '';
      this.newAdList.ad_link = '';
    } else {
      this.newAdList.AdMob = '';
    }
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.newAdList.ad_image = event.target.result;
      }
    }
  }
  onItemSelect(item: any) {
    // console.log(item);
    // console.log(this.countryArray);
  }
  OnItemDeSelect(item: any) {
    // console.log(item);
    // console.log(this.countryArray);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
  }
  addAdDetails() {
    if (this.newAdList.ad_title != '' && this.newAdList.ad_type != 'None') {
      if (this.newAdList.ad_image != '' || this.newAdList.AdMob != '') {
        this.submitForm = false;
        this.newAdList.ad_country=this.countryArray;
        console.log("add ad",this.newAdList)
        this.apiService.postService('ad', this.newAdList).subscribe((res) => {
          // console.log("add ad", res)
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
        this.submitForm = true;
      }

    }
  }
  // end

  /// edit advertisement related ////
  startEdit(getAd) {
    this.adListDiv = false;
    this.isEditDiv = true;
    this.editAdList = getAd;
    this.countryArray = getAd.country;
    // console.log("get edit country arr",this.countryArray)
  }
  closeEdit() {
    this.adListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.ngOnInit();
  }
  onEditSelectFile(event, editAdList) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.editAdList.ad_image = event.target.result;
      }
    }
  }
  editAdDetails(getValue) {
    if (getValue.ad_title != '' && getValue.ad_type != 'None') {
      if (getValue.ad_image != '' || getValue.AdMob != '') {
        this.submitForm = false;
        getValue.country = this.countryArray;
        this.apiService.putService('ad', getValue).subscribe((res) => {
          if (res.success == true) {
            this.successDiv = true;
            this.message = res.message;
          } else {
            this.errorDiv = true;
            this.message = res.message.message;
          }
        }, error => {
          this.errorDiv = true;
          this.message = error.message;
        });
      } else {
        this.submitForm = true;
      }
    }
  }
  /// end ///
  // delete ad
  startDelete(getValue) {
    if (confirm("Are you sure? Delete this ad...")) {
      this.apiService.deleteService('ad' + '/' + getValue._id, '').subscribe((res) => {
        // console.log(res)
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

}

