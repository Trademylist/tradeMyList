import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './layout/home/home.component';
import * as $ from 'jquery';
import { ProductListingComponent } from './layout/product-listing/product-listing.component';
import { LoginComponent } from './layout/login/login.component';
import { SignupComponent } from './layout/signup/signup.component';
import { NotificationComponent } from './layout/notification/notification.component';
import { ProductDetailsComponent } from './layout/product-details/product-details.component';
import { ApiService } from './services/api-service/api.service';
// import { GoogleApiService } from './services/google-api.service';
import { LoginRedirect } from './services/auth/login-redirect.service';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from './services/toast/toast.service';
import { LoaderService } from './services/loader/loader.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { ShareModule } from './share/share.module';
import { NetworkService } from 'src/app/services/geo-service/network.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { ForgetPasswordComponent } from './layout/forget-password/forget-password.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';

const socialAuthServiceConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        // '554176830677-cggeqsivpsgj4ph6j7ncl3s2uajro79u.apps.googleusercontent.com'
        // '767072480580-logd1mknpielovpp7g95p2ev09sqdek5.apps.googleusercontent.com'
        '61422236781-f6t5cr8beoe7vhg7rk87kjecnr56trfe.apps.googleusercontent.com'
        // '1039716479272-35vtf5b15ilqdvr7uh8phpqcr4rs0b0b.apps.googleusercontent.com'
      ),
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('134912721483403'),
    }
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductListingComponent,
    LoginComponent,
    SignupComponent,
    NotificationComponent,
    ProductDetailsComponent,
    ForgetPasswordComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule,
    ShareModule,
    SocialLoginModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    InfiniteScrollModule,
    NgxScrollTopModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ToastrModule.forRoot(),
    NgbModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), // ToastrModule added
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: socialAuthServiceConfig
    },
    ApiService,
    // GoogleApiService,
    ToastService,
    FormBuilder,
    LoaderService,
    LoginRedirect,
    NetworkService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
