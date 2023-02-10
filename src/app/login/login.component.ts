import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title: String = 'Trade Admin Login';
  loginForm: FormGroup;
  divOpen: boolean = false;
  errDiv: boolean = false;
  errMsg: String = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private spinnerService: NgxSpinnerService
  ) {
    // this.resetForm();
  }

  ngOnInit() {
    let accessTokenDesihub = localStorage.getItem("accessTokenDesihub");
    let userId = localStorage.getItem("userId");
    let userRole = localStorage.getItem("userRole");
    let token = sessionStorage.getItem("accessToken");
    if (accessTokenDesihub != null) {
      sessionStorage.setItem("accessToken", accessTokenDesihub);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userRole", userRole);
      this.router.navigate(['dashboard/home']);
    } else {
      this.divOpen = true;
      this.resetForm();
    }
  }

  /* ========== Login form validation rules ============================= +*/
  resetForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(6)
      ]))
    });
    this.divOpen = true;
  }
  /* ========== Login form validation rules ============================= -*/

  doLogin(data) {
    this.apiService.postService1('login', data).subscribe((response) => {
      if (response.success) {
        if (response.data.role == 'user') {
          this.errDiv = true;
          this.errMsg = 'You are not able to login this site..';
        } else {
          sessionStorage.setItem("accessToken", response.data.token);
          sessionStorage.setItem("userId", response.data.userid);
          sessionStorage.setItem("userRole", response.data.role);
          localStorage.setItem('access', JSON.stringify(response.data.permission));
          localStorage.setItem('accessTokenDesihub', JSON.stringify(response.data.token));
          localStorage.setItem("userId", JSON.stringify(response.data.userid));
          localStorage.setItem("userRole", JSON.stringify(response.data.role));
          this.resetForm();
          this.router.navigate(['dashboard/home']);
        }
      } else {
        this.errDiv = true;
        this.errMsg = response.message;
      }
    }, err => {
      this.errDiv = true;
      this.errMsg = err.message;
    });
  }

}
