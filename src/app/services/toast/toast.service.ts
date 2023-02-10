import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastrService: ToastrService, ) { }

  /* ========== Toast Service ============================= +*/

  async presentToast(message: string) {
    let ToastConfig={
      positionClass:'toast-top-right',
      timeOut: 3000,
    }
    this.toastrService.success(message,message, ToastConfig);

    // const toast = await this.toastr.create({
    //   message: msg,
    //   duration: 3000,
    //   // showCloseButton: true,
    //   position: 'bottom',
    //   animated: true,
    //   // closeButtonText: 'Yeah',
    //   // cssClass:"my-custom-class"
    // });
    // toast.present();
  }

  async presentErrorToast(message: string) {
    let ToastConfig={
      positionClass:'toast-top-right',
      timeOut: 3000,
    }
    this.toastrService.error(message,message, ToastConfig);

    // const toast = await this.toastr.create({
    //   message: msg,
    //   duration: 3000,
    //   // showCloseButton: true,
    //   position: 'bottom',
    //   animated: true,
    //   // closeButtonText: 'Yeah',
    //   // cssClass:"my-custom-class"
    // });
    // toast.present();
  }

  async presentChatToast(message?: string, duration?: number, position?: any) {

    let ToastConfig={
      positionClass:'toast-top-right',
      timeOut: duration,
    }
    this.toastrService.success(message,message, ToastConfig);

  }

  async presentToastWithOptions(message: string) {


   
    let ToastConfig={
      positionClass:'toast-top-right',
      timeOut: 3000,
    }
    this.toastrService.success(message,message, ToastConfig);
  }

  async presentNotification(message: string, title:string) {

    let ToastConfig={
      positionClass:'toast-top-right',
      timeOut: 5000,
    }
    this.toastrService.info(message,message, ToastConfig);
  }
  /* ========== End Toast Service ============================= +*/
}