import { Injectable } from '@angular/core';
import { StatusService } from './status.service';
import { RiderService } from './rider.service';
import { environment } from '../../environments/environment'
import Socket = SocketIOClient.Socket;

@Injectable()
export class RideService {
  private socket: Socket;

  constructor(private statusService: StatusService,
              private riderService: RiderService) {
    this.socket = this.statusService.socket;

    this.listenForAvailableRides();
    this.keepRideInStorageSynced();
    this.joinOrLeaveRide();
  }

  listenForAvailableRides() {
    this.socket.on('availableRides', (rides) => {
      this.statusService.availableRides$.next(rides);
    });
  }

  keepRideInStorageSynced() {
    let ride = environment.storage.getItem('currentRide');
    this.statusService.currentRide$.next(ride);

    this.statusService.currentRide$.subscribe(ride => {
      if ( ride ) {
        environment.storage.setItem('currentRide', ride);
      } else {
        environment.storage.removeItem('currentRide');
      }
    });
  }

  joinOrLeaveRide() {
    this.statusService.currentRide$
        .delay(100) // Todo: Not sure if this works. Kind of ugly, in any case.
        .withLatestFrom(this.statusService.userRider$)
        .subscribe(([ ride, userRider ]) => {
          console.log("ride:", ride);
          console.log("userRider:", userRider);
          if ( ride && userRider ) {
            this.joinRide(userRider);
          } else {
            this.leaveRide(userRider);
          }
        });
  }

  joinRide(userRider) {
    this.socket.emit('joinRide', userRider, () => {
      console.log("userRider:", userRider);
        this.socket.emit('giveMeFullRiderList', userRider);
        this.riderService.emitUpdatedRider();

    });
  }

  leaveRide(userRider) {
    this.socket.emit('leaveRide', userRider);
  }

}
