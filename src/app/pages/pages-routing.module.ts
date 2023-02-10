import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';

const routes: Routes = [{ path: '', component: PagesComponent },
{ path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
{ path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) },
{ path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
