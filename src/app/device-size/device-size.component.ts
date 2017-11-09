import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { getBootstrapDeviceSize } from '../_lib/util';

@Component({
  selector: 'rp-device-size',
  templateUrl: './device-size.component.html',
  styleUrls: ['./device-size.component.scss']
})
export class DeviceSizeComponent implements OnInit, OnDestroy {
  bootstrapSize: string;
  innerHeight: number;
  innerWidth: number;

  constructor(private settingsService: SettingsService) {
  };

  ngOnInit() {
    this.getSize();
    window.addEventListener('resize', this.getSize);
  }

  // I can't use an arrow function here, because I need to bind "this."
  getSize = function () {
    this.bootstrapSize = getBootstrapDeviceSize();
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
  }.bind(this);

  ngOnDestroy() {
    window.removeEventListener('resize', this.getSize);
  }
}
