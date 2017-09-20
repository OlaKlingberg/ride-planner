import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
import { User } from '../user/user';
import { SocketService } from '../core/socket.service';
import Socket = SocketIOClient.Socket;
import { UserService } from '../user/user.service';

@Injectable()
export class RiderService {
  riderList$: BehaviorSubject<User[]> = new BehaviorSubject(null);
  user: User = null;

  private socket: Socket;
  private zCounter: number = 0;

  constructor(private socketService: SocketService,
              private userService: UserService) {
    this.socket = socketService.socket;
    this.onDisconnectedRider();
    this.onJoinedRider();
    this.onRemovedRider();
    this.onRiderList();
    this.onUpdatedRiderPosition();
    this.subscribeToUser();
  }

  onDisconnectedRider() {
    this.socket.on('disconnectedRider', disconnectedRider => {
      console.log('disconnectedRider');
      this.riderListPromise().then((riderList: Array<User>) => {
        let idx = _.findIndex(riderList, rider => rider._id === disconnectedRider._id);
        if ( idx >= 0 ) {
          riderList[ idx ].disconnected = disconnectedRider.disconnected;
          // console.log("About to call riderList$.next() in onDisconnectedRider()");
          this.riderList$.next(riderList);
        }
      });
    });
  }

  onJoinedRider() {
    this.socket.on('joinedRider', joinedRider => {
      console.log('joinedRider:', joinedRider.fname, joinedRider.lname);
      // If the zIndices are getting too high, it's time to request the whole riderList again.
      if ( this.zCounter >= 1000 ) {
        this.zCounter = 0;
        console.log("Counter reached 1000! About to emit giveMeRiderList.");
        this.socket.emit('giveMeRiderList', this.user.ride);
      } else {
        // if ( joinedRider._id !== this.user._id ) {
        joinedRider = new User(joinedRider);
        // joinedRider.zIndex = this.zCounter++;
        // if ( joinedRider.leader ) joinedRider.zIndex += 500;
        this.riderListPromise().then((riderList: User[]) => {
          riderList = riderList.filter(rider => rider._id !== joinedRider._id); // Remove rider, if rider already exists.
          riderList.push(joinedRider);
          // console.log("About to call riderList$.next() in onJoinedRider()");
          this.riderList$.next(riderList);
          // console.log('joinedRider. riderList:', this.riderList$.value);
        });
        // }
      }
    });
  }

  onRemovedRider() {
    this.socket.on('removedRider', _id => {
      console.log('removedRider. riderList:', this.riderList$.value);
      let riders = this.riderList$.value.filter(rider => rider._id !== _id);

      // console.log("About to call riderList$.next() in onRemovedRider()");
      this.riderList$.next(riders);
    });
  }

  onRiderList() {
    this.socket.on('riderList', riderList => {
      // console.log('onRiderList. riderList:', riderList);
      riderList = riderList.map(rider => new User(rider));
      console.log("About to call riderList$.next() in onRiderList");
      this.riderList$.next(riderList);
    });
  }

  onUpdatedRiderPosition() {
    this.socket.on('updatedRiderPosition', updatedRider => {
      // console.log('updatedRiderPosition. riderList:', this.riderList$.value);
      let riderList = this.riderList$.value;
      let idx = _.findIndex(riderList, rider => rider._id === updatedRider._id);
      if ( idx >= 0 ) {
        riderList[ idx ].position.timestamp = updatedRider.position.timestamp;
        riderList[ idx ].position.coords.accuracy = updatedRider.position.coords.accuracy;
        riderList[ idx ].position.coords.latitude = updatedRider.position.coords.latitude;
        riderList[ idx ].position.coords.longitude = updatedRider.position.coords.longitude;

        // console.log("About to call riderList$.next() in onUpdatedRiderPosition(). riderList:", riderList);
        this.riderList$.next(riderList);
      }
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

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }
}
