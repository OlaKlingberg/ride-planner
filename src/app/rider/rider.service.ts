import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import Socket = SocketIOClient.Socket;
import * as _ from 'lodash';

import { SettingsService } from '../settings/settings.service';
import { SocketService } from '../core/socket.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Injectable()
export class RiderService {
  riderList$: BehaviorSubject<User[]> = new BehaviorSubject(null);
  user: User = null;

  private socket: Socket;
  private zCounter: number = 0;

  constructor(private settingsService: SettingsService,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = socketService.socket;
    this.onDisconnectedRider();
    this.onJoinedRider();
    this.onRemovedRider();
    this.onRiderList();
    this.onUpdatedRiderPosition();
    this.subscribeToUser();
  }

  addDummyRiders(callback) {
    console.log("RiderService.addDummyRiders()");
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    this.socket.emit('addDummyRiders', this.user, token, callback);
  }

  onDisconnectedRider() {
    this.socket.on('disconnectedRider', disconnectedRider => {
      this.riderListPromise().then((riderList: Array<User>) => {
        let idx = _.findIndex(riderList, rider => rider._id === disconnectedRider._id);
        if ( idx >= 0 ) {
          riderList[ idx ].disconnected = disconnectedRider.disconnected;
          this.riderList$.next(riderList);
        }
      });
    });
  }

  onJoinedRider() {
    this.socket.on('joinedRider', joinedRider => {
      // If the zIndices are getting too high, it's time to request the whole riderList again.
      if ( this.zCounter >= 1000 ) {
        this.zCounter = 0;
        this.socket.emit('giveMeRiderList', this.user.ride);
      } else {
        joinedRider = new User(joinedRider);
        this.riderListPromise().then((riderList: User[]) => {
          riderList = riderList.filter(rider => rider._id !== joinedRider._id); // Remove rider, if rider already exists.
          riderList.push(joinedRider);
          this.riderList$.next(riderList);
          setInterval(() => {
          }, 3000);
        });
      }
    });
  }

  onRemovedRider() {
    this.socket.on('removedRider', _id => {
      let riders = this.riderList$.value.filter(rider => rider._id !== _id);
      this.riderList$.next(riders);
    });
  }

  onRiderList() {
    this.socket.on('riderList', riderList => {
      riderList = riderList.map(rider => new User(rider));
      this.riderList$.next(riderList);
    });
  }

  onUpdatedRiderPosition() {
    this.socket.on('updatedRiderPosition', updatedRider => {

      let riderList = this.riderList$.value;
      let idx = _.findIndex(riderList, rider => rider._id === updatedRider._id);
      if ( idx >= 0 ) {
        riderList[ idx ].position.timestamp = updatedRider.position.timestamp;
        riderList[ idx ].position.coords.accuracy = updatedRider.position.coords.accuracy;
        riderList[ idx ].position.coords.latitude = updatedRider.position.coords.latitude;
        riderList[ idx ].position.coords.longitude = updatedRider.position.coords.longitude;

        this.riderList$.next(riderList);
      }
    });
  }

  removeDummyRiders(ride) {
    let riderList = this.riderList$.value;
    riderList = riderList.filter(rider => !rider.dummy);
    this.riderList$.next(riderList);
    this.socket.emit('removeDummyRiders', ride);
  }

  riderListPromise() {
    let riderListPromise = new Promise((resolve, reject) => {
      let subscription = this.riderList$.subscribe(riderList => {
        if ( riderList ) {
          resolve(riderList);
          subscription.unsubscribe();
        }
      })
    });

    return riderListPromise;
  }

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }
}

