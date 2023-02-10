import { Component, OnInit } from '@angular/core';
import { Observable, merge, of, fromEvent } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MAG ADMIN';

  isConnected = true;
  online$: Observable<boolean>;//user online or not
  onlineStatus: boolean;

  constructor() {

  }
  ngOnInit() {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );
    this.online$.subscribe(d => {
      this.onlineStatus = d;
      if (!this.onlineStatus) {
        alert('No Internet!!!')
      }
    })
  }
}

