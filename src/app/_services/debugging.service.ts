import { Injectable } from '@angular/core';
import { StatusService } from './status.service';
import Socket = SocketIOClient.Socket;

@Injectable()
export class DebuggingService {
  private socket: Socket;

  constructor(private statusService: StatusService) {
    this.socket = this.statusService.socket;
    this.watchForDebugMessages();
  }

  watchForDebugMessages() {
    this.statusService.debugMessages$.subscribe(debugInfo => {
      if (debugInfo.message) {
        this.socket.emit('debugging', debugInfo.message);
      } else {
        this.socket.emit('debugging', debugInfo);}
    });
  }
}
