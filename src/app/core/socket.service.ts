import { Injectable } from '@angular/core';

import Socket = SocketIOClient.Socket;

import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {
  socket: Socket;

  constructor() {
    // this.onAvailableRides();
    // this.onDebugging();
    // this.onDisconnectedRider();
    // this.onJoinedRider();
    // this.onRemovedRider();
    // this.onRiderList();
    // this.onSocketConnection();
    // this.onUpdateRiderPosition();
    this.socket = io(environment.api);  // io is made available through import into index.html.
  }

  // onAvailableRides() {
  //   this.socket.on('availableRides', availableRides => {
  //
  //   })
  // }
  //
  // onDebugging() {
  //
  // }
  //
  // onDisconnectedRider() {
  //
  // }
  //
  // onJoinedRider() {
  //
  // }
  //
  // onRemovedRider() {
  //
  // }
  //
  // onRiderList() {
  //
  // }
  //
  // onSocketConnection() {
  //
  // }
  //
  // onUpdateRiderPosition() {
  //
  // }

  socketPromise() {
    let socketPromise = new Promise((resolve, reject) => {
      if (this.socket.connected) {
        resolve(true);
      } else {
        this.socket.on('socketConnection', () => {
          resolve(true);
        });
      }
    });

    return socketPromise;
  }
}
