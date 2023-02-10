import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-report-comment',
  templateUrl: './report-comment.component.html',
  styleUrls: ['./report-comment.component.css']
})
export class ReportCommentComponent implements OnInit {

  public errorDiv: boolean = false;
  public successDiv: boolean = false;
  public message: String;

  public searchInput: any = '';
  public commentListDiv: boolean = true;
  public isAddEditDiv: boolean = false;

  public allComments: any = [];
  public collection: any = [];
  public p: number = 1;

  public commentDtls: any = {};
  public subComments: any[];

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

  tokenVerifyWithreportList() {
    if (this.apiService.tokenCheck()) {
      this.apiService.getService('comment', '').subscribe((response) => {
        console.log("get comment ", response)
        if (response.success == true) {
          this.allComments = response.data;
          this.pagination(this.allComments.length)
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

  startAddEdit(getValue) {
    console.log(getValue)
    this.commentListDiv = false;
    this.isAddEditDiv = true;
    this.subComments = [];
    this.addSubComment();
  }

  closeAddEdit() {
    this.commentDtls = {};
    this.commentListDiv = true;
    this.isAddEditDiv = false;
    this.successDiv = false;
    this.errorDiv = false;
    this.ngOnInit();
  }

  resetAddEdit() {
    this.commentDtls = {};
  }

  addSubComment(): void {
    this.subComments.push({
      sub_comment: ""
    });
  }

  removeSubComment(index: number): void {
    this.subComments.splice(index, 1);
  }

  addComment() {
    var comment: HTMLElement = document.getElementById('comment');
    comment.innerHTML = '';

    if ((this.commentDtls.comment == '') || (this.commentDtls.comment == undefined)) {
      comment.innerHTML = 'Please enter comment.';
    } else {
      let subComment: any = [];
      this.subComments.forEach(function (item) {
        if (item.sub_comment != "") {
          subComment.push(item.sub_comment);
        }
      });
      if (subComment.length > 0 && subComment[0] != "") {
        this.commentDtls.sub_comment = subComment;
      }
      console.log(this.commentDtls);
      this.apiService.postService('comment', this.commentDtls).subscribe(response => {
        if (response.success) {
          this.successDiv = true;
          this.errorDiv = false;
          this.message = response.message;
        } else {
          this.errorDiv = true;
          this.successDiv = false;
          this.message = 'Error occur!!';
          console.log("Error");
        }
      });
    }
  }

  /// delete report related ////
  startDelete(getReport) {
    if (confirm("Are you Sure? Delete this comment...")) {
      this.apiService.deleteService('' + '/' + getReport._id, '').subscribe((res) => {
        if (res.success) {
          this.successDiv = true;
          this.errorDiv = false;
          this.message = res.message;
          this.ngOnInit();
        } else {
          this.errorDiv = true;
          this.successDiv = false;
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
