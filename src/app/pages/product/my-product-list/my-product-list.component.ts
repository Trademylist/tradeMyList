import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api-service/api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { NetworkService } from 'src/app/services/geo-service/network.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
//import { ModalController, AlertController } from '@ionic/angular';
//import { ViewImagePage } from 'src/app/shared/modal/view-image/view-image.page';
import { Location } from '@angular/common';
import { OnEnter } from 'src/app/services/utility/utility.service';
import { DialogService } from '../../../share/dialog/dialog.service';
import { DialogComponent } from '../../../share/dialog/dialog.component';
//import { InAppPurchasePage } from '../../../shared/modal/in-app-purchase/in-app-purchase.page';
import {Config}  from "../../../share/config";

declare var $:any;
@Component({
  selector: 'app-my-product-list',
  templateUrl: './my-product-list.component.html',
  styleUrls: ['./my-product-list.component.scss']
})
export class MyProductListComponent implements OnInit , OnEnter, OnDestroy {
  @ViewChild('appDialog',{static:true}) appDialog: DialogComponent;
  baseRoute=Config.baseRoute;
  public segment: string;
  public latlong: any;
  public getFavouriteProduct: any;
  public getUploadedProduct: any;
  public getUploadedCommercial: any;
  public getSoldProduct: any;
  public getSoldCommercial: any;
  public getExpireProduct: any;
  public getExpireCommercial: any;
  public productImageUrl: any;
  public getProductCategory: any;
  public getProductCategoryImageUrl: any;
  public getCommercialCategory: any;
  public getCommercialCategoryImageUrl: any;
  private subscription: Subscription;
  isDisabled = true;
  public favouriteLoaded: number = 0;
  constructor(
    private router: Router,
    private dialogService: DialogService,
    private activatedRoute:ActivatedRoute,
    private apiService: ApiService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private networkService: NetworkService,
    private authService: AuthenticationService,
    private location: Location
  ) {
    window.scroll(0,0);
   }

  public async ngOnInit(): Promise<void> {
    this.dialogService.register(this.appDialog);
    await this.onEnter();
  }

  public async onEnter(): Promise<void> {

    this.networkService.onPaymentCompletedForSellFaster.subscribe(action=>{
      this.segmentChanged(action);
    })
    this.latlong = this.networkService.getLatLong();
   // this.appAllCategory();
    this.activatedRoute.url.subscribe(params => {
      console.log("params",params);
  });
    this.subscription = this.activatedRoute.params.subscribe(event => {
      console.log(event.url);
      let redirectUrl=this.baseRoute+"/product/my-product-listing";
      if (event.url =='favourites') { 
        this.segment = "favourites";
        this.location.replaceState(redirectUrl+"/favourites");
        this.getFavourite();
        
      } else if (event.url === 'product') {
        this.segment = "product";
        this.location.replaceState(redirectUrl+"/product");
        this.sellerAllProduct();
      }
     
       else if (event.url =='commercial') {
        this.segment = "commercial";
        this.location.replaceState(redirectUrl+"/commercial");
        this.sellerAllCommercial();
      } else if (event.url=='sold') {
        this.segment = "sold";
        this.location.replaceState(redirectUrl+"/sold");
        this.sellerAllSoldProduct();
      } else if (event.url=='expired') {
        this.segment = "expired";
        this.location.replaceState(redirectUrl+"/expired");
        this.sellerAllExpiredProduct();
      }
    });
  }

  public ngOnDestroy(): void {

  }
  /** Function is used to change segment and display data according to it
   * @param  {} event
   */
  segmentChanged(productType) {
    this.segment = productType;
    let redirectUrl=this.baseRoute+"/product/my-product-listing";
    //this.segment = event.detail.value;
    if (productType == "favourites") {
      this.location.replaceState(redirectUrl+"/favourites");
      this.getFavourite();
    } else if (productType == "product") {
      this.location.replaceState(redirectUrl+"/product");
      this.sellerAllProduct();
    } 
    else if (productType == "commercial") {
      this.location.replaceState(redirectUrl+"/commercial");
      this.sellerAllCommercial();
    } else if (productType == "sold") {
      this.location.replaceState(redirectUrl+"/sold");
      this.sellerAllSoldProduct();
    } else if (productType == "expired") {
      this.location.replaceState(redirectUrl+"/expired");
      this.sellerAllExpiredProduct();
    }
  }

