import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ApiService } from 'src/app/services/api-service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rating-tag',
  templateUrl: './rating-tag.component.html',
  styleUrls: ['./rating-tag.component.scss']
})
export class RatingTagComponent implements OnInit {

  pageTitle="Rating";
  public loggedUser: any = {};
  public soldedUserImage: any = '';
  public rating: number = 0;
  public soldedUser: any = {
    user_id: '',
    user_type: '',
    product_id: '',
    rating: 0,
    tags: [],
    description: ''
  };
  public tagList: Array<any> = [];
  public ratingReviewToggle: any = '';
  public buttonClicked: number = 0;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private location: Location
  ) { }

  ngOnInit() { 

    this.onEnter();
  }

  onEnter() {
    this.loggedUser = JSON.parse(localStorage.getItem("userDetails"));
    this.activatedRoute.params.subscribe(params => {
      this.soldedUser.user_id = params.user_id;
      this.soldedUser.product_id = params.product_id;
      this.soldedUser.user_type = "Buyer";
      this.soldedUserImage = params.user_image;
    });
    this.ratingReviewToggle = 'rating';
  }

  goBack() {
    this.location.back();
  }

  onChangeRate(rating) { }

  publishRating() {
    this.soldedUser.rating = this.rating;
    this.ratingReviewToggle = 'review';
    this.getTags();
  }

  getTags() {
    this.loaderService.present();
    this.apiService.getX('app_seller/buyer_tag').subscribe(res => {
      this.loaderService.dismiss();
      if (res.success) {
        this.tagList = res.data;
      }
    }, error => {
      this.loaderService.dismiss();
    });
  }

  selectTag(tag) {
    const index = this.soldedUser.tags.indexOf(tag, 0);
    if (index > -1) {
      this.soldedUser.tags.splice(index, 1);
    } else {
      this.soldedUser.tags.push(tag);
    }
  }

  isSelectedTag(tag) {
    if (this.soldedUser.tags.indexOf(tag, 0) > -1)
      return true;
  }

  publishReview() {
    if (this.buttonClicked == 1) {
      // do nothing
    } else {
      this.apiService.postX('app_seller/review', this.soldedUser).subscribe(res => {
        if (res.success) {
          this.buttonClicked = 1;
          this.toastService.presentToast(res.message);
          this.productSold();
          this.router.navigate(['trade/product/my-product-listing/product']);
        } else {
          this.buttonClicked = 0;
          this.toastService.presentToast(res.message);
        }
      }, error => {
        this.buttonClicked = 0;
        this.toastService.presentToast('Review publish failed');
      });
    }
  }

  productSold() {
    this.apiService.postX('app_seller/product_sold', { product_id: this.soldedUser.product_id, sold_id: this.soldedUser.user_id })
      .subscribe((res) => {
      });
  }

}
