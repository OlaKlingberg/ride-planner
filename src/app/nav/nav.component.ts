import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { navAnimations } from './nav.component.animations';
import { NavService } from './nav.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import * as $ from 'jquery';


@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: navAnimations
})
export class NavComponent implements OnInit {
  navBarState: string;
  user: User = null;
  ride: string;

  private route: string;

  constructor(private location: Location,               // Used in the template. Has to be initialized?
              private navService: NavService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToNavBarState();
    this.subscribeToRoute();
    this.subscribeToUser();
  }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }

  subscribeToNavBarState() {
    this.navService.navBarState$.subscribe(navBarState => {
      this.navBarState = navBarState;
    });
  }

  subscribeToRoute() {
    this.router.events.subscribe(() => {
      this.route = this.router.url;
      this.navBarState = 'show';
    });
  }

  subscribeToUser() {
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }
}
