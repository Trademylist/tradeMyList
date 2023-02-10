import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WriteAdminComponent } from './write-admin.component';

const routes: Routes = [{ path: '', component: WriteAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WriteAdminRoutingModule { }
