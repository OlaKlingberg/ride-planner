import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RiderService } from './rider.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class RideService {
  public currentRide$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(private riderService: RiderService,
              private authenticationService: AuthenticationService) {
    setTimeout(() => {
      this.trackCurrentRide(); // Has to be postponed one tick, to let AppComponent retrieve currentRide from localStorage. Kind of an ugly solution ...
    }, 0);
  }

  trackCurrentRide() {
    // Save ride in localStorage, where it can be retrieved by AppComponent in case of a page refresh.
    this.currentRide$.subscribe((ride) => {
      if ( ride ) {
        localStorage.setItem('currentRide', ride);
        this.riderService.emitRider(this.authenticationService.user$.value, ride);
      } else {
        localStorage.removeItem('currentRide');
        this.riderService.removeRider();
      }

    })
  }
}
