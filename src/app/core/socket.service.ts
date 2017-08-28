import { Injectable } from '@angular/core';

import Socket = SocketIOClient.Socket;

import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io(environment.api);  // io is made available through import into index.html.
  }
}
