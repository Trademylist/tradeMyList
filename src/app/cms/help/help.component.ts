  import { Component, OnInit } from '@angular/core';
  import { Location } from "@angular/common";
  import { Router, ActivatedRoute } from '@angular/router';
  import { UtilityService } from 'src/app/services/utility/utility.service';
  import { ApiService } from 'src/app/services/api-service/api.service';
  import { ToastService } from 'src/app/services/toast/toast.service';
  declare var $: any;
  @Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss']
  })
  export class HelpComponent implements OnInit {


    requestOptions = [
      {
        request: "I have a question about my account",
        subRequests: [
          "I can't create an account",
          "I'm not able to access my account",
          "I want to edit my profile",
          "I want to delete my account"
        ],
        isSelected: false
      },
      {
        request: "I have an issue buying or selling",
        subRequests: [
          "I can't search in the location I want",
          "I can't contact the seller",
          "Seller is not responding"
        ],
        isSelected: false
      },
      { request: "I have a question about credit card system and featured ads", isSelected: false },
      { request: "I have a technical issue", isSelected: false }
    ];
    basicCategory: any = [];
    requestCategory: any = [];
    subCategorySelected: boolean;
    showButton: boolean = false;
    subRequests: string = null;
    manual_comment: string = null;
  
    //=======================above admin option================//

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
  
    public async ngOnInit(): Promise<void> { 
        this.subCategorySelected = false;
        this.getReportCategories();
        this.onEnter();
    }
    onEnter() {
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
      $('#admin-option').show();
      // let route = 'contents/write-admin-option';
      // this.router.navigate([route]);
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

    /************  Help options Below ************/

    closeLocationAlert(){
      $('#admin-option').hide();
    }
    getReportCategories() {
      this.requestOptions.forEach(category => {
        category.isSelected = false
      });
      this.basicCategory = this.requestOptions;
      this.requestCategory = this.requestOptions;
      this.showButton = true;
    }
    /** Function is used to check if new categories would be shown or request category is selected/deselected
     * @param  {} cat
     */

    reportSteps(cat) {
      console.log(cat);
      this.requestCategory.forEach(category => {
        if (cat.comment != category.comment) {
          category.isSelected = false;
        }
      });
      if (cat.subRequests && cat.subRequests.length >= 1) {
        let report: any = [];
        cat.subRequests.forEach(category => {
          report.push({ request: category, isSelected: false });
        });
        this.requestCategory = report;
        console.log(this.requestCategory);
        this.subRequests = null;
        this.manual_comment = null;
        this.subCategorySelected = true;
        console.log(this.subCategorySelected);
        console.log(this.showButton);
      } else {

        this.getRequestOption(cat.request);
        // if (cat.isSelected) {
        //   cat.isSelected = false;
        //   this.subRequests = null;
        // } else {
        //   cat.isSelected = true;
        //   if (this.subCategorySelected) {
        //     this.subRequests = cat.comment;
        //   }
        // }
      }
    }
    /** Function is used to show original report categories
     */
    previousCategories() {
      this.requestCategory = this.basicCategory;
      // this.selectedCategory = [];
      this.manual_comment = null;
      this.subRequests = null;
      this.subCategorySelected = false;
      // this.showTextarea = false;
    }
    /** Function is used to check if request category has sub sections
     * @param  {} cat
     */
    checkForwardCategory(cat) {
      if (cat.subRequests) {
        if (cat.subRequests.length >= 1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    /** Function is used to get selected request option
     * @param  {} cat
     */
    getRequestOption(cat) {
      this.utilityService.setRequestOption(cat);
      this.closeLocationAlert();
      this.requestData.option = cat;
      // this.location.back();
    }
    /** Function is used to go back to previous page in stack
     */
    goBack() {
      // this.location.back();
      this.closeLocationAlert();
    }

  }
  
