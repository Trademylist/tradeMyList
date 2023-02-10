import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { SellerComponent } from './seller/seller.component';
import { ProductComponent } from './product/product.component';
import { FreebiesComponent } from './freebies/freebies.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { CmsComponent } from './cms/cms.component';
import { OfferDiscountAdminComponent } from './offer-discount-admin/offer-discount-admin.component';
import { OfferDiscountSellerComponent } from './offer-discount-seller/offer-discount-seller.component';
import { CategoryComponent } from './category/category.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportCommentComponent } from './reports/report-comment/report-comment.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { FooterComponent } from './footer/footer.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { AddFreebiesComponent } from './freebies/add-freebies/add-freebies.component';

export const DashboardRoutes: Route[] = [
  {
    path: 'dashboard',
    // canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'seller',
        component: SellerComponent
      },
     
      {
        path: 'product',
        component: ProductComponent
      },
      
      {
        path: 'product/add-product',
        component: AddProductComponent
      },
      {
        path: 'freebies',
        component: FreebiesComponent
      },
      
      {
        path: 'freebies/add-freebie',
        component: AddFreebiesComponent
      },
      {
        path: 'vacancies',
        component: VacanciesComponent
      },
      {
        path: 'admin-offer-discount',
        component: OfferDiscountAdminComponent
      },
      {
        path: 'seller-offer-discount',
        component: OfferDiscountSellerComponent
      },
      {
        path: 'category/:id',
        component: CategoryComponent
      },
      {
        path: 'advertisement/:id',
        component: AdvertisementComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      },
      {
        path: 'report-comment',
        component: ReportCommentComponent
      },
      {
        path: 'cms',
        component: CmsComponent
      }, 
      {
        path: 'profile/:id',
        component: ProfileComponent
      },
      {
        path: 'sub-category/:item',
        component: SubCategoryComponent
      },
      {
        path: 'footer',
        component: FooterComponent
      }
    ]
  }
];
