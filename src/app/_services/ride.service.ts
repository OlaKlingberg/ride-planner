import { Injectable } from '@angular/core';
import { StatusService } from './status.service';
import { environment } from '../../environments/environment'
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
    // On page refresh, get currentRide from storage (session- och local-).
    let ride = environment.storage.getItem('currentRide');
    let token = environment.storage.getItem('currentToken');
    token = JSON.parse(token);
    this.statusService.currentRide$.next(ride);
    this.socket.emit('giveMeFullRiderList', { ride, token });

    // Keep currentRide in storage synced with currentRide$
    this.statusService.currentRide$.subscribe(ride => {
      if ( ride ) {
        let token = environment.storage.getItem('currentToken');
        token = JSON.parse(token);
        this.socket.emit('joinRide', ride);
        this.socket.emit('giveMeFullRiderList', { ride, token });
        environment.storage.setItem('currentRide', ride);
      } else {
        environment.storage.removeItem('currentRide');
      }

    });
  }
}
