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

  constructor(private authenticationService: AuthenticationService, // Needs to be injected, to be initialized.
              private rideService: RideService,                     // Needs to be injected, to be initialized.
              private debuggingService: DebuggingService,           // Needs to be injected, to be initialized.
              private statusService: StatusService) {
  }

  ngOnInit() {
    this.watchUser();
    this.watchCurrentRide();
    this.watchRiders(); // For debugging.
    this.refreshAfterSleep();
  }

  watchUser() {
    this.statusService.user$.subscribe(user => {
      this.userName = user ? user.fullName : null;
    });
  }

  watchCurrentRide() {
    this.statusService.currentRide$.subscribe(currentRide => {
      this.currentRide = currentRide;
    });
  }

  // For debugging.
  watchRiders() {
    // this.statusService.riders$.subscribe(riders => this.riders = riders);
  }

  refreshAfterSleep() {
    let i = 0;
    let prev: number = Date.now();
    let now: number;
    setInterval(() => {
      now = Date.now();
      console.log(now);
      console.log("now - prev:", now - prev);
      console.log("User:", this.userName);
      this.statusService.debugMessages$.next(`${this.userName}. Counter: ${i++}. Time diff: ${now - prev}`);


      if (now - prev > 3000) {
        this.statusService.debugMessages$.next(`${this.userName}. Counter: ${i++}. Time diff: ${now - prev}`);
        window.location.reload();
      }

      prev = now;
      now = Date.now();





    }, 2000);

  }


}
