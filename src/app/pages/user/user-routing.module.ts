import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import { BlockListComponent } from './block-list/block-list.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { SellerDetailsComponent } from './seller-details/seller-details.component';
import { LoginRedirect } from '../../services/auth/login-redirect.service'
import { ReportUserComponent } from './report-user/report-user.component';
import { from } from 'rxjs';
const routes: Routes = [
  {
    path: '', component: UserComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'all-reviews',canActivate: [LoginRedirect],  component: ProfileDetailsComponent },
      { path: 'edit-profile', canActivate: [LoginRedirect], component: EditProfileComponent },
      { path: 'profile-details', canActivate: [LoginRedirect], component: ProfileDetailsComponent },
      { path: 'my-block-list', canActivate: [LoginRedirect], component: ProfileDetailsComponent },

      { path: 'notification-settings',canActivate: [LoginRedirect], component: NotificationSettingsComponent },
      { path: 'block-list',canActivate: [LoginRedirect], component: BlockListComponent },
      { path: 'product-seller-details', component: SellerDetailsComponent },
      { path: 'report-user', canActivate: [LoginRedirect], component: ReportUserComponent },
      






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
export class UserRoutingModule { }
