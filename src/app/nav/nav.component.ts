import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { User } from '../user/user';
import * as $ from 'jquery';

import { UserService } from '../user/user.service';
import { navAnimations } from './nav.component.animations';
import { Router } from '@angular/router';
import { PositionService } from '../core/position.service';
import { NavService } from './nav.service';

@Component({
  selector: 'rp-nav',
  templateUrl: './nav.component.html',
  styleUrls: [ './nav.component.scss' ],
  animations: navAnimations
})
export class NavComponent implements OnInit {
  public user: User = null;
  public ride: string;
  public navBarState: string;

  private route: string;

  constructor(private location: Location,               // Used in the template. Has to be initialized?
              private router: Router,
              private navService: NavService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.subscribeToUser();
    this.subscribeToNavBarState();
    this.subscribeToRoute();
  }

  subscribeToRoute() {
    this.router.events.subscribe(() => {
      this.route = this.router.url;
      this.navBarState = 'show';
    });
  }

  subscribeToNavBarState() {
    this.navService.navBarState$.subscribe(navBarState => {
      this.navBarState = navBarState;
    });
  }

  subscribeToUser() {
    this.userService.user$.subscribe(
        user => this.user = user
    );
  }

  closeAccordion() {
    if ( $(window).width() < 768 ) $('.navbar-toggle').click();
  }


}
