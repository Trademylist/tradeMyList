import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRedirect } from '../../services/auth/login-redirect.service';
import { ChatComponent } from './chat.component';
import {ChatListComponent} from './chat-list/chat-list.component';
import {ChatDetailsComponent} from './chat-details/chat-details.component';
const routes: Routes = [
  {
    path: '', component: ChatComponent,
    children: [
      { path: '', redirectTo: 'chat', canActivate: [LoginRedirect], pathMatch: 'full' },
      { path: 'chatter', canActivate: [LoginRedirect], component: ChatListComponent },
      { path: 'chat-details', canActivate: [LoginRedirect], component: ChatDetailsComponent },
     
      
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
export class ChatRoutingModule { }
