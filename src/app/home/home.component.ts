import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { SettingsService } from '../settings/settings.service';

import { getBootstrapDeviceSize } from '../_lib/util';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {
  deviceSize: string;
  demoMode: boolean;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.demoMode = this.settingsService.demoMode;

    this.setDeviceSize();
    window.addEventListener('resize', this.setDeviceSize);
  }

  // I can't use an arrow function here, because I need to bind "this."
  setDeviceSize = function () {
    this.deviceSize = getBootstrapDeviceSize();
  }.bind(this);

  ngOnDestroy() {
    window.removeEventListener('resize', this.setDeviceSize);
  }
}