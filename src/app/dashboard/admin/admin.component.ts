import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ValidationService } from 'src/app/services/validation-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  adminListDiv: boolean = true;
  isAddDiv: boolean = false;
  isEditDiv: boolean = false;

  searchInput: any = '';
  getAdminDetails: any = [];
  collection: any = [];
  p: number = 1;

  countryList: any = [];
  dropdownSettings = {};

  adminForm: FormGroup;
  adminEditForm: FormGroup;
  arr = [];
  constructor(
    private router: Router,
    private apiService: ApiService,
    private validationService: ValidationService,
    private fb: FormBuilder,
    ){
    let accessTokenDesihub =  JSON.parse(localStorage.getItem("accessTokenDesihub"));
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
      if (!this.validationService.roleValidation()) {
        this.router.navigate(['login']);
      }
    }
  }
 
  ngOnInit() {
    this.resetForm();
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('all_admin', '').subscribe((response) => {
        // console.log("get admin", response)
        if (response.success) {
          this.getAdminDetails = response.data;
          this.pagination(this.getAdminDetails.length)
        }
      });
      this.apiService.getService('all_country', '').subscribe((response) => {
        console.log("get country", response)
        if (response.success) {
          this.countryList = response.data;
        }
      })
    }
    this.dropdownSettings = {
      singleSelection: true,//false/true
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }

  /* ========== Admin form validation rules ============================= +*/
  resetForm() {
    this.adminForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      country: new FormControl([{ "id": 11, "itemName": "USA" }], Validators.compose([
        Validators.required])),
        username: new FormControl('', Validators.compose([
          Validators.required
        ])),
        permission: this.fb.group({
          manage_admin: [false, [Validators.required]],
          manage_seller: [false, [Validators.required]],
          manage_product: [false, [Validators.required]],
          manage_product_category: [false, [Validators.required]],
          manage_commercial: [false, [Validators.required]],
          manage_commercial_category: [false, [Validators.required]],
          manage_make_model:[false, [Validators.required]],
          manage_report_option: [false, [Validators.required]],
          change_password: [false, [Validators.required]],
          cms: [false, [Validators.required]],
        })
    });

    // this.adminForm = new FormGroup({
    //   email: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    //   ])),
    //   country: new FormControl('', Validators.compose([
    //     Validators.required])),
    // });
    // this.adminEditForm = new FormGroup({
    //   _id: new FormControl,
    //   email: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    //   ])),
    //   country: new FormControl('', Validators.compose([
    //     Validators.required])),
    //   status: new FormControl('', Validators.compose([
    //     Validators.required])),
    // });
  }
  /* ========== Admin form validation rules ============================= -*/

  pagination(length) {
    for (let i = 1; i <= length; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  // close error/ success message div
  closeMessageDiv() {
    // this.adminListDiv = true;
    // this.isAddDiv = false;
    // this.isEditDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }

  // add new admin 
  addNew() {
    this.adminListDiv = false;
    this.isAddDiv = true;
  }
  onItemSelect(item: any) {
    // console.log(item);
    // console.log(this.countryArray);
  }
  OnItemDeSelect(item: any) {
    // console.log(item);
    // console.log(this.countryArray);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
  }
  closeAdd() {
    this.adminListDiv = true;
    this.isAddDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.countryList = [];
    this.ngOnInit();
  }
  addAdminDetails(data: any) {
    this.apiService.postService('admin', data).subscribe((res) => {
      if (res.success) {
        this.successDiv = true;
        this.message = res.message;
        this.closeAdd()
      } else {
        this.errorDiv = true;
        this.message = res.message.message;
      }
    }, error => {
      this.errorDiv = true;
      this.message = error.message;
    });
  }
  // end

  getIndex(i){
    let sum = ((this.p - 1)*5) + (i+1);
    return sum;
  }

  /// edit admin related ////
  startEdit(getValue) {
    this.adminListDiv = false;
    this.isEditDiv = true;

    this.adminEditForm = this.fb.group({
      _id: [getValue._id, [Validators.required]],
      email: [getValue && getValue.email ? getValue.email : '', [ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      // country: [getValue && getValue.country ? getValue.country : '', [Validators.required]],
      username: [getValue && getValue.username ? getValue.username : '', [Validators.required]],
      status: [getValue && getValue.status ? getValue.status : '', [Validators.required]],
        permission: this.fb.group({
          manage_admin: [getValue && getValue.permission && getValue.permission.manage_admin ? getValue.permission.manage_admin : false, [Validators.required]],
          manage_seller: [getValue && getValue.permission && getValue.permission.manage_seller ? getValue.permission.manage_seller : false, [Validators.required]],
          manage_product: [getValue && getValue.permission && getValue.permission.manage_product ? getValue.permission.manage_product : false, [Validators.required]],
          manage_product_category: [getValue && getValue.permission && getValue.permission.manage_product_category ? getValue.permission.manage_product_category : false, [Validators.required]],
          manage_commercial: [getValue && getValue.permission && getValue.permission.manage_commercial ? getValue.permission.manage_commercial : false, [Validators.required]],
          manage_commercial_category: [getValue && getValue.permission && getValue.permission.manage_commercial_category ? getValue.permission.manage_commercial_category : false, [Validators.required]],
          manage_make_model:[getValue && getValue.permission && getValue.permission.manage_make_model ? getValue.permission.manage_make_model : false, [Validators.required]],
          manage_report_option: [getValue && getValue.permission && getValue.permission.manage_report_option ? getValue.permission.manage_report_option : false, [Validators.required]],
          change_password: [getValue && getValue.permission && getValue.permission.change_password ? getValue.permission.change_password : false, [Validators.required]],
          cms: [getValue && getValue.permission && getValue.permission.cms ? getValue.permission.cms : false, [Validators.required]],
          })
    });

  }
  closeEdit() {
    this.adminListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.countryList = [];
    this.ngOnInit();
  }
  editAdminDetails(getValue) {
    this.apiService.putService('admin', getValue).subscribe((res) => {
      if (res.success == true) {
        this.successDiv = true;
        this.message = res.message;
        this.closeEdit();
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

  // ddelete admin
  startDelete(getValue) {
    if (confirm("Are you sure? Delete this admin...")) {
      this.apiService.deleteService('admin' + '/' + getValue._id, '').subscribe((res) => {
        if (res.success) {
          this.successDiv = true;
          this.message = res.message;
          this.getAdminDetails = this.getAdminDetails.filter(u => u !== getValue);
        } else {
          this.errorDiv = true;
          this.message = res.message;
        }
      }, error => {
        this.errorDiv = true;
        this.message = error.message;
      });
    }
  }
  // end
}
