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
    // On page refresh, get currentRide from localStorage.
    let ride = localStorage.getItem('currentRide');
    let token = localStorage.getItem('currentToken');
    token = JSON.parse(token);
    this.statusService.currentRide$.next(ride);
    this.socket.emit('giveMeFullRiderList', { ride, token });

    // Keep currentRide in localStorage synced with currentRide$
    this.statusService.currentRide$.subscribe(ride => {
      if ( ride ) {
        let token = localStorage.getItem('currentToken');
        token = JSON.parse(token);
        this.socket.emit('joinRide', ride);
        this.socket.emit('giveMeFullRiderList', { ride, token });
        localStorage.setItem('currentRide', ride);
      } else {
        localStorage.removeItem('currentRide');
      }

    });
  }
}
