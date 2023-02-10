import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api-service/api.service';
import { NavigationExtras, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase-service/firebase.service';
// import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { OnEnter, UtilityService } from 'src/app/services/utility/utility.service';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

// import { Observable, combineLatest } from 'rxjs'
// import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  private subscription: Subscription;
  public segment: string;
  public loggedUser: any = {};
  public chatDetails: Array<any> = [];
  public chatProductDetails: Array<any> = [];
  public imagePath: any = '';
  public chatUserDetails: Array<any> = [];
  public userImagePath: any = '';
  public messageType: string;
  public notificationDetails: Array<any> = [];
  today = moment();
  public notificationLoaded: number = 0;
  private blockList: any = [];

  constructor(
    // private events: Events,
    private apiService: ApiService,
    private router: Router,
    private firebaseService: FirebaseService,
    // private fireStore:AngularFirestore,
    private loaderService: LoaderService,
    private utilityService: UtilityService,
    private authenticationService: AuthenticationService
  ) { 
    sessionStorage.removeItem("home_scroll");
  }
  public async ngOnInit(): Promise<void> {
    await this.onEnter();
  }
  public async onEnter(): Promise<void> {
    this.utilityService.momentLocaleModifier();
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    console.log(this.loggedUser);
    // this.subscription = this.router.events.subscribe((event) => {
      // alert(JSON.stringify(event));
      // if (event instanceof NavigationEnd && event.url === '/app/chat') {
        this.segment = "message";
        this.messageType = "all";
        this.apiService.getX("app_seller/chatBlock").subscribe(res => {
          if (res.success) {
            this.blockList = res.data;
            this.getAllMessages();
          }
        });
      // } else if (event instanceof NavigationEnd && event.url === '/app/chat/notifications') {
      //   this.segment = "notification";
      //   this.getAllNotifications();
      // }
    // });
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  segmentChanged(event) {
    if (event.detail.value == "message") {
      this.segment = "message";
      this.messageType = "all";
    } else if (event.detail.value == "notification") {
      this.segment = "notification";
      //this.getAllNotifications();
    } else {
      this.segment = "message";
    }
  }
  messageTypeChanged(event) {
    if (event == "all") {
      this.messageType = "all";
    } else if (event== "selling") {
      this.messageType = "selling";
    } else if (event == "buying") {
      this.messageType = "buying";
    } else {
      this.messageType = "all";
    }
  }
  /**
   * Event for tab page to show the count
   */
  updateCount(chatDetails) {
    // this.events.publish('chatCount', chatDetails);
  }
  /** Function is used to get all chatted message
   */
  getAllMessages() {
    this.loaderService.present();
    let params: any = {
      sender_id: this.loggedUser.userid,
      oparator: '==',
    };
    this.subscription = this.firebaseService.firebaseHandler("trade_chats", params, 'all_single_message').subscribe((response) => {
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
        this.getChatProductDetails(allChatProduct, allChatSender, allChatReceiver);
        response.sort((x, y) => {
          return y.created - x.created;
        });
        this.chatDetails = response.filter((v, i, a) => a.findIndex(t => (t.product_id === v.product_id)) === i);
        this.checkBlockList(this.chatDetails, Object.keys(this.chatDetails).length - 1);
        // this.chatDetails = response.filter((v, i, a) => a.findIndex(t => (t.product_id === v.product_id)) === i);
        // this.updateCount(this.chatDetails);
        this.loaderService.dismiss();
      } else {
        this.loaderService.dismiss();
      }
    }, (err) => {
      this.loaderService.dismiss();
    });
  }
  getChatProductDetails(allChatProduct, allChatSender, allChatReceiver) {
    let data = {
      sender: allChatSender,
      receiver: allChatReceiver,
      product: allChatProduct
    }
    this.apiService.postX('app_seller/chatListDetail', data)
      .subscribe((res) => {
        if (res.success) {
          this.chatProductDetails = res.data.result;
          this.imagePath = res.data.productUrl;
        }
      });
  }
  getChatUserDetails(allChatUser) {
    this.apiService.postX('app_seller/chatUser', { 'chatuser': allChatUser })
      .subscribe((res) => {
        if (res.success) {
          this.chatUserDetails = res.data[0];
          this.userImagePath = res.path;
        }
      });
  }
  checkBuyerSeller(chat) {
    for (let i = 0; i < this.chatProductDetails.length; i++) {
      if (this.chatProductDetails[i].product_id == chat.product_id) {
        if (this.chatProductDetails[i].sender_id == this.loggedUser.userid || this.chatProductDetails[i].receiver_id == this.loggedUser.userid)
          return true;
      }
    }
  }
  checkAvailable(chat, checkType) {
    const found = this.chatProductDetails.some(el => el.product_id === chat.product_id);
    if (found) {
      if (checkType == 'all') {
        return true;
      } else if (checkType == 'seller') {
        const seller = this.chatProductDetails.some(el => (el.product_id === chat.product_id) && (el.seller_id !== this.loggedUser.userid));
        if (seller)
          return true;
        else
          return false;
      } else if (checkType == 'buyer') {
        const seller = this.chatProductDetails.some(el => (el.product_id === chat.product_id) && (el.seller_id === this.loggedUser.userid));
        if (seller)
          return true;
        else
          return false;
      }
      return true;
    }
    else
      return false;
  }

  getProductName(val) {
    for (let i = 0; i < this.chatProductDetails.length; i++) {
      if (this.chatProductDetails[i].product_id == val.product_id) {
        return this.chatProductDetails[i].product_name;
      }
    }
  }
  getProductMessage(val) {
    for (let i = 0; i < this.chatProductDetails.length; i++) {
      if (this.chatProductDetails[i].product_id == val.product_id) {
        return val.message;
      }
    }
  }
  getChatUser(val) {
    for (let i = 0; i < this.chatProductDetails.length; i++) {
      if (this.chatProductDetails[i].product_id == val.product_id) {
        if (this.chatProductDetails[i].receiver_id == this.loggedUser.userid) {
          return this.chatProductDetails[i].sender_name != null ? this.chatProductDetails[i].sender_name : 'Trade User';
        } else {
          return this.chatProductDetails[i].receiver_name != null ? this.chatProductDetails[i].receiver_name : 'Trade User';
        }
      }
    }
  }
  checkChatMessage(val) {
    let chat = this.chatProductDetails.findIndex(prdt => prdt.product_id == val.product_id);
    if (chat != -1) {
      if ((val.message != "" || val.message != null) && (val.image == "" || val.image == null)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  isUnreadMessage(chat) {
    return (chat.seen == undefined || chat.seen == false) && chat.receiver_id == this.loggedUser.userid
  }
  checkChatImage(val) {
    let chat = this.chatProductDetails.findIndex(prdt => prdt.product_id == val.product_id);
    if (chat != -1) {
      if (val.image == "" || val.image == null) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  /** Function is used to get image of the product which is in discuss
   * @param  {} val
   */
  getProductImage(val) {
    for (let i = 0; i < this.chatProductDetails.length; i++) {
      if (this.chatProductDetails[i].product_id == val.product_id) {
        return this.chatProductDetails[i].product_image;
      }
    }
  }

  goChatDetails(val) {
    if (this.chatProductDetails.length > 0) {
      let productDtls: any = {};
      for (let i = 0; i < this.chatProductDetails.length; i++) {
        if (this.chatProductDetails[i].product_id == val.product_id) {
          // productDtls.seller_id = this.chatProductDetails[i].user_id;
          productDtls.seller_id = val.seller_id;
          productDtls.sender_id = val.sender_id;
          productDtls.receiver_id = val.receiver_id;
          productDtls.product_id = val.product_id;
        }
      }
      setTimeout(() => {
        let navigationExtras: NavigationExtras = {
          queryParams: productDtls
        };

        this.router.navigate(['/trade/chat/chat-details'],navigationExtras);

        // this.router.navigate(['app/chat-details', { chatDetails: JSON.stringify(productDtls) }]);
      }, 10)
    }
  }

  /** Function is used to get all notifications
   */
  getAllNotifications() {
    this.loaderService.present();
    this.apiService.getX('app_seller/notification?seen=false', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.notificationDetails = res.data;
          this.notificationLoaded = Object.keys(this.notificationDetails).length <= 0 ? 2 : 1;
        } else {
          this.notificationLoaded = Object.keys(res.data).length <= 0 ? 2 : 1;
        }
      }, error => {
        setTimeout(() => {
          this.notificationLoaded = 2;
          this.loaderService.dismiss();
        }, 100);
      });
  }
  /** Function is used to check notification routings
   */
  checkNotificaion(notification) {
    notification.seen = true;
    this.apiService.deleteX("app_seller/delete_notification", '').subscribe((res) => {
      if (res.success) { }
    });
    let data: any = {};
    if (notification.click_action == 'chat') {
      data.seller_id = notification.seller_id;
      data.sender_id = notification.sender_id;
      data.receiver_id = notification.receiver_id;
      data.product_id = notification.product_id;
      data.segment = this.segment == 'notification' ? this.segment : undefined;
      this.router.navigate(['app/chat-details', { chatDetails: JSON.stringify(data) }]);
    } else if (notification.click_action == 'soldout' || notification.click_action == 'product_expired' || notification.click_action == 'product_delete') {
      this.router.navigate(['app/my-listing']);
    } else if (notification.click_action == 'review') {
      this.router.navigate(['seller-review', {
        user_id: notification.sender_id,
        product_id: notification.product_id,
        page: 'notifications',
        segment: this.segment == 'notification' ? this.segment : undefined
      }])
    } else if (notification.click_action == 'product_update' || notification.click_action == 'product_liked') {
      let route: string;
      let data = { _id: notification.product_id, segment: this.segment == 'notification' ? this.segment : undefined };
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
  /** Function is used to enable or disable profile redirection button 
   * @param  {} notification
   */
  enableProfileButton(notification) {
    if (notification.click_action == 'chat' || notification.click_action == 'product_liked' || notification.click_action == 'review') {
      return true;
    } else {
      return false;
    }
  }
  /** Function is used to show how much time ago chat is sent
   * @param  {string} chatTime
   */
  getTime(chatTime: string) {
    return moment(chatTime).from(this.today);
  }
  checkBlockList(chatList, length) {
    // if (Object.keys(this.blockList).length > 0) {
    //   chatList.forEach(chat => {
    //     let index = this.blockList.findIndex(data => {(data.user_id == chat.receiver_id || data.user_id == chat.sender_id) && (data.blocked_id == chat.receiver_id || data.blocked_id == chat.sender_id) && (data.product_id == chat.product_id)});
    //     if (index != -1) {
    //       chatList.splice(index, 1);
    //     }
    //   });
    // } else {
    //   this.updateCount(this.chatDetails);
    // }
    if (length < 0) {
      setTimeout(() => {
        this.chatDetails = chatList;
        this.updateCount(this.chatDetails);
        return;
      }, 1000);
    } else {
      let index = this.blockList.findIndex(data => ((data.user_id == chatList[length].receiver_id || data.user_id == chatList[length].sender_id) && data.product_id == chatList[length].product_id));
      if (index != -1) {
        chatList.splice(length, 1);
      }
      this.checkBlockList(chatList, length - 1);
    }
  }
  removeItem(chat, index) {
    let data = {
      blocked_id: chat.receiver_id == this.loggedUser.userid ? chat.sender_id : chat.receiver_id,
      product_id: chat.product_id
    }
    this.apiService.postX("app_seller/chatBlock", data).subscribe(res => {
      if (res.success) {
        this.chatDetails.splice(index, 1);
      }
    });
  }


    /** Function is used to check if the user is logged in and navigates accordingly
   */
  checkLogin() {
    let checkState: any;
    this.authenticationService.authState.subscribe(state => {
      checkState = state;
    });
    if (checkState) {
      return true;
    } else {
      return false;

    }
  }
}