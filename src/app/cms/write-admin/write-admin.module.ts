import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WriteAdminRoutingModule } from './write-admin-routing.module';
import { WriteAdminComponent } from './write-admin.component';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WriteAdminComponent],
  imports: [
    CommonModule,
    WriteAdminRoutingModule,
    FormsModule
  ]
})
export class WriteAdminModule { }
