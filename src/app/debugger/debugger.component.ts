import { Component, OnDestroy, OnInit } from '@angular/core';
import Socket = SocketIOClient.Socket;
import { User } from '../user/user';
import { SocketService } from '../core/socket.service';

@Component({
  templateUrl: './debugger.component.html',
  styleUrls: [ './debugger.component.scss' ]
})
export class DebuggerComponent implements OnInit, OnDestroy {
  private user: User;
  private socket: Socket;
  public debugMessages: Array<any> = [];
  public time;

  constructor(private socketService: SocketService) {
    this.socket = socketService.socket;
  }

  ngOnInit() {
    this.listenForDebugMessages();
    this.clock();
  }

  clock() {
    setInterval(() => {
      this.time = new Date().toLocaleTimeString('en-US', { hour12: false })
    }, 1000);
  }

  listenForDebugMessages() {
    this.socket.on('debugging', message => {
      this.debugMessages.push(message);
    });
  }

  clearMessageList() {
    this.debugMessages = [];
  }

  ngOnDestroy() {
    this.socket.removeAllListeners();
  }
}
