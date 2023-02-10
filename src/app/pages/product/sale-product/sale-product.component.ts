import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service/api.service';
import { FirebaseService } from 'src/app/services/firebase-service/firebase.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Location } from '@angular/common';
import { DialogService } from '../../../share/dialog/dialog.service';
import { DialogComponent } from '../../../share/dialog/dialog.component';

@Component({
  selector: 'app-sale-product',
  templateUrl: './sale-product.component.html',
  styleUrls: ['./sale-product.component.scss']
})
export class SaleProductComponent implements OnInit {
  @ViewChild('appDialog',{static:true}) appDialog: DialogComponent;
  
  public pageTitle ="Sale Product";
  public productId: any;
  public productType: any;
  public loggedUser: any = {};
  public userList: Array<any> = [];
  public userImagePath: any = '';

  constructor(
    private dialogService: DialogService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private firebaseService: FirebaseService,
    private loaderService: LoaderService,
    private location: Location,
 
  ) { }

  ngOnInit() { 

    this.dialogService.register(this.appDialog);
    this.onEnter();
  }

  onEnter() {
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    this.activatedRoute.params.subscribe(params => {
      this.productId = params.productId;
      this.productType = params.productType;
    });
    this.initFavoriteUser();
  }

  async goBack() {
    this.location.back();
  }

  initFavoriteUser() {
    this.loaderService.present();
    this.apiService.postX('app_seller/favorite_list', { product_id: this.productId })
      .subscribe(resp => {
        console.log(resp);
        this.loaderService.dismiss();
        if (resp.success) {
          if (resp.user && Object.keys(resp.user).length > 0) {
            this.userList = resp.data.user;
            this.userImagePath = resp.data.path;
          }
          this.getAllMessages();
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }

  getUserList(likedUsers) {
    this.apiService.postX('app_seller/chatUser', { 'chatuser': likedUsers })
      .subscribe((res) => {
        if (res.success) {
          this.userList = this.userList.concat(res.data);
          this.userList = this.userList.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i);
        }
      });
  }

  getAllMessages() {
    let params: any = {
      sender_id: this.loggedUser.userid,
      oparator: '==',
    };
    this.firebaseService.firebaseHandler("trade_chats", params, 'all_single_message').subscribe((response) => {
      if (response.length > 0) {
        let usersArray: Array<any> = [];
        let rows: Array<any> = response.sort((x, y) => {
          return y.created - x.created;
        });
        rows.forEach((row: any) => {
          if (row.product_id == this.productId) {
            if (usersArray.indexOf(row.sender_id) < 0) {
              usersArray.push(row.sender_id);
            }
          }
        });
        setTimeout(() => {
          usersArray.length > 0 ? this.getUserList(usersArray) : '';
        }, 100);
      }
    });
  }

  async selectUser(user) {
    this.router.navigate(['/trade/product/rating-tag',
      {
        "user_id": user._id,
        "product_id": this.productId,
        "email": user.email,
        "user_image": user.image == null ? 'assets/images/default-avatar.png' : user.image
      }
    ]);
  }

  async soldSomeWhere() {
    this.dialogService.show("Sold it somewhere else","You will be selling the " + this.productType + " to a non-registered user. Continue?")
        .then((res) => {
          this.apiService.postX('app_seller/product_sold', { product_id: this.productId, sold_id: '' })
            .subscribe((res) => { });
          this.router.navigate(['trade/product/my-product-listing/product']);
        })
        .catch((err) => {
          console.warn('rejected',err);
         // this.loaderService.dismiss();
        });

    // const alert = await this.alertController.create({
    //   header: 'Sold it somewhere else',
    //   message: "You will be selling the " + this.productType + " to a non-registered user. Continue?",
    //   cssClass: 'alertBox',
    //   buttons: [{
    //     text: 'No',
    //     role: 'cancel',
    //     cssClass: 'alertBoxCancel',
    //     handler: (blah) => {
    //     }
    //   }, {
    //     text: 'Yes',
    //     cssClass: 'alertBoxOk',
    //     handler: () => {
    //       this.apiService.postX('app_seller/product_sold', { product_id: this.productId, sold_id: '' })
    //         .subscribe((res) => { });
    //       this.router.navigate(['app/my-listing/product']);
    //     }
    //   }]
    // });
    // await alert.present();
  }
}
