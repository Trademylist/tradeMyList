import { Injectable } from '@angular/core';
//import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { environment } from '../../../environments/environment.prod';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root'
})
export class InAppPurchaseService {
  consumables: any = [];

  constructor(
   // private iap2: InAppPurchase2,
    private utilityService: UtilityService
  ) { }

  /** Function is used to setup products;
   */
  setup() {
    // this.iap2.verbosity = this.iap2.DEBUG;
    // environment.consumableIds.forEach(productId => {
    //   this.iap2.register({
    //     id: productId,
    //     type: this.iap2.CONSUMABLE,
    //     alias: productId
    //   });
    //   this.consumables.push(this.iap2.get(productId));
    //   this.registerHandlersForPurchase(productId);
    // });

    // this.iap2.refresh();
  }

  registerHandlersForPurchase(productId) {
  //   let self = this.iap2;
  //   this.iap2.when(productId).updated(function (product) {
  //     if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
  //       product.finish();
  //     }
  //   });
  //   this.iap2.when(productId).registered((product: IAPProduct) => { });
  //   this.iap2.when(productId).owned((product: IAPProduct) => {
  //     product.finish();
  //   });
  //   this.iap2.when(productId).approved((product: IAPProduct) => {
  //     product.finish();
  //     this.utilityService.publish();
  //   });
  //   this.iap2.when(productId).refunded((product: IAPProduct) => { });
  //   this.iap2.when(productId).expired((product: IAPProduct) => { });
  }
}
