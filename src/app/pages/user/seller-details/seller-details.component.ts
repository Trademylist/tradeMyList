import { Component, OnInit,ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api-service/api.service';
import { LoaderService } from '../../../services/loader/loader.service';
import {ToastService} from '../../../services/toast/toast.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../../../share/dialog/dialog.component'
import { DialogService } from '../../../share/dialog/dialog.service';

//import { PopoverController } from '@ionic/angular';
///import { ReportPage } from '../../../shared/modal/report/report.page';

import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss']
})
export class SellerDetailsComponent implements OnInit {
 @ViewChild('appDialog',{static:true}) appDialog: DialogComponent;

  public dialogTitle:string="";
  public dialogMessage:string="";
  public sellerSegment: string;
  public seller_id: any;
  public sellerBasicDetails: any = {};
  public sellerRating: any=5;
  public sellerProducts: Array<any> = [];
  public sellerCommercials: Array<any> = [];
  public sellerSoldProducts: Array<any> = [];
  public productImageUrl: any = '';
  public sellerReviews: Array<any> = [];

  constructor(
    private toastService:ToastService,
    private dialogService: DialogService,
    private location: Location,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private utilityService:UtilityService,
    //private popoverController: PopoverController
  ) { }

  ngOnInit() { 
    this.dialogService.register(this.appDialog);
    this.onEnter();
  }

  onEnter() {
    this.sellerSegment = 'selling';
    this.activatedroute.queryParams.subscribe(params => {
      if (params) {
        this.seller_id = params.sender_id;
      }
    });
    setTimeout(() => {
      this.initSellerDetails();
    }, 5);
  }
  /** Function is used to check if seller details is shown for the logged in users or not
   */
  onRate($event){

    
  }
  checkLoggedUser() {
    if (localStorage.getItem('userDetails')) {
    let userid = JSON.parse(localStorage.getItem('userDetails')).userid;
    if (this.seller_id == userid) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
  }

  segmentChanged(event) {
    if (event== "selling") {
      this.sellerSegment = event;
    } else if (event == "commercial") {
      this.sellerSegment = event;
    } else if (event == "reviews") {
      this.sellerSegment = event;
    }
  }

  /** Function is used to go back to previous page in stack
   */
  goBack() {
    this.location.back();
  }

  initSellerDetails() {
    this.loaderService.present();
    this.apiService.post('app_user/get_review', { "user_id": this.seller_id }).subscribe(res => {
      this.loaderService.dismiss();
      if (res.success) {
        this.sellerBasicDetails = res.data.user_details;
        this.sellerRating = this.sellerBasicDetails.avgRating == null ? 0 : this.sellerBasicDetails.avgRating;
        this.sellerProducts = res.data.seller_products;
        this.sellerCommercials = res.data.seller_commercial;
        this.productImageUrl = res.data.product_imageUrl;
        this.sellerReviews = res.data.review_details;
      }
    }, error => {
      this.loaderService.dismiss();
    });
  }

  goProductDetails(getValue) {
    getValue.productImageUrl = this.productImageUrl;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "productDetails": JSON.stringify(getValue)
      }
    };
    this.router.navigate(['trade/product/product-details'], navigationExtras);
  }

  /** Function is called to show report popover
   * @param  {any} ev
   */

  async presentPopover(ev: any) {
    alert('popover seller for report page');
    // const popover = await this.popoverController.create({
    //   component: ReportPage,
    //   componentProps: {
    //     "userId": this.seller_id
    //   },
    //   event: ev,
    //   translucent: true
    // });
    // return await popover.present();
  }
  /** Function is used to view user data
  */
  seeUserDetails(user_id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "sender_id": user_id,
      }
    };
    this.router.navigate(['trade/user/product-seller-details'], navigationExtras);
    this.seller_id = user_id;
    this.initSellerDetails();
    this.sellerSegment='selling';
   
  }
  /** Function is used to open product details page
   * @param  {} product
   */
  openProductDetails(product) {
    let navigationExtras: NavigationExtras = {
      // queryParams: {
      //   "productDetails": JSON.stringify(product),
      // }
      queryParams: {
        "productDetails": JSON.stringify({_id:product._id}),
      }
    };
    this.router.navigate(['trade/product/product-details'], navigationExtras);
  }
  /** Function is used to open commercial details page
   * @param  {} product
   */
  openCommercialDetails(product) {
    product.productImageUrl = this.productImageUrl
    let navigationExtras: NavigationExtras = {
      // queryParams: {
      //   "productDetails": JSON.stringify(product),
      // }
      queryParams: {
        "productDetails": JSON.stringify({_id:product._id}),
      }
      
    };
    this.router.navigate(['trade/product/commercial-product-details'], navigationExtras);
  }


  /** Function is used to navigate to user reporting page
   */
  openReportPage() {
    // this.dismissPage();
    // this.utilityService.setData('id', this.seller_id);
    // this.router.navigate(['trade/user/report-user']);


    let navigationExtras: NavigationExtras = {
      queryParams: {
        "sender_id": this.seller_id,
      }
    };
    this.router.navigate(['trade/user/report-user'], navigationExtras);
  }

  /** Function is used to block user
   */
  async blockUser() {
    
    this.dialogService.show("Block User","Blocking will prevent you from sending and receiving any messages to the user. Are you sure?")
    .then((res) => {
      this.loaderService.presentLoader();
      console.warn('ok clicked');
      let data = {
                block_user_id: this.seller_id
              }
              this.apiService.postX("app_seller/block_user", data).subscribe(resp => {
                this.loaderService.dismiss();
                this.toastService.presentToast(resp.message);
                if (resp.success) {
                  this.goToProduct();
                }
              });
    })
    .catch((err) => {
      console.warn('rejected',err);
     // this.loaderService.dismiss();
    });

    // alert("Confirm Block user");
    // this.dismissPage();
    // const alert = await this.alertController.create({
    //   header: 'Block User',
    //   message: 'Blocking will prevent you from sending and receiving any messages to the user. Are you sure?',
    //   cssClass: 'alertBox',
    //   buttons: [{
    //     text: 'Cancel',
    //     role: 'cancel',
    //     cssClass: 'alertBoxCancel',
    //     handler: (blah) => { }
    //   }, {
    //     text: 'OK',
    //     cssClass: 'alertBoxOk',
    //     handler: () => {
    //       let data = {
    //         block_user_id: this.userId
    //       }
    //       this.apiService.postX("app_seller/block_user", data).subscribe(resp => {
    //         this.toastService.presentToast(resp.message);
    //         if (resp.success) {
    //           this.goToProduct();
    //         }
    //       });
    //     }
    //   }]
    // });
    // alert.present();
  }

  /** Function is used to dismiss popover page
   */
  dismissPage() {
   
  }

  goToProduct() {
   this.router.navigate(['/home-page']);
  }

}
