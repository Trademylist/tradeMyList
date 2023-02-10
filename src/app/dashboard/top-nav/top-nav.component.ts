import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation-service.service';
import { DOCUMENT } from '@angular/common';

declare var $: any;
// $('.navbar-nav>li>a').on('click', function(){
//   $('.navbar-collapse').collapse('hide');
// });
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  userInfo:any;

  constructor(private router: Router, 
    private validationService: ValidationService, 
    @Inject(DOCUMENT) private document: Document) {
    this.userInfo = this.validationService.roleValidation();
  }

  ngOnInit() {
  }
  toggleSideNav() {
    // this.document.body.classList.toggle('aside-toggled');
    this.document.body.classList.toggle('aside-collapsed');
  }

}
