import { Injectable } from '@angular/core';

import Socket = SocketIOClient.Socket;

import { environment } from '../../environments/environment';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class SocketService {
  socket: Socket;

  constructor(private settingsService: SettingsService) {
    console.log("SocketService.constructor()");
    this.socket = io(settingsService.api);  // io is made available through import into index.html.

    // console.log("socket:", this.socket);
    // this.listenForConnection();
  }

  // listenForConnection() {
  //   this.socket.on('socketConnection', socketId => {
  //     console.log("socketId:", socketId);
  //   })
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
