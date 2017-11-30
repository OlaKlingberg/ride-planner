import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { getBootstrapDeviceSize } from '../_lib/util';
import { SettingsService } from '../settings/settings.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {
  demoMode: boolean;
  deviceSize: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.demoMode = this.settingsService.demoMode;
    this.setDeviceSize();
    window.addEventListener('resize', this.setDeviceSize);
  }

  setDeviceSize = function () {
    this.deviceSize = getBootstrapDeviceSize();
  }.bind(this);

  ngOnDestroy() {
    window.removeEventListener('resize', this.setDeviceSize);
  }
}