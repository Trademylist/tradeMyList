import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  public errorDiv: boolean = false;
  public successDiv: boolean = false;
  public message: String;

  public searchInput: any = '';
  public reportListDiv: boolean = true;
  public isEditDiv: boolean = false;

  public allReports: any = [];
  public collection: any = [];
  public p: number = 1;

  public userReportDtls: any;
  public reportedUserDtls: any;
  public reportedByUserDtls: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    let accessTokenDesihub = localStorage.getItem("accessTokenDesihub");
      if (accessTokenDesihub == null) {
        sessionStorage.clear();
        localStorage.removeItem("accessTokenDesihub");
        localStorage.removeItem("access");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        this.router.navigate(['/login']);
      }
   }

  ngOnInit() {
    let userRole = sessionStorage.getItem("userRole");
    let accessPermission = JSON.parse(localStorage.getItem("access"));
    if(userRole == 'admin' && accessPermission.manage_report_option != false) {
          this.tokenVerifyWithreportList();
    } else if(userRole == 'super_admin') {
          this.tokenVerifyWithreportList();
    } else {
      this.router.navigate(['login']);
    }
    
  }

  getIndex(i){
    let sum = ((this.p - 1)*5) + (i+1);
    return sum;
  }

  tokenVerifyWithreportList(){
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('report', '').subscribe((response) => {
        console.log("get report ", response)
        if (response.success == true) {
          this.allReports = response.data;
          this.pagination(this.allReports.length)
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
    this.errorDiv = false;
    this.successDiv = false;
  }

  /// edit report related ////
  startEdit(getReport) {
    console.log(getReport)
    this.userReportDtls = getReport;
    this.reportedUserDtls = getReport.reported_user;
    this.reportedByUserDtls = getReport.reprted_by_user;
    this.reportListDiv = false;
    this.isEditDiv = true;
  }

  closeEdit() {
    this.reportListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.ngOnInit();
  }

  blockUser(){
    if (this.apiService.tokenCheck()) {
      this.apiService.putService('user' , this.reportedUserDtls).subscribe((res) => {
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
  }
  /// end ///

  /// delete report related ////
  startDelete(getReport) {
    if (confirm("Are you Sure? Delete this report...")) {
      this.apiService.deleteService('' + '/' + getReport._id, '').subscribe((res) => {
        if (res.success) {
          this.successDiv = true;
          this.message = res.message;
          this.ngOnInit();
        } else {
          this.errorDiv = true;
          this.message = res.message;
        }
      }, error => {
        this.errorDiv = true;
        this.message = 'Error occur!!';
      });
    }
  }
  /// end ///
}
