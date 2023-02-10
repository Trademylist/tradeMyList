import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private BASE_URL: string = environment.API_BASE_URL;

  constructor(
    private router: Router, 
    public http: HttpClient,
    private spinnerService: NgxSpinnerService
    ) {
  }

  tokenCheck() {
    let token = sessionStorage.getItem("accessToken");
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      sessionStorage.clear();
      return false;
    }
    // const helper = new JwtHelperService();
    // if (helper.isTokenExpired(this.token)) {
    //   this.router.navigate(['/login']);
    //   sessionStorage.clear();
    //   // sessionStorage.removeItem('accessToken');
    //   return false;
    // } else {
    //   return true;
    // }
  }

  formDataPost(params) {
    if((typeof params.loading !== 'undefined'))
    this.spinnerService.show();
    return new Promise((resolve, reject) => {
        const httpOptions = {
          headers: new HttpHeaders().set("x-access-token", sessionStorage.getItem("accessToken") || '')
        };
        return this.http.post(this.BASE_URL + params.url, params.body, httpOptions).pipe().subscribe(res => {
         if((typeof params.loading !== 'undefined')) 
         this.spinnerService.hide()
         return resolve(res);
        }, err => {
          if((typeof params.loading !== 'undefined')) 
          this.spinnerService.hide()
          return reject(err ? err.json() : {});
        });
      });
    }

    formDataPut(params) {
      if((typeof params.loading !== 'undefined'))
      this.spinnerService.show();
      return new Promise((resolve, reject) => {
          const httpOptions = {
            headers: new HttpHeaders().set("x-access-token", sessionStorage.getItem("accessToken") || '')
          };
          return this.http.put(this.BASE_URL + params.url, params.body, httpOptions).pipe().subscribe(res => {
           if((typeof params.loading !== 'undefined')) 
           this.spinnerService.hide()
           return resolve(res);
          }, err => {
            if((typeof params.loading !== 'undefined')) 
            this.spinnerService.hide()
            return reject(err ? err.json() : {});
          });
        });
      }

  public postService1(serviceName: string, data): Observable<any> {
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json" });
    let requestData = JSON.stringify(data);
    // console.log("post1 req data",requestData)
    let serviceUrl = this.BASE_URL + serviceName;
    this.spinnerService.show(); 
    return this.http.post(serviceUrl, requestData, { headers: headersObj }).pipe(
      map((res: Response) => {
        this.spinnerService.hide();
        return res;
      }));
  }

  public postService(serviceName: string, data): Observable<any> {
    let token = sessionStorage.getItem("accessToken");
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json", 'x-access-token': `${token}` });
    let requestData = JSON.stringify(data);
    this.spinnerService.show(); 
    console.log("post req data", requestData)
    let serviceUrl = this.BASE_URL + serviceName;
    return this.http.post(serviceUrl, requestData, { headers: headersObj }).pipe(
      map((res: Response) => {
        this.spinnerService.hide();
        return res
      }));
  }

  public getService(serviceName: string, data: any = ''): Observable<any> {
    let token = sessionStorage.getItem("accessToken");
    let serviceUrl = this.BASE_URL + serviceName;
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json", 'x-access-token': `${token}` });
    if (data != '') {
      serviceUrl += '/' + data;
      // Object.keys(data).forEach(key => {
      //   serviceUrl += '/' + data[key];
      // });
    }
    this.spinnerService.show(); 
    return this.http.get(serviceUrl, { headers: headersObj }).pipe(
      map((res: Response) => {
        this.spinnerService.hide();
        return res;
      }));
  }

  public putService(serviceName: string, data): Observable<any> {
    let serviceUrl = this.BASE_URL + serviceName;
    let requestData = JSON.stringify(data);
    // console.log("put req data",requestData)
    let token = sessionStorage.getItem("accessToken");
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json", 'x-access-token': `${token}` });
    this.spinnerService.show(); 
    return this.http.put(serviceUrl, requestData, { headers: headersObj }).pipe(
      map((res: Response) => {
        this.spinnerService.hide();
        return res;
      }));
  }

  public deleteService(serviceName: string, data): Observable<any> {
    let serviceUrl = this.BASE_URL + serviceName;
    let token = sessionStorage.getItem("accessToken");
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json", 'x-access-token': `${token}` });
    this.spinnerService.show(); 
    return this.http.delete(serviceUrl, { headers: headersObj }).pipe(
      map((res: Response) => {
        this.spinnerService.hide();
        return res;
      }));
  }

  // public fileUpload(serviceName: string, data: any, image: File): Observable<any> {

  //   let headersObj = new HttpHeaders({ 'Content-Type': "application/form-data", 'x-access-token': `${this.token}` });  

  //   const headers = new HttpHeaders();
  //   headers.append('Content-Type', 'multipart/form-data');
  //   headers.append('Accept', 'application/json');
  //   headers.append('x-access-token',  `${this.token}`);
  //   console.log("img", image)
  //   console.log("data", data)
  //   // console.log("post req data", requestData)
  //   let serviceUrl = this.BASE_URL + serviceName;
  //   return this.http.post(serviceUrl, formData, { headers: headers }).pipe(
  //     map((res: Response) => res));
  // }

}
