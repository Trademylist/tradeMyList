import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private data = [];
  private purchase = new Subject();
  private product = new Subject();
  private commercial = new Subject();
  purchaseRefresh = this.purchase.asObservable();
  productRefresh = this.product.asObservable();
  commercialRefresh = this.commercial.asObservable();
  requestOption = new BehaviorSubject(undefined);

  constructor() { }

  /** Function is used to set data
  * @param  {} id
  * @param  {} data
  */
  setData(id, data) {
    this.data[id] = data;
  }
  /** Function is used to retrieve data
   * @param  {} id
   */
  getData(id) {
    return this.data[id];
  }
  /** Resolver is used to make sure the data is already available in our page once arrive there
   * @param  {ActivatedRouteSnapshot} route
   */
  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
    return this.getData(id);
  }
  /** Function is used to define replacement strings for moment#from
   */
  momentLocaleModifier() {
    moment.updateLocale('en', {
      relativeTime: {
        s: 'a few s',
        ss: '%d s',
        m: "a m",
        mm: "%d m",
        h: "an h",
        hh: "%d h"
      }
    });
  }
  publish() {
    this.purchase.next();
  }
  productPublish() {
    this.product.next();
  }
  commercialPublish() {
    this.commercial.next();
  }
  setRequestOption(option) {
    this.requestOption.next(option);
  }
  getRequestOption() {
    return this.requestOption.value;
  }
  clearRequestOption() {
    this.requestOption.next(undefined);
  }
}

export interface OnEnter {
  onEnter(): Promise<void>;
}