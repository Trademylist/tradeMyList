import { Injectable } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  iconClasses = {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning'
  };

  constructor(private toastrService: ToastrService) { }
  // (message, title, ToastConfig)
  // toastComponent: Toast,
  // closeButton: false,
  // timeOut: 2000,
  // extendedTimeOut: 1000,
  // disableTimeOut: false,
  // easing: 'ease-in',
  // easeTime: 300,
  // progressBar: false, 	//Show progress bar
  // progressAnimation: 'decreasing', //'decreasing' \| 'increasing'
  // toastClass: 'ngx-toastr',
  // positionClass: 'toast-top-right',
  // titleClass: 'toast-title',
  // messageClass: 'toast-message',
  // tapToDismiss: true,
  // onActivateTick: false,

  public toast_success(message, title, ToastConfig) {
    this.toastrService.success(title, message, {
      toastComponent: Toast,
      closeButton: false,
      timeOut: 3000,
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      tapToDismiss: true,
      progressBar: true,
    })
  }

  public toast_warning(message, title, ToastConfig) {
    this.toastrService.warning(title, message, {
      toastComponent: Toast,
      closeButton: false,
      timeOut: 3000,
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      tapToDismiss: true,
      progressBar: true,
    })
  }

  public toast_error(message, title, ToastConfig) {
    this.toastrService.error(title, message, {
      toastComponent: Toast,
      closeButton: false,
      timeOut: 3000,
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      tapToDismiss: true,
      progressBar: true,
    });
  }

}
