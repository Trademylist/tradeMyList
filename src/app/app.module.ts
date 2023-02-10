import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { TopNavComponent } from './dashboard/top-nav/top-nav.component';
import { SideNavComponent } from './dashboard/side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { SellerComponent } from './dashboard/seller/seller.component';
import { ProductComponent } from './dashboard/product/product.component';
import { FreebiesComponent } from './dashboard/freebies/freebies.component'
import { VacanciesComponent } from './dashboard/vacancies/vacancies.component';
import { CmsComponent } from './dashboard/cms/cms.component';
import { AdvertisementComponent } from './dashboard/advertisement/advertisement.component';
import { OfferDiscountAdminComponent } from './dashboard/offer-discount-admin/offer-discount-admin.component';
import { OfferDiscountSellerComponent } from './dashboard/offer-discount-seller/offer-discount-seller.component';
import { CategoryComponent } from './dashboard/category/category.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { SearchFilterPipe } from './services/search-filter.pipe';
import {NgxImageCompressService} from 'ngx-image-compress';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { ReportCommentComponent } from './dashboard/reports/report-comment/report-comment.component';
import { SubCategoryComponent } from './dashboard/sub-category/sub-category.component';
import { FooterComponent } from './dashboard/footer/footer.component';
import { AddProductComponent } from './dashboard/product/add-product/add-product.component';
import { AddFreebiesComponent } from './dashboard/freebies/add-freebies/add-freebies.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetPasswordComponent,
    DashboardComponent,
    TopNavComponent,
    SideNavComponent,
    HomeComponent,
    SellerComponent,
    ProductComponent,
    FreebiesComponent,
    VacanciesComponent,
    CmsComponent,
    AdvertisementComponent,
    OfferDiscountAdminComponent,
    OfferDiscountSellerComponent,
    CategoryComponent,
    AdminComponent,
    ProfileComponent,
    SearchFilterPipe,
    ReportsComponent,
    ReportCommentComponent,
    SubCategoryComponent,
    FooterComponent,
    AddProductComponent,
    AddFreebiesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    NgxSpinnerModule,
    AngularMultiSelectModule    
  ],
  providers: [
    NgxImageCompressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
