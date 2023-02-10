import { ApplicationRef, Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trade-website';
  selectedLocality = localStorage.getItem('locality');
  constructor(
    private update: SwUpdate,
    private appRef: ApplicationRef
  ){
    this.updateClient();
    this.checkUpdate();
  }

  
  updateClient() {
    if(!this.update.isEnabled) {
      console.log('Not Enabled');
      return;
    }
    this.update.available.subscribe((event)=>{
      console.log(`current`,event.current,`available`,event.available);
      if(confirm('update available for the app please confirm')) {
        this.update.activateUpdate().then(() => location.reload());
      }
    });

    this.update.activated.subscribe((event) => {
      console.log(`current`,event.previous,`available`,event.current);
    })
  }

  checkUpdate(){
    this.appRef.isStable.subscribe((isStable) => {
      if(isStable) {
        const timeInterval = interval(8*60*60*1000);

        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() => console.log('checked'));
          console.log('update checked');
        })
      }
    })
  }
  closeLocationAlert(){
    $('#location-alert').hide();
  }

  setProductAddress(){
    return false;
  }
}
