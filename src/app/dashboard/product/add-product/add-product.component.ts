import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  CsvSrc: any;
  csvData: any;
  message: any;
  validator: any = false;  
  errorDiv: boolean = false;
  successDiv: boolean = false;
  constructor(private router: Router,
    private apiService: ApiService) { }

  ngOnInit() {
  }
  submitCsv() {
    let formData = new FormData();
    if (this.CsvSrc != undefined) {
      formData.append('file', this.CsvSrc);
      this.apiService.formDataPost({ url: 'productTest/:product_id', body: formData }).then((res) => {
        if (res["success"]) {
          this.successDiv = true;
          console.log('res["success"]',res, res["message"])
          this.message = res["message"];
          setTimeout(() => {
            this.router.navigate (['/dashboard/product']);
        }, 700);
        } else {
          this.errorDiv = true;
          this.message = res["message"].message;
        }
      }, error => {
        this.errorDiv = true;
        this.message = error.message;
      });
    }
  }

  closeMessageDiv() {
    this.errorDiv = false;
    this.successDiv = false;
   }
  handleFileSelect(event: any) {
    if (event["target"].files.length > 0) {
      this.validator = true;
      const file = event["target"].files[0];
      this.CsvSrc = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.csvData = reader.result;
      }
      console.log(this.csvData, 'csvDatacsvData');
    }else{
      this.validator = false;
    }
  }

}
