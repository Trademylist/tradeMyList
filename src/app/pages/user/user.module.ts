import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { BlockListComponent } from './block-list/block-list.component';
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import { ShareModule } from '../../share/share.module';
import { SellerDetailsComponent } from './seller-details/seller-details.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ToastService } from '../../services/toast/toast.service';
import { LoaderService } from '../../services/loader/loader.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ApiService } from '../../services/api-service/api.service';
// import { NgxStarRatingModule } from 'ngx-star-rating';
// import { NgxSpinnerModule } from "ngx-spinner";
import { RatingModule } from 'ng-starrating';
import { ReportUserComponent } from './report-user/report-user.component';

@NgModule({
  declarations: [UserComponent, EditProfileComponent, NotificationSettingsComponent, BlockListComponent, AllReviewsComponent, SellerDetailsComponent, ProfileDetailsComponent, ReportUserComponent],
  imports: [
    CommonModule,
    ShareModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    RatingModule
    // NgxSpinnerModule
  ],
  providers: [
    ToastService,
    LoaderService,
    ApiService
  ]
})
export class UserModule { }
