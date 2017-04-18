import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import Socket = SocketIOClient.Socket;

@Component({
  selector: 'rp-socket',
  templateUrl: 'auction.component.html',
  styleUrls: ['auction.component.scss']
})
export class AuctionComponent implements OnInit {
  price: number = 0.0;
  socket: Socket;
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
