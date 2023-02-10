import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ShareRoutingModule } from './share-routing.module';
import { ShareComponent } from './share.component';
import { FooterComponent } from './footer/footer.component';
import { LeftNavigationComponent } from './left-navigation/left-navigation.component';
import { HeaderComponent } from './header/header.component';
import { ProductFilterPipe } from './pipes/product-filter.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { DndDirective } from './directive/dnd.directive';
import { ProgressComponent } from './progress/progress.component';
import { LocationComponent } from './location/location.component';
import { AgmCoreModule } from '@agm/core';
import { StripeComponent } from './stripe/stripe.component';
// import { NgxSpinnerModule } from "ngx-spinner";
import { NgPaymentCardModule } from 'ng-payment-card';
import { NgxPayPalModule } from 'ngx-paypal';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { DialogComponent } from './dialog/dialog.component';
import { DialogService } from './dialog/dialog.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareButtonComponent } from './share-button/share-button.component';
@NgModule({
  declarations: [ShareComponent, FooterComponent, LeftNavigationComponent, HeaderComponent, ProductFilterPipe, SearchFilterPipe, DndDirective, ProgressComponent, LocationComponent, StripeComponent, DateAgoPipe, DialogComponent, ShareButtonComponent],
  imports: [
    CommonModule,
    ShareRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPayPalModule,
    NgPaymentCardModule,
    CreditCardDirectivesModule,
    NgbModule,
    // NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4',
      //app working key
      // apiKey: 'AIzaSyB5HFrN_U7pZuruWp9i61NUiSgGEx9sVps',
      // apiKey: 'AIzaSyAb5r8EzswE0piYF5HJgfk-UbRLuL6VnKM', 


      libraries: ["places"]
    })
  ],
  exports: [
    FooterComponent,
    LeftNavigationComponent,
    HeaderComponent,
    SearchFilterPipe,
    ProductFilterPipe,
    ProgressComponent,
    DndDirective,
    LocationComponent,
    StripeComponent,
    DateAgoPipe,
    DialogComponent,
    ShareButtonComponent
  ],
  providers: [DialogService]
})
export class ShareModule { }
