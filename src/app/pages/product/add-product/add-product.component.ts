import { Component, NgZone, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service/api.service';
import { NetworkService } from 'src/app/services/geo-service/network.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent } from 'ngx-image-cropper';
declare var $: any;

export interface FileHandle {
  file: File,
  url: SafeUrl
}
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

@HostListener('mousewheel', ['$event']) onMouseWheelChrome(event: any) {
    this.disableScroll(event);
}

@HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.disableScroll(event);
}

@HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.disableScroll(event);
}


disableScroll(event: any) {
    if (event.srcElement.type === "number")
        event.preventDefault();
}

  //crop image section
  imageChangedEvent: any = '';
  croppedImage: any = '';
  coverImageProcessed = 0;
  additionalImageProcessed = 0;
  totalAdditionalImageSelected = 0;
  //crop Image section

  originalCoverImage: any[] = [];
  originalCoverImageFile: any[] = [];

  maxAdditionalImageError="";
  coverImage: any[] = [];
  additionalImages: any[] = [];
  latlong: any;
  taskType: string;
  pageTitle: any = '';
  productType: any;
  redirectUrl: any;
  allCategory: any;
  categoryImageUrl: any;
  productImageUrl: any;
  product: any = {};
  productNameDisplay: string;
  flag: boolean;
  flagNew: string = 'mi';
  carMakeSubCategoryList: [];
  carModelSubCategoryList: [];
  cartTrimSubCategoryList: [];
  house_sub_category: any = [
    {
      "key": "Type of listing",
      "value": [
        "For Rent",
        "For Sale"
      ],
      "image": [
        "assets/icon/for-rent.png",
        "assets/icon/for-sale.png"
      ]
    },
    {
      "key": "Type of Property",
      "value": [
        "Apartment",
        "Room",
        "House",
        "Commercial",
        "Other"
      ],
      "image": [
        "assets/icon/for-apartment.png",
        "assets/icon/for-room.png",
        "assets/icon/for-house.png",
        "assets/icon/for-commercial.png",
        "assets/icon/for-other.png"
      ]
    },
    {
      "key": "No of bedrooms",
      "value": [
        1,
        2,
        3,
        4
      ]
    },
    {
      "key": "No of bathrooms",
      "value": [
        1,
        1.5,
        2,
        2.5,
        3,
        3.5,
        4
      ]
    }
  ];
  property_sub_category: any = [
    {
      "key": "Furnishing",
      "value": [
        "Furnished",
        "Semi-Furnished",
        "Unfurnished",
        "Furnished",
        "Semi-Furnished",
        "Unfurnished",
        "Furnished",
        "Semi-Furnished",
        "Unfurnished"
      ]
    },
    {
      "key": "Construction Status",
      "value": [
        "New Launch",
        "Ready to Move",
        "Under Construction"
      ]
    },
    {
      "key": "Listed By",
      "value": [
        "Builder",
        "Dealer",
        "Owner"
      ]
    },
    {
      "key": "Car Parking",
      "value": [
        "0",
        "1",
        "2",
        "3",
        "4"
      ]
    }
  ];
  car_sub_category: any = [
    {
      "key": "Seller",
      "value": [
        "Individual",
        "Dealer"
      ]
    },
    {
      "key": "Transmission",
      "value": [
        "Manual",
        "Automatic"
      ],
      "image": [
        "assets/icon/for-manual.png",
        "assets/icon/for-automatic.png"
      ]
    }
  ];
  sendImageArray: Array<String> = [];
  // GoogleAutocomplete: google.maps.places.AutocompleteService;
  // autocompleteItems: any[];
  // geocoder;
  message: string;
  currencyCode: any;
  activeFlag: boolean = false;
  subCategoryElement: any;
  subCategory: any;
  subCategoryNumber: any;
  yearMin: any = 1990;
  yearMax: any = new Date();

  cover_thumb: string;
  uploadedImages: any = [];
  previousUploadedImages: any = [];
  totalImages: 12;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private _Activatedroute: ActivatedRoute,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private networkService: NetworkService,
    public zone: NgZone,

  ) {
    window.scroll(0,0);
    // this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    // this.autocompleteItems = [];
    // this.geocoder = new google.maps.Geocoder;
  }
  
  ngOnInit() {
    this.latlong = this.networkService.getLatLong();
    this.yearMax.setFullYear(this.yearMax.getFullYear() + 1);
    this.yearMax = this.yearMax.getFullYear();
    this.checkProduct();
    this.getCarSubCategory();

    this.networkService.onSelectProductAddress.subscribe((productAddress: any) => {
      console.log("productAddress", productAddress);
      let coordinates: any = [];
      if (productAddress != null || productAddress != undefined) {
        coordinates = [
          productAddress.longitude, productAddress.latitude
        ];
        this.product.address = productAddress.address;
        this.product.country = productAddress.country;
        this.product.geometry = { coordinates };
        this.getCurrentOnAddressChange();
      }

    })
  }


  getCarSubCategory(type = "Make") {
    let categoryName = "";
    if (type == "Make") {
      categoryName = "Make";
    } else if (type == "Model") {
      categoryName = this.product.make;
    } else if (type == "Trim") {
      categoryName = this.product.model
    }
    this.loaderService.present();
    this.apiService.postX('app_user/subCategoryList', { "name": categoryName, type: "Car" })
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          if (res.data.length) {
            if (type == "Make") {
              this.carMakeSubCategoryList = res.data[0].division;
            } else if (type == "Model") {
              this.carModelSubCategoryList = res.data[0].division;
            } else if (type == "Trim") {
              this.cartTrimSubCategoryList = res.data[0].division;
            }
          } else {
            if (type == "Model") {
              this.carModelSubCategoryList = [];
            } else if (type == "Trim") {
              this.cartTrimSubCategoryList = [];
            }
          }
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }
  onSelectCategory(event) {
    this.product.category = event.target.value;
  }
  getCarMakeModel(val) {
    this.product.make = val;
    this.getCarSubCategory('Model');
  }
  getCarMakeModelTrim(val) {
    this.product.model = val;
    this.getCarSubCategory("Trim");
  }
  ngOnDestroy() {
    if (this.uploadedImages.length > 0) {
      this.discardImages(this.uploadedImages);
      this.uploadedImages = [];
    }
  }
  discardImages(images) {
    let data = {
      file: images
    };
    this.apiService.postX('app_seller/discard', data).subscribe(() => { });
  }
  checkProduct() {
    this._Activatedroute.queryParams.subscribe(params => {
      // let params = paramsData.get('taskType');
      this.redirectUrl = params.redirectUrl;
      this.taskType = params.taskType;
      this.productType = params.productType;
      if (this.productType == 'product' || this.productType == 'Product') {
        this.getProductCategories();
      } else {
        this.productType = 'freebies'
        this.getCommercialCategories();
      }
      if (this.taskType == 'add') {
        let imageArray = {};//JSON.parse(params.sendImageArray);
        let itemCategory = undefined;//JSON.parse(params.sendCategory);
        this.pageTitle = "Listing details";
        this.getSavedAddress();
        this.addItem(params, imageArray, itemCategory);
      } else {
        this.editItem(params);
      }
    });
  }
  addItem(params, imageArray, itemCategory) {
    this.sendImageArray = [];
    this.productImageUrl = params.sendImageUrl;
    this.product.category = itemCategory;
    this.product.product_description = '';
    this.product.product_name = '';
    this.product.product_price = '';
    // this.product.seller_phone = '';
    if (this.product.category == "Car" || this.product.category == "Van & Trucks") {
      this.product.make = '';
      this.product.model = '';
      this.product.seller = '';
      this.product.transmission = '';
      this.product.trim = '';
      this.product.unit = 'Miles';
      this.product.year = 2000;
      this.product.range = undefined;
    } else if (this.product.category == "Housing") {
      this.product.typeList = '';
      this.product.propertyType = '';
      this.product.bedRoomNo = '';
      this.product.bathRoomNo = '';
    } else if (this.product.category == "Property") {
      this.product.furnishing = this.property_sub_category[0].value[0];
      this.product.construction_status = this.property_sub_category[1].value[0];
      this.product.listed_by = this.property_sub_category[2].value[0];
      this.product.super_builtup_area = '';
      this.product.carpet_area = '';
      this.product.maintenance = '';
      this.product.car_parking = this.property_sub_category[3].value[0];
      this.product.washrooms = '';
    } else if (this.product.category == "Jobs & Services") {
      this.product.salary_from = '';
      this.product.salary_to = '';
      this.product.ad_title = '';
      this.product.additional_info = '';
    }
  }
  editItem(params) {
    this.pageTitle = "Edit Listing";
    let itemId = params.product_id;
    if (this.productType == 'product' || this.productType == 'Product') {
      this.getItem('app_seller/product', itemId);
    } else {
      this.getItem('app_seller/freebies', itemId);
    }
  }
  getProductCategories() {
    this.loaderService.presentLoader('');
    this.apiService.getX('app_user/category_list/product', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.allCategory = res.data.category;
          this.categoryImageUrl = res.data.categoryImageUrl;
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }
  getCommercialCategories() {
    this.loaderService.presentLoader('');
    this.apiService.getX('app_user/category_list/freebies', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.allCategory = res.data.category;
          this.categoryImageUrl = res.data.categoryImageUrl;
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }

  getItem(urlString: string, id) {
    // this.apiService.getX(urlString, id).subscribe(resp => {
    //   if (resp.success) {
    //     this.productImageUrl = resp.data.productImageUrl;
    //     let respData = resp.data.product;
    //     this.product._id = respData._id;
    //     this.cover_thumb = respData.cover_thumb ? respData.cover_thumb : '';
    //     this.coverImage.push({ url: this.cover_thumb });
    //     this.product.cover_thumb = respData.cover_thumb ? respData.cover_thumb : '';
    //     this.product.address = respData.address;
    //     this.product.category = respData.category;
    //     this.product.country = respData.country;
    //     this.product.createdAt = respData.createdAt;
    //     this.product.geometry = respData.geometry;
    //     this.product.image = respData.image;
    //     if (respData.image.length > 0) {
    //       this.originalCoverImage[0] = respData.image[0];
    //     }
    //     for (let adImg = 1; adImg < respData.image.length; adImg++) {
    //       this.additionalImages.push({ url: respData.image[adImg] });
    //     }
    //     this.product.isBlock = respData.isBlock;
    //     this.product.likelist = respData.likelist;
    //     this.product.product_description = respData.product_description;
    //     this.product.product_name = respData.product_name;
    //     this.product.product_price = respData.product_price;
    //     this.product.currencyCode = respData.currencyCode;
    //     // this.product.seller_phone = respData.seller_phone;
    //     this.product.soldOut = respData.soldOut;
    //     if (this.productType == 'product' || this.product.category == "Van & Trucks") {
    //       this.subCategory = respData.sub_category;
    //       this.subCategoryNumber = respData.sub_category_number;
    //     }
    //     if (this.product.category == "Car" || this.product.category == "Van & Trucks") {
    //       console.log(this.subCategory);
    //       this.product.make = this.subCategory[0].value;
    //       this.getCarMakeModel(this.product.make);
    //       this.product.model = this.subCategory[1].value;
    //       this.getCarMakeModelTrim(this.product.model);
    //       this.product.seller = this.subCategory[2].value;
    //       this.product.transmission = this.subCategory[3].value;
    //       this.product.trim = this.subCategory[4].value;
    //       this.product.unit = this.subCategory[5].value;
    //       this.product.year = this.subCategoryNumber[0].value;
    //       if (this.product.unit == 'Miles' || this.product.unit == 'miles') {
    //         this.flag == true;
    //         this.flagNew = 'mi';
    //         this.product.range = this.subCategoryNumber[1].value;
    //       } else {
    //         this.flag == false;
    //         this.flagNew = 'km';
    //         this.product.range = this.subCategoryNumber[1].value / 0.621371;
    //         this.subCategoryNumber[1].value = this.product.range;
    //       }
    //     } else if (this.product.category == 'Housing') {
    //       this.product.typeList = this.subCategory[0].value;
    //       this.product.propertyType = this.subCategory[1].value;
    //       this.product.bedRoomNo = this.subCategoryNumber[0].value;
    //       this.product.bathRoomNo = this.subCategoryNumber[1].value;
    //     } else if (this.product.category == 'Property') {
    //       this.product.furnishing = this.subCategory[0].value;
    //       this.product.construction_status = this.subCategory[1].value;
    //       this.product.listed_by = this.subCategory[2].value;
    //       this.product.super_builtup_area = this.subCategory[3].value;
    //       this.product.carpet_area = this.subCategory[4].value;
    //       this.product.maintenance = this.subCategory[5].value;
    //       this.product.car_parking = this.subCategory[6].value;
    //       this.product.washrooms = this.subCategory[7].value;
    //     } else if (this.product.category == 'Jobs & Services') {
    //       this.product.salary_from = this.subCategory[0].value;
    //       this.product.salary_to = this.subCategory[1].value;
    //       this.product.ad_title = this.subCategoryNumber[0].value;
    //       this.product.additional_info = this.subCategoryNumber[1].value;
    //     }
    //     this.sendImageArray = respData.image;
    //     console.log(this.product);
    //     console.log(this.productImageUrl);
    //   } else {
    //     this.toastService.presentToast(resp.message);
    //   }
    // });

    this.apiService.getX(urlString, id).subscribe(resp => {
      if (resp.success) {
        this.productImageUrl = resp.data.productImageUrl;
        let respData = resp.data.product;
        this.product._id = respData._id;
        this.cover_thumb = respData.cover_thumb ? respData.cover_thumb : '';
        this.product.cover_thumb = respData.cover_thumb ? respData.cover_thumb : '';
        this.coverImage.push({ url: this.cover_thumb });
        this.product.address = respData.address;
        this.product.category = respData.category;
        this.product.country = respData.country;
        this.product.createdAt = respData.createdAt;
        this.product.geometry = respData.geometry;
        this.product.image = respData.image;

        if (respData.image.length > 0) {
          this.originalCoverImage[0] = respData.image[0];
        }
        for (let adImg = 1; adImg < respData.image.length; adImg++) {
          this.additionalImages.push({ url: respData.image[adImg] });
        }

        this.product.isBlock = respData.isBlock;
        this.product.likelist = respData.likelist;
        this.product.product_description = respData.product_description;
        this.product.product_name = respData.product_name;
        this.product.product_price = respData.product_price;
        this.product.currencyCode = respData.currencyCode;
        this.product.soldOut = respData.soldOut;
        this.subCategory = respData.sub_category;
        this.subCategoryNumber = respData.sub_category_number;
        if (this.product.category == "Car" || this.product.category == "Van & Trucks") {
          this.product.make = this.subCategory[0].value;
          this.getCarMakeModel(this.product.make);
          this.product.model = this.subCategory[1].value;
          this.getCarMakeModelTrim(this.product.model);
          this.product.seller = this.subCategory[2].value;
          this.product.transmission = this.subCategory[3].value;
          this.product.trim = this.subCategory[4].value;
          this.product.unit = this.subCategory[5].value;
          this.product.year = this.subCategoryNumber[0].value;
          if (this.product.unit == 'Miles' || this.product.unit == 'miles') {
            this.flag == true;
            this.flagNew = 'mi';
            this.product.range = this.subCategoryNumber[1].value;
          } else {
            this.flag == false;
            this.flagNew = 'km';
            this.product.range = this.subCategoryNumber[1].value / 0.621371;
            this.subCategoryNumber[1].value = this.product.range;
          }
        } else if (this.product.category == 'Housing') {
          this.product.typeList = this.subCategory[0].value;
          this.product.propertyType = this.subCategory[1].value;
          this.product.bedRoomNo = this.subCategoryNumber[0].value;
          this.product.bathRoomNo = this.subCategoryNumber[1].value;
        } else if (this.product.category == 'Property') {
          this.product.furnishing = this.subCategory[0].value;
          this.product.construction_status = this.subCategory[1].value;
          this.product.listed_by = this.subCategory[2].value;
          this.product.car_parking = this.subCategoryNumber[0].value;
          this.product.super_builtup_area = this.subCategoryNumber[1].value;
          this.product.carpet_area = this.subCategoryNumber[2].value;
          this.product.maintenance = this.subCategoryNumber[3].value;
          this.product.washrooms = this.subCategoryNumber[4].value;
        } else if (this.product.category == 'Jobs' || this.product.category == 'Services') {
          this.product.type_of_job = respData.sub_category[0].value;
        }
        this.sendImageArray = respData.image;
      } else {
        this.toastService.presentToast(resp.message);
      }
    });
  }
  getCurrAddress(latlong) {
    // let lat = parseFloat(latlong.latitude);
    // let lng = parseFloat(latlong.longitude);
    // let options: NativeGeocoderOptions = {
    //   useLocale: true,
    //   maxResults: 5
    // };
    // this.nativeGeocoder.reverseGeocode(lat, lng, options)
    //   .then((result: NativeGeocoderResult[]) => {
    //     let coordinates: any = [];
    //     coordinates = [lng, lat];
    //     this.product.geometry = { coordinates };
    //     this.product.address = "";
    //     let responseAddress = [];
    //     for (let [key, value] of Object.entries(result[0])) {
    //       if (value.length > 0)
    //         responseAddress.push(value);
    //     }
    //     responseAddress.reverse();
    //     for (let value of responseAddress) {
    //       this.product.address += value + ", ";
    //     }
    //     this.product.address = this.product.address.slice(0, -2);
    //     this.product.country = result[0].countryName;
    //     this.apiService.postX('app_user/currency', { 'country': this.product.country })
    //       .subscribe((res) => {
    //         if (res.success) {
    //           this.currencyCode = res.code;
    //           this.product.currencyCode = this.currencyCode;
    //         } else {
    //           this.message = 'Something went wrong; please try again later.';
    //         }
    //       }, error => {
    //         this.product.currencyCode = 'INR';
    //       });
    //   })
    //   .catch((error: any) => {
    //     this.product.address = 'Address Not Available!';
    //   });
  }
  getSavedAddress() {
    let coordinates: any = [];
    coordinates = [localStorage.getItem('longitude'), localStorage.getItem('latitude')];
    //coordinates = [23,86];

    this.product.geometry = { coordinates };
    this.product.address = localStorage.getItem('address');
    this.product.country = localStorage.getItem('country');
    this.apiService.postX('app_user/currency', { 'country': this.product.country })
      .subscribe((res) => {
        if (res.success) {
          this.currencyCode = res.code;
          this.product.currencyCode = this.currencyCode;
        } else {
          this.message = 'Something went wrong; please try again later.';
        }
      }, error => {
        this.product.currencyCode = 'INR';
      });
  }
  compareWithFN(o1, o2) {
    return o1 === o2;
  }

  getCurrentOnAddressChange() {
    this.loaderService.presentLoader('');
    this.apiService.postX('app_user/currency', { 'country': this.product.country })
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.currencyCode = res.code;
          this.product.currencyCode = this.currencyCode;
        } else {
          this.message = 'Something went wrong; please try again later.';
        }
      }, error => {
        this.loaderService.dismiss();
        this.product.currencyCode = 'INR';
      });
  }


  uploadFile(imageData, position, imageCheck, fileDataType) {
    console.log(imageData, position, imageCheck, fileDataType);
    const frmData = new FormData();
    if (imageData != '') {
      let today: any = new Date();
      let fileNameSet: string = 'trade_' + today.getTime() + '.' + fileDataType;
      frmData.append('file', imageData, fileNameSet);
      console.log('form data', frmData.getAll('file'));
      this.loaderService.presentLoader('');
      this.apiService.uploadFile('app_seller/upload', frmData)
        .subscribe((res) => {

          if (res.success) {
            this.productImageUrl = res.data.path;
            this.uploadedImages.push(res.data.image);
            if (imageCheck == 'cover') {
              this.coverImageProcessed++;
              if (position == 0) {

                if (this.originalCoverImage[0] != undefined && this.originalCoverImage[0] != "") {
                  //this.totalImages += 1;
                  this.previousUploadedImages.push(this.originalCoverImage[0]);
                }
                this.originalCoverImage[0] = res.data.image;
              } else {
                if (this.cover_thumb != undefined && this.cover_thumb != "") {
                  //this.totalImages += 1;
                  this.previousUploadedImages.push(this.cover_thumb);
                }
                this.cover_thumb = res.data.image;
                this.coverImage[0] = { url: this.cover_thumb };
              }
              if (this.coverImageProcessed == 2) {
                this.loaderService.dismiss();
              }
              // this.zone.run(() => {

              //   //alert(this.cover_thumb);
              // });
            } else {
              this.additionalImageProcessed++;
              if (this.sendImageArray[position] != undefined) {
                this.totalImages += 1;
                //this.previousUploadedImages.push(this.sendImageArray[position]);
              }
              
              this.zone.run(() => {
                //this.sendImageArray[position] = res.data.image;
                this.sendImageArray.push(res.data.image);
                if (this.sendImageArray.length > 0) {
                  this.activeFlag = false;
                }

              });
              console.log(this.sendImageArray);
              if (this.additionalImageProcessed == this.totalAdditionalImageSelected) {
                this.loaderService.dismiss();
              }
              //alert((this.additionalImages.length-this.totalAdditionalImageSelected+this.additionalImageProcessed-1));
              this.additionalImages[this.additionalImages.length-this.totalAdditionalImageSelected+this.additionalImageProcessed-1]={url:res.data.image};
            }
            this.totalImages -= 1;
          } else {
            this.toastService.presentToast(res.message);
            this.loaderService.dismiss();
          }
        }, error => {
          this.loaderService.dismiss();
          this.toastService.presentErrorToast("File not uploaded, pelase try again.");
          if (imageCheck == 'cover') {
            $("#cover_image").val("");
            this.cover_thumb = "";
          } else {
            if (this.additionalImages.length == 1) {
              $("#additional_images").val("");
              this.additionalImages.pop();
            }
          }
        });
    }
  }

  uploadMultipleFile(files) {
    const frmData = new FormData();
    if (files != '') {
      let today: any = new Date();
      let fileNameSet: string = "trade";
      for (const file of files) {
        fileNameSet = 'trade_' + today.getTime();
        frmData.append(fileNameSet, file.file);
        console.log('form data', file.file);
      }
      // let fileNameSet: string = 'trade_' + today.getTime() + '.' + fileDataType;
      // frmData.append('files', imagesData);
      console.log('form data', frmData.getAll('file'));
      this.apiService.uploadFile('app_seller/upload_multiple', frmData)
        .subscribe((res) => {
          if (res.success) {
            console.log(res);
            this.loaderService.dismiss();
          } else {
            this.toastService.presentToast(res.message);
            this.loaderService.dismiss();
          }
        });
    }
  }

  async deleteImage(imgEntry, position) {
    if (confirm("Delete Additional Image?")) {
      if (this.additionalImages.length == 1) {
        $("#additional_images").val("");
      }
      this.additionalImages.splice(position, 1);

      // let indexOfDeletedItem = this.sendImageArray.indexOf(imgEntry);
      // if (indexOfDeletedItem !== -1) {
      //   this.sendImageArray.splice(indexOfDeletedItem, 1);
      // }
      this.imageDelete(imgEntry, position, 'additional');
    }

  }
  async deleteCoverImage(imgEntry, position) {
    if (confirm("Delete Cover Image?")) {
      $("#cover_image").val("");
      this.cover_thumb = "";
      this.imageDelete(imgEntry, position, 'cover')
    }

  }

  imageDelete(imgEntry, position, imageType) {
    console.log(this.sendImageArray);
    this.loaderService.presentLoader('Please wait....');
    this.apiService.postX('app_seller/unlink', { 'file': imgEntry, product_id: this.product._id })
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.message = "Image deleted successfully.";
          let removedImageIndex = this.sendImageArray.findIndex(image => image == imgEntry);
          if (removedImageIndex != -1) {
            this.sendImageArray.splice(removedImageIndex, 1);
          }
          // if (imageType == "additional") {
          //   if (this.cover_thumb != undefined && this.cover_thumb != "") {
          //     this.sendImageArray.splice(position + 1, 1);
          //   } else {
          //     this.sendImageArray.splice(position, 1);
          //   }
          // }else if(imageType =="cover"){
          //   this.sendImageArray.splice(0, 1);
          // }

          console.log("console.log(this.sendImageArray)", this.sendImageArray);
          this.toastService.presentToast(this.message);
        } else {
          this.toastService.presentErrorToast(res.message);
        }
      }, error => {
        this.loaderService.dismiss();
        this.toastService.presentToast(error);
      });
  }
  onCategoryChange(): void {
    if (this.product.category == "Car" || this.product.category == "Van & Trucks") {
      this.product.make = '';
      this.product.model = '';
      this.product.trim = '';
      this.product.year = 2000;
      this.product.unit = 'Miles';
      this.product.range = undefined;
      this.product.seller = '';
      this.flag == true;
      this.flagNew = 'mi';
      this.checkCarRange();
    } else if (this.product.category == "Housing") {
      this.product.typeList = this.house_sub_category[0].value[0];
      this.product.propertyType = this.house_sub_category[1].value[0];
      this.product.bedRoomNo = this.house_sub_category[2].value[0];
      this.product.bathRoomNo = this.house_sub_category[3].value[0];
    } else if (this.product.category == "Property") {
      this.product.furnishing = this.property_sub_category[0].value[0];
      this.product.construction_status = this.property_sub_category[1].value[0];
      this.product.listed_by = this.property_sub_category[2].value[0];
      this.product.super_builtup_area = '';
      this.product.carpet_area = '';
      this.product.maintenance = '';
      this.product.car_parking = this.property_sub_category[3].value[0];
      this.product.washrooms = '';
    } else if (this.product.category == "Jobs & Services") {
      this.product.salary_from = '';
      this.product.salary_to = '';
      this.product.ad_title = '';
      this.product.additional_info = '';
    }
  }
  checkCarRange() {
    if (this.product.range == undefined || isNaN(this.product.range)) {
      return true;
    } else {
      return false;
    }
  }
  goCarSubCategory(type) {
    let selected;
    if (type == 'Make') {
      selected = this.product.make;
      this.openSubCatModal(type, 'Make', selected);
    } else if (type == 'Model') {
      if (this.product.make != '') {
        selected = this.product.model;
        this.openSubCatModal(type, this.product.make, selected);
      }
    } else if (type == 'Trim') {
      if (this.product.model != '') {
        selected = this.product.trim;
        this.openSubCatModal(type, this.product.model, selected);
      }
    }
  }
  async openSubCatModal(type, value, selected) {
    // const modal = await this.modalController.create({
    //   component: ProductFilterSubcategoryPage,
    //   componentProps: {
    //     "subCategoriesType": type,
    //     "subCategories": value,
    //     "selectedSubCategory": selected
    //   }
    // });
    // modal.onDidDismiss().then((data: any) => {
    //   if (data['data'] != undefined) {
    //     if (type == 'Make') {
    //       this.product.make = data['data'].subCategory;
    //       this.product.model = '';
    //       this.product.trim = '';
    //     } else if (type == 'Model') {
    //       this.product.model = data['data'].subCategory;
    //       this.product.trim = '';
    //     } else if (type == 'Trim') {
    //       this.product.trim = data['data'].subCategory;
    //     }
    //   }
    // });
    // return await modal.present();
  }
  async goEditSubCategory(type, value) {
    let selected;
    if (type == 'Make') {
      selected = this.product.make;
    } else if (type == 'Model') {
      selected = this.product.model;
    } else if (type == 'Trim') {
      selected = this.product.trim;
    }
    // const modal = await this.modalController.create({
    //   component: ProductFilterSubcategoryPage,
    //   componentProps: {
    //     "subCategoriesType": type,
    //     "subCategories": value,
    //     "selectedSubCategory": selected
    //   }
    // });
    // modal.onDidDismiss().then((data: any) => {
    //   if (data['data'] != undefined) {
    //     if (type == 'Make') {
    //       this.product.make = data['data'].subCategory;
    //     } else if (type == 'Model') {
    //       this.product.model = data['data'].subCategory;
    //     } else if (type == 'Trim') {
    //       this.product.trim = data['data'].subCategory;
    //     }
    //   }
    // });
    // return await modal.present();
  }
  selectTypeList(data) {
    //if the track was selected already, unselect it; else select this track. 
    if (this.isSelectedTypeList(data)) {
      this.product.typeList = null;
    } else {
      this.product.typeList = data;
    }
  }
  isSelectedTypeList(data) {
    return this.product.typeList === data;
  }
  selectPropertyType(data) {
    //if the track was selected already, unselect it; else select this track. 
    if (this.isSelectedPropertyType(data)) {
      this.product.propertyType = null;
    } else {
      this.product.propertyType = data;
    }
  }
  isSelectedPropertyType(data) {
    this.product.sub_category.map((val) => {
      console.log(val);
    })
    return this.product.propertyType === data;
  }
  selectBedRoom(data) {
    //if the track was selected already, unselect it; else select this track. 
    // if (this.isSelectedBedRoom(data)) {
    //   this.product.bedRoomNo = null;
    // } else {
    this.product.bedRoomNo = data;
    //}
  }
  isSelectedBedRoom(data) {
    return this.product.bedRoomNo === data;
  }
  selectBathRoom(data) {
    // if (this.isSelectedBathRoom(data)) {
    //   this.product.bathRoomNo = null;
    // } else {
    this.product.bathRoomNo = data;
    // }
  }
  isSelectedBathRoom(data) {
    return this.product.bathRoomNo === data;
  }
  // for car sub filter
  selectSeller(data) {
    //if the track was selected already, unselect it; else select this track. 
    if (this.isSelectedSeller(data)) {
      this.product.seller = null;
    } else {
      this.product.seller = data;
    }
  }
  isSelectedSeller(data) {
    return this.product.seller === data;
  }
  selectTransmission(data) {
    //if the track was selected already, unselect it; else select this track. 
    if (this.isSelectedTransmission(data)) {
      this.product.transmission = null;
    } else {
      this.product.transmission = data;
    }
  }
  isSelectedTransmission(data) {
    return this.product.transmission === data;
  }
  selectFurnishing(data) {
    // if (this.isSelectedFurnishing(data)) {
    //   this.product.furnishing = null;
    // } else {
    this.product.furnishing = data;
    // }
  }
  isSelectedFurnishing(data) {
    return this.product.furnishing === data;
  }
  selectConstructionStatus(data) {
    // if (this.isSelectedConstructionStatus(data)) {
    //   this.product.construction_status = null;
    // } else {
    this.product.construction_status = data;
    // }
  }
  isSelectedConstructionStatus(data) {
    return this.product.construction_status === data;
  }
  selectListedBy(data) {
    // if (this.isSelectedListedBy(data)) {
    //   this.product.listed_by = null;
    // } else {
    this.product.listed_by = data;
    //}
  }
  isSelectedListedBy(data) {
    return this.product.listed_by === data;
  }
  selectCarParking(data) {
    // if (this.isSelectedCarParking(data)) {
    //   this.product.car_parking = null;
    // } else {
    this.product.car_parking = data;
    // }
  }
  isSelectedCarParking(data) {
    return this.product.car_parking === data;
  }
  // called when you click the posted within
  select(track) {
    //if the track was selected already, unselect it; else select this track. 
    if (this.isSelected(track)) {
      this.product.no_of_day = null;
    } else {
      this.product.no_of_day = track;
    }
  }
  // check the selected track, if true then 
  isSelected(track) {
    return this.product.no_of_day === track; // the track that you selected
  }
  goLocation() {
    this.networkService.selectedLocationAddress.next('setProductAddress');
    $("#location-alert").show();

  }
  closeModal() {
    $("#location-alert").hide();
  }
  // autofill address //
  sellerUploadProduct() {

    let product_price: HTMLElement = document.getElementById('product_price');
    let product_name: HTMLElement = document.getElementById('product_name');
    let product_cover: HTMLElement = document.getElementById('product_cover');
    product_name.innerHTML = '';
    product_cover.innerHTML = '';
    product_price.innerHTML = '';
    // if (this.productType === 'product') {
    //   product_price = document.getElementById('product_price');
    //   product_price.innerHTML = '';
    // }
    let address: HTMLElement = document.getElementById('address');
    address.innerHTML = '';
    // let seller_phone: HTMLElement = document.getElementById('phone');
    // seller_phone.innerHTML = '';
    let product_description: HTMLElement = document.getElementById('product_description');
    product_description.innerHTML = '';
    if (this.cover_thumb == undefined || this.cover_thumb == '') {
      product_cover.innerHTML = 'Please enter product cover image.';
    } else if ((this.product.product_name == '') || (this.product.product_name == undefined)) {
      product_name.innerHTML = 'Please enter product name.';
    } else if ((this.product.address == '') || (this.product.address == undefined)) {
      address.innerHTML = 'Please enter address.';
    } else if ((this.product.product_description == '') || (this.product.product_description == undefined)) {
      product_description.innerHTML = 'Please enter product description.';
    } else if (this.product.product_price == '' || this.product.product_price == undefined) {
      product_price.innerHTML = 'Please enter product price.';
    }
    // else if ((this.product.seller_phone == '') || (this.product.seller_phone == undefined)) {
    //   seller_phone.innerHTML = 'Please enter seller phone.';
    // } 
    else {
      console.log(this.sendImageArray);
      if (this.originalCoverImage.length > 0) {
        this.sendImageArray.unshift(this.originalCoverImage[0]);
      }
      let productImageArray = [];
      for (const property in this.sendImageArray) {
        console.log(this.sendImageArray[property]);
        productImageArray.push(this.sendImageArray[property]);
      }
      // for (let i in this.sendImageArray) {
      //   productImageArray.push([productImageArray[i]]);
      // }
      this.product.image = productImageArray;
      this.product.cover_thumb = this.cover_thumb;
      console.log("productImageArray", this.product);

      this.product.product_type = this.productType == 'product' ? 'Product' : 'Commercial';
      this.loaderService.presentLoader('Posting..');
      this.apiService.postX('app_seller/' + this.productType, this.product)
        .subscribe((res) => {
          this.loaderService.dismiss();
          if (res.success) {
            this.uploadedImages = [];
            this.sendImageArray = [];
            if (this.previousUploadedImages.length > 0) {
              this.uploadedImages = this.previousUploadedImages;
            }
            if (this.productType === 'product' || this.productType === 'Product') {
              this.message = "Product uploaded successfully.";
            }
            if (this.productType === 'freebies') {
              this.message = "Commercial uploaded successfully.";
            }
            this.toastService.presentToast(this.message);
            // this.goBack();
            sessionStorage.removeItem("product_list");
            sessionStorage.removeItem("product_count");
            sessionStorage.removeItem("home_scroll");
            this.router.navigate(["/home-page"]);
          } else {
            this.toastService.presentToast(res.message);
          }
        }, error => {
          this.loaderService.dismiss();
          this.toastService.presentToast(error.message);
        });
    }
  }

  sellerEditProduct() {
    let product_price: HTMLElement = document.getElementById('product_price');
    let product_name: HTMLElement = document.getElementById('product_name');
    let product_cover: HTMLElement = document.getElementById('product_cover');
    product_name.innerHTML = '';
    product_cover.innerHTML = '';
    product_price.innerHTML = '';
    // if (this.productType == 'product') {
    //   product_price = document.getElementById('product_price');
    //   product_price.innerHTML = '';
    // }
    let address: HTMLElement = document.getElementById('address');
    address.innerHTML = '';
    // let seller_phone: HTMLElement = document.getElementById('phone');
    // seller_phone.innerHTML = '';
    let product_description: HTMLElement = document.getElementById('product_description');
    product_description.innerHTML = '';
    if (this.cover_thumb == undefined || this.cover_thumb == '') {
      product_cover.innerHTML = 'Please enter product cover image.';
    } else if ((this.product.product_name == '') || (this.product.product_name == undefined)) {
      product_name.innerHTML = 'Please enter product name.';
    } else if ((this.product.address == '') || (this.product.address == undefined)) {
      address.innerHTML = 'Please enter address.';
    } else if ((this.product.product_description == '') || (this.product.product_description == undefined)) {
      product_description.innerHTML = 'Please enter product description.';
    } else if (this.product.product_price == '' || this.product.product_price == undefined) {
      product_price.innerHTML = 'Please enter product price.';
    }
    // else if ((this.product.seller_phone == '') || (this.product.seller_phone == undefined)) {
    //   seller_phone.innerHTML = 'Please enter seller phone.';
    // } 
    else {
      if (this.originalCoverImage.length > 0) {
        this.sendImageArray[0] = this.originalCoverImage[0];
      }
      this.product.image = this.sendImageArray;
      if (this.previousUploadedImages.length > 0) {
        //this.product.image = this.previousUploadedImages.concat(this.sendImageArray);
      }

      // console.log(this.product.image);
      // return false;
      this.product.cover_thumb = this.cover_thumb;
      if (this.productType === 'commercial') {
        this.productType = 'freebies';
      }

      this.loaderService.presentLoader('Posting...');
      this.apiService.putX('app_seller/' + this.productType + '/' + this.product._id, this.product)
        .subscribe((res) => {
          this.loaderService.dismiss();
          if (res.success) {
            this.uploadedImages = [];
            if (this.previousUploadedImages.length > 0) {
              this.uploadedImages = this.previousUploadedImages;
            }
            if (this.productType === 'product' || this.productType === 'Product') {
              this.message = "Product updated successfully.";
            }
            if (this.productType === 'freebies') {
              this.message = "Commercial updated successfully.";
            }
            this.toastService.presentToast(this.message);
            this.goBack();
          } else {
            this.toastService.presentToast(res.message);
          }
        }, error => {
          this.loaderService.dismiss();
          this.toastService.presentToast(error.message);
        });
    }
  }
  async closeAddEdit() {
    let head;
    if (this.pageTitle == "Listing details") {
      head = "You're really, really close to posting it and making that sale.";
    } else {
      head = 'Are you sure you want to discard these changes?';
    }

    if (confirm(head)) {
      this.goBack();
    }

  }

  goBack() {
    let productPath = "trade/product";
    // if (this.redirectUrl == 'all-product' || this.redirectUrl == '/app/product') {
    //   this.router.navigate(['app/product']);
    // } else if (this.redirectUrl == 'all-commercial' || this.redirectUrl == '/app/commercial') {
    //   this.router.navigate(['app/commercial']);
    // }
 
      this.router.navigate([productPath + '/my-product-listing/'+this.redirectUrl]);
    
  }

  milesClick() {
    this.flag == true;
    this.flagNew = 'mi';
  }
  kmClick() {
    this.flag == false;
    this.flagNew = 'km';
  }
  splitWord(productName: string, val: number) {
    const strToArray = productName.length;
    const itemName = productName;
    return strToArray > 6 ? `${itemName.substring(0, 4)} ...` : itemName;
  }
  /** Function is used to check if any cover image is uploaded and shows cover image according to it
   */
  coverImageCheck() {
    if (this.cover_thumb != '' && this.cover_thumb != undefined) {
      this.coverImage.push({ url: this.productImageUrl + this.cover_thumb })
      // return (this.productImageUrl + this.cover_thumb);

    } else {

      // if (this.sendImageArray[0] != '' && this.sendImageArray[0] != undefined) {
      //   return (this.productImageUrl + this.sendImageArray[0]);
      // } else {
      //   return 'assets/imgs/upload-ing-bg.jpg';
      // }
    }
  }


  /** Function is used to display product title according to category selected
   * @param  {string} category
   */
  displayProductTitle(category: string) {
    if (category == "Jobs") {
      return "Job name";
    } else if (category == "Services") {
      return "Service name";
    } else if (category == "Jobs & Services") {
      return "Job name";
    } else if (category == undefined || (category != "Jobs" && category != "Services")) {
      return "Product name";
    }
  }
  showLength(data) {
    if (data == "" || data == undefined || data == null) {
      return 0;
    } else {
      return data.toString().length;
    }
  }


















  /**
   * 
   * @param event Crop Image handling
   */

  imageCropped(event: ImageCroppedEvent) {

    console.log(event);
    this.croppedImage = event.base64;

  }
  imageLoaded() {
    // show cropper
    $('#crop-modal').show();
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  base64ToFile(base64Image: string): Blob {
    const split = base64Image.split(',');
    const type = split[0].replace('data:', '').replace(';base64', '');
    const byteString = atob(split[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type });
  }

  uploadCoverCroped() {
    this.coverImageProcessed = 0;
    const imageUrlBase64 = this.croppedImage;
    let croppedImageName = new Date().getTime();
    let imageFile = new File([this.base64ToFile(this.croppedImage)], "cropped_image_" + croppedImageName + ".png", { type: 'image/png' });
    console.log("d", imageFile);
    $('#crop-modal').hide();
    this.prepareCoverImageFilesList([{ file: imageFile, url: imageUrlBase64 }]);
    this.prepareCoverOriginalImageFilesList(this.originalCoverImageFile); // also orginal image will be uploaded in first index of additional image
  }

  closeCropModal() {
    $('#crop-modal').hide();
    $("#cover_image").val("");
  }
  /** Crop Image Handling */




  /**
   * on file drop handler
   */
  onCoverImageFileDropped($event) {
    this.originalCoverImageFile = [];
    console.log($event)
    this.imageChangedEvent = { target: { files: [$event[0].file] } }
    //this.prepareCoverImageFilesList($event) ;
    this.originalCoverImageFile = $event;
  }


  onAdditionalImagesFileDropped($event) {
    let totalImageSelected = this.additionalImages.length+$event.length;
    if(totalImageSelected>10){
      this.maxAdditionalImageError="More than 10 additional images not allowed!"
      return false;
  }else{
    this.maxAdditionalImageError = "";
  }
    this.prepareAdditionalImagesFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileCoverImageBrowseHandler(event) {
    this.originalCoverImageFile = [];
    console.log(event.target.files);
    this.imageChangedEvent = event;
    let files: FileHandle[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      this.originalCoverImageFile.push({ file, url });
      console.log("sdfsadfsadfdsa", this.originalCoverImageFile);
      $('#product_cover').empty();
    }
    // this.imageChangedEvent = event;
    // this.prepareCoverImageFilesList(files);
  }

  
  fileAdditionalImagesBrowseHandler(event) {
    let totalImageSelected = this.additionalImages.length+event.target.files.length;
    if(totalImageSelected>10){
    // if(event.target.files.length>10){
        this.maxAdditionalImageError="More than 10 additional images not allowed!"
        return false;
    }else{
      this.maxAdditionalImageError = "";
    }
    let files: FileHandle[] = [];
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({ file, url });
    }
    this.prepareAdditionalImagesFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteCoverImageFile(image, index: number) {
    this.coverImage.splice(index, 1);
    this.deleteCoverImage(image, index);
  }

  deleteAdditionalImagesFile(image, index: number) {

    this.deleteImage(image, index);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.additionalImages.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.additionalImages[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.additionalImages[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareCoverImageFilesList(files: Array<any>) {
    this.coverImage = [];
    let item = files[0];
    //item.process = 0;
    this.coverImage.push(item);
    console.log(item);
    // for (const item of files) {
    //   console.log(item);
    //   item.progress = 0;
    //   this.coverImage.push(item);
    // }
    this.uploadFile(item.file, 1, "cover", item.file.type.slice(6, 10));
    //this.uploadFilesSimulator(0);
  }

  prepareCoverOriginalImageFilesList(files: Array<any>) {
    let item = files[0];
    console.log(item);
    this.uploadFile(item.file, 0, "cover", item.file.type.slice(6, 10));
  }

  prepareAdditionalImagesFilesList(files: Array<any>) {
    let position = 1;
    this.additionalImageProcessed = 0;
    this.totalAdditionalImageSelected = files.length;
    for (const item of files) {

      console.log(item);
      item.progress = 0;
      this.additionalImages.push(item);
      this.uploadFile(item.file, position, "additional", item.file.type.slice(6, 10));
      position++;
    }

    
    console.log(this.product);
    // this.uploadMultipleFile(files);
    //this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
