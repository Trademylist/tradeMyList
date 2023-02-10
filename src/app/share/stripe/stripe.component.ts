
import { ICreateOrderRequest } from "ngx-paypal";
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef, OnInit, Input
} from '@angular/core';
// import { AlertController, Events, Platform, ModalController } from '@ionic/angular';
// import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { ApiService } from '../../services/api-service/api.service';
import { ToastService } from '../../services/toast/toast.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InAppPurchaseService } from '../../services/in-app-purchase/in-app-purchase.service';
import { CreditCardValidators } from 'angular-cc-library';
import { NgForm } from "@angular/forms"
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service'
import { NetworkService } from 'src/app/services/geo-service/network.service';
import { Config } from '../../share/config';
import { Router, NavigationEnd, NavigationExtras, ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';

declare var $: any;
@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;

  stripe;
  loading = false;
  confirmation;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  page: string;
  consumable: string;
  product_id: string;
  product_type: string

  product: any = [];
  days: number;
  success: boolean = false;
  checkApprovedCallTimes: number = 0;
  checkAPICallTimes: number = 0;
  pageTitle: string;
  selectedBoost: any = [];
  currencyCode = '';
  message = '';

  cardForm: FormGroup;
  submitted: boolean = false;
  showPaymentCard = false;

  constructor(

    public loaderService:LoaderService,
    public router:Router,
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService,
    public networkService: NetworkService,
    // public platform: Platform,
    // private iap2: InAppPurchase2,
    // private modalController: ModalController,
    private _fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private iapService: InAppPurchaseService,
    // private events: Events,
    // private alertController: AlertController
  ) {

  }

  ngAfterViewInit() {
    this.stripeService.setPublishableKey('pk_test_51I9ehvHyg5mkVfE7IxuFmH9v5aSlOU8K9vsOYhiS8TOqY2LpUM0cFImNXIGdkHinv7pN6cVItvDMDNnZ2KPFG0uF00dPc1n5uj').then(
      stripe => {
        this.stripe = stripe;
        const elements = stripe.elements();

        var style = {
          base: {
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            },
            ':-webkit-autofill': {
              color: '#32325d',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
            ':-webkit-autofill': {
              color: '#fa755a',
            },
          }
        };
        // var element = elements.create('card', );
        
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
      });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    this.loaderService.presentLoader();
    
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.log('Error:', error);
      this.loaderService.dismiss();
    } else {
      this.submitted = true;
      console.log('Success!', token);
      this.loaderService.dismiss();
      let payload = {
        "amount": this.selectedBoost.price,
        "currency": "USD",
        "token": token.id
      }

      this.apiService.postX('app_user/create_charge', payload)
        .subscribe((res) => {
          if (res.paid) {
            console.log(res);
            this.storePaymentInfo(res);
           // this.purchaseComplete();
          }
        });

    }
  }

  storePaymentInfo(res) {
    this.loaderService.presentLoader();
    let userDetails=Config.getLoginUser;
    let payload = {
      "user_id":userDetails.userid,
      "product_id":this.product_id,
      "info":res
  }
    this.apiService.postX('app_seller/payment', payload)
      .subscribe((res) => {
        this.loaderService.dismiss();
       this.purchaseComplete();
      });
  }
  // onSubmit() {
  //   this.submitted = true;
  //   console.log(this.cardForm);
  // }

  closePaypalModal() {
    this.showPaymentCard = false;
    this.submitted=false;
    $('#paypalModal').hide();
  }
  ngOnInit() {
    //this.showPaymentCard = this.showCard;
    this.networkService.onSelectedProductForSellFaster.subscribe((data) => {
      this.page = data.page;
      this.consumable = data.consumable;
      this.product_id = data.product_id;
      this.product_type = data.product_type;

      console.log("NetworkServiceNetworkService", data);
      this.initPrice();
    });
    this.cardForm = this._fb.group({
      creditCard: ['', [CreditCardValidators.validateCCNumber]],
      expirationDate: ['', [CreditCardValidators.validateExpDate]],
      creditCardHolderName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(75)]],
      cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
    });


   
  }

  initPrice(){
    this.product=[];
    if (this.page == 'boost') {
      this.pageTitle = 'Boost ' + this.product_type;
      // for (let i = 0; i <= 2; i++) {
      // this.product.push(this.iapService.consumables[i]);
      this.product.push({ id: "boost_daily", title: "Daily", price: parseFloat('1.00').toFixed(2) });
      this.product.push({ id: "boost_weekly", title: "Weekly", price: parseFloat('5.00').toFixed(2) });
      this.product.push({ id: "boost_monthly", title: "Monthly", price: parseFloat('20.00').toFixed(2) });


      // }
    } else {
      
      this.pageTitle = 'Reactivate ' + this.product_type;
      // this.product.push(this.iapService.consumables[3]);
      this.product.push({ title: "Daily", price: parseFloat('0.99').toFixed(2)  });
    }
  }

  processPayment(cc) {
    console.log(cc);
  }
  registerHandlersForPurchase(productId) {
    // let self = this.iap2;
    // this.iap2.when(productId).updated(function (product) {
    //   if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
    //     product.finish();
    //   }
    // });
    // this.iap2.when(productId).registered((product: IAPProduct) => { });
    // this.iap2.when(productId).owned((product: IAPProduct) => {
    //   product.finish();
    // });
    // this.iap2.when(productId).approved((product: IAPProduct) => {
    //   this.checkApprovedCallTimes++;
    //   product.finish();
    //   this.purchaseComplete();
    // });
    // this.iap2.when(productId).refunded((product: IAPProduct) => { });
    // this.iap2.when(productId).expired((product: IAPProduct) => { });
  }

  checkoutFeature(prdt) {
    $('[data-toggle="tooltip"]').tooltip()
    if (Object.keys(prdt).length <= 0) {
      this.alertMsg();
    } else {
      this.showPaymentCard = true;
      // this.registerHandlersForPurchase(prdt);
      try {
        // this.iap2.order(prdt).then((p) => {
        //   this.registerHandlersForPurchase(prdt);
        //   if (this.page == 'boost') {
        //     this.days = prdt.id == 'boost_daily' ? 1 : prdt.id == 'boost_weekly' ? 7 : 30;
        //   }
        // }).catch((e) => { });

        if (this.page == 'boost') {
          this.days = prdt.id == 'boost_daily' ? 1 : prdt.id == 'boost_weekly' ? 7 : 30;
        }
      } catch (err) { }
    }
  }

  checkoutReactivate(prdt) {
    this.selectedBoost.price=prdt.price;
    $('[data-toggle="tooltip"]').tooltip()
    if (Object.keys(prdt).length <= 0) {
      this.alertMsg();
    } else {
      this.showPaymentCard = true;
    }
  }

  cancel() {
    this.showPaymentCard = false;
  }
  purchaseComplete() {
    if (this.page == 'boost') {
      if (this.product_type == 'Product') {
        this.boostProduct('app_seller/boost');
      } else {
        this.boostProduct('app_seller/commercial_boost');
      }
    } else {
      if (this.product_type == 'Product') {
        this.reactivateProduct('app_seller/product_reactivation');
      } else {
        this.reactivateProduct('app_seller/commercial_reactivation');
      }
    }
  }

  boostProduct(apiUrl) {
    this.loaderService.presentLoader();
    let data = {
      product_id: this.product_id,
      no_of_day: this.days
    }
    this.apiService.postX(apiUrl, data).subscribe(resp => {
      this.loaderService.dismiss();
      this.checkAPICallTimes++;
      if (resp.success) {
        this.closePaypalModal();
        if (this.product_type == 'Product') {
          this.networkService.paymentCompletedForSellFaster.next('product');
          // this.router.navigate(['trade/product/my-product-listing/product']);
          //this.events.publish('product:reload', this.product_id);
        } else {
          this.networkService.paymentCompletedForSellFaster.next('commercial');
          // this.router.navigate(['trade/product/my-product-listing/commercial']);
          // this.events.publish('commercial:reload', this.product_id);
        }
        this.toastService.presentToast(this.product_type + " boosted");
        this.success = true;
        this.close();
      } else {
        this.toastService.presentToast(resp.message);
      }
    }, err => {
      this.loaderService.dismiss();
      this.toastService.presentToast(this.product_type + " boosting not successful, please try again");
    });
  }

  reactivateProduct(apiUrl) {
    this.loaderService.presentLoader();
    let data = {
      product_id: this.product_id
    }
    this.apiService.postX(apiUrl, data).subscribe(resp => {
      this.loaderService.dismiss();
      if (resp.success) {
        this.closePaypalModal();
        if (this.product_type == 'Product') {
          this.networkService.paymentCompletedForSellFaster.next('product');
          // this.events.publish('product:reload', this.product_id);
        } else {
          // this.events.publish('commercial:reload', this.product_id);
          this.networkService.paymentCompletedForSellFaster.next('commercial');
        }
        this.toastService.presentToast("Reactivation successful");
        this.success = true;
        this.close();
      } else {
        this.toastService.presentToast(resp.message);
      }
    }, err => {
      this.loaderService.dismiss();
      this.toastService.presentToast("Reactivation unsuccessful, please try again");
    });
  }
  isBoostSelected(boost) {
    return boost.id == this.selectedBoost.id;
  }
  selectNewBoost(boost) {
    this.selectedBoost = boost;
  }
  async alertMsg() {
    // alert("Please select a boost before continuing");
    $("#boost-alert").show();
    // const alert = await this.alertController.create({
    //   message: 'Please select a boost before continuing',
    //   cssClass: 'alertBox',
    //   buttons: ['OK']
    // });
    // await alert.present();
  }
  close() {
    //this.modalController.dismiss(this.success);
  }

  getCurrencyCode() {
    let country = localStorage.getItem("country");
    this.apiService.postX('app_user/currency', { 'country': country })
      .subscribe((res) => {
        if (res.success) {
          this.currencyCode = res.code;
        } else {
          this.message = 'Something went wrong; please try again later.';
        }
      }, error => {
        this.message = 'Something went wrong; please try again later.';
      });
  }

  getCurrencySymbol(currency) {
    // if(this.currencies[currency] !==undefined){
    //   return this.currencies[currency].symbol;
    // }else{
    //   return currency;
    // }

  }
  closeMe(id){
    $('#'+id).hide();
  }
}
