import { Component, OnInit } from '@angular/core';
import { StatusService } from '../_services/status.service';
import Socket = SocketIOClient.Socket;
import { User } from '../_models/user';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: [ './debugger.component.scss' ]
})
export class DebuggerComponent implements OnInit {
  private user: User;
  private socket: Socket;
  public debugMessages: Array<any> = [];
  public time;

  constructor(private statusService: StatusService) {
    this.socket = statusService.socket;
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
      console.log(message);
      this.debugMessages.push(message);
    });
  }

  clearMessageList() {
    this.debugMessages = [];
  }

}
