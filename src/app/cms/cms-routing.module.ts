import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRedirect } from '../services/auth/login-redirect.service';
import { CmsComponent } from './cms.component';
import {HelpComponent} from './help/help.component';
import {HelpOptionComponent} from './help-option/help-option.component';
// const routes: Routes = [
//   {
//     path: '', component: CmsComponent,
//     children: [
//       { path: '', redirectTo: 'trade-cms', canActivate: [LoginRedirect], pathMatch: 'full' },
//       { path: 'ask-admin', canActivate: [LoginRedirect], component: HelpComponent },
//     ]
//   },
// ]

const routes: Routes = [
  { path: '', component: CmsComponent },
  // { path: 'write-admin', loadChildren: () => import('./write-admin/write-admin.module').then(m => m.WriteAdminModule) },
  { path: 'ask-admin', canActivate: [LoginRedirect], component: HelpComponent }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
