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
    console.log("DebuggingService.watchForDebugMessages()");
    this.statusService.debugMessages$.subscribe(debugInfo => {
      console.log("DebuggingService.watchForDebugMessages() debugInfo", debugInfo,);
      if (debugInfo.message) {
        this.socket.emit('debugging', debugInfo.message);
      } else {
        this.socket.emit('debugging', debugInfo);}
    });
  }
}
