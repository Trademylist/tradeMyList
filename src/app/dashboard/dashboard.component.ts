import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
        let accessTokenDesihub = localStorage.getItem("accessTokenDesihub");
        if (accessTokenDesihub == null) {
          sessionStorage.clear();
          localStorage.removeItem("accessTokenDesihub");
          localStorage.removeItem("access");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          this.router.navigate(['/login']);
        }
      }
  });
  }

}
