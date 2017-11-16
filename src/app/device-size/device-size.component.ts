import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { DeviceSizeService } from './device-size.service';

@Component({
  selector: 'rp-device-size',
  templateUrl: './device-size.component.html',
  styleUrls: ['./device-size.component.scss']
})
export class DeviceSizeComponent implements OnInit, OnDestroy {
  // show: boolean = true;

  constructor(private deviceSizeService: DeviceSizeService, // Used in the template.
              private settingsService: SettingsService) {   // Used in the template.
  };

  ngOnInit() {
    console.log("showBootstrapSize:", this.settingsService.showBootstrapSize);
    console.log("show:", this.deviceSizeService.show);
  }

  hide() {
    this.deviceSizeService.show = false;
  }

  ngOnDestroy() {
  }
}
