import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MiscService } from '../_services/misc.service';
import { User } from '../_models/user';
import * as $ from 'jquery';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: [
    trigger('navBar', [
      state('show', style({
        opacity: 1,
        display: "block"
      })),
      state('hide', style({
        opacity: 0,
        display: "none"
      })),
      transition('show => hide', animate('500ms 4s')),
      transition('hide => show', animate('100ms'))
    ])
  ]
})
export class NavComponent implements OnInit {
  public user: User = null;
  public ride: string;
  public navBarState: string;

  constructor(private miscService: MiscService,
              private userService: UserService,
              public location: Location) {
  }

  ngOnInit() {
    this.subscribeToUser();
    this.subscribeToNavBarState();
  }

  subscribeToUser() {
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  subscribeToNavBarState() {
    this.miscService.navBarState$.subscribe(navBarState => {
      // if ( this.user ) console.log(`${this.user.fname} ${this.user.lname}. NavComponent.watchNavBar. navBarState: ${navBarState}`);
      this.navBarState = navBarState;
    });
  }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }

}
