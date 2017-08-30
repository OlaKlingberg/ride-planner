import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

import { User } from '../user/user';
import { SocketService } from '../core/socket.service';
import Socket = SocketIOClient.Socket;
import { UserService } from '../user/user.service';
import { RideSubjectService } from '../ride/ride-subject.service';

@Injectable()
export class MapService {
  riderList$: BehaviorSubject<Array<User>> = new BehaviorSubject(null);
  user: User = null;

  private socket: Socket;
  private zCounter: number = 0;

  constructor(private rideSubjectService: RideSubjectService,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
    this.listenForDisconnectedRider();
    this.listenForJoinedRider();
    this.listenForRemovedRider();
    this.listenForRiderList();
    this.requestRiderList();
    this.subscribeToUser();
  }

  listenForDisconnectedRider() {
    this.socket.on('disconnectedRider', disconnectedRider => {
      console.log('disconnectedRider');
      this.riderListPromise().then((riderList: Array<User>) => {
        let idx = _.findIndex(riderList, rider => rider._id === disconnectedRider._id);
        if ( idx >= 0) {
          riderList[ idx ].disconnected = disconnectedRider.disconnected;
          this.riderList$.next(riderList);
        }
      });
    });
  }

  listenForJoinedRider() {
    this.socket.on('joinedRider', joinedRider => {
      console.log('joinedRider:', joinedRider.fname, joinedRider.lname);
      // If the zIndices are getting too high, it's time to request the whole riderList again.
      if ( this.zCounter >= 1000 ) {
        this.zCounter = 0;
        console.log("Counter reached 1000! About to emit giveMeRiderList.");
        this.socket.emit('giveMeRiderList', this.user.ride);
      } else {
        if ( joinedRider._id !== this.user._id ) {
          joinedRider = new User(joinedRider);
          joinedRider.zIndex = this.zCounter++;
          if ( joinedRider.leader ) joinedRider.zIndex += 500;
          this.riderListPromise().then((riderList: Array<User>) => {
            // console.log("riderList before adding the joined rider:", riderList);
            riderList = riderList.filter(rider => rider._id !== joinedRider._id);
            riderList.push(joinedRider);
            // console.log("Updated riderList:", riderList);
            this.riderList$.next(riderList);
          });
        }
      }
    });
  }

  listenForRemovedRider() {
    this.socket.on('removedRider', _id => {
      console.log('removedRider');
      let riders = this.riderList$.value.filter(rider => rider._id !== _id);

      // This will be used to set the map bounds.
      this.riderList$.next(riders);
    });
  }

  listenForRiderList() {
    this.socket.on('riderList', riderList => {
      console.log('riderList:', riderList);
      riderList = riderList.map(rider => new User(rider));
      riderList = riderList.filter(rider => rider._id !== this.user._id);
      riderList = this.setZIndexAndOpacity(riderList);
      this.riderList$.next(riderList);
    });
  }

  requestRiderList() {
    Promise.all([this.socketService.socketPromise(), this.rideSubjectService.ridePromise()]).then(values => {
      let ride = values[1];
      console.log("About to emit giveMeRiderList for ride:", ride);
      this.socket.emit('giveMeRiderList', ride);
    });

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

  setZIndexAndOpacity(riders) {
    riders = riders.map(rider => {
      rider.zIndex = this.zCounter++;
      if ( rider.leader ) rider.zIndex = rider.zIndex + 500;
      if ( rider.disconnected ) rider.zIndex = rider.zIndex * -1;

      return rider;
    });

    return riders;
  }

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

}