import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RiderService } from './rider.service';
import { AuthenticationService } from './authentication.service';
import { StatusService } from './status.service';

@Injectable()
export class RideService {

  constructor(private riderService: RiderService,
              private statusService: StatusService) {
    setTimeout(() => {
      this.trackCurrentRide(); // Has to be postponed one tick, to let AppComponent retrieve currentRide from localStorage. Kind of an ugly solution ...
    }, 0);
  }

  trackCurrentRide() {
    // Save ride in localStorage, where it can be retrieved by AppComponent in case of a page refresh.
    this.statusService.currentRide$.subscribe((ride) => {
      if ( ride ) {
        localStorage.setItem('currentRide', ride);
        this.riderService.emitRider(this.statusService.user$.value, ride);
      } else {
        localStorage.removeItem('currentRide');
        this.riderService.removeRider();
      }

    })
  }
}
