import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  event = new EventEmitter();    
  subsVar: Subscription;

  constructor(
  ) { }

  callFun() {    
    this.event.emit();    
  }
}
