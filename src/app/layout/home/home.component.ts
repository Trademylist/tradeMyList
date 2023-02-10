import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationExtras, Router, ActivatedRoute, UrlTree, UrlSegmentGroup, UrlSegment, PRIMARY_OUTLET, NavigationStart } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
// import { SubFilterPage } from 'src/app/shared/modal/sub-filter/sub-filter.page';
import { ApiService } from '../../services/api-service/api.service';
import { NetworkService } from '../../services/geo-service/network.service';
import { LoaderService } from '../../services/loader/loader.service';
import { ToastService } from '../../services/toast/toast.service';
import { OnEnter, UtilityService } from '../../services/utility/utility.service';
import { Config } from '../../share/config';
// import { ProductFilterLocationPage } from '../product-filter-location/product-filter-location.page';
// import { ProductFilterSubcategoryPage } from '../product-filter-subcategory/product-filter-subcategory.page';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // pageSize = Config.itemPerPage;
  pageSize = 11;
  currentPage = 1;
  totalProduct=0;
  loadingMore=false;
  storeIndex = 0;

  public BASE_API="app_user";
  selectedLocality = localStorage.getItem('locality');
  public searchQuery: any = '';
  public allCategory: any = [];
  public categoryImageUrl: any = '';
  public allProduct: any = [];
  public productImageUrl: any = '';
  public loggedUser: any = {};
  private subscription: Subscription;
  public filtersData: any;
  public productRadius: string;
  public latlong: any;
  public locality: string;
  public dataLoaded=0;
  public localLocality: any;
  public home_scroll: number = 0;
  
  constructor(
    private router: Router,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private networkService: NetworkService,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private activatedroute: ActivatedRoute,
    private toastService: ToastService,
  ) {

    this.home_scroll = Number(JSON.parse(sessionStorage.getItem("home_scroll")));
    console.log("home_scroll====", this.home_scroll)
    if(this.home_scroll != null && this.home_scroll != 0) {
      window.scrollTo(0,this.home_scroll);
    } else {
      window.scrollTo({ top: 0});
    }

    window.addEventListener('beforeunload', (event) => {
      sessionStorage.removeItem("product_list");
      sessionStorage.removeItem("product_count");
      sessionStorage.removeItem("home_scroll");
    });
  }


  public ngOnInit() {
    this.localLocality = localStorage.getItem("locality");

    this.networkService.onPaymentCompletedForSellFaster.subscribe(action=>{
      console.log("option 1")
      this.allProduct=[];
      this.initProductData();
    });

    this.networkService.currentLocality.subscribe((locality) => {
      console.log("option 2")
      let product_list = JSON.parse(sessionStorage.getItem("product_list"));
      let product_count = JSON.parse(sessionStorage.getItem("product_count"));

      if(locality === this.localLocality && product_list != null) {
        this.allProduct = product_list
        this.currentPage = 1;
        this.totalProduct = Number(product_count);
        this.latlong = this.networkService.getLatLong();
        if (!localStorage.getItem("longitude") && !localStorage.getItem('latitude')) {
          this.networkService.getGeolocation();
        }
        this.productRadius = localStorage.getItem('radius') ? localStorage.getItem('radius') : null;
        this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));

      } else {

        sessionStorage.removeItem("product_list");
        sessionStorage.removeItem("product_count");
        sessionStorage.removeItem("home_scroll");

        const tree: UrlTree = this.router.parseUrl(this.router.url);
        const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
        const s: UrlSegment[] = g.segments;
  
        window.scrollTo({ top: 0});
        this.allProduct=[];
        this.currentPage = 1;
        this.totalProduct=0;
        this.loadingMore=false;
        this.locality = locality;
        this.initProductData();
      }
    })
    
    this.activatedroute.paramMap.subscribe(params => {
      console.log("option 3")
      if (params['params']['category'] != undefined) {
        this.searchQuery = params['params']['category'];
      }
    });

    this.networkService.onHeaderSearch.subscribe((searchData) => {
      console.log("option 4");
      window.scrollTo({ top: 200});
      if(searchData != '') {
        this.searchQuery = searchData;
        this.initProductData();
      } else{
        this.searchQuery = '';
        this.currentPage = 1;
        this.totalProduct=0;
        this.allProduct=[];
        this.initProductData();
      }
    })
  }

  loadMore() {
    this.loadingMore=true;
    this.currentPage++;
    let data = {
      latitude: this.latlong.latitude,
      longitude: this.latlong.longitude,
      distance: parseInt(this.productRadius),
      country: localStorage.getItem('country'),
    }
    this.appAllProductOnScroll(data, this.pageSize, this.currentPage);
  }
  
  
  onScrollUp() {
  }

  goToAddProduct() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "taskType": 'add',
        "redirectUrl": 'product',
        "productType": 'product',
      }
    };
    this.router.navigate(['/trade/product/add-product'], navigationExtras);
  }

  async initProductData() {
    this.latlong = this.networkService.getLatLong();
    if (!localStorage.getItem("longitude") && !localStorage.getItem('latitude')) {
      this.networkService.getGeolocation();
    }
    this.productRadius = localStorage.getItem('radius') ? localStorage.getItem('radius') : null;
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    this.appAllCategory();
    if (this.filtersData == null) {
      this.locality = this.networkService.getLocality();
      setTimeout(() => {
        this.locality = this.networkService.getLocality();
        if ((this.locality == '' || this.locality == null || this.locality == 'undefined')) {
          $('#location-alert').show();
        }
      },6000);

      let data = {
        latitude: this.latlong.latitude,
        longitude: this.latlong.longitude,
        distance: parseInt(this.productRadius),
        country: localStorage.getItem('country'),
        unit: "Miles",
        search_key:this.searchQuery
      }

      this.appAllProduct(data, this.pageSize, this.currentPage);
      localStorage.removeItem("filtersData");
      this.filtersData = null;
    } else {
      delete this.filtersData['exradius'];
      delete this.filtersData['rangeRadius'];
    }
  }


  public ngOnDestroy(): void {

  }

  // go profile page
  gotoProfile() {
    this.router.navigate(['app/profile']);
  }
  // go profile page

  // get all product category
  appAllCategory() {
    this.apiService.get('app_user/category_list/product', '')
      .subscribe((res) => {
        if (res.success) {
          this.allCategory = res.data.category;
          this.categoryImageUrl = res.data.categoryImageUrl;
        }
      });
  }
  // end get all product category

  // get all product fn call
  appAllProduct(latlong, limit = 12, page) {
    //alert(JSON.stringify(latlong));
    this.loaderService.present();
    this.apiService.postX('app_user/all_product?page=' + page + '&limit=' + limit, latlong)
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.productSetup(res);
        }
      }, error => {
        setTimeout(() => {
          this.loaderService.dismiss();
        }, 1000);
      });
  }

  appAllProductOnScroll(latlong, limit = 12, page) {
    //this.loaderService.present();
    this.apiService.postX('app_user/all_product?page=' + page + '&limit=' + limit, latlong)
      .subscribe((res) => {
        this.loadingMore=false;
       // this.loaderService.dismiss();
        if (res.success) {
          this.productSetup(res);
        }
      }, error => {
        this.loadingMore=false;
        setTimeout(() => {
        //  this.loaderService.dismiss();
        }, 1000);
      });
  }

  /** Function is used to setup product data from response 
  * @param  {} response
  * @param  {} event
  */

  async productSetup(response, event = '') {
    
    this.totalProduct=response.data.total;
    sessionStorage.setItem("product_count", JSON.stringify(this.totalProduct));
    let today = moment();

    if (response.data.product.length > 0 && (this.allProduct.length > 0 && this.currentPage > 1) || (this.allProduct.length == 0 && this.currentPage == 1)) {
      response.data.product.forEach(product => {
        product.createdAt = moment(product.createdAt).from(today);
        this.allProduct.push(product);
      }); 
      for(let i=7;i<this.allProduct.length; i += 7) {
        this.allProduct[i].show_content = true;
      }
      // sessionStorage.removeItem("product_list");
      sessionStorage.setItem("product_list", JSON.stringify(this.allProduct));
    }else{
      
      // this.allProduct=[];
      // response.data.product.forEach(product => {
      //   product.createdAt = moment(product.createdAt).from(today);
      //   this.allProduct.push(product);
  
      this.allProduct = response.data.product;
      
    }
    this.productImageUrl = response.data.productImageUrl;
    if (this.filtersData != null) {
      this.locality = this.filtersData.locality;
    }
    
    this.dataLoaded = Object.keys(this.allProduct).length <= 0 ? 2 : 1;
    if (event != "") {
      //event.target.complete();
    }
    if (Object.keys(response.data.product).length <= 0) {
      // this.noMoreData = "No more Products to load. Check back later.";
    }
    // if (this.selectedProductId != undefined) {
    //   setTimeout(() => {
    //     this.scrollToLabel(this.selectedProductId);
    //   }, 300);
    // }
  }
  // end get all product fn call

  // async doRefresh(event) {
  //   setTimeout(() => { 
  //     this.latlong = this.networkService.getLatLong();
  //     this.appAllCategory();
  //     this.appAllProduct(this.latlong);
  //     event.target.complete();
  //   }, 1);
  // }

  search(event) { }

  btnSearchCategory(getValue) {
    this.searchQuery = getValue.category_name;
  }

  goProductDetails(getValue) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "productDetails":JSON.stringify({_id:getValue._id}) //JSON.stringify(getValue)
      }
    };
    let testDiv = document.getElementById(getValue._id);
    sessionStorage.setItem("home_scroll", JSON.stringify(Math.round(testDiv.offsetTop / 2)));
    this.router.navigate(['/trade/product/product-details'], navigationExtras);
  }


  /** Function is used to check if product is liked ot not
   * @param  {} likelist
   */
  isLiked(likelist) {
    let userId = this.authService.getUserId();
    if (likelist.indexOf(userId) > -1)
      return true;
    return false;
  }
  /** Function is used to like or unlike a product
   * @param  {} product
   */
  likedUnlikedProduct(product) {

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
  /** Function is used to save the product like or dislike on server
   * @param  {} apiName
   * @param  {} product
   */
  doLikeUnlike(apiName, product) {
    let userId = this.authService.getUserId();
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
        setTimeout(() => {
          // this.loaderService.dismiss();
        }, 1000);
      });
  }
  // end product like and unlike section

  // go filter page
  async gotoProductFilter() {

    this.utilityService.setData('id', 'product');
    this.router.navigate(['app/product-filter/id']);
  }
  // end go filter page

  // filter fn call
  getProductFilterResult() {
    if (localStorage.getItem("accessToken")) {
      this.BASE_API="app_seller"
    }
    this.loaderService.present();
    this.apiService.postX(this.BASE_API+'/filter', this.filtersData)
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          let today = moment();
          this.allProduct = res.data.product;
          this.allProduct.forEach(product => {
            product.createdAt = moment(product.createdAt).from(today);
          });
          this.productImageUrl = res.data.productImageUrl;
          this.locality = this.filtersData.locality;
        }
      }, error => {
        setTimeout(() => {
          this.loaderService.dismiss();
        }, 1000);
      });
  }
  // filter fn call
  async openFilterModal(key) {
    // const modal = await this.modalController.create({
    //   component: SubFilterPage,
    //   cssClass: 'sub-filter-modal-css',
    //   componentProps: {
    //     filterKey: key,
    //     page: "Product"
    //   }
    // });
    // await modal.present();
    // modal.onDidDismiss()
    //   .then((data) => {
    //     if (data['data'] != undefined) {
    //       let key: any = data['data'].filterKey;
    //       let value: any = data['data'].filterValue;
    //       let filter = JSON.parse(localStorage.getItem("filtersData"));
    //       if (key == "Seller") {
    //         this.filtersData.seller = value.seller;
    //         filter.seller = value.seller;
    //       } else if (key == "Transmission") {
    //         this.filtersData.transmission = value.transmission;
    //         filter.transmission = value.transmission;
    //       } else if (key == "Range") {
    //         this.filtersData.range = value.range;
    //         this.filtersData.rangeRadius = value.rangeRadius;
    //         filter.range = value.range;
    //         filter.rangeRadius = value.rangeRadius;
    //       } else if (key == "Unit") {
    //         this.filtersData.unit = value.unit;
    //         filter.unit = value.unit;
    //       } else if (key == "Distance") {
    //         this.filtersData.distance = value.distance;
    //         filter.distance = value.distance;
    //       } else if (key == "Year") {
    //         this.filtersData.year = value.year;
    //         filter.year = value.year;
    //       } else if (key == "Price") {
    //         this.filtersData.price = value.price;
    //         filter.price = value.price;
    //       }
    //       setTimeout(() => {
    //         this.getProductFilterResult();
    //         localStorage.setItem("filtersData", JSON.stringify(filter));
    //       }, 10);
    //     }
    //   });
  }

  selectCarFilter(key) {
    let selected;
    if (key == 'Make') {
      selected = this.filtersData.make;
      this.openSubCatModal(key, 'Make', selected);
    } else if (key == 'Model') {
      if (this.filtersData.make != undefined) {
        selected = this.filtersData.model;
        this.openSubCatModal(key, this.filtersData.make, selected);
      }
    } else if (key == 'Trim') {
      if (this.filtersData.model != undefined) {
        selected = this.filtersData.trim;
        this.openSubCatModal(key, this.filtersData.model, selected);
      }
    } else if (key == 'Seller' || key == 'Transmission' ||
      key == 'Year' || key == 'Range' || key == 'Unit' ||
      key == 'Distance' || key == 'Price') {
      this.openFilterModal(key);
    } else if (key == 'Location') {
      this.openLocationFilter(key);
    }
  }

  async openSubCatModal(type, value, selected) {
    // const modal = await this.modalController.create({
    //   component: ProductFilterSubcategoryPage,
    //   componentProps: {
    //     "subCategoriesType": type,
    //     "subCategories": value,
    //     "selectedSubCategory": selected
    //   }
    // });
    // await modal.present();
    // modal.onDidDismiss()
    //   .then((data) => {
    //     if (data['data'] != undefined) {

    //       if (type == 'Make') {
    //         this.filtersData.make = data['data'].subCategory;
    //         this.filtersData.model = undefined;
    //         this.filtersData.trim = undefined;
    //       } else if (type == 'Model') {
    //         this.filtersData.model = data['data'].subCategory;
    //         this.filtersData.trim = undefined;
    //       } else if (type == 'Trim') {
    //         this.filtersData.trim = data['data'].subCategory;
    //       }
    //       setTimeout(() => {
    //         this.getProductFilterResult();
    //       }, 10);
    //     }
    //   });
  }

  async openLocationFilter(key) {
    // const modal = await this.modalController.create({
    //   component: ProductFilterLocationPage,
    // });
    // await modal.present();
    // modal.onDidDismiss()
    //   .then((data) => {
    //     if (data['data'] != undefined) {
    //       this.filtersData.latitude = data['data'].latitude;
    //       this.filtersData.longitude = data['data'].longitude;
    //       this.filtersData.country = data['data'].country;
    //       this.filtersData.locality = data['data'].locality;
    //       this.locality = this.filtersData.locality;
    //       setTimeout(() => {
    //         this.getProductFilterResult();
    //       }, 10);
    //     }
    //   });
  }

  // check which filtered data show 
  checkNotShow(filter) {
    if (filter.key == 'categoryImage') {
      return false;
    } else if (filter.key == 'latitude') {
      return false;
    } else if (filter.key == 'longitude') {
      return false;
    } else if (filter.key == 'country') {
      return false;
    } else if (filter.key == 'locality') {
      return false;
    } else if (filter.key == 'unit') {
      return false;
    } else if (filter.key == 'price') {
      if ((filter.value[0].lower == '' || filter.value[0].lower == null) && (filter.value[0].upper == '' || filter.value[0].upper == null)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  // end check which filtered data show 

  // show scroll filtered item 
  showFilterValue(filter) {
    if (filter.key == 'price') {
      if (this.filtersData.price[0].lower == '' || this.filtersData.price[0].lower == null) {
        return (0 + ' - ' + this.filtersData.price[0].upper);
      } else if (this.filtersData.price[0].upper == '' || this.filtersData.price[0].upper == null) {
        return (this.filtersData.price[0].lower + ' - ' + 0);
      } else {
        return (this.filtersData.price[0].lower + ' - ' + this.filtersData.price[0].upper);
      }
    } else if (filter.key == 'distance') {
      let distanceUnit = this.filtersData.unit == 'Miles' ? 'mi' : 'km';
      return ('Distance ' + this.filtersData.distance + ' ' + distanceUnit);
    } else if (filter.key == 'year') {
      return (this.filtersData.year[0].lower + ' - ' + this.filtersData.year[0].upper);
    } else if (filter.value == 'PriceDesc') {
      return ('Price: High to Low');
    } else if (filter.value == 'PriceAesc') {
      return ('Price: Low to High');
    } else if (filter.value == 'Distance') {
      return ('Sort by distance');
    } else if (filter.value == 'PublishRecent') {
      return ('Sort by published recently');
    } else {
      return filter.value;
    }
  }

  // close filter one by one
  closeFilter(objKey) {
    if (objKey == "category") {
      this.resetAllFilter();
    } else {
      this.initFilterData(objKey);
      var key = objKey;
      delete this.filtersData[key];
      this.getProductFilterResult();
    }
  }

  initFilterData(key) {
    let filters = JSON.parse(localStorage.getItem('filtersData'));
    if (key == "price") {
      filters[key] = [{ lower: '', upper: '' }];
    } else if (key == "distance") {
      filters["exradius"] = 7;
      filters[key] = '';
    } else if (key == "unit") {
      filters[key] = "Miles";
    } else if (key == "locality") {
      filters[key] = localStorage.getItem('locality');
    } else if (key == "country") {
      filters[key] = localStorage.getItem('country');
    } else if (key == "latitude") {
      filters[key] = localStorage.getItem('latitude');
    } else if (key == "longitude") {
      filters[key] = localStorage.getItem('longitude');
    } else if (key == "range") {
      filters.rangeRadius = undefined;
      delete filters[key];
    } else if (key == "year") {
      filters.year = { lower: 1990, upper: new Date().getFullYear() };
    }
    localStorage.setItem("filtersData", JSON.stringify(filters));
  }
  // end close filter one by one

  // close all filter
  resetAllFilter() {
    localStorage.removeItem("filtersData");
    let data = {
      latitude: this.latlong.latitude,
      longitude: this.latlong.longitude,
      distance: parseInt(this.productRadius),
      country: localStorage.getItem('country'),
      unit: "Miles"
    }
    this.appAllProduct(data, this.pageSize, 1);
    this.filtersData = null;
    this.locality = this.networkService.getLocality();
  }
  // end close all filter

  // go to app location page
  async goLocation() {
    this.utilityService.setData('id', 'productAddress');
    this.router.navigate(['app/location/id']);
  }
  // end go to location page

  /** Function is used to check the distance and range filter
   * @param  {} filter
   */
  checkFilterKey(filter) {
    if (this.filtersData[filter] != '' && this.filtersData[filter] != undefined) {
      return true;
    } else {
      return false;
    }
  }

  /** Function is used to check if any cover image is uploaded and shows cover image according to it
   */
  coverImageCheck(product) {
    if (product.cover_thumb != undefined) {
      return (this.productImageUrl + product.cover_thumb);
    } else {
      if (product.image[0] != undefined) {
        return (this.productImageUrl + product.image[0]);
      } else {
        return 'assets/imgs/no_image.jpg';
      }
    }
  }

  /** Function is used to check if any cover image is uploaded and shows cover image according to it
 */
  coverImageCheckAmazon(product) {
    if (product.cover_thumb != undefined) {
      return (product.cover_thumb);
    } else {
      if (product.image[0] != undefined) {
        return (product.image[0]);
      } else {
        return 'assets/imgs/no_image.jpg';
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

  closeLocationAlert() {
    $('#location-alert').hide();
  }

  checkSellFaster(product) {
    if (this.loggedUser && this.loggedUser.userid == product.user_id) {
        return true;
    } else {
      return false;
    }
  }

  isMyProduct(product){
    return this.loggedUser && this.loggedUser.userid == product.user_id;
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
  }
}
