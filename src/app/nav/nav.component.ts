import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MiscService } from '../shared/misc.service';
import { User } from '../user/user';
import * as $ from 'jquery';

import { UserService } from '../user/user.service';
import { navAnimations } from './nav.component.animations';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
      this.navBarState = navBarState;
    });
  }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }

}
