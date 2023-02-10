import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.css']
})
export class CmsComponent implements OnInit {

  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  getCMSDetails: any = [];
  collection: any = [];
  p: number = 1;

  cmsListDiv: boolean = true;
  isAddDiv: boolean = false;
  isEditDiv: boolean = false;

  addCMS: any = {
    page_name: '', page_desc: '', isBlock: false
  };

  editCMSList: any;

  constructor(
    private router: Router,
    private apiService: ApiService
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
    if(userRole == 'admin' && accessPermission.cms != false) {
          this.tokenVerifyWithCMSList();
    } else if(userRole == 'super_admin') {
          this.tokenVerifyWithCMSList();
    } else {
      this.router.navigate(['login']);
    }
  }

  getIndex(i){
    let sum = ((this.p - 1)*5) + (i+1);
    return sum;
  }

  tokenVerifyWithCMSList() {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('all_cms', '').subscribe((response) => {
        // console.log("get cms ", response)
        if (response.success) {
          this.getCMSDetails = response.data;
          this.pagination(this.getCMSDetails.length)
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
    // this.cmsListDiv = true;
    // this.isAddDiv = false;
    // this.isEditDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }

  // add new cms 
  addNew() {
    this.cmsListDiv = false;
    this.isAddDiv = true;
  }
  closeAdd() {
    this.cmsListDiv = true;
    this.isAddDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.addCMS.page_name=''; 
    this.addCMS.page_desc=''; 
    this.addCMS.isBlock= false;
    this.ngOnInit();
  }
  addCMSDetails() {
    if (this.addCMS.page_name != '' && this.addCMS.page_desc != '') {
      this.apiService.postService('cms', this.addCMS).subscribe((res) => {
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
    } else {
      this.errorDiv = true;
      this.message = 'Page name and page description required!!';
    }
  }
  // end

  /// edit cms related ////
  startEdit(getCMS) {
    this.cmsListDiv = false;
    this.isEditDiv = true;
    this.editCMSList = getCMS;
  }
  closeEdit() {
    this.ngOnInit();
    this.cmsListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
  }
  editCMSDetails(getCMS) {
    this.apiService.putService('cms', getCMS).subscribe((res) => {
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
