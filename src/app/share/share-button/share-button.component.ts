import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent implements OnInit {

  @Input() type: 'facebook' | 'twitter';
  @Input() shareUrl: string;
  navUrl: string;

  constructor() { }

  ngOnInit() {
    this.createNavigationUrl();
  }

  private createNavigationUrl() {
    let searchParams = new URLSearchParams();

    // TODO: zrobić map z tego manualnego dziugania

    switch(this.type) {
      case 'facebook':
        searchParams.set('u', this.shareUrl);
        this.navUrl = 'https://www.facebook.com/sharer/sharer.php?' + searchParams;
        break;
      case 'twitter':
        searchParams.set('url', this.shareUrl);
        this.navUrl =  'https://twitter.com/share?' + searchParams;
        break;
    }
  }

  public share() {
    return window.open(this.navUrl, "_blank");
  }

}
