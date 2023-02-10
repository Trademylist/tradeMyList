
import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { IonContent, ActionSheetController } from '@ionic/angular';
// import { File, FileEntry } from '@ionic-native/file/ngx';
import { ApiService } from 'src/app/services/api-service/api.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase-service/firebase.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../../services/loader/loader.service';
// import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ToastService } from 'src/app/services/toast/toast.service';
// import { Crop } from '@ionic-native/crop/ngx';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss']
})
export class ChatDetailsComponent implements OnInit {
  @ViewChild('chatcontent', { static: false }) content: ElementRef;

  private subscriptions: Array<Subscription> = [];
  public chatMessages: Array<any> = [];
  public enteredMessage: any = '';
  public loggedUser: any = {};
  public getChatParams: any = {};
  public friendDetails: any = {};
  public productDetails: any = {};
  public sellerDetails: any = {};
  public senderDetails: any = {};
  public userImagePath: any = '';
  public productImagePath: any = '';
  public chatImageUrl: any = '';
  public sender_id: any;
  public receiver_id: any;
  public suggestMessage: any = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    public location: Location,
    // public actionSheet: ActionSheetController,
    // private camera: Camera,
    private toastService: ToastService,
    private loaderService: LoaderService,
    // private crop: Crop,
    public zone: NgZone,
    // private file: File
  ) {
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));

    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params.product_id != undefined) {
        this.getChatParams = params;
        setTimeout(() => {
          this.getProductDetails();
          this.getSellerDetails();
          this.getSenderDetails();
          this.getAllMessages();
        }, 5)
      } else {
        this.toastService.presentErrorToast("Required to choose a product to continue chat!");
        return false;
      }
    });
  }

  ngOnInit() {
    this.readChatMessage('');
    this.subscriptions.push(this.firebaseService.clearAllMessageOfBefore30Days("trade_chats").subscribe((response) => { }));
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);

  };
  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      console.log("subscription", subscription);
      subscription.unsubscribe();
    });
    this.firebaseService.unsubscribe();

  }

  readChatMessage(chatMessages) {
    let params = {
      // oparator: '==',
      // receiver_id: this.receiver_id,
      // seen:true
      sender_id: this.loggedUser.userid,
      oparator: '==',
      receiver_id: this.loggedUser.userid,
      product_id: this.getChatParams.product_id
    }
    this.subscriptions.push(this.firebaseService.updateChat("trade_chats", params, 'update').subscribe((response) => {
      alert(response.length);
      if (typeof (response.doc_id) != 'undefined' && response.doc_id != '') {
        this.sendNotification(params);
        this.enteredMessage = '';
        this.chatImageUrl = '';
        this.scrollToBottom();
      }
    }))
  }

  clearAllChatMessages() {
    let params = {
      // oparator: '==',
      // receiver_id: this.receiver_id,
      // seen:true
      sender_id: this.loggedUser.userid,
      oparator: '==',
      receiver_id: this.loggedUser.userid,
      product_id: this.getChatParams.product_id
    }
    this.subscriptions.push(this.firebaseService.clearAllChatMessageByReceiverAndProductId("trade_chats", params).subscribe((response) => {
      if (typeof (response.doc_id) != 'undefined' && response.doc_id != '') {
        //this.sendNotification(params);
        this.enteredMessage = '';
        this.chatImageUrl = '';
        this.scrollToBottom();
      }
    }))
  }

  goBack() {
    if (this.getChatParams.segment && this.getChatParams.segment != undefined) {
      this.router.navigate(['app/chat/notifications']);
    } else {
      this.location.back();
    }
  }
  isReadedMyMsg(chat, i) {
    // console.log('hello'+ i +',,,'+(chat.seen == undefined || chat.seen == true) && chat.sender_id == this.loggedUser.userid);
    // console.log('hello1'+ i +',,,'+(chat.seen == undefined || chat.seen == true) && chat.sender_id === this.loggedUser && this.loggedUser.userid);

    // return (chat.seen == undefined || chat.seen == true) && chat.sender_id == this.loggedUser &&  this.loggedUser.userid
    if (this.loggedUser && this.loggedUser.userid != null || this.loggedUser && this.loggedUser.userid != undefined || this.loggedUser && this.loggedUser.userid != "") {
      if (chat && chat.seen && chat.sender_id == this.loggedUser.userid) {
        return true
      } else {
        return false
      }
    }
  }
  getProductDetails() {
    let data = {
      product_id: this.getChatParams.product_id
    }
    this.apiService.postX('app_seller/any_product_details', data)
      .subscribe((res) => {
        if (res.success) {
          this.productDetails = res.data.product;
          this.productImagePath = res.data.product.image[0];
        }
      });
  }
  clearChat() {
    event.stopPropagation();
    this.clearAllChatMessages();
  }
  getSellerDetails() {
    let chatUser: any = [this.getChatParams.seller_id]
    this.apiService.postX('app_seller/chatUser', { 'chatuser': chatUser })
      .subscribe((res) => {
        if (res.success) {
          this.sellerDetails = res.data[0];
          this.userImagePath = res.path;
        }
      });
  }
  getSenderDetails() {
    let chatUser: any = [this.getChatParams.sender_id]
    this.apiService.postX('app_seller/chatUser', { 'chatuser': chatUser })
      .subscribe((res) => {
        if (res.success) {
          this.senderDetails = res.data[0];
          this.userImagePath = res.path;
        }
      });
  }
  getAllMessages() {
    if (this.loggedUser.userid == this.getChatParams.sender_id) {
      this.sender_id = this.getChatParams.sender_id;
      this.receiver_id = this.getChatParams.receiver_id;
    } else {
      this.sender_id = this.getChatParams.receiver_id;
      this.receiver_id = this.getChatParams.sender_id;
    }
    let params: any = {
      sender_id: this.sender_id,
      oparator: '==',
      receiver_id: this.receiver_id
    };
    this.subscriptions.push(this.firebaseService.firebaseHandler("trade_chats", params, 'single_message').subscribe((response) => {
      if (response.length > 0) {
        this.chatMessages = response.sort(function (x, y) {
          return x.created - y.created;
        });
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);
        this.getChatUserDetails();
        this.getSuggestMessage();
      }
    }))
  }

  // scrollToBottom(): void {
  //   this.content.scrollToBottom(300);
  // }

  scrollToBottom(): void {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }
  getChatUserDetails() {
    let chatUser: any = [this.receiver_id];
    this.apiService.postX('app_seller/chatUser', { 'chatuser': chatUser })
      .subscribe((res) => {
        if (res.success) {
          this.friendDetails = res.data[0];
          this.userImagePath = res.path;
        }
      });
  }

  getSuggestMessage() {
    this.apiService.getX('app_user/suggest')
      .subscribe((res) => {
        if (res.success) {
          this.suggestMessage = res.data;
        }
      });
  }

  async choosePictureSource() {
    // const actionSheet = await this.actionSheet.create({
    //   header: "Select Image Source",
    //   buttons: [{
    //     text: 'Load from Library',
    //     handler: () => {
    //       this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    //     }
    //   }, {
    //     text: 'Use Camera',
    //     handler: () => {
    //       this.takePicture(this.camera.PictureSourceType.CAMERA);
    //     }
    //   }, {
    //     text: 'Cancel',
    //     role: 'cancel'
    //   }]
    // });
    // await actionSheet.present();
  }

  takePicture(sourceType) {
    // let options: CameraOptions = {
    //   quality: 35,
    //   sourceType: sourceType,
    //   allowEdit: false,
    //   correctOrientation: true
    // };
    // this.camera.getPicture(options).then(imagePath => {
    //   this.crop.crop(imagePath, { quality: 35 }).then((cropedImage) => {
    //     this.file.resolveLocalFilesystemUrl(cropedImage).then(entry => (entry as FileEntry).file(fileData => {
    //       let imageData: any;
    //       const reader = new FileReader();
    //       reader.onload = (e: Event) => {
    //         let fileBlob: any = new Blob([reader.result], { type: fileData.type });
    //         imageData = fileBlob;
    //       };
    //       reader.readAsArrayBuffer(fileData);
    //       setTimeout(() => {
    //         this.uploadImage(imageData, fileData.type.slice(6, 10));
    //       }, 1000);
    //     }));
    //     // this.uploadImage(cropedImage);
    //   })
    // });
  }

  uploadImage(imageData, fileDataType) {
    this.loaderService.present();
    if (imageData != '') {
      let today: any = new Date();
      let fileNameSet: string = 'trade_' + today.getTime() + '.' + fileDataType;
      const frmData = new FormData();
      frmData.append('file', imageData, fileNameSet);
      this.apiService.uploadFile('chat_media_upload', frmData)
        .subscribe((res) => {
          this.loaderService.dismiss();
          console.log(res);
          if (res.success) {
            this.zone.run(() => {
              this.chatImageUrl = res.data.image;
            });
          }
        });
    }
  }

  closeImage() {
    this.chatImageUrl = '';
  }

  suggestedChat(getValue) {
    this.enteredMessage = getValue;
  }

  sendMessage(ev) {
    ev.preventDefault();
    let messageTime = Date.now();
    let message = this.enteredMessage;
    if (this.chatImageUrl != '' || message != '' && message != null) {
      let params: any = {
        seller_id: this.getChatParams.seller_id,
        sender_id: this.sender_id,
        receiver_id: this.receiver_id,
        product_id: this.getChatParams.product_id,
        message: message,
        seen: false,
        image: this.chatImageUrl,
        created: messageTime
      }
      this.firebaseService.firebaseHandler("trade_chats", params, 'save').subscribe((response) => {
        if (typeof (response.doc_id) != 'undefined' && response.doc_id != '') {
          this.sendNotification(params);
          this.enteredMessage = '';
          this.chatImageUrl = '';
          this.scrollToBottom();
        }
      });
    } else {
      this.toastService.presentToast('Please enter a message and try again.');
    }
  }


  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      // var reader = new FileReader();

      // console.log(event.target.files[0]);
      // reader.readAsDataURL(event.target.files[0]); // read file as data url

      // reader.onload = (event) => { // called once readAsDataURL is completed
      //   //this.url = event.target.result;
      // }
      let fileData = event.target.files[0];
      let imageData: any;
      const reader = new FileReader();
      reader.onload = (e: Event) => {
        let fileBlob: any = new Blob([reader.result], { type: fileData.type });
        imageData = fileBlob;
      };
      reader.readAsArrayBuffer(event.target.files[0]);
      setTimeout(() => {
        this.uploadImage(imageData, fileData.type.slice(6, 10));
      }, 1000);

    }
  }
  /** Function is used to send push notification on successfully sending a message
   * @param  {} params
   */
  sendNotification(params) {
    let data: any = {
      seller_id: this.getChatParams.seller_id,
      sender_id: params.sender_id,
      receiver_id: params.receiver_id,
      product_id: params.product_id,
      message: params.message,
      image: this.chatImageUrl
    }
    this.apiService.postX('app_seller/chat_push', data)
      .subscribe((res) => {

      });
  }

  isDifferentDay(messageIndex: number): boolean {
    if (messageIndex === 0) return true;
    const d1 = new Date(this.chatMessages[messageIndex - 1].created);
    const d2 = new Date(this.chatMessages[messageIndex].created);
    return d1.getFullYear() !== d2.getFullYear()
      || d1.getMonth() !== d2.getMonth()
      || d1.getDate() !== d2.getDate();
  }

  getMessageDate(messageIndex: number): string {
    let messageTime = Date.now();
    const d1 = new Date(this.chatMessages[messageIndex].created);
    const d2 = new Date(messageTime);
    if (d1.getFullYear() === d2.getFullYear()
      && d1.getMonth() === d2.getMonth()
      && d1.getDate() === d2.getDate()) {
      return "Today";
    } else {
      const wholeDate = new Date(this.chatMessages[messageIndex].created).toDateString();
      return wholeDate.slice(0, wholeDate.length - 5);
    }
  }
  /** Function is used to navigate to product details page
   */


  goProductDetails() {
    // let route: any = '';
    // if (this.productDetails.product_price == null || this.productDetails.product_price == '') {
    //   route = 'trade/product/commercial-product-details';
    // } else {
    //   route = 'trade/product/product-details';
    // }
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     "productDetails": JSON.stringify(this.productDetails),
    //   }
    // };
    // this.router.navigate([route], navigationExtras);
    // this.router.navigate(["/trade/chat/chatter"])

    let home_scroll = Number(JSON.parse(sessionStorage.getItem("home_scroll")));
    console.log("home_scroll====", home_scroll)
    if(home_scroll != null && home_scroll != 0) {
      this.router.navigate(["/home-page"])
    } else {
      this.router.navigate(["/trade/chat/chatter"])
    }
    
  }


  /** Function is used to view seller data
  */
  goSellerDetails() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "sender_id": this.sellerDetails._id,
      }
    };
    this.router.navigate(['app/product-seller-details'], navigationExtras);
  }
  /** Function is used to check whether message button should be enabled or not
   */
  enableMsgButton() {
    if (this.enteredMessage.length > 0 || this.chatImageUrl != '') {
      return true;
    } else {
      return false;
    }
  }
  getChatUser() {
    if (this.getChatParams.receiver_id == this.loggedUser.userid)
      return this.senderDetails.username != null ? this.senderDetails.username : "Trade User";
    else
      return this.friendDetails.username != null ? this.friendDetails.username : "Trade User";
  }
  getChatImage() {
    if (this.getChatParams.receiver_id == this.loggedUser.userid)
      return this.senderDetails.image != null ? this.senderDetails.image : "assets/imgs/default-avatar.png";
    else
      return this.friendDetails.image != null ? this.friendDetails.image : "assets/imgs/default-avatar.png";
  }
}