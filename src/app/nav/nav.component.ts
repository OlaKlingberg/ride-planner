import { Component, OnInit } from '@angular/core';
import { StatusService } from '../_services/status.service';
import { User } from '../_models/user';
import * as $ from 'jquery';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: [
    trigger('navBarState', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('show => hide', animate('500ms 2s')),
      transition('hide => show', animate('100ms'))
    ])
  ]
})
export class NavComponent implements OnInit {
  public user: User;
  public ride: string;
  public navBarState: string;

  constructor(private statusService: StatusService) {
  }

  ngOnInit() {
    this.watchUser();
    this.watchRide();
    this.watchNavBar();
  }

  watchUser() {
    this.statusService.user$.subscribe(
        user => this.user = user
    );
  }

  watchRide() {
    this.statusService.currentRide$.subscribe(
        ride => this.ride = ride
    );
  }

  watchNavBar() {
    this.statusService.navBarState$.subscribe(navBarState => {
      this.navBarState = navBarState;
    });
  }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
    // this.statusService.navBarState$.next('hide');
  }

  // Make the nav bar visible again, if it's been hidden (currently only used on the map page).
  showNavBar() {
    // console.log("showNavBar");
    this.statusService.navBarState$.next('show');
  }

}
