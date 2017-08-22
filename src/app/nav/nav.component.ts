import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MiscService } from '../shared/misc.service';
import { User } from '../user/user';
import * as $ from 'jquery';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { UserService } from '../user/user.service';

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
      // transition('hide => show', animate('10ms'))
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
    // console.log("NavComponent. subscribeToUser()");
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  subscribeToNavBarState() {
    this.miscService.navBarState$.subscribe(navBarState => {
      this.navBarState = navBarState;
    });
  }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }

}
