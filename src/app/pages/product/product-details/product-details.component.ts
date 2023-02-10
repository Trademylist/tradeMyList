import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
// import { ViewImagePage } from 'src/app/shared/modal/view-image/view-image.page';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { FirebaseService } from 'src/app/services/firebase-service/firebase.service';
// import { AngularFirestore } from '@angular/fire/firestore';
import { UtilityService } from 'src/app/services/utility/utility.service';
import * as moment from 'moment';
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from "ngx-image-gallery";
import { NetworkService } from 'src/app/services/geo-service/network.service';
// import { Observable, combineLatest } from 'rxjs'
// import { map } from 'rxjs/operators';


declare var $: any;
declare var google;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {


  // get reference to gallery component
  @ViewChild(NgxImageGalleryComponent) ngxImageGallery: NgxImageGalleryComponent;

  // gallery configuration
  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,

  };

  // gallery images
  productGallery: GALLERY_IMAGE[] = [];

  //==========================================


  selectedViewImage = "";

  @ViewChild('gmap1', { static: false }) mapElement: ElementRef;
  public shareLink: string = window.location.href;
  public productDetails: any = {};
  public productImages: any[] = [];
  public productUrl: any;
  public map: any;
  public enteredMessage: any = '';
  public loggedUser: any = {};
  public suggestMessage: any = [];
  public getProductCategory: any;
  public getProductCategoryImageUrl: any;
  public itemId: string;
  public unit: string;
  public seller_id: any;
  public slideOpts = {
    slidesPerView: 1
  };
  public productList: any = [];
  public sliderIndex: number = 1;

  public seller_details: any;
  public avg_rating: any;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private toastService: ToastService,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private location: Location,
    private networkService: NetworkService,
    private firebaseService: FirebaseService,
    // private fireStore:AngularFirestore,
    private utilityService: UtilityService
  ) { }

  /** Function is called when component is initialised and will get product id through route parameter and call item API to get all product details
   */
  ngOnInit() {

    this.initialize();
    window.scrollTo({ top: 0 });
    this.networkService.onPaymentCompletedForSellFaster.subscribe(action => {
      this.location.back();
    })

  }

  onselectFruit(image) {
    console.log(image);
  }
  initialize() {
    this.utilityService.momentLocaleModifier();
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.productDetails) {
        this.productList = JSON.parse(params.productDetails);
        //alert(this.productList._id);
        this.itemId = this.productList._id;
      }
    });
    setTimeout(() => {
      this.getItem();
      this.getSuggestMessage();
      this.appAllCategory();
    }, 5);
  }
  /** Function is called to load map and show product seller location
   */
  loadMap() {
    let address = this.productDetails.address;
    // alert(this.productDetails.geometry.coordinates[0]);
    let mapOptions = {
      center: { lng: parseFloat(this.productDetails.geometry.coordinates[0]), lat: parseFloat(this.productDetails.geometry.coordinates[1]) },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'greedy',
      fullscreenControl: false
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    console.log(this.map)
    let infowindow = new google.maps.InfoWindow();
    let marker = new google.maps.Marker({
      position: { lat: parseFloat(this.productDetails.geometry.coordinates[1]), lng: parseFloat(this.productDetails.geometry.coordinates[0]) },
      map: this.map,
      // icon: 'assets/icon/map-marker.png'
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(
        "<div>" + address + "</div>"
      );
      infowindow.open(this.map, this);
    });
  }

  /** Function is used to go back to previous page
   */
  goBack() {
    if (this.productList.segment && this.productList.segment != undefined) {
      this.router.navigate(['app/chat/notifications']);
    } else {
      this.location.back();
    }
  }

  /** Function is used to get all the details of product
   */
  getItem() {
    this.productDetails = {};
    this.apiService.getX('app_user/product', this.itemId).subscribe(resp => {
      if (resp.success) {

        this.productUrl = resp.data.productImageUrl;
        let respData = resp.data.product;
        this.productGalleryFormat(respData.image, respData.cover_thumb);
        let today = moment();
        this.seller_id = respData.user_id;
        this.getSellerDetails();
        this.productImages = respData.image;
        this.productDetails._id = respData._id;
        this.productDetails.address = respData.address;
        this.productDetails.category = respData.category;
        this.productDetails.country = respData.country;
        this.productDetails.createdAt = moment(respData.createdAt).from(today);
        this.productDetails.geometry = respData.geometry;
        this.productDetails.isBlock = respData.isBlock;
        this.productDetails.likelist = respData.likelist;
        this.productDetails.product_description = respData.product_description;
        this.productDetails.product_name = respData.product_name;
        this.productDetails.product_price = respData.product_price;
        this.productDetails.seller_phone = respData.seller_phone;
        this.productDetails.soldOut = respData.soldOut;
        this.productDetails.currencyCode = respData.currencyCode;
        this.productDetails.boost = respData.boost;
        this.productDetails.product_type = respData.product_type;
        this.productDetails.cover_thumb = respData.cover_thumb;
        this.productDetails.user_id = respData.user_id;
        let subCategory = respData.sub_category;
        let subCategoryNumber = respData.sub_category_number;
        if (this.productDetails.category == "Car") {
          this.productDetails.make = subCategory[0].value ? subCategory[0].value : '';
          this.productDetails.model = subCategory[1].value ? subCategory[1].value : '';
          this.productDetails.seller = subCategory[2].value ? subCategory[2].value : '';
          this.productDetails.transmission = subCategory[3].value ? subCategory[3].value : '';
          this.productDetails.trim = subCategory[4].value ? subCategory[4].value : '';
          this.productDetails.unit = subCategory[5].value ? subCategory[5].value : '';
          this.productDetails.year = subCategoryNumber[0].value ? subCategoryNumber[0].value : '';
          if (subCategoryNumber[1].value) {
            if (this.productDetails.unit == 'miles' || this.productDetails.unit == 'Miles') {
              this.unit = 'mi';
              this.productDetails.range = subCategoryNumber[1].value;
            } else {
              this.unit = 'km';
              this.productDetails.range = subCategoryNumber[1].value / 0.621371;
            }
          } else {
            this.unit = '';
            this.productDetails.range = '';
          }
        } else if (this.productDetails.category == 'Housing') {
          this.productDetails.typeList = subCategory[0].value ? subCategory[0].value : '';
          this.productDetails.propertyType = subCategory[1].value ? subCategory[1].value : '';
          this.productDetails.bedRoomNo = subCategoryNumber[0].value ? subCategoryNumber[0].value : '';
          this.productDetails.bathRoomNo = subCategoryNumber[1].value ? subCategoryNumber[1].value : '';
        }
        this.loadMap();
      } else {
        this.toastService.presentToast(resp.message);
      }
    });
  }

  showChatOption() {
    var len = Object.keys(this.productDetails).length;
    return (len > 0 && this.loggedUser != null ? (this.loggedUser.userid != this.seller_id ? true : false) : false);
  }

  /** Function is used to get seller ratings and count of users who gave review
 */
  getSellerDetails() {
    this.apiService.get('app_user/rating', this.seller_id).subscribe((res) => {
      if (res.success) {
        this.seller_details = res.data;
        this.avg_rating = res.data.avg_rating == null ? 0 : res.data.avg_rating;
      }
    });
  }

  getSuggestMessage() {
    this.loaderService.present();
    this.apiService.getX('app_user/suggest')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.suggestMessage = res.data;
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }

  suggestedChat(getValue) {
    this.enteredMessage = getValue;
  }

  sendMessage(ev) {
    this.closeChatBox();
    ev.preventDefault();
    let messageTime = Date.now();
    let message = this.enteredMessage;
    if (message != '' && message != null) {
      let params: any = {
        seller_id: this.seller_id,
        receiver_id: this.seller_id,
        sender_id: this.loggedUser.userid,
        product_id: this.productDetails._id,
        message: message,
        image: null,
        created: messageTime
      }

      this.firebaseService.firebaseHandler("trade_chats", params, 'save').subscribe((response) => {
        if (typeof (response.doc_id) != 'undefined' && response.doc_id != '') {
          this.sendNotification(params);
          this.enteredMessage = '';
          this.toastService.presentToast('Message sent successfully.');
        }
      }, (err) => { });
    } else {
      this.toastService.presentToast('Please enter a message and try again.');
    }
  }


  /** Function is used to send push notification on successfully sending a message
   * @param  {} params
   */
  sendNotification(params) {
    let data: any = {
      seller_id: this.seller_id,
      sender_id: params.sender_id,
      receiver_id: params.receiver_id,
      product_id: params.product_id,
      message: params.message,
      image: null
    }
    this.apiService.postX('app_seller/chat_push', data)
      .subscribe((res) => {
        if (res.success) {
          let productDtls: any = {};
          productDtls.seller_id = this.seller_id;
          productDtls.sender_id = params.sender_id;
          productDtls.receiver_id = params.receiver_id;
          productDtls.product_id = params.product_id;

          let navigationExtras: NavigationExtras = {
            queryParams: {
              "seller_id": this.seller_id,
              "sender_id": params.sender_id,
              "receiver_id": params.receiver_id,
              "product_id": params.product_id
            }
          };

          this.router.navigate(['/trade/chat/chat-details'], navigationExtras);
        }
      });
  }

  closeChatBox() {
    $("#chatbox123").hide();
  }
  /** Function is used to share product
   */
  gotoShare() {

    // this.loaderService.present();
    // this.apiService.postX('app_seller/share', { "product_id": this.productDetails._id, "type": 'product' })
    //   .subscribe((res) => {
    //     this.loaderService.dismiss();
    //     if (!res.success) {
    //       this.toastService.presentToast(res.message);
    //     }
    //   }, error => {
    //     this.loaderService.dismiss();
    //   });
  }
  /** Function is used to check if the product is liked or not by the logged in user
   * @param  {} likelist
   */
  isLiked(likelist) {
    if (likelist == null) {
      return false;
    } else {
      let userId = this.authService.getUserId();
      if (likelist.indexOf(userId) > -1)
        return true;
      return false;
    }
  }
  /** Function is used to call like or dislike function depending on whether the product is liked or disliked from before 
   * @param  {} product
   */
  likedUnlikedFeed(product) {
    if (this.loggedUser == null) {
      this.toastService.presentErrorToast("Login Required!");
      return false;
    }
    if (this.loggedUser.userid == product.user_id) {
      this.toastService.presentErrorToast("Your can not like your own product!");
      return false;
    }

    let userId = this.authService.getUserId();
    if (product.likelist.indexOf(userId) > -1) {
      this.doLikeUnlike('dislikes', product);
    } else {
      this.doLikeUnlike('likes', product);
    }
  }
  /** Function is called to like or dislike a product
   * @param  {} apiName
   * @param  {} product
   */
  doLikeUnlike(apiName, product) {
    let userId = this.authService.getUserId();
    if (!userId) {
      this.toastService.presentErrorToast("Login Required!");
    }
    // this.loaderService.present();
    this.apiService.postX('app_seller/' + apiName, { "product_id": product._id })
      .subscribe((res) => {
        // this.loaderService.dismiss();
        if (res.success) {
          if (apiName == 'likes') {
            product.likelist.push(userId);
          } else {
            let index = product.likelist.indexOf(userId);
            product.likelist.splice(index, 1);
          }
        }
      }, error => {
        // this.loaderService.dismiss();
      });
  }

  closeCropModal() {
    $("#banner-view-image").hide();
  }
  /** Function is used to view product's uploaded image
   */
  async viewImage(image) {
    this.selectedViewImage = image;
    $("#banner-view-image").show();
    // let index = this.productImages.findIndex(prdtImage => prdtImage == image);
    // const modal = await this.modalController.create({
    //   component: ViewImagePage,
    //   componentProps: {
    //     image: this.productImages,
    //     path: this.productUrl,
    //     position: index
    //   }
    // });
    // await modal.present();
  }

  /** Function is used to view seller data
   */
  goSellerDetails() {
    // this.toastService.presentErrorToast("Work in progress!");
    // return false;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "sender_id": this.seller_id,
      }
    };
    this.router.navigate(['trade/user/product-seller-details'], navigationExtras);
  }

  /** Function is used to get all categories
   */
  appAllCategory() {
    this.apiService.get('app_user/category_list/product', '')
      .subscribe((res) => {
        if (res.success) {
          this.getProductCategory = res.data.category;
          this.getProductCategoryImageUrl = res.data.categoryImageUrl;
        }
      });
  }

  /** Function is used to transition to product editing page
   */
  editProduct() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "taskType": 'edit',
        "redirectUrl": 'product',
        "productType": 'product',
        "product_id": this.productDetails._id,
        "categoryDetails": JSON.stringify(this.getProductCategory),
        "categoryImageUrl": JSON.stringify(this.getProductCategoryImageUrl)
      }
    };
    console.log(navigationExtras);
    // this.router.navigate(['app/sell-product-edit'], navigationExtras);
    this.router.navigate(['/trade/product/edit-product'], navigationExtras);
  }

  /** Function is used to view in-app-purchase page
   */
  async viewBoostModal() {

    let componentProps = {
      page: 'boost',
      consumable: 'boost_product',
      product_id: this.itemId,
      product_type: this.productDetails.product_type
    }
    this.networkService.selectedProductForSellFaster.next(componentProps);
    $('#paypalModal').show();

    // const modal = await this.modalController.create({
    //   component: InAppPurchasePage,
    //   componentProps: {
    //     page: 'boost',
    //     consumable: 'boost_product',
    //     product_id: this.itemId,
    //     product_type: this.productDetails.product_type
    //   }
    // });
    // modal.onDidDismiss().then(data => {
    //   if (data.data == true) {
    //     this.productDetails.boost = 1;
    //   }
    // });
    // await modal.present();
  }
  /** Function is used to check if boost option should be shown for the product
   */
  checkBooost() {
    if (this.loggedUser && this.loggedUser.userid == this.seller_id) {
      if (this.productDetails.boost == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  /** Function is used to get slider index
   */
  getSlider() {
    //   this.slidefromHtml.getActiveIndex().then(id => {
    //     this.sliderIndex = 1;
    //     this.sliderIndex += id;
    //     console.log('your index', id)
    //  });
  }


  /** Function is used to check if the user viewing the page is logged in or not
 */
  checkLoggedUser() {
    if (this.loggedUser && Object.keys(this.loggedUser).length > 0) {
      if (this.loggedUser.userid === this.seller_id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  //==================================


  productGalleryFormat(productImages,cover_thumb) {
    productImages[0] = cover_thumb;
    for (let i = 0; i < productImages.length; i++) {

      this.productGallery.push({
        url: productImages[i] + "?w=1260",
        altText: 'woman-in-black-blazer-holding-blue-cup',
        title: 'woman-in-black-blazer-holding-blue-cup',
        thumbnailUrl: productImages[i] + "?w=100"
      })

    }
  }
  // METHODS
  // open gallery
  openGallery(index: number = 0) {
    this.ngxImageGallery.open(index);
  }

  // close gallery
  closeGallery() {
    this.ngxImageGallery.close();
  }

  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }

  // next image in gallery
  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }

  // prev image in gallery
  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }

  /**************************************************/

  // EVENTS
  // callback on gallery opened
  galleryOpened(index = 0) {
    console.info('Gallery opened at index ', index);
  }

  // callback on gallery closed
  galleryClosed() {
    console.info('Gallery closed.');
  }

  // callback on gallery image clicked
  galleryImageClicked(index) {
    console.info('Gallery image clicked with index ', index);
  }

  // callback on gallery image changed
  galleryImageChanged(index) {
    console.info('Gallery image changed to index ', index);
  }

  // callback on user clicked delete button
  deleteImage(index) {
    console.info('Delete image at index ', index);
  }

  openChatBox() {
    $('#chatbox123').show();
  }

  goToLogin() {
    this.router.navigate(['signin']);
  }

  copyToClipBoard() {
    let searchParams = new URLSearchParams();
    searchParams.set('u', this.shareLink);
    let val = 'https://www.facebook.com/sharer/sharer.php?' + searchParams;

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastService.presentToast("Link copied to clipboard!");
  }
}
