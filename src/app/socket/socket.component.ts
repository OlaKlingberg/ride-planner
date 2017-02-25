import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ride-socket',
  templateUrl: 'socket.component.html',
  styleUrls: ['socket.component.scss']
})
export class SocketComponent implements OnInit {
  price: number = 0.0;
  socket = null;
  bidValue = '';

  constructor(){}

  ngOnInit() {
    this.socket = io(environment.api);  // io is made available through import into index.html.
    this.socket.on('priceUpdate', data => {
      this.price = data;
    });
  }

  bid(){
    this.socket.emit('bid', this.bidValue);
    this.bidValue = '';
  }

}
