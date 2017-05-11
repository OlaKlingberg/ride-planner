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

  constructor(private statusService: StatusService) {
    this.socket = statusService.socket;
  }

  ngOnInit() {
    this.listenForDebugMessages();
  }

  listenForDebugMessages() {
    this.socket.on('debugging', message => {
        this.debugMessages.push(message);
    });
  }

  clearMessageList() {
    this.debugMessages = [];
  }

}
