import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import {ShareModule} from '../share/share.module';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    ShareModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
