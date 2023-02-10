import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatDetailsComponent } from './chat-details/chat-details.component';
import {ShareModule} from '../../share/share.module';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { environment } from '../../../environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChatComponent, ChatListComponent, ChatDetailsComponent],
  imports: [
    CommonModule,
    ShareModule,
    ChatRoutingModule,
    ReactiveFormsModule,
    FormsModule 
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFirestoreModule
  ]
})
export class ChatModule { }
