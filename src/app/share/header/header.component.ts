import { Component, OnInit, NgZone, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api-service/api.service';
// import { GoogleApiService, Maps } from '../../services/google-api.service';
import { NetworkService } from '../../services/geo-service/network.service';
import { LoaderService } from '../../services/loader/loader.service';
import { Config } from '../../share/config';
import { SocialAuthService } from "angularx-social-login";
import { AuthenticationService } from '../../services/auth/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FirebaseService } from 'src/app/services/firebase-service/firebase.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
declare var $: any;
import { from } from 'rxjs';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
// import { geolib } from '../../services/geolib';
declare var google: any;

const colors = [
  'red',
  'blue',
  'green',
  'yellow',
  'brown',
  'BurlyWood',
  'Cyan',
  'DarkGreen',
  'DarkOrchid',
  'DarkOliveGreen',
  'Fuchsia',
  'GoldenRod',
  'Indigo',
  'LightCoral',
  'MediumSlateBlue',
];
let colorIndex = 0;

// import { Address } from 'cluster';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  totalUnreadMsg = 0;
  showLeftButton = false;
  productCategorySlice = [];
  loadMap = false;
  currentLat = 0.000;
  currentLong = 0.000;
  locality = "";
  selectedLocality = localStorage.getItem('locality');
  // @Output() onSearchQuery: EventEmitter<any> = new EventEmitter<any>();
  boxWidth = $("#navbarSupportedContent").width();
    

  public baseRoute = Config.baseRoute;
  public status1: boolean = false;
  public searchQuery = "";
  public notificationStatus: boolean = false;
  public latlong: any;
  public allCategory: any;
  public categoryImageUrl: any;
  public allProduct: any;
  public allCommercialCategory: any;
  public categoryCommercialImageUrl: any;
  public productImageUrl: any;
  public toggled: boolean = false;
  public loggedUser: any = {};
  public selectedCategory: any;
  public notificationDetails: Array<any> = [];
  public notificationLoaded: number = 0;
  private subscription: Subscription;
  private notificationLoadedFirstTime = true;
  @ViewChild('popover') popover: any;
  options = {
    types: [],
    componentRestrictions: { country: 'UA' }
  }

  public handleAddressChange(address: any) {
    // Do some stuff
  }
  constructor(
    private location: Location,
    private router: Router,
    private apiService: ApiService,
    // public googleApiService: GoogleApiService,
    private loaderService: LoaderService,
    private networkService: NetworkService,
    private socialAuthService: SocialAuthService,
    private authService: AuthenticationService,
    private toastService: ToastService,
    public ngZone: NgZone,
    public activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private eventEmitterService: EventEmitterService
  ) {
   
  }
  toggle1() {
    this.status1 = !this.status1;
    console.log("hit");
  }
  notification() {
    this.notificationStatus = !this.notificationStatus;
  }
  ngOnInit(): void {
    this.networkService.currentLocality.subscribe((locality) => {
      this.locality = locality
    });
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    console.log(this.allCategory);
    this.userAllCategory();
    this.appAllCommercialCategory();
    if (this.loggedUser) {
      //this.getAllMessages();
      // this.getAllNotifications();
    }

    this.networkService.updateProfilePicture.subscribe((profilePic) => {
      if (this.loggedUser) {
        this.loggedUser.image = profilePic;
      }
    });



    // this.googleApiService.api.then(maps => {
    //   this.initAutocomplete(maps);
    //   this.initMap(maps);
    // });

    // this.findMe();


    this.authService.authState.subscribe(state => {
      if (state) {
        // this.router.navigate(['signin']);
        this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
        this.getAllMessages();
        // this.getAllNotifications();
      } else {
        // this.router.navigate(['landing']);
        this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
        //this.router.navigate(['signin']);
        this.notificationDetails = [];
        this.totalUnreadMsg = 0;
      }
    });


  }
  goToProduct() {
    this.router.navigate(['/trade/product/product-list']);
  }

  onHomePageClick() {
    this.searchQuery = "";
    this.networkService.headerSearchData.next(this.searchQuery);
  }
  goToCommercialProduct() {
    this.router.navigate(['/trade/product/commercial-product-list']);
  }

  goToAddProduct() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "taskType": 'add',
        "redirectUrl": 'product',
        "productType": 'product',
      }
    };
    console.log(navigationExtras);
    this.router.navigate(['/trade/product/add-product'], navigationExtras);
  }
  closeLocationAlert() {
    $('#location-alert').hide();
  }

  buttonRight() {
    this.showLeftButton = true;
    $('#navbarSupportedContent').animate({
      scrollLeft: "+=1000px",
    }, "slow");
  };
  buttonLeft() {
    // this.showLeftButton = false;
    $('#navbarSupportedContent').animate({
      scrollLeft: "-=1000px"
    }, "slow");
    console.log( this, arguments.length );
  };
  getLocation() {
    // this.router.navigate(['/home-page']);
    event.preventDefault();
    this.selectedLocality = localStorage.getItem('locality');
    this.networkService.selectedLocationAddress.next('setUserLocation');
    $('#location-alert').show();

  }


  onGo() {
    this.networkService.setCurrentLocation.next('setUserLocation');
  }
  userAllCategory() {
    this.loaderService.presentLoader('');
    this.apiService.get('app_user/category_list/product', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.allCategory = res.data.category;
          // let i, j,  chunk = 10;
          // for (i = 0, j = this.allCategory.length; i < j; i += chunk) {
          //   this.productCategorySlice.push(this.allCategory.slice(i, i + chunk));
          //   // do whatever
          // }

          // console.log("this.productCategorySlice",this.productCategorySlice)
          this.categoryImageUrl = res.data.categoryImageUrl;
        }
      },
        error => {
          this.loaderService.dismiss();
        }
      );
  }

  appAllCommercialCategory() {
    this.loaderService.presentLoader('');
    this.apiService.get('app_user/category_list/freebies', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.allCommercialCategory = res.data.category;
          this.categoryCommercialImageUrl = res.data.categoryImageUrl;
        }
      },
        error => {
          this.loaderService.dismiss();
        }
      );
  }
  search(event) {
    console.log("event.target.value=", event.target.value);
    // if (this.selectedCategory != undefined) {
    // this.selectedCategory.category_name = event.target.value;
    //this.onSearchQuery.emit(this.selectedCategory);
    this.networkService.headerSearchData.next(event.target.value);
    // }
    // alert(event.target.value);
  }
  public btnSearchCategory(category: any): void {
    this.toggle1();
    this.router.navigate(['/trade/product/product-list', { category: category.category_name }]);
    this.searchQuery = category.category_name;
    this.selectedCategory = category;
    this.networkService.headerSearchData.next(category.category_name);
    // this.onSearchQuery.emit(this.selectedCategory);
  }
  btnSearchCommercialCategory(category) {
    this.toggle1();
    // this.toastService.presentErrorToast("Work in progress");
    if (this.allCommercialCategory.includes(category)) {
      this.router.navigate(['/trade/product/commercial-product-list', { category: category.category_name }]);
      this.searchQuery = category.category_name;
      this.selectedCategory = category;
      // this.onSearchQuery.emit(this.selectedCategory);
      this.networkService.headerSearchData.next(category.category_name);
      console.log(category);
    }

  }

  logout() {
    // event.stopPropagation();
    this.subscription.unsubscribe();
    this.authService.logout();
    // // if (localStorage.getItem('login_type') == 'Google') {
    // //   this.socialAuthService.signOut();
    // // } else if (localStorage.getItem('login_type') == 'Facebook') {
    // //   this.socialAuthService.signOut();
    // // }
    // this.socialAuthService.signOut().then((data) => {
    //   console.log("datta==",data);
    //   this.subscription.unsubscribe();
    //   this.authService.logout();
    // }).catch((err) => {
    //   console.log("err===",err)
    // })
    this.eventEmitterService.callFun();


  }
  goToDownload() {
    $('html, body').animate({
      scrollTop: $("#download-app").offset().top
    }, 1000);
  }



  /** Function is used to get all chatted message
   */
  getAllMessages() {
    let params: any = {
      sender_id: this.loggedUser.userid,
      oparator: '==',
    };
    this.subscription = this.firebaseService.firebaseHandler("trade_chats", params, 'all_single_message').subscribe((response) => {
      console.log('testtesttesttesttest', response);
      setTimeout(() => {
        this.getAllNotifications();
      }, 3000);

      if (response.length > 0) {

        let result = response.filter(function (a) {
          let key = a.product_id + '|' + a.sender_id + '|' + a.receiver_id;
          let key2 = a.product_id + '|' + a.receiver_id + '|' + a.sender_id;
          if (!this[key] && !this[key2]) {
            this[key] = true;
            this[key2] = true;
            return true;
          }
        }, Object.create(null));
        const allChatProduct = result.map(m => m.product_id);
        const allChatSender = result.map(m => m.sender_id);
        const allChatReceiver = result.map(m => m.receiver_id);
        // this.getChatProductDetails(allChatProduct, allChatSender, allChatReceiver);
        response.sort((x, y) => {
          return y.created - x.created;
        });
        let chatDetails = response.filter((v, i, a) => {
          return a.findIndex(t => (t.product_id === v.product_id)) === i && (v.seen == undefined || v.seen == false) && v.receiver_id == this.loggedUser.userid;
        });
        this.totalUnreadMsg = chatDetails.length;
      } else {
      }
    }, (err) => { });
  }




  /** Function is used to get all notifications
     */
  getAllNotifications() {
    // this.loaderService.present();
    this.apiService.getX('app_seller/notification?seen=false', '')
      .subscribe((res) => {
        //this.loaderService.dismiss();
        if (res.success) {
          this.notificationDetails = res.data;
          this.notificationLoaded = Object.keys(this.notificationDetails).length <= 0 ? 2 : 1;
        } else {
          this.notificationLoaded = Object.keys(res.data).length <= 0 ? 2 : 1;
        }

        if (!this.notificationLoadedFirstTime && this.notificationDetails.length > 0) {
          let lastNotificatin = this.notificationDetails[0];
          this.toastService.presentNotification(lastNotificatin.message, lastNotificatin.message);
        }
        this.notificationLoadedFirstTime = false;
      }, error => {
        setTimeout(() => {
          this.notificationLoaded = 2;
          // this.loaderService.dismiss();
        }, 100);
      });
  }

  /** Function is used to clear all notifications
 */
  clearAllNotification() {
    this.apiService.deleteX("app_seller/delete_notification", '').subscribe((res) => {
      if (res.success) {
        this.notificationDetails = [];
        this.notificationLoaded = 2;
      }
    });
  }
  /** Function is used to clear individual notification
   */
  clearIndividualNotification(notification) {
    this.apiService.deleteX("app_seller/notification", notification._id).subscribe((res) => {
      if (res.success) {
        let index = this.notificationDetails.findIndex(detail => detail._id == notification._id);
        console.log(index);
        this.notificationDetails.splice(index, 1);
      }
    });
  }

  goToChatListPage() {
    this.router.navigate(['/trade/chat/chatter']);
  }
  /** Function is used to check notification routings
  */
  checkNotificaion(notification) {
    this.popover.close()
    console.log("_____click work88888888888888888___________", this.popover);
    notification.seen = true;
    this.clearIndividualNotification(notification);
    let data: any = {};
    if (notification.click_action == 'chat') {
      // data.seller_id = notification.seller_id;
      // data.sender_id = notification.sender_id;
      // data.receiver_id = notification.receiver_id;
      // data.product_id = notification.product_id;
      // // data.segment = this.segment == 'notification' ? this.segment : undefined;
      // this.router.navigate(['/trade/chat/chat-details?', { chatDetails: JSON.stringify(data) }]);


      let navigationExtras: NavigationExtras = {
        queryParams: {
          "seller_id": encodeURIComponent(notification.seller_id),
          "sender_id": encodeURIComponent(notification.sender_id),
          "receiver_id": encodeURIComponent(notification.receiver_id),
          "product_id": encodeURIComponent(notification.product_id),
        }
      }
      this.router.navigate(["/trade/chat/chat-details"], navigationExtras);



    } else if (notification.click_action == 'soldout' || notification.click_action == 'product_expired' || notification.click_action == 'product_delete') {

      this.router.navigate(['trade/product/my-product-listing/expired']);
    } else if (notification.click_action == 'review') {
      this.router.navigate(['trade/user/product-seller-details', {
        sender_id: notification.sender_id,
        product_id: notification.product_id,
        page: 'notifications',
        segment: 'notification'
      }])
    } else if (notification.click_action == 'product_update' || notification.click_action == 'product_liked') {
      let route: string;
      let data = { _id: notification.product_id, segment: 'notification' };
      if (notification.product_type == 'Product') {
        route = 'trade/product/product-details';
      } else {
        route = 'trade/product/commercial-product-details';
      }
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "productDetails": JSON.stringify(data)
        }
      };

      this.router.navigate([route], navigationExtras);
    }
  }



}
