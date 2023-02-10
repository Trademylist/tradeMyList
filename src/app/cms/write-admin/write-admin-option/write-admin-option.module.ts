import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WriteAdminOptionRoutingModule } from './write-admin-option-routing.module';
import { WriteAdminOptionComponent } from './write-admin-option.component';

import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [WriteAdminOptionComponent],
  imports: [
    CommonModule,
    WriteAdminOptionRoutingModule,
    FormsModule
  ]
})
export class WriteAdminOptionModule { }
