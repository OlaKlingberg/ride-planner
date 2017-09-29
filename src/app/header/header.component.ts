import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../user/user.service';
import { PositionService } from '../core/position.service';
import { User } from '../user/user';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'rp-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
  accuracy: number = null;
  displayHeader: boolean;
  latitude: number = null;
  longitude: number = null;
  ride: string;
  title: string = 'RidePlanner';
  user: User = null;

  constructor(public location: Location,
              private positionService: PositionService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToPosition();
    this.subscribeToUser();

    this.router.events.subscribe(event => {
      if ( event instanceof NavigationEnd ) {
        this.checkDisplayHeader();
      }
    });
  }

  checkDisplayHeader() {
    if ( this.location.path().includes('/frame') ||
        this.location.path().includes('/map') ||
        ( this.location.path().includes('/cuesheet/') && this.location.path().includes('/bike/')) ) return this.displayHeader = false;

    // if (this.location.path().includes('/map')) return this.displayHeader = false;

    // if (this.location.path().includes('/cuesheet/') && this.location.path().includes('/bike/')) return this.displayHeader = false;

    this.displayHeader = true;
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
