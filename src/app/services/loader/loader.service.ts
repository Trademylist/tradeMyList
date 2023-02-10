import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // private loading: HTMLIonLoadingElement;
  private isShowing = false;

  constructor(private spinner: NgxSpinnerService) { }

  /* ========== Loader Service ============================= +*/
  async present() {
    this.spinner.show();
  }
  async presentLoader(message?: string, duration?: number) {
    this.spinner.show();
 
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, duration);
  }
  public async dismiss() {
    this.spinner.hide();
  }
  /* ========== End Loader Service ============================= +*/

}
