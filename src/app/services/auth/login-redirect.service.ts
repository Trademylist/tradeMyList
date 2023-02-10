import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirect implements CanActivate {
  constructor( private router: Router) { }

  canActivate(): boolean {
    if (localStorage.getItem("accessToken") == null) {
      this.router.navigate(['/signin']);
      return false;
    }
    else {
      return true;
    }
  }
}
