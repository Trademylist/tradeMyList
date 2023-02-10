import { NgModule } from '@angular/core';
import { Routes, RouterModule,ExtraOptions,PreloadAllModules } from '@angular/router';
// import { AddCommercialProductComponent } from './dashboard-seller/add-commercial-product/add-commercial-product.component';
// import { AddProductComponent } from './dashboard-seller/add-product/add-product.component';
// import { AllReviewsComponent } from './dashboard-seller/all-reviews/all-reviews.component';
// import { BlockListComponent } from './dashboard-seller/block-list/block-list.component';
// import { ChatterDetailsComponent } from './dashboard-seller/chatter-details/chatter-details.component';
// import { ChatterComponent } from './dashboard-seller/chatter/chatter.component';
// import { EditProfileComponent } from './dashboard-seller/edit-profile/edit-profile.component';
// import { MyListingComponent } from './dashboard-seller/my-listing/my-listing.component';
// import { NotificationSettingsComponent } from './dashboard-seller/notification-settings/notification-settings.component';
import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './layout/login/login.component';
import { ForgetPasswordComponent } from './layout/forget-password/forget-password.component';
import { ProductDetailsComponent } from './layout/product-details/product-details.component';
// import { ProductListingComponent } from './layout/product-listing/product-listing.component';
// import { ProductListingComponent } from './layout/product-listing/product-listing.component';
import { SignupComponent } from './layout/signup/signup.component';
import { LoginRedirect } from './services/auth/login-redirect.service';
import {ProductListingComponent} from './pages/product/product-listing/product-listing.component';
import {CommercialProductListingComponent} from './pages/product/commercial-product-listing/commercial-product-listing.component';
const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomeComponent },
  { path: 'home-page/commercial', component: CommercialProductListingComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'product-details', component: ProductDetailsComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  // { path: 'seller-details', component: SellerDetailsComponent},
  // { path: 'add-product', component: AddProductComponent},
  // { path: 'edit-profile', component: EditProfileComponent},
  // { path: 'add-commercial-product', component: AddCommercialProductComponent},
  // { path: 'my-listing', component: MyListingComponent},
  // { path: 'chatter', component: ChatterComponent},
  // { path: 'chat-details', component: ChatterDetailsComponent},
  // { path: 'all-reviews', component: AllReviewsComponent},
  // { path: 'block-list', component: BlockListComponent},
  // { path: 'notification-settings', component: NotificationSettingsComponent},
  // { path: 'my-listing', component: MyListingComponent}

  { path: 'trade', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: 'share', loadChildren: () => import('./share/share.module').then(m => m.ShareModule) },
  { path: 'trade-cms/:id', loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule) },
  { path: 'trade-help', loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule) },
  { path: 'contents', loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule) },


];


const config: ExtraOptions = {
  useHash: true,
  preloadingStrategy: PreloadAllModules
  // enableTracing: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes,config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
