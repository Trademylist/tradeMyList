import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ApiService } from 'src/app/services/api-service/api.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-write-admin',
  templateUrl: './write-admin.component.html',
  styleUrls: ['./write-admin.component.scss']
})
export class WriteAdminComponent implements OnInit {
  requestData = {
    email: "",
    name: "",
    description: "",
    phone_no: "",
    option: ""
  };
  passing_param: any;

  constructor(
    private location: Location,
    private router: Router,
    private utilityService: UtilityService,
    private apiService: ApiService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) { }

  public async ngOnInit(): Promise<void> { }
  ionViewWillEnter() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.type) {
        this.passing_param = params.passing_param;
      }
    });
    let loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    let respData = this.utilityService.getRequestOption();
    if (respData != undefined) {
      this.requestData.option = respData;
    }
    if (this.requestData.email == "" && loggedUser.email) {
      this.requestData.email = loggedUser.email;
    }
  }
  /** Function is used to go back to previous page in stack
   */
  myBackButton() {
    this.location.back();
  }
  openOptions() {
    let route = 'contents/write-admin-option';
    this.router.navigate([route]);
  }
  ionViewWillLeave() {
    this.utilityService.clearRequestOption();
  }
  checkForm() {
    if (
      this.requestData.email == "" ||
      this.requestData.name == "" ||
      this.requestData.phone_no == "" ||
      this.requestData.description == "" ||
      this.requestData.option == ""
    ) {
      return true;
    } else {
      return false;
    }
  }
  sendRequest() {
    this.apiService.post('app_user/contactUs', this.requestData).subscribe(resp => {
      if (resp.success) {
        this.toastService.presentToast("Thanks for submitting your request, we will contact you as soon as possible");
        this.myBackButton();
      } else {
        this.toastService.presentToast("Unable to submit request, please try later");
      }
    }, error => {
      this.toastService.presentToast("Unable to submit request, please try later");
    });
  }
}
