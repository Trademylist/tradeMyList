import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/services/validation-service.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  isActive = false;
  showMenu = '';
  divClass: String = 'fa fa-plus';
  accessPermission: any;
  subCategoryName: any;
  isAdmin: boolean = false;// check admin or super admin

  constructor(
    private validationService: ValidationService,
    public router:Router,
    private apiService: ApiService, 
    ) { 
      this.accessPermission = JSON.parse(localStorage.getItem("access"));
    }

  ngOnInit() {
    let accessTokenDesihub = JSON.parse(localStorage.getItem("accessTokenDesihub"));
    if (accessTokenDesihub == null) {
      sessionStorage.clear();
      this.router.navigate(['/login']);
    } else if (this.validationService.roleValidation()) {
      this.isAdmin = true;
    }
    this.getSubCategory();
  }

  getSubCategory() {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('app_user/subCategoryName', '').subscribe((response) => {
        if (response.success) {
          this.subCategoryName = response.data;
          console.log("subCategoryName===",this.subCategoryName)
        }
      })
    }
  }

  openAdminForm(item) {
    this.router.navigate(['/dashboard/sub-category/'+item]);
  }

  logout() {
    if (confirm("Are you sure you want to log out from the application?")) {
      sessionStorage.clear();
      localStorage.removeItem("accessTokenDesihub");
      localStorage.removeItem("access");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      this.router.navigate(['/login']);
    }
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
      this.divClass = 'fa fa-plus';
    } else {
      this.divClass = 'fa fa-minus';
      this.showMenu = element;
    }
  }
}
