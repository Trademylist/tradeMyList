import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  email: String;
  errDiv: boolean = false;
  successDiv: boolean = false;
  message: String;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  submit() {
    this.errDiv = false;
    this.successDiv = false;
    if (this.email) {
      this.apiService.postService1('forgot_password', { "email": this.email }).subscribe((response) => {
        if (response.success) {
          this.successDiv = true;
          this.message = response.message;
        } else {
          this.errDiv = true;
          this.message = response.message;
        }
      }, err => {
        this.errDiv = true;
        this.message = err.message;
      });
    } else {
      this.errDiv = true;
      this.message = 'Please enter your email';
    }
  }

}
