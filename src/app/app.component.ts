import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthenticationService } from "./_services/authentication.service";
import { StatusService } from './_services/status.service';
import { RideService } from './_services/ride.service';
import { RiderService } from './_services/rider.service';
import { Rider } from './_models/rider';
import { DebuggingService } from './_services/debugging.service';

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  title: string = 'RidePlanner2';
  userName: string;
  currentRide: string;
  riders: Array<Rider>;
  debugMessages: Array<any> = [];
  lat: number = null;
  lng: number = null;
  acc: number = null;

  constructor(private authenticationService: AuthenticationService, // Needs to be injected, to be initialized.
              private rideService: RideService,                     // Needs to be injected, to be initialized.
              private riderService: RiderService,                   // Needs to be injected, to be initialized.
              private debuggingService: DebuggingService,           // Needs to be injected, to be initialized.
              private statusService: StatusService) {
  }

  ngOnInit() {
    this.watchUser();
    this.watchCoords();
    this.watchCurrentRide();
    // this.watchRiders(); // For debugging.
    this.refreshAfterSleep();
  }

  watchUser() {
    this.statusService.user$.subscribe(user => {
      this.userName = user ? user.fullName : null;
    });
  }

  watchCoords() {
    this.statusService.coords$.subscribe(coords => {
      if (coords) {
        this.lat = coords.lat;
        this.lng = coords.lng;
        this.acc = coords.acc;
      }
    });
  }

  watchCurrentRide() {
    this.statusService.currentRide$.subscribe(currentRide => {
      this.currentRide = currentRide;
    });
  }

  // For debugging.
  watchRiders() {
    this.statusService.riders$.subscribe(riders => this.riders = riders);
  }

  refreshAfterSleep() {
    let now: number;
    let prev: number = Date.now();
    setInterval(() => {
      now = Date.now();

      if (now - prev > 3000) {
        window.location.reload();
      }

      prev = now;
      now = Date.now();
    }, 2000);
  }



}
