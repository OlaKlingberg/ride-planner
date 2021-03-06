import { Component, OnInit } from '@angular/core';

import { PositionService } from '../core/position.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

@Component({
  selector: 'rp-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
  accuracy: number = null;
  display: boolean = false;
  latitude: number = null;
  longitude: number = null;
  ride: string;
  title: string = 'RidePlanner';
  user: User = null;

  constructor(private positionService: PositionService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToPosition();
    this.subscribeToUser();
  }

  subscribeToPosition() {
    this.positionService.position$.subscribe(position => {
      if ( position ) {
        setTimeout(() => {
          this.latitude = position.coords.latitude;
        }, 0);
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
      }
    });
  }

  subscribeToUser() {
    this.userService.user$.subscribe(user => {
      if ( user ) {
        this.ride = user.ride;
        this.user = new User(user);
      } else {
        this.ride = null;
        this.user = null;
      }
    });
  }

}
