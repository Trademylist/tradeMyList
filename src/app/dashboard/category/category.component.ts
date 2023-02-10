import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  passing_param: any;
  displayCategoryName: any;
  // searchErrDiv: boolean = false;
  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  searchInput: any = '';
  // searchCancelToggle: boolean = true;

  getCategoryDetails: any = [];
  categoryImageUrl: any;
  collection: any = [];
  p: number = 1;

  categoryListDiv: boolean = true;
  isAddDiv: boolean = false;
  isEditDiv: boolean = false;

  newCategoryList: any = {
    category_name: '',
    category_type: '',
    category_image: '',
  };
  file: File = null;

  editCategoryList: any;

  constructor(
    private apiService: ApiService, 
    private _Activatedroute: ActivatedRoute,
    private router: Router
    ) {
      let accessTokenDesihub = JSON.parse(localStorage.getItem("accessTokenDesihub"));
      if (accessTokenDesihub == null) {
        sessionStorage.clear();
        localStorage.removeItem("accessTokenDesihub");
        localStorage.removeItem("access");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        this.router.navigate(['/login']);
      } else if(accessTokenDesihub != null) {
        let userId = JSON.parse(localStorage.getItem("userId"));
        let userRole = JSON.parse(localStorage.getItem("userRole"));
            sessionStorage.setItem("accessToken", accessTokenDesihub);
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("userRole", userRole);
      }

  }

  ngOnInit() {
    let userRole = sessionStorage.getItem("userRole");
    let accessPermission = JSON.parse(localStorage.getItem("access"));
    if(userRole == 'admin' && (accessPermission.manage_product_category != false || accessPermission.manage_commercial_category != false) ) {
      this.tokenVerifyWithCategoryList(accessPermission,userRole);
    } else if(userRole == 'super_admin') {
      this.tokenVerifyWithCategoryList(accessPermission,userRole);
    } else {
      this.router.navigate(['login']);
    }
  }

  tokenVerifyWithCategoryList(accessPermission,userRole){
    this._Activatedroute.paramMap.subscribe(params => {
      this.passing_param = params.get('id');
      // console.log(this.passing_param)
      if (this.passing_param == 1 && (accessPermission.manage_product_category != false || userRole == 'super_admin')) {
        this.displayCategoryName = "Manage Product Category";
        this.newCategoryList.category_type = "product";
        this.getCategory('category_list/product');
      } else if (this.passing_param == 2 && (accessPermission.manage_commercial_category != false || userRole == 'super_admin')) {
        this.displayCategoryName = "Manage Freebies Category";
        this.newCategoryList.category_type = "freebies";
        this.getCategory('category_list/freebies');
      } else if (this.passing_param == 3) {
        this.displayCategoryName = "Manage Offer Category";
        this.newCategoryList.category_type = "offer_admin";
        this.getCategory('category_list/offer_admin');
        // } else if (this.passing_param == 4) {
        //   this.displayCategoryName = "Manage Seller Offer Category"
        //   this.newCategoryList.category_type = "offer_seller";
        //   this.getCategory('category_list/offer_seller')
      }
    });
  }

  getIndex(i){
    let sum = ((this.p - 1)*5) + (i+1);
    return sum;
  }

  getCategory(getValue) {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService(getValue, '').subscribe((response) => {
        // console.log("get cat ", response)
        if (response.success) {
          // this.getAdDetails = response.data.ad;
          this.getCategoryDetails = response.data.category;
          this.categoryImageUrl = response.data.categoryImageUrl;
          this.pagination(this.getCategoryDetails.length)
        }
      })
    }
  }

  pagination(length) {
    for (let i = 1; i <= length; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  // close error/ success message div
  closeMessageDiv() {
    // this.categoryListDiv = true;
    // this.isAddDiv = false;
    // this.isEditDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }

  // add new advertisement 
  addNew() {
    this.categoryListDiv = false;
    this.isAddDiv = true;
  }
  closeAdd() {
    this.categoryListDiv = true;
    this.isAddDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.newCategoryList.category_name = '';
    this.newCategoryList.category_type = '';
    this.newCategoryList.category_image = '';
    this.ngOnInit();
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.newCategoryList.category_image = event.target.result;
      }
    }
  }

  addCategoryDetails() {

    // if (this.newCategoryList.category_name != '' &&
    //   this.newCategoryList.category_type != '' &&
    //   this.newCategoryList.category_image != '') {
        this.apiService.postService('category', this.newCategoryList).subscribe((res) => {
          if (res.success == true) {
            this.successDiv = true;
            this.message = res.message;
          } else {
            this.errorDiv = true;
            this.message = res.message;
          }
        }, error => {
          this.errorDiv = true;
          this.message = error.message;
        });
    // }
  
  }
  // end

  /// edit advertisement related ////
  startEdit(getValue) {
    this.categoryListDiv = false;
    this.isEditDiv = true;
    this.editCategoryList = getValue;
  }
  closeEdit() {
    this.ngOnInit();
    this.categoryListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
  }
  editCategoryDetails(getValue) {
    this.apiService.putService('category', getValue).subscribe((res) => {
      // console.log(res)
      if (res.success == true) {
        this.successDiv = true;
        this.message = res.message;
      } else {
        this.errorDiv = true;
        this.message = res.message;
      }
    }, error => {
      this.errorDiv = true;
      this.message = error.message;
    });
  }
  /// end ///
}
