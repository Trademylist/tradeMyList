  import { Component, OnInit } from '@angular/core';
  import { Location } from "@angular/common";
  import { UtilityService } from 'src/app/services/utility/utility.service';
  
  @Component({
    selector: 'app-write-admin-option',
    templateUrl: './write-admin-option.component.html',
    styleUrls: ['./write-admin-option.component.scss']
  })
  export class WriteAdminOptionComponent implements OnInit {
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
  
    constructor(
      private location: Location,
      private utilityService: UtilityService
    ) { }
  
    ngOnInit() {
      this.subCategorySelected = false;
      this.getReportCategories();
    }
    /** Function is used to get report categories
     */
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
      this.location.back();
    }
    /** Function is used to go back to previous page in stack
     */
    goBack() {
      this.location.back();
    }
  }
  

