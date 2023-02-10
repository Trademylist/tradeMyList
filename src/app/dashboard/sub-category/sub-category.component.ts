import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {
  passing_param: any;
  displayCategoryName: any = "Manage Make And Model"
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
  AddCubCategory: FormGroup;
  editCategoryList: any;
  categoryId: any;
  categoryType: any;
  makeId:any;
  modelId: any = "";
  makeIndex:number = 0;

  constructor(
    private apiService: ApiService, 
    private _Activatedroute: ActivatedRoute,
    public FB: FormBuilder,
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
      } else if (accessTokenDesihub != null) {
        let userId = JSON.parse(localStorage.getItem("userId"));
        let userRole = JSON.parse(localStorage.getItem("userRole"));
        sessionStorage.setItem("accessToken", accessTokenDesihub);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userRole", userRole);
        
        this._Activatedroute.params.subscribe((param)=>{
          this.categoryType = param.item;
          this.getMakeList(this.categoryType);
          console.log("param===",param.item)
        })
      }
  }

  ngOnInit() {
    let userRole = sessionStorage.getItem("userRole");
    let accessPermission = JSON.parse(localStorage.getItem("access"));
    if(userRole == 'admin' && accessPermission.manage_make_model != false) {
          // this.getCategory();
    } else if(userRole == 'super_admin') {
          // this.getCategory();
    } else {
      this.router.navigate(['login']);
    }
  }

  getMakeList(type) {
    if (this.apiService.tokenCheck()) {
      this.apiService.postService('app_user/all_list', { name:'Make', type }).subscribe((response) => {
        if (response.success) {
          this.getCategoryDetails = response.data.division;
          this.makeId = response.data._id;
        }
      })
    }
  }

  deleteMake(item) {
    if (this.apiService.tokenCheck()) {
      this.apiService.putService(`app_user/deleteMake?Id=${this.makeId}`, { name:item, "type": this.categoryType }).subscribe((response) => {
        if (response.success) {
         this.getMakeList(this.categoryType);
        }
      })
    }
  }

  getIndex(i){
    let sum = ((this.p - 1)*5) + (i+1);
    return sum;
  }

  createForm() {
    this.AddCubCategory = this.FB.group({
      name: ['',[Validators.required]],
      type:[this.categoryType ? this.categoryType : '',[Validators.required]],
      division: this.FB.array([])
    })
  }

  createEditForm(MakeName,data){
    this.AddCubCategory = this.FB.group({
      name: [MakeName ? MakeName : '',[Validators.required]],
      type:[this.categoryType ? this.categoryType : '',[Validators.required]],
      // isBlock: [data && data.isBlock == true ? true : false, [Validators.required]],
      division: this.FB.array([])
    });
    console.log("data.division===",data)
    if(data && data.division) {
      data.division.forEach(element => {
        this.editDivision(element);
      });
    }
  }

  startEdit(index,MakeName) {
    this.makeIndex = index;
    this.getModelList(MakeName);
  }

  getModelList(MakeName) {
    if (this.apiService.tokenCheck()) {
      this.apiService.postService('app_user/all_list', { name:MakeName, type:this.categoryType}).subscribe((response) => {
        if (response.success) {
          if(response.data && response.data.division) {
            this.createEditForm(MakeName,response.data);
            this.modelId = response.data._id;
            this.categoryListDiv = false;
            this.isEditDiv = true;
          } else {
            this.createEditForm(MakeName,'');
            this.modelId = "";
            this.categoryListDiv = false;
            this.isEditDiv = true;
          }
        }
      })
    }
  }

  DivisionSlot() : FormArray {
    return this.AddCubCategory.get("division") as FormArray
  }
  
  newDivisionSlot(): FormGroup {
    return this.FB.group({
      name: ['',[Validators.required]]
    })
  }

  addDivision() {
    this.DivisionSlot().push(this.newDivisionSlot());
  }

  editNewDivisionSlot(element): FormGroup {
    return this.FB.group({
      name: [element,[Validators.required]]
    })
  }

  editDivision(element) {
    this.DivisionSlot().push(this.editNewDivisionSlot(element));
  }

  removeQuantity(i:number) {
    if(this.DivisionSlot().length != 1) {
      this.DivisionSlot().removeAt(i);
    }
  }

  editSubCategory() {
    let divisionValue = this.AddCubCategory.value.division;
      let Obj = [];
      divisionValue.forEach((element,index) => {
        Obj[index] = element.name
      });
      this.AddCubCategory.value.division = Obj;
        this.apiService.putService(`app_user/editSubCategory?Id=${this.modelId}&makeId=${this.makeId}&Index=${this.makeIndex}`, this.AddCubCategory.value).subscribe((res) => {
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

  addCategoryDetails() {
      let divisionValue = this.AddCubCategory.value.division;
      let Obj = [];
      divisionValue.forEach((element,index) => {
        Obj[index] = element.name
      });
      this.AddCubCategory.value.division = Obj;
        this.apiService.postService(`app_user/addMakewithModel?makeId=${this.makeId}`, this.AddCubCategory.value).subscribe((res) => {
          if (res.success == true) {
            this.successDiv = true;
            this.message = res.message;
            this.closeAdd();
          } else {
            this.errorDiv = true;
            this.message = res.message;
          }
        }, error => {
          this.errorDiv = true;
          this.message = error.message;
        });  
  }

  getCategory() {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('app_user/all_list', '').subscribe((response) => {
        if (response.success) {
          this.getCategoryDetails = response.data;
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

  closeMessageDiv() {
    this.errorDiv = false;
    this.successDiv = false;
  }

  addNew() {
    this.categoryListDiv = false;
    this.isAddDiv = true;
    this.createForm();
    this.addDivision();
  }

  closeAdd() {
    this.getMakeList(this.categoryType);
    this.categoryListDiv = true;
    this.isAddDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.ngOnInit();
  }

  // startEdit(getValue) {
  //   this.createEditForm(getValue);
  //   this.categoryId = getValue._id;
  //   this.categoryListDiv = false;
  //   this.isEditDiv = true;
  //   this.editCategoryList = getValue;
  // }

  closeEdit() {
    this.getMakeList(this.categoryType);
    this.ngOnInit();
    this.categoryListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
  }

}
