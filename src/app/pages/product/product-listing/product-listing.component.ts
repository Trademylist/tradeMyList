import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
// import { SubFilterPage } from 'src/app/shared/modal/sub-filter/sub-filter.page';
import { ApiService } from '../../../services/api-service/api.service';
import { NetworkService } from '../../../services/geo-service/network.service';
import { LoaderService } from '../../../services/loader/loader.service';
import { ToastService } from '../../../services/toast/toast.service';
import { OnEnter, UtilityService } from '../../../services/utility/utility.service';
import  *  as  data  from  '../../../../assets/currency.json';
import { Config } from '../../../share/config';
// import { ProductFilterLocationPage } from '../product-filter-location/product-filter-location.page';
// import { ProductFilterSubcategoryPage } from '../product-filter-subcategory/product-filter-subcategory.page';

declare var $: any;
@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {
  pageSize = Config.itemPerPage;
  currentPage = 1;
  totalProduct=0;
  loadingMore=false;

  currencies: any = (data as any).default;
  public sortby = [];
  public filterCategory = [];
  public filterPrice = [];
  selectedLocality = localStorage.getItem('locality');
  public searchQuery: any = '';
  public allCategory: any = [];
  public categoryImageUrl: any = '';
  public allProduct: any = [];
  public productImageUrl: any = '';
  public loggedUser: any = {};
  private subscription: Subscription;
  public filtersData: any = {};
  public productRadius: string;
  public latlong: any;
  public locality: string;
  public userDetails: any;
  public dataLoaded: number = 0;

  public message="";
  public currencyCode:'';
  public priceFilterInterface=[
    {min:0,max:1000},
    {min:1000,max:5000},
    {min:5000,max:10000},
    {min:10000,max:20000},
    {min:20000,max:99999999},
    
  ]
  constructor(
    private router: Router,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private networkService: NetworkService,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private activatedroute: ActivatedRoute,
    private toastService: ToastService
  ) { 
    window.scroll(0,0);
  }

  public async ngOnInit(): Promise<void> {

    this.networkService.onPaymentCompletedForSellFaster.subscribe(action=>{
      this.getProductFilterResult();
    });

    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.filtersData = JSON.parse(localStorage.getItem('filtersData'));
    this.filtersData = { ...this.filtersData, category: "All categories", price: [{lower: "", upper: ""}], sortBy: "Distance"}
    console.log("this.filtersDatathis.filtersData", this.filtersData)
   
    // await this.onEnter();
    this.getCurrencyCode();
   
    // console.log("1",this.filtersData);
    if (this.filtersData == null) {
      this.initFilterDataInterface();
    }else{
      if(Array.isArray(this.filtersData.category)){
        this.filterCategory = this.filtersData.category;
        this.filterPrice = this.filtersData.filterPrice;
      }

      if(!this.filtersData.sortBy){
        this.filtersData.sortBy='Distance';
      }
    }

    this.networkService.currentLocality.subscribe((locality) => {
      window.scrollTo({ top: 0});
      this.locality = locality;
      if (this.filtersData == null) {
        this.initFilterDataInterface();
      }else if(this.filtersData.locality != locality){

        this.filtersData.locality=localStorage.getItem('locality');
        this.filtersData.country= localStorage.getItem('country');
        this.filtersData.latitude= localStorage.getItem('latitude');
        this.filtersData.longitude= localStorage.getItem('longitude');
      }
      this.getProductFilterResult();
      this.getCurrencyCode();
    })

    this.activatedroute.paramMap.subscribe(params => {
      if (params['params']['category'] != undefined) {
        this.searchQuery = params['params']['category'];
        // alert(this.searchQuery);
        if (this.filtersData == null) {
          this.initFilterDataInterface();
        }else{
         
         
        }
        
        this.filterCategory=[];
        if(!this.filterCategory.includes(params['params']['category'])){
          this.filterCategory.push(params['params']['category']);
        }
        this.filtersData.category = [this.searchQuery];
       

        this.checkSortBy();
       this.getProductFilterResult();
      }
    });

    this.networkService.onHeaderSearch.subscribe((searchData) => { 
      console.log(searchData);
      this.searchQuery = searchData;
      // if (this.filtersData == null) {
      //   this.initFilterDataInterface();
      // }

      // if(!this.filterCategory.includes(this.searchQuery)){
      //   this.filterCategory.push(this.searchQuery);
      // }

      //this.filtersData['category'] = [this.searchQuery];
      // this.checkSortBy();
      this.getProductFilterResult();
    })
    this.checkSortBy();
    // console.log(this.filterCategory);

    await this.initProductData();
  }

  /** Function is used to initialise filter variable with default variable
 */
  initFilterDataInterface() {
    // console.log('initFilterData');
    let unit='Km';
      if(this.userDetails!=null && this.userDetails.distance){
        unit = this.userDetails.distance;
      }else{
        unit='Miles';
      }
    let filter = {
      category: 'All categories',
      categoryImage: 'assets/imgs/all-category.png',
      price: [{ lower: '', upper: '' }],
      filterPrice:[],
      distance: parseInt(localStorage.getItem('radius')),
      // unit: this.userDetails.distance ? this.userDetails.distance : 'Miles',
      unit: unit,
      sortBy:'Distance',
      search_key:this.searchQuery,
      locality: localStorage.getItem('locality'),
      country: localStorage.getItem('country'),
      latitude: localStorage.getItem('latitude'),
      longitude: localStorage.getItem('longitude'),
      exradius: 7
    };
    this.filtersData = filter;
    this.checkSortBy();
    //this.milesClick();
  }

  goToAddProduct() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "taskType": 'add',
        "redirectUrl": 'product',
        "productType": 'product',
      }
    };
    // console.log(navigationExtras);
    this.router.navigate(['/trade/product/add-product'], navigationExtras);
  }

  getCurrencyCode(){
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

  getCurrencySymbol(currency){
    if(this.currencies[currency] !==undefined){
      return this.currencies[currency].symbol;
    }else{
      return currency;
    }
    
  }
  // public async onEnter(): Promise<void> {
  //   this.utilityService.momentLocaleModifier();
  //   this.utilityService.productRefresh.subscribe(() => {
  //     this.resetAllFilter();
  //     if (this.searchQuery != '') {
  //       this.searchQuery = '';
  //     }
  //   });


  // }

  async initProductData() {

    this.latlong = this.networkService.getLatLong();
    if (!localStorage.getItem("longitude") && !localStorage.getItem('latitude')) {
      this.networkService.getGeolocation();
    }
    this.productRadius = localStorage.getItem('radius') ? localStorage.getItem('radius') : null;
    this.searchQuery = '';
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    this.appAllCategory();
    //this.filtersData = JSON.parse(localStorage.getItem("filtersData"));
    if (this.filtersData == null) {
      this.locality = this.networkService.getLocality();
      setTimeout(() => {
        this.locality = this.networkService.getLocality();
        if ((this.locality == '' || this.locality == null || this.locality == 'undefined')) {
          //this.networkService.selectedLocationAddress.next('setUserLocation');
          $('#location-alert').show();
          // this.networkService.getGeolocation();
          // this.locality = this.networkService.getLocality();
          // this.goLocation();
        }
      },
        6000);

      let data = {
        latitude: this.latlong.latitude,
        longitude: this.latlong.longitude,
        distance: parseInt(this.productRadius),
        country: localStorage.getItem('country'),
      }
      this.appAllProduct(data);
      localStorage.removeItem("filtersData");
      this.filtersData = null;
    } else {
      delete this.filtersData['exradius'];
      delete this.filtersData['rangeRadius'];
      this.getProductFilterResult();
    }
  }


  public ngOnDestroy(): void {

  }

currencySymboleTable(){

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
  appAllProduct(latlong) {
    this.loaderService.present();
    this.apiService.postX('app_user/all_product', latlong)
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          let today = moment();
          this.allProduct = res.data.product;
          this.allProduct.forEach(product => {
            product.createdAt = moment(product.createdAt).from(today);
          });
          this.productImageUrl = res.data.productImageUrl;
        }
      }, error => {
        setTimeout(() => {
          this.loaderService.dismiss();
        }, 1000);
      });
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

  selectedCategoryDisplay(){
    return this.filterCategory.length==0?'All Product':this.filterCategory.length>1?this.filterCategory[0]+' and more':this.filterCategory[0];
  }

  btnSearchCategory(getValue) {
    this.searchQuery = getValue.category_name;
  }

  goProductDetails(getValue) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        "productDetails": JSON.stringify({_id:getValue._id}),
      }
    };
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

  onSelectPriceFilter(event){
    console.log(event.target.value);
    let index = event.target.value;
    // console.log(this.priceFilterInterface[index]);
    if(this.filtersData==null){
      this.initFilterDataInterface();
    }
    if (event.target.checked) {
      this.filterPrice.push(index);
    }
    else {
      let i: number = 0;
      for (let i = 0; i < this.filterPrice.length; i++) {
        if (this.filterPrice[i] == event.target.value) {
          this.filterPrice.splice(i, 1);
          break;
        }
      }
    }
    if(this.filterPrice.length>0){
      // console.log(this.filterPrice.sort());
      let minVal = this.priceFilterInterface[this.filterPrice[0]].min;
      let maxVal = this.priceFilterInterface[this.filterPrice[this.filterPrice.length-1]].max;
      // console.log(minVal);
      // console.log(maxVal);

      this.filtersData.price[0].lower=minVal;
      this.filtersData.price[0].upper=maxVal;
    }else{
      this.filtersData.price[0].lower='';
      this.filtersData.price[0].upper='';
    }
   
    this.filtersData.filterPrice=[...new Set(this.filterPrice)];
    this.getProductFilterResult();

  }
  /** Function is used to like or unlike a product
   * @param  {} product
   */
  likedUnlikedProduct(product) {

    if (this.loggedUser == null) {
      this.toastService.presentErrorToast("Login Required!");
      return false;
    }
    if (this.loggedUser && this.loggedUser.userid == product.user_id) {
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



  /** Function is used to sort by filter
   * @param  {} track
   */
  selectSortby(track) {
    console.log(track);
    if(this.filtersData ==null){
      this.initFilterDataInterface();
    }
    this.filtersData.sortBy = track;
    // console.log(this.isSelectedSortby(track));
    // if (this.isSelectedSortby(track)) {
    //   this.filtersData.sortBy = null;
    // } else {
    //   this.filtersData.sortBy = track;
    // }
    this.getProductFilterResult();
  }
  /** Function is used to check sorting
   * @param  {} track
   */
  isSelectedSortby(track) {
    return this.filtersData.sortBy === track;
  }

  onSlectCategoryFilter(event) {
    if(this.filtersData==null){
      this.initFilterDataInterface();
    }
    if (event.target.checked) {
      this.filterCategory.push(event.target.value);
    }
    else {
      let i: number = 0;
      for (let i = 0; i < this.filterCategory.length; i++) {
        if (this.filterCategory[i] == event.target.value) {
          this.filterCategory.splice(i, 1);
          break;
        }
      }
    }
    this.filtersData.category = this.filterCategory;
    if(this.filterCategory.length==0){
      //this.filtersData.category="All categories";
    }
    this.getProductFilterResult();
  }

  // filter fn call
  getProductFilterResult(page=1, limit=this.pageSize) {
    this.totalProduct=0;
    this.currentPage=page;
      this.allProduct=[];
      // if(this.allProduct.length>0){
      //   limit=this.allProduct.length;
      //   this.allProduct=[];
      // }
    let api_base="app_user";
    if (localStorage.getItem("accessToken")) {
      api_base="app_seller";
    }
    if(this.filtersData==null){
      this.initFilterDataInterface();
    }
    if(this.filterCategory.length==0){
      this.filtersData.category="All categories";
    }
   
    this.filtersData.search_key=this.searchQuery;
    
    localStorage.setItem('filtersData',JSON.stringify(this.filtersData));
    let filterParams = Object.assign({}, this.filtersData);
    delete filterParams['filterPrice']; 

    console.log(this.filtersData);
    console.log(filterParams);
    this.loaderService.present();
    this.apiService.postX(api_base+'/filter?page=' + page + '&limit=' + limit, filterParams)
      .subscribe((res) => {
        this.loaderService.dismiss();
        if (res.success) {
          this.productSetup(res);
          // let today = moment();
          // this.allProduct = res.data.product;
          // this.allProduct.forEach(product => {
          //   product.createdAt = moment(product.createdAt).from(today);
          // });
         // this.productImageUrl = res.data.productImageUrl;
          //this.locality = this.filtersData.locality;
        }
      }, error => {
        setTimeout(() => {
          this.loaderService.dismiss();
        }, 1000);
      });
  }

  onLoadMore() {
    this.loadingMore=true;
    this.currentPage++;
    // let data = {
    //   latitude: this.latlong.latitude,
    //   longitude: this.latlong.longitude,
    //   distance: parseInt(this.productRadius),
    //   country: localStorage.getItem('country'),
    // }
    this.loadMoreProduct(this.pageSize, this.currentPage);
    //this.currentPage += 1;
  }

  loadMoreProduct(limit = this.pageSize, page = 1) {

    let api_base="app_user";
    if (localStorage.getItem("accessToken")) {
      api_base="app_seller";
    }
    //this.loaderService.present();
    let filterParams = Object.assign({}, this.filtersData);
    delete filterParams['filterPrice']; 

    this.apiService.postX(api_base+'/filter?page=' + page + '&limit=' + limit, filterParams)
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
 productSetup(response, event = '') {
  //  console.log(response);
  this.totalProduct=response.data.total;
  let today = moment();

  if ((this.allProduct.length > 0 && this.currentPage > 1) || (this.allProduct.length == 0 && this.currentPage == 1)) {
   
    response.data.product.forEach(product => {
      product.createdAt = moment(product.createdAt).from(today);
      this.allProduct.push(product);
    });

    for(let i=5;i<this.allProduct.length; i += 5) {
      this.allProduct[i].show_content = true;
    }
  }else{
    this.allProduct = response.data.product;
    for(let i=5;i<this.allProduct.length; i += 5) {
      this.allProduct[i].show_content = true;
    }
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

  /** Function is used to check the previous page and make modification according to it
   */
  checkSortBy() {
    //  console.log("2",this.filtersData)
    if (this.filtersData != null && this.filtersData.category != 'Jobs & Services') {
      this.sortby = [
        { "data": "Distance", "value": "Distance" },
        { "data": "Price: high to low", "value": "PriceDesc" },
        { "data": "Price: low to high", "value": "PriceAsc" },
        { "data": "Most recently published", "value": "PublishRecent" },
      ];
    } else {
      this.sortby = [
        { "data": "Distance", "value": "Distance" },
        { "data": "Most recently published", "value": "PublishRecent" },
      ];
    }
    // console.log(this.sortby);
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
    }
    this.appAllProduct(data);
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

  isMyProduct(product){
    return this.loggedUser && this.loggedUser.userid == product.user_id;
  }

  checkSellFaster(product) {
    //console.log(product);
    if (this.loggedUser && this.loggedUser.userid == product.user_id) {
        return true;
    } else {
      return false;
    }
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
