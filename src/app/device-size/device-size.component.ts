import { Component } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { DeviceSizeService } from './device-size.service';

@Component({
  selector: 'rp-device-size',
  templateUrl: './device-size.component.html',
  styleUrls: ['./device-size.component.scss']
})
export class DeviceSizeComponent {
  temporarilyHide: boolean = false;
  showBootstrapSize: boolean = false;

  constructor(private deviceSizeService: DeviceSizeService,
              private settingsService: SettingsService) {
    this.showBootstrapSize = settingsService.showBootstrapSize;
    this.temporarilyHide = deviceSizeService.temporarilyHide;
  };

  hide() {
    this.deviceSizeService.temporarilyHide = true;
  }

}
