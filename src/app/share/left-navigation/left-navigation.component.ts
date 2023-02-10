import { Component, OnInit } from '@angular/core';
import {Config} from '../../share/config';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit {
  baseRoute=Config.baseRoute;
  productParams= {
    "taskType": 'add',
    "redirectUrl": 'product',
    "productType": 'product',
  }
  commercialParams = {
    "taskType": 'add',
    "redirectUrl": 'commercial',
    "productType": 'commercial'
    
  }
  constructor() { }

  ngOnInit(): void {
    //alert(this.baseRoute);
  }

}
