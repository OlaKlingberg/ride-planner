import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RiderService } from './rider.service';
import { AuthenticationService } from './authentication.service';
import { StatusService } from './status.service';
import Socket = SocketIOClient.Socket;

@Injectable()
export class RideService {
  private socket: Socket;

  constructor(private statusService: StatusService) {
    this.socket = this.statusService.socket;

    this.listenForAvailableRides();
    this.watchRide();
  }

  listenForAvailableRides() {
    this.socket.on('availableRides', (rides) => {
      this.statusService.availableRides$.next(rides);
    });
  }

  watchRide() {
    // On page refresh, get currentRide from sessionStorage.
    this.statusService.currentRide$.next(sessionStorage.getItem('currentRide'));

    // Keep currentRide in sessionStorage synced with currentRide$
    this.statusService.currentRide$.subscribe(ride => {
      if (ride) {
        this.socket.emit('joinRide', ride);
        sessionStorage.setItem('currentRide', ride);
      } else {
        sessionStorage.removeItem('currentRide');
      }

    });
  }
}
