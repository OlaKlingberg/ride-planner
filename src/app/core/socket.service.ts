import { Injectable } from '@angular/core';

import Socket = SocketIOClient.Socket;

import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io(environment.api);  // io is made available through import into index.html.
  }

  socketPromise() {
    let socketPromise = new Promise((resolve, reject) => {
      if (this.socket.connected) {
        console.log("Socket already connected, so will resolve socketPromise now.");
        resolve(true);
      } else {
        this.socket.on('socketConnection', () => {
          console.log("About to resolve socketPromise!");
          resolve(true);
        });
      }
    });

    return socketPromise;
  }
}
