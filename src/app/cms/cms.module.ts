import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../share/share.module';
import { CmsRoutingModule } from './cms-routing.module';
import { CmsComponent } from './cms.component';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HelpComponent } from './help/help.component';
import { HelpOptionComponent } from './help-option/help-option.component';
@NgModule({
  declarations: [CmsComponent, HelpComponent, HelpOptionComponent],
  imports: [
    CommonModule,
    CmsRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CmsModule { }
