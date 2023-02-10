import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AddCommercialProductComponent } from './add-commercial-product/add-commercial-product.component';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShareModule } from '../../share/share.module';
import { MyProductListComponent } from './my-product-list/my-product-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast/toast.service';
import { LoaderService } from '../../services/loader/loader.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ApiService } from '../../services/api-service/api.service';
import { CommercialProductListingComponent } from './commercial-product-listing/commercial-product-listing.component';
import { CommercialProductDetailsComponent } from './commercial-product-details/commercial-product-details.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { RatingModule } from 'ng-starrating';
// import { AgmCoreModule } from '@agm/core';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { environment } from '../../../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SaleProductComponent } from './sale-product/sale-product.component';
import { RatingTagComponent } from './rating-tag/rating-tag.component';
@NgModule({
  declarations: [ProductComponent, AddProductComponent, AddCommercialProductComponent, ProductListingComponent, ProductDetailsComponent, MyProductListComponent, CommercialProductListingComponent, CommercialProductDetailsComponent, SaleProductComponent, RatingTagComponent],
  imports: [
    CommonModule,
    ShareModule,
    ProductRoutingModule,
    NgxImageGalleryModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    ImageCropperModule,
    RatingModule,
    NgbModule,
    NgxStarRatingModule
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFirestoreModule
    // AgmCoreModule
  ],
  providers: [
    ToastService,
    LoaderService,
    ApiService
  ]
})
export class ProductModule { }
