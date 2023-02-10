import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ValidationService } from 'src/app/services/validation-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  footerForm: FormGroup;
  footerDetails: any;
  image: any;
  imageSrc: any;
  content_show: boolean = false;
  errorDiv: boolean = false;
  successDiv: boolean = false;
  message: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private validationService: ValidationService,
    private fb: FormBuilder,
    ){
    let accessTokenDesihub =  JSON.parse(localStorage.getItem("accessTokenDesihub"));
    if (accessTokenDesihub == null) {
      sessionStorage.clear();
      localStorage.removeItem("accessTokenDesihub");
      localStorage.removeItem("access");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      this.router.navigate(['/login']);
    } else if(accessTokenDesihub != null) {
      let userId = JSON.parse(localStorage.getItem("userId"));
      let userRole = JSON.parse(localStorage.getItem("userRole"));
      sessionStorage.setItem("accessToken", accessTokenDesihub);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userRole", userRole);
      if (!this.validationService.roleValidation()) {
        this.router.navigate(['login']);
      }
    }
  }
 
  ngOnInit() {
    if (this.apiService.tokenCheck()) {
      this.getFooterDetails();
    }
  }

  getFooterDetails() {
    this.apiService.getService('app_user/defaultData/footer', '').subscribe((response) => {
      console.log("response==", response)
      if (response.success) {
        let footerData = response.data;
        footerData.forEach(element => {
          if(element.type == "footer") {
            this.footerDetails = element;
            this.image = element.image;
          }
        });
      }
      this.content_show = true;
      this.resetForm();
    })
  }

  resetForm() {
    this.footerForm = this.fb.group({
      text: [this.footerDetails && this.footerDetails.text ? this.footerDetails.text : '', [Validators.required]],
      title: [this.footerDetails && this.footerDetails.title ? this.footerDetails.title : '', [Validators.required]],
      type: ["footer"]
    });
  }

  closeMessageDiv() {
    this.errorDiv = false;
    this.successDiv = false;
   }

  selectImage(event){
    if (event["target"].files.length > 0) {
      const file = event["target"].files[0];
      this.imageSrc = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.image = reader.result;
      }
    }
  }


  submitFooter() {
    let formData = new FormData();
    formData.append('text', this.footerForm.value.text);
    formData.append('title', this.footerForm.value.title);
    formData.append('type', this.footerForm.value.type);
    if(this.imageSrc != undefined) {
      formData.append('file', this.imageSrc);
    }

    if(this.footerDetails) {
      formData.append('_id', this.footerDetails._id);
      this.apiService.formDataPut({url: 'app_user/defaultData', body: formData}).then((res) => {
        if (res["success"]) {
          this.successDiv = true;
          this.message = res["message"];
          this.getFooterDetails();
        } else {
          this.errorDiv = true;
          this.message = res["message"].message;
        }
      }, error => {
        this.errorDiv = true;
        this.message = error.message;
      });
     
    } else {
      if(this.imageSrc != undefined) {
        this.apiService.formDataPost({url: 'app/defaultData', body: formData}).then((res) => {
          if (res["success"]) {
            this.successDiv = true;
            this.message = res["message"];
            this.getFooterDetails();
          } else {
            this.errorDiv = true;
            this.message = res["message"].message;
          }
        }, error => {
          this.errorDiv = true;
          this.message = error.message;
        });
      } else {
        this.errorDiv = true;
        this.message = "Please Select footer Image"
      }
    }
  }

}
