import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ApiService } from '../services/api-service/api.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Location } from "@angular/common";
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    console.log(this.sanitized.bypassSecurityTrustHtml(value))
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
@Component({
  selector: 'app-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  passing_param: any
  getData: any;
  cms_title: any;
  storedSafetyNumber: string;
  storedSupportNumber: string;
  safetyNumber: string = 'SAFETY HELPLINE';
  supportNumber: string = 'SUPPORT HELPLINE';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
    private spinner:NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.passing_param = params.get('id');
      if (this.passing_param == 'terms-and-conditions') {
        this.cms_title = "Terms & Condition";
        this.getCMS('get_cms/Terms & Condition');
      } else if (this.passing_param == 'privacy-policy') {
        this.cms_title = "Privacy Policy";
        this.getCMS('get_cms/Privacy Policy');
      } else if (this.passing_param == 'help') {
        this.cms_title = "Help";
        this.getCMS('get_cms/Help');
      }
    });
  }

  getCMS(getValue) {
    this.spinner.show();
    this.apiService.get(getValue, '').subscribe((res) => {
      this.spinner.hide();
      if (res.success) {
        this.getData = res.data[0].page_desc;
      }
    }, error => {
      this.spinner.hide();
    });
  }

  showSafetyNumber() {
    this.apiService.get('get_cms/Safety Helpline', '').subscribe((res) => {
      if (res.success) {
        this.safetyNumber = res.data[0].page_desc;
      }
    }, error => {
    });
  }
  showSupportNumber() {
    this.apiService.get('get_cms/Support Helpline', '').subscribe((res) => {
      if (res.success) {
        this.supportNumber = res.data[0].page_desc;
      }
    }, error => {
    });
  }
  myBackButton() {
    this.location.back();
  }
  /** Function is used to navigate to submit comment page
   */
  writeToAdmin() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        type: this.passing_param,
      }
    };
    let route = 'tradecms/' + this.passing_param + '/write-admin';
    this.router.navigate([route], navigationExtras);
  }
}

