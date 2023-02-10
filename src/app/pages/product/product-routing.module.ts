import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product.component';
import { AddCommercialProductComponent } from './add-commercial-product/add-commercial-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { MyProductListComponent } from './my-product-list/my-product-list.component'
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CommercialProductDetailsComponent } from './commercial-product-details/commercial-product-details.component';
import { LoginRedirect } from '../../services/auth/login-redirect.service';
import {ProductListingComponent} from './product-listing/product-listing.component';
import {CommercialProductListingComponent} from './commercial-product-listing/commercial-product-listing.component';
import {SaleProductComponent} from './sale-product/sale-product.component';
import {RatingTagComponent} from './rating-tag/rating-tag.component';



const routes: Routes = [
  {
    path: '', component: ProductComponent,
    children: [
      { path: '', redirectTo: 'product', canActivate: [LoginRedirect], pathMatch: 'full' },
      { path: 'add-commercial-product', canActivate: [LoginRedirect], component: AddCommercialProductComponent },
      { path: 'add-product', canActivate: [LoginRedirect], component: AddProductComponent },
      { path: 'edit-product', canActivate: [LoginRedirect], component: AddProductComponent },
      { path: 'product-details', component: ProductDetailsComponent },
      { path: 'commercial-product-details', component: CommercialProductDetailsComponent },
      { path: 'product-list', component: ProductListingComponent },
      { path: 'commercial-product-list', component: CommercialProductListingComponent },
      { path: 'sale-product',canActivate: [LoginRedirect], component: SaleProductComponent },
      { path: 'rating-tag',canActivate: [LoginRedirect], component: RatingTagComponent },

      
      { path: 'my-product-listing/:url', canActivate: [LoginRedirect], component: MyProductListComponent },

      // { path: 'my-account', component: MyAccountComponent },
      // { path: 'change-password', component: ChangePasswordComponent },
      // { path: 'address', component: AddressListComponent },
      // { path: 'address/add', component: AddressAddComponent },
      // { path: 'address/update/:id', component: AddressAddComponent },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
