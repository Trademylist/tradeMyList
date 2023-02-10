import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api-service/api.service';
import { ToastService } from '../../../services/toast/toast.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { DialogComponent } from '../../../share/dialog/dialog.component'
import { DialogService } from '../../../share/dialog/dialog.service';
import { LoaderService } from '../../../services/loader/loader.service';

@Component({
  selector: 'app-report-user',
  templateUrl: './report-user.component.html',
  styleUrls: ['./report-user.component.scss']
})
export class ReportUserComponent implements OnInit {
  @ViewChild('appDialog',{static:true}) appDialog: DialogComponent;
  userId: string;
  basicCategory: any = [];
  reportCategory: any = [];
  selectedCategory: any = [];
  subCategorySelected: boolean;
  sub_comment: string = null;
  manual_comment: string = null;
  subCategoryTitle: string;
  showTextarea: boolean = false;
  showButton: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private router: Router,
    private _location: Location,
    private utilityService: UtilityService,
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  /** Function is used to get userId when page initiates
   */
  ngOnInit() {
    this.dialogService.register(this.appDialog);
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.userId = params.sender_id;
      }
    });
    // setTimeout(() => {
    //   this.initSellerDetails();
    // }, 5);


    // if (this.route.snapshot.data['userId']) {
    //   this.userId = this.route.snapshot.data['userId'];
    // }
    this.subCategorySelected = false;
    this.getReportCategories();
  }

  /** Function is used to go back to previous page in stack
   */
  goBack() {
    this._location.back();
  }

  /** Function is used to get report categories
   */
  getReportCategories() {
    this.apiService.getX('app_seller/commentList').subscribe(resp => {
      if (resp.success) {
        resp.data.forEach(category => {
          category.isSelected = false;
        });
        this.basicCategory = resp.data;
        this.reportCategory = resp.data;
        this.showButton = true;
      }
    });
  }

  /** Function is used to check if new categories would be shown or report category is selected/deselected
   * @param  {} cat
   */
  reportSteps(cat) {
    if (this.subCategorySelected == false) {
      this.selectCategory(cat);
    }
    this.reportCategory.forEach(category => {
      if (cat.comment != category.comment) {
        category.isSelected = false;
      }
    });
    if (cat.sub_comment && cat.sub_comment.length >= 1) {
      let report: any = [];
      cat.sub_comment.forEach(category => {
        report.push({ comment: category, isSelected: false });
      });
      this.reportCategory = report;
      this.sub_comment = null;
      this.manual_comment = null;
      this.subCategorySelected = true;
      this.showTextarea = false;
    } else {
      if (cat.isSelected) {
        cat.isSelected = false;
        this.sub_comment = null;
      } else {
        cat.isSelected = true;
        if (cat.comment == "Other" || cat.comment == "other") {
          this.showTextarea = true;
        } else {
          this.showTextarea = false;
        }
        if (this.subCategorySelected) {
          this.sub_comment = cat.comment;
        }
      }
    }
  }

  /** Function is used to report user
   */
  async reportUser() {
    if (Object.keys(this.selectedCategory).length >= 1) {
      if (this.subCategorySelected == true && (this.sub_comment == null && this.manual_comment == null)) {
        this.toastService.presentToast('Please select an option before reporting');
      } else if ((this.selectedCategory.comment == "Other" || this.selectedCategory.comment == "other") && this.manual_comment == null) {
        this.toastService.presentToast('Please provide additional notes for report');
      } else {

        this.dialogService.show("Report User","Are you sure you want to report this?")
        .then((res) => {
          this.loaderService.presentLoader();
          console.warn('ok clicked');
          if (this.selectedCategory.comment == "Other" || this.selectedCategory.comment == "other") {
            let data = {
              reported_to: this.userId,
              comment: this.selectedCategory.comment,
              manual_comment: this.manual_comment
            }
            this.reportService(data);
          } else if (this.subCategorySelected) {
            let data = {
              reported_to: this.userId,
              comment: this.selectedCategory.comment,
              sub_comment: this.sub_comment
            }
            this.reportService(data);
          } else {
            let data = {
              reported_to: this.userId,
              comment: this.selectedCategory.comment
            }
            this.reportService(data);
          }
        })
        .catch((err) => {
          console.warn('rejected',err);
         // this.loaderService.dismiss();
        });

        // let alert = await this.alertController.create({
        //   header: 'Report User',
        //   message: 'Are you sure you want to report this?',
        //   cssClass: 'alertBox',
        //   buttons: [
        //     {
        //       text: 'Cancel',
        //       role: 'cancel',
        //       cssClass: 'alertBoxCancel',
        //       handler: () => { }
        //     }, {
        //       text: 'OK',
        //       cssClass: 'alertBoxOk',
        //       handler: () => {
        //         if (this.selectedCategory.comment == "Other" || this.selectedCategory.comment == "other") {
        //           let data = {
        //             reported_to: this.userId,
        //             comment: this.selectedCategory.comment,
        //             manual_comment: this.manual_comment
        //           }
        //           this.reportService(data);
        //         } else if (this.subCategorySelected) {
        //           let data = {
        //             reported_to: this.userId,
        //             comment: this.selectedCategory.comment,
        //             sub_comment: this.sub_comment
        //           }
        //           this.reportService(data);
        //         } else {
        //           let data = {
        //             reported_to: this.userId,
        //             comment: this.selectedCategory.comment
        //           }
        //           this.reportService(data);
        //         }
        //       }
        //     }
        //   ]
        // });
        // alert.present();
      }
    } else {
      this.toastService.presentErrorToast('Please select an option before reporting');
    }
  }

  /** Function is used to call report service API
   * @param  {} data
   */
  reportService(data) {
    this.apiService.postX('app_seller/report', data).subscribe(resp => {
      if (resp.success) {
        this.toastService.presentToast('User reported');
        this.goBack();
      } else {
        this.toastService.presentToast('User reported');
      }
    });
  }

  /** Function is used to navigate to new set of report categories under selected category
   * @param  {} cat
   */
  extraCategories(cat) {
    cat.userId = this.userId;
    this.utilityService.setData('categories', cat);
    this.router.navigate(['app/report-user-extra/categories']);
  }

  /** Function is used to show original report categories
   */
  previousCategories() {
    this.reportCategory = this.basicCategory;
    this.selectedCategory = [];
    this.manual_comment = null;
    this.sub_comment = null;
    this.subCategorySelected = false;
    this.showTextarea = false;
  }

  /** Function is used to check if report category has sub comments
   * @param  {} cat
   */
  checkForwardCategory(cat) {
    if (cat.sub_comment.length >= 1) {
      return true;
    } else {
      return false;
    }
  }
  /** Function is used to determine whether check mark icon will be shown beside category options
   * @param  {} cat
   */
  checkSelectCategory(cat) {
    if (cat.comment == "Other" || cat.comment == "other" || cat.comment == "Others" || cat.comment == "others") {
      return false;
    } else {
      if (!this.subCategorySelected) {
        if (cat.isSelected && cat.sub_comment.length <= 0) {
          return true;
        } else {
          return false;
        }
      } else {
        if (cat.isSelected) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  /** Function is used to check if the report category is other
   */
  checkOtherCategory(cat) {
    if (cat.comment == "Other" || cat.comment == "other" || cat.comment == "Others" || cat.comment == "others") {
      return true;
    } else {
      return false;
    }
  }
  /** Function is used to check if user has commented for other category
   * @param  {} cat
   */
  otherComment(cat) {
    if (this.manual_comment != null) {
      if (!this.subCategorySelected) {
        this.selectCategory(cat);
      }
    }
  }
  /** Function is used to save selected main report category
   * @param  {} cat
   */
  selectCategory(cat) {
    this.selectedCategory = cat;
    if (cat.comment == "Inappropriate profile and bio") {
      this.subCategoryTitle = "Which one?";
    } else {
      this.subCategoryTitle = "What happened?";
    }
  }
}

