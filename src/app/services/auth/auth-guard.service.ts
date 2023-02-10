import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    public authenticationService: AuthenticationService
  ) { }

  canActivate(): boolean {
    // let token = localStorage.getItem("accessToken");
    // if (token) {
    //   return true;
    // } else {
    //   this.router.navigate(['login']);
    //   localStorage.clear();
    //   return false;
    // }
    return this.authenticationService.isAuthenticated();
  }

}