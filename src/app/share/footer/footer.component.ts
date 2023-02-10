import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
declare var $:any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  loggedUser: any;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    ) {
    this.authService.authState.subscribe(state => {
      if (state) {
        this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
      } else {
        this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
      }
    });
   }

  ngOnInit(): void {
  }
goTo(id){
  $('html').animate({ scrollTop: 0 }, 'slow');
  let route = 'trade-cms/'+id;
  this.router.navigate([route]);
}

goToUrl(path){
  $('html').animate({ scrollTop: 0 }, 'slow');
 // let route = 'trade-cms/'+id;
  this.router.navigate([path]);
}
}
