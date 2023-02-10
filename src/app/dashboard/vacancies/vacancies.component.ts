import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit {

  // searchErrDiv: boolean = false;
  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  searchInput: any = '';
  // searchCancelToggle: boolean = true;

  getVacanciesDetails: any = [];
  collection: any = [];
  p: number = 1;

  productListDiv: boolean = true;
  isEditDiv: boolean = false;

  editVacanciesList: any;

  constructor(private router: Router,
    private apiService: ApiService) { }

  ngOnInit() {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('all_vacancies', '').subscribe((response) => {
        // console.log("get vacancies ", response)
        if (response.success) {
          this.getVacanciesDetails = response.data;
          this.pagination(this.getVacanciesDetails.length);
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
    // this.productListDiv = true;
    // this.isEditDiv = false;
    // this.searchErrDiv = false;
    this.errorDiv = false;
    this.successDiv = false;
  }

  /// search vacancies related ////
  // searchVacancies() {
  //   if (this.searchInput != '') {
  //     this.searchCancelToggle = false;
  //     this.apiService.postService('search_vacancies', { 'search_value': this.searchInput }).subscribe((res) => {
  //       // console.log("search",res)
  //       if (res.success) {
  //         this.getVacanciesDetails = res.data;
  //         this.pagination(this.getVacanciesDetails.length);
  //       } else {
  //         this.searchErrDiv = true;
  //         this.message = res.message;
  //       }
  //     }, error => {
  //       this.searchErrDiv = true;
  //       this.message = 'Error occur!!';
  //     });
  //   } else {
  //     this.searchErrDiv = true;
  //     this.message = 'Enter Search Input!!';
  //   }
  // }
  // cancelSearchVacancies() {
  //   this.searchInput = '';
  //   this.searchCancelToggle = true;
  //   this.searchErrDiv = false;
  //   this.message = '';
  //   this.ngOnInit();
  // }
  // searchInputkeyDown() {
  //   if (this.searchInput == '') {
  //     this.searchCancelToggle = true;
  //     this.searchErrDiv = false;
  //     this.message = '';
  //     this.ngOnInit();
  //   }
  // }
  /// end ///

  /// edit vacancies related ////
  startEdit(getVacancies) {
    this.productListDiv = false;
    this.isEditDiv = true;
    this.editVacanciesList = getVacancies;
  }
  closeEdit() {
    this.ngOnInit();
    this.productListDiv = true;
    this.isEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
  }
  editVacanciesDetails(editVacanciesList) {
    if (editVacanciesList.job_title != '' && editVacanciesList.job_description != '' &&
      editVacanciesList.job_location != '' && editVacanciesList.contactperson_phone != '' &&
      editVacanciesList.contactperson_phone.length == 10) {
      this.apiService.putService('vacancies', editVacanciesList).subscribe((res) => {
        if (res.success == true) {
          this.successDiv = true;
          this.message = res.message;
          // this.ngOnInit();
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

  /// delete vacancies related ////
  startDelete(getVacancies) {
    if (confirm("Are you Sure? Delete this vacancies...")) {
      this.apiService.deleteService('vacancies' + '/' + getVacancies._id, '').subscribe((res) => {
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
