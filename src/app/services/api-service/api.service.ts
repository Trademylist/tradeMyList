import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry, delay, retryWhen, scan } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// declare var google;
// const GOOGLE_MAPS_API_KEY = 'AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4';

// export type Maps = typeof google.maps;
@Injectable(
  //   {
  //   providedIn: 'root'
  // }
)
export class ApiService {

  private BASE_URL: string = environment.API_BASE_URL;
  protected readonly NETWORK_RETRY_ATTEMPTS: number = 3;
  protected readonly WAITING_TIME: number = 3000; // 5 seconds

  constructor(
    // private transfer: FileTransfer,
    public http: HttpClient) { }

  public post(serviceName: string, data): Observable<any> {
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json" });
    let requestData = JSON.stringify(data);
    let serviceUrl = this.BASE_URL + serviceName;

    /* old one
    return this.http.post(serviceUrl, requestData, { headers: headersObj }).pipe(
      map((res: Response) => res));
      */


      /**
       * Retry strategy applied
       */


      return this.http.post(serviceUrl, requestData, { headers: headersObj }).pipe(
        retryWhen(err => err.pipe(
          delay(this.WAITING_TIME),
          scan((retrycount, val, index) => {
            if (this.NETWORK_RETRY_ATTEMPTS < index) {
              throw err;
            } else {
              console.log("No of retry :" + index);
            }
          })
        )
        ));
  }
  public postX(serviceName: string, data): Observable<any> {
    let token = localStorage.getItem("accessToken");
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json", 'x-access-token': `${token}` });
    let requestData = JSON.stringify(data);
    let serviceUrl = this.BASE_URL + serviceName;
     /* old one
    return this.http.post(serviceUrl, requestData, { headers: headersObj }).pipe(
      map((res: Response) => res));
      */


     return this.http.post(serviceUrl, requestData, { headers: headersObj }).pipe(
      retryWhen(err => err.pipe(
        delay(this.WAITING_TIME),
        scan((retrycount, val, index) => {
          if (this.NETWORK_RETRY_ATTEMPTS < index) {
            throw err;
          } else {
            console.log("No of retry :" + index);
          }
        })
      )
      ));
  }

  public get(serviceName: string, data: any = ''): Observable<any> {
    let serviceUrl = this.BASE_URL + serviceName;
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json" });
    if (data != '') {
      serviceUrl += '/' + data;
    }

    // return this.http.get(serviceUrl, { headers: headersObj }).pipe(
    //   map((res: Response) => res));

    return this.http.get(serviceUrl, { headers: headersObj }).pipe(
      retryWhen(err => err.pipe(
        delay(this.WAITING_TIME),
        scan((retrycount, val, index) => {
          if (this.NETWORK_RETRY_ATTEMPTS < index) {
            throw err;
          } else {
            console.log("No of retry :" + index);
          }
        })
      )
      ));
  }
  public getX(serviceName: string, data: any = ''): Observable<any> {
    let token = localStorage.getItem("accessToken");
    let serviceUrl = this.BASE_URL + serviceName;
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json", 'x-access-token': `${token}` });
    if (data != '') {
      serviceUrl += '/' + data;
    }
    // return this.http.get(serviceUrl, { headers: headersObj }).pipe(
    //   map((res: Response) => res));

    return this.http.get(serviceUrl, { headers: headersObj }).pipe(
      retryWhen(err => err.pipe(
        delay(this.WAITING_TIME),
        scan((retrycount, val, index) => {
          if (this.NETWORK_RETRY_ATTEMPTS < index) {
            throw err;
          } else {
            console.log("No of retry :" + index);
          }
        })
      )
      ));

  }

  public putX(serviceName: string, data: any): Observable<any> {
    let serviceUrl = this.BASE_URL + serviceName;
    let requestData = JSON.stringify(data);
    let token = localStorage.getItem("accessToken");
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json", 'x-access-token': `${token}` });

    /* old one 
    return this.http.put(serviceUrl, requestData, { headers: headersObj }).pipe(
      map((res: Response) => res));
*/

/**
 * Retry starategy applied
 */
    return this.http.put(serviceUrl, requestData, { headers: headersObj }).pipe(
      retryWhen(err => err.pipe(
        delay(this.WAITING_TIME),
        scan((retrycount, val, index) => {
          if (this.NETWORK_RETRY_ATTEMPTS < index) {
            throw err;
          } else {
            console.log("No of retry :" + index);
          }
        })
      )
      ));
  }

  public deleteX(serviceName: string, data: any): Observable<any> {
    let serviceUrl = this.BASE_URL + serviceName;
    let token = localStorage.getItem("accessToken");
    let headersObj = new HttpHeaders({ 'Content-Type': "application/json", 'x-access-token': `${token}` });
    if (data != '') {
      serviceUrl += '/' + data;

    }
    return this.http.delete(serviceUrl, { headers: headersObj }).pipe(
      map((res: Response) => res));
  }

  public multipleFilePostX(serviceName: string, data): Observable<any> {
    let token = localStorage.getItem("accessToken");
    let headersObj = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'x-access-token': `${token}`
    });
    let serviceUrl = this.BASE_URL + serviceName;
    return this.http.post(serviceUrl, data, { headers: headersObj }).pipe(
      map((res: Response) => res));
  }

  public uploadFile(serviceName: string, data): Observable<any> {
    let token = localStorage.getItem("accessToken");
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    // headers.append('x-access-token', `${token}`);
    let serviceUrl = this.BASE_URL + serviceName;
    /* Old one 
    return this.http.post(serviceUrl + '?token=' + token, data, { headers: headers }).pipe(
      map((res: Response) => res));
      /* */


      return this.http.post(serviceUrl + '?token=' + token, data, { headers: headers }).pipe(
        retryWhen(err => err.pipe(
          delay(this.WAITING_TIME),
          scan((retrycount, val, index) => {
            if (this.NETWORK_RETRY_ATTEMPTS < index) {
              throw err;
            } else {
              console.log("No of retry :" + index);
            }
          })
        )
        ));

  }

  public filePostX(serviceName: string, formData): Observable<any> {
    let serviceUrl = this.BASE_URL + serviceName;
    let token = localStorage.getItem("accessToken");
    let headersObj = new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'x-access-token': `${token}` });
    let requestData = { file_type: 'image', token: token };
    // const fileTransfer: FileTransferObject = this.transfer.create();
    // let uploadOptions: FileUploadOptions = {
    //   fileKey: 'file',
    //   httpMethod: "POST",
    //   chunkedMode: false,
    //   headers: headersObj,
    //   mimeType: "image/jpeg",
    //   params: requestData
    // }
    return Observable.create(observer => {
      // fileTransfer.upload(formData, serviceUrl, uploadOptions).then((data: any) => {
      //   let response = JSON.parse(data.response);
      //   observer.next(response);
      //   observer.complete();
      // }, (err) => {
      //   observer.error(err);
      // });
    });
  }

  countryByLatLong(lat, lng) {
    let serviceUrl = 'http://api.geonames.org/countryCodeJSON?lat=' + `${lat}` + '&lng=' + `${lng}` + '&username=AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4';
    return this.http.get(serviceUrl).pipe(
      map((res: Response) => res));
  }

  public getJSONService() {
    return this.http.get('assets/subcategory.json').pipe(
      map((res: Response) => res));
  }




}
