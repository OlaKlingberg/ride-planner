import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { MiscService } from './misc.service';

import Socket = SocketIOClient.Socket;
import { AlertService } from './alert.service';

import * as _ from 'lodash';

import { nameSort } from '../_lib/util';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from './user.service';
import { DebuggingService } from './debugging.service';
import { User } from '../_models/user';

@Injectable()
export class RiderService {
  private socket: Socket;
  private LatDummyAddition: number;
  private LngDummyAddition: number;
  private userName: string = '';
  private prevPos: { lat: number, lng: number, acc: number } = { lat: null, lng: null, acc: null };
  private timer = null;
  private geoWatch = null;
  // public availableRides$: BehaviorSubject<Array<string>> = new BehaviorSubject(null);
  // public newRider$: Subject<User> = new Subject();
  // public updatedRider$: Subject<User> = new Subject();
  // public removedRider$: Subject<User> = new Subject();
  // public disconnectedRider$: Subject<User> = new Subject();

  // public riderList: Array<User>;


  constructor(private miscService: MiscService,
              private alertService: AlertService,
              private userService: UserService,
              private debuggingService: DebuggingService) {
    // this.socket = this.miscService.socket;
    // this.listenForAvailableRides();
    // this.joinOrLeaveRide();
    // this.subscribeToUser();
    // this.subscribeToCoords();
    // this.emitRemoveRider();
    // this.listenForRiderList();
    // this.listenForNewRider();
    // this.listenForUpdatedRiderPosition();
    // this.listenForRemovedRider();
    // this.listenForDisconnectedRider();
    // this.setDummyCoordAdjustments();

  }

  // listenForAvailableRides() {
  //   this.socket.on('availableRides', (rides) => {
  //     this.availableRides$.next(rides);
  //   });
  // }
  //
  // listenForRiderList() {
  //   this.socket.on('riderList', riderList => {
  //       this.riderList = riderList.map(rider => new User(rider)); // Riders are instances of User.
  //   });
  // }
  //
  // listenForNewRider() {
  //   this.socket.on('newRider', rider => {
  //     rider = new User(rider);
  //     this.newRider$.next(rider);
  //   });
  // }
  //
  // listenForUpdatedRiderPosition() {
  //   this.socket.on('updatedRiderPosition', riderPosition => {
  //     this.updatedRider$.next(riderPosition);
  //   });
  // }
  //
  // listenForRemovedRider() {
  //   this.socket.on('removedRider', rider => {
  //     this.removedRider$.next(rider);
  //   });
  // }
  //
  // listenForDisconnectedRider() {
  //   this.socket.on('disconnectedRider', (rider) => {
  //     this.disconnectedRider$.next(rider);
  //   });
  // }



  // joinOrLeaveRide() {
  //   this.currentRide$
  //   // .delay(100) // Todo: Not sure if this works. Kind of ugly, in any case.
  //       .withLatestFrom(this.userRider$)
  //       .subscribe(([ ride, userRider ]) => {
  //         console.log("ride:", ride);
  //         console.log("userRider:", userRider);
  //         if ( ride && userRider ) {
  //           this.joinRide(userRider);
  //         } else {
  //           this.leaveRide(userRider);
  //         }
  //       });
  // }

  // joinRide(userRider) {
  //   this.socket.emit('joinRide', userRider, () => {
  //     console.log("joinRide() userRider:", userRider);
  //     this.socket.emit('giveMeFullRiderList', userRider);
  //     this.emitUpdatedRider();
  //
  //   });
  // }

  // leaveRide(userRider) {
  //   this.socket.emit('leaveRide', userRider);
  // }

  // subscribeToUser() {
  //   this.userService.user$.subscribe(user => {
  //     this.userName = user ? user.fullName : null;
  //   });
  // }

  // emitUpdatedRider() {
  //   this.userRider$.subscribe(userRider => {
  //     if ( userRider ) this.socket.emit('updateRiderPosition', _.pick(userRider, '_id', 'token', 'lat', 'lng'));
  //   });
  // }

  // emitRemoveRider() {
  //   this.currentRide$
  //       .withLatestFrom(this.userService.user$)
  //       .subscribe(([ ride, user ]) => {
  //         this.socket.emit('removeRider', _.pick(user, '_id', 'token'));
  //       });
  // }





  // setDummyCoordAdjustments() {
  //   this.LatDummyAddition = Math.random() * .002 - .001;
  //   this.LngDummyAddition = Math.random() * .002 - .001;
  // }
  //
  // setDummyMovements() {
  //   let LatDummyMovement = Math.random() * .0004 - .0002;
  //   let LngDummyMovement = Math.random() * .0004 - .0002;
  //
  //   setTimeout(() => {
  //     setInterval(() => {
  //       let coords = this.coords$.value;
  //       coords.lat += LatDummyMovement;
  //       coords.lng += LngDummyMovement;
  //       this.coords$.next(coords);
  //     }, Math.random() * 6000 + 5000);
  //   }, 5000);
  // }
  //
  // getDummyCoords(coords) {
  //   coords.lat += this.LatDummyAddition;
  //   coords.lng += this.LngDummyAddition;
  //
  //   return coords;
  // }


}

