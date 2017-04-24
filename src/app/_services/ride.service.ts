import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RiderService } from './rider.service';
import { AuthenticationService } from './authentication.service';
import { StatusService } from './status.service';
import Socket = SocketIOClient.Socket;
import { environment } from '../../environments/environment';

@Injectable()
export class RideService {
  private socket: Socket;

  constructor(private statusService: StatusService) {
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.listenForAvailableRides();
    this.watchCurrentRide();
  }

  listenForAvailableRides() {
    this.socket.on('availableRides', (rides) => {
      this.statusService.availableRides$.next(rides);
    });
  }

  watchCurrentRide() {
    // On page refresh, get currentRide from sessionStorage.
    this.statusService.currentRide$.next(sessionStorage.getItem('currentRide'));

    // Keep sessionStorage synced with currentRide$.
    this.statusService.currentRide$.subscribe(ride => {
      ride ? sessionStorage.setItem('currentRide', ride) : sessionStorage.removeItem('currentRide');
    });
  }

}
