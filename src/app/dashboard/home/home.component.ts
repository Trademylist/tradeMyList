import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ValidationService } from 'src/app/services/validation-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public getData: any;
  accessPermission: any;

  constructor(
    private apiService: ApiService,
    private validationService: ValidationService,
    private router: Router,
    // route: ActivatedRouteSnapshot
  ) { 
    let accessTokenDesihub = JSON.parse(localStorage.getItem("accessTokenDesihub"));
      if (accessTokenDesihub == null) {
        sessionStorage.clear();
        localStorage.removeItem("accessTokenDesihub");
        localStorage.removeItem("access");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        this.router.navigate(['/login']);
      } else if( accessTokenDesihub != null){
        let userId = JSON.parse(localStorage.getItem("userId"));
        let userRole = JSON.parse(localStorage.getItem("userRole"));
        sessionStorage.setItem("accessToken", accessTokenDesihub);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userRole", userRole);
        this.accessPermission = JSON.parse(localStorage.getItem("access"));
        this.getDashBoardData(this.accessPermission)
      }
  }

  ngOnInit() {
    // if (this.apiService.tokenCheck()) {
    //   this.apiService.getService('dashboard', '').subscribe((response) => {
    //     if (response.success) {
    //       this.getData = response.data;
    //       if (!this.validationService.roleValidation()) {
    //         this.getData = this.getData.filter(x => x.name != 'Admin');
    //       }
    //     }
    //   }, err => {

    //   })
    // }
  }

  getDashBoardData(accessPermission) {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('dashboard', '').subscribe((response) => {
        console.log("get count ", response)
        if (response.success) {
          this.getData = response.data;
          if (!this.validationService.roleValidation()) {
            this.getData = this.getData.filter(x => x.name != 'Admin');
            if(accessPermission.cms == false) {
              this.getData = this.getData.filter(x => x.name != 'Cms');
            }
            if(accessPermission.manage_seller == false) {
              this.getData = this.getData.filter(x => x.name != 'Seller');
            }
            if(accessPermission.manage_product == false) {
              this.getData = this.getData.filter(x => x.name != 'Product');
            }
            if(accessPermission.manage_commercial == false) {
              this.getData = this.getData.filter(x => x.name != 'Commercial');
            }
          } 
        }
      }, err => {
        // console.log("get dashboard err", err)

      })
    }
  }

}