  // Get All Category
  appAllCategory() {
    this.apiService.get('app_user/category_list/product', '')
      .subscribe((res) => {
        if (res.success) {
          this.getProductCategory = res.data.category;
          this.getProductCategoryImageUrl = res.data.categoryImageUrl;
        }
      });
    this.apiService.get('app_user/category_list/freebies', '')
      .subscribe((res) => {
        if (res.success) {
          this.getCommercialCategory = res.data.category;
          this.getCommercialCategoryImageUrl = res.data.categoryImageUrl;
        }
      });
  }
  // End Get All Category

  // Favourite Section
  getFavourite() {
    this.loaderService.present();
    this.apiService.getX('app_seller/likelist')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.getFavouriteProduct = res.data.product;
          this.productImageUrl = res.data.productImageUrl;
        }
        this.favouriteLoaded = Object.keys(res.data.product).length <= 0 ? 2 : 1;
      }, error => {
        setTimeout(() => {
          this.favouriteLoaded = 2;
          this.loaderService.dismiss();
        }, 500);
      });
  }

  goProductDetails(product) {
    product.productImageUrl = this.productImageUrl
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "productDetails":JSON.stringify({_id:product._id}) //JSON.stringify(product)
      }
    };
    if (product.product_type == 'Commercial') {
      this.router.navigate(['trade/product/commercial-product-details'], navigationExtras);
    } else {
      this.router.navigate(['trade/product/product-details'], navigationExtras);
    }
  }

  isLiked(likelist) {
    let userId = this.authService.getUserId();
    if (likelist.indexOf(userId) > -1)
      return true;
    return false;
  }

  likedUnlikedFeed(product) {
    let userId = this.authService.getUserId();
    if (product.likelist.indexOf(userId) > -1) {
      if (product.product_price == null) {
        this.doLikeUnlike('commercial_dislikes', product);
      } else {
        this.doLikeUnlike('dislikes', product);
      }
    } else {
      if (product.product_price == null) {
        this.doLikeUnlike('commercial_likes', product);
      } else {
        this.doLikeUnlike('likes', product);
      }
    }
  }
  doLikeUnlike(apiName, product) {
    this.apiService.postX('app_seller/' + apiName, { "product_id": product._id })
      .subscribe((res) => {
        if (res.success) {
          this.getFavourite();
        }
      });
  }

  startExploring() {
    this.router.navigate(['app/product']);
  }
  // End Favourite Section

  // Product Section
  sellerAllProduct() {
    this.loaderService.present();
    this.apiService.getX('app_seller/own_product', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.getUploadedProduct = res.data.product;
          this.productImageUrl = res.data.productImageUrl;
        }
      }, error => {
        setTimeout(() => {
          this.loaderService.dismiss();
        }, 500);
      });
  }
  // End Product Section

  // Commercial Section
  sellerAllCommercial() {
    this.loaderService.present();
    this.apiService.getX('app_seller/own_freebies', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.getUploadedCommercial = res.data.product;
          this.productImageUrl = res.data.productImageUrl;
        }
      }, error => {
        setTimeout(() => {
          this.loaderService.dismiss();
        }, 500);
      });
  }
  // End Commercial Section

  // Product And Commercial Common Section
  async startDelete(product, type) {
    if(confirm("Are you sure want to delete?")){
      this.deleteProduct(product, type);
    }
  }

  deleteProduct(product, type) {
    let url: any = (type == 'product' ? 'product' : 'freebies');
    this.loaderService.present();
    this.apiService.deleteX('app_seller/' + url, product._id)
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (type == 'product') {
          if (res.success) {
            let i = this.getUploadedProduct.indexOf(product);
            if (i > -1)
              this.getUploadedProduct.splice(i, 1);
            this.toastService.presentToast('Item deleted successfully.');
          }else{
            this.toastService.presentToast(res.message);
          }
        } else {
          if (res.success) {
            let i = this.getUploadedCommercial.indexOf(product);
            if (i > -1)
              this.getUploadedCommercial.splice(i, 1);
            this.toastService.presentToast('Item deleted successfully.');
          }else{
            this.toastService.presentToast(res.message);
          }
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }

  async viewImage(productImageUrl, img) {
    // const modal = await this.modalController.create({
    //   component: ViewImagePage,
    //   componentProps: {
    //     image: img,
    //     path: productImageUrl,
    //     position: 0
    //   }
    // });
    // await modal.present();
  }

  startEdit(getValue, type, redirectUrl) {
   
    console.log(type);
    let product_type: any = (type == 'product' ? 'product' : 'commercial');
    let category: any = (type == 'product' ? JSON.stringify(this.getProductCategory) : JSON.stringify(this.getCommercialCategory));
    let imgUrl: any = (type == 'product' ? JSON.stringify(this.getProductCategoryImageUrl) : JSON.stringify(this.getCommercialCategoryImageUrl));

    let navigationExtras: NavigationExtras = {
      queryParams: {
        "taskType": 'edit',
        "redirectUrl": redirectUrl,
        "productType": product_type,
        "product_id": getValue._id,
        "categoryDetails": category,
        "categoryImageUrl": imgUrl
      }
    };
    console.log(navigationExtras);
    this.router.navigate(['/trade/product/edit-product'], navigationExtras);

  }

  async startSold(product, type) {

    // if(confirm("This action can't be undone. Only select this when you have met the buyer and received payment. Continue?")){
    //   this.markSold(product, type);
    // }


    this.dialogService.show("Mark as sold","This action can't be undone. Only select this when you have met the buyer and received payment. Continue?")
        .then((res) => {
          this.markSold(product, type);
        })
        .catch((err) => {
          console.warn('rejected',err);
         // this.loaderService.dismiss();
        });

    // const alert = await this.alertController.create({
    //   header: 'Mark as sold',
    //   message: "This action can't be undone. Only select this when you have met the buyer and received payment. Continue?",
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
    //       this.markSold(product, type);
    //     }
    //   }]
    // });
    // await alert.present();
  }

  async markSold(product, type) {
    this.router.navigate(['trade/product/sale-product', { productId: product._id,productType:type }]);
  }
  // End  Product And Commercial Common Section

  // Sold Product Section
  sellerAllSoldProduct() {
    this.loaderService.present();
    this.apiService.getX('app_seller/all_sold_product', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.getSoldProduct = res.data.product;
          this.getSoldCommercial = res.data.freebies;
          this.productImageUrl = res.data.productImageUrl;
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }

  async startDeleteSoldItem(product, type) {

    this.dialogService.show("Delete product","Are you sure you want to delete this listing?")
    .then((res) => {
      this.deleteSoldItem(product, type)
    })
    .catch((err) => {
      console.warn('rejected',err);
     // this.loaderService.dismiss();
    });
    
    // const alert = await this.alertController.create({
    //   header: 'Delete listing',
    //   message: 'Are you sure you want to delete this listing?',
    //   cssClass: 'alertBox',
    //   buttons: [{
    //     text: 'Cancel',
    //     role: 'cancel',
    //     cssClass: 'alertBoxCancel',
    //     handler: (blah) => {
    //     }
    //   }, {
    //     text: 'Okay',
    //     cssClass: 'alertBoxOk',
    //     handler: () => {
    //       this.deleteSoldItem(product, type)
    //     }
    //   }]
    // });
    // await alert.present();
  }

  deleteSoldItem(getProduct, type) {
    this.loaderService.present();
    let api: any = (type == 'product' ? 'delete_sold_product' : 'delete_sold_freebies');
    let product: any[] = (type == 'product' ? this.getSoldProduct : this.getSoldCommercial);

    this.apiService.postX('app_seller/' + api, { product_id: getProduct._id })
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          let i = product.indexOf(getProduct);
          if (i > -1)
            product.splice(i, 1);
          this.toastService.presentToast(res.message);
        } else {
          this.toastService.presentToast("Something going wrong");
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }

  sellAgain(getProduct, type) {
    this.loaderService.present();
    let api: any = (type == 'product' ? 'product_resell' : 'freebies_resell');
    let product: any[] = (type == 'product' ? this.getSoldProduct : this.getSoldCommercial);

    this.apiService.postX('app_seller/' + api, { product_id: getProduct._id })
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          let i = product.indexOf(getProduct);
          if (i > -1) {
            product.splice(i, 1);
          }
          this.router.navigate(['app/my-listing/' + type]);
        } else {
          this.toastService.presentToast("Something going wrong");
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }
  // End Product Section

  // Expired Product Section
  sellerAllExpiredProduct() {
    this.loaderService.present();
    this.apiService.getX('app_seller/all_expire_product', '')
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.getExpireProduct = res.data.product;
          this.getExpireCommercial = res.data.freebies;
          this.productImageUrl = res.data.productImageUrl;
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }

  async startDeleteExpired(product, type) {

    if(confirm("Are you sure you want to delete this listing?")){
      this.deleteExpiredItem(product, type);
    }
    // const alert = await this.alertController.create({
    //   header: 'Delete listing',
    //   message: 'Are you sure you want to delete this listing?',
    //   cssClass: 'alertBox',
    //   buttons: [{
    //     text: 'Cancel',
    //     role: 'cancel',
    //     cssClass: 'alertBoxCancel',
    //     handler: (blah) => {
    //     }
    //   }, {
    //     text: 'Okay',
    //     cssClass: 'alertBoxOk',
    //     handler: () => {
    //       this.deleteExpiredItem(product, type);
    //     }
    //   }]
    // });
    // await alert.present();
  }

  deleteExpiredItem(getProduct, type) {
    this.loaderService.present();
    let product: any[] = (type == 'product' ? this.getExpireProduct : this.getExpireCommercial);

    this.apiService.deleteX('app_seller/all_expire_product', getProduct._id)
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          let i = product.indexOf(getProduct);
          if (i > -1)
            product.splice(i, 1);
        }
      }, error => {
        this.loaderService.dismiss();
      });
  }
  // End Expired Product Section

  gotoShare() {
    this.router.navigate(['app/share-product']);
  }

  /** Function is used to check if any cover image is uploaded and shows cover image according to it
   */
  coverImageCheck(product) {
    if (product.cover_thumb != undefined) {
      return (this.productImageUrl + product.cover_thumb);
    } else {
      return (this.productImageUrl + product.image[0]);
    }
  }


  coverImageCheckAmazon(product) {
    if (product.cover_thumb != undefined) {
      return (product.cover_thumb);
    } else {
      if (product.image[0] != undefined) {
        return ( product.image[0]);
      } else {
        return 'assets/images/no_image.jpg';
      }
    }
  }
  
  /** Function is used to split words and put elipsis
   * @param  {string} productName
   * @param  {number} val
   */
  splitWord(productName: string, val: number) {
    const strTOArray = productName.split(' ');
    const newStr = strTOArray.filter((item, i) => (i < val)).join(' ');
    return (newStr.length === productName.length) ? newStr : `${newStr}...`;
  }
  /** Function is used to view in-app-purchase page
   */
  async viewBoostModal(product, page) {
    let componentProps= {
          page: page,
          consumable: 'boost_product',
          product_id: product._id,
          product_type: product.product_type
        }
    this.networkService.selectedProductForSellFaster.next(componentProps);
    $('#paypalModal').show();
   // alert("show modal pending")
    // const modal = await this.modalController.create({
    //   component: InAppPurchasePage,
    //   componentProps: {
    //     page: page,
    //     consumable: 'boost_product',
    //     product_id: product._id,
    //     product_type: product.product_type
    //   }
    // });
    // modal.onDidDismiss().then(data => {
    //   if (data.data == true) {
    //     if (page == 'boost') {
    //       this.modifyBoostedProduct(product._id, product.product_type);
    //     } else {
    //       this.removeReactivatedProducts(product._id, product.product_type);
    //     }
    //   }
    // });
    // await modal.present();
  }
  modifyBoostedProduct(productId, type) {
    let product: any[] = (type == 'Product' ? this.getExpireProduct : this.getExpireCommercial);
    let i = product.findIndex(prdt => prdt._id == productId);
    if (i > -1) {
      product[i].boost = 1;
    }
  }
  removeReactivatedProducts(productId, type) {
    let product: any[] = (type == 'Product' ? this.getExpireProduct : this.getExpireCommercial);
    let i = product.findIndex(prdt => prdt._id == productId);
    if (i > -1) {
      product.splice(i, 1);
    }
  }
  closePaypalModal(){
    $('#paypalModal').hide();
  }
  /** Function is used to check if boost option should be shown for the product
   */
  checkBooost(product) {
    if (product.boost == 0) {
      return false;
    } else {
      return true;
    }
  }
}