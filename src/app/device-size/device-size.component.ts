import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { DeviceSizeService } from './device-size.service';

@Component({
  selector: 'rp-device-size',
  templateUrl: './device-size.component.html',
  styleUrls: ['./device-size.component.scss']
})
export class DeviceSizeComponent implements OnInit {
  bootstrapSize: string;
  innerHeight: number;
  innerWidth: number;
  temporarilyHide: boolean = false;
  showBootstrapSize: boolean = false;

  constructor(private deviceSizeService: DeviceSizeService,
              private settingsService: SettingsService) {
    this.showBootstrapSize = settingsService.showBootstrapSize;
    this.temporarilyHide = deviceSizeService.temporarilyHide$.value;
  };

  ngOnInit() {
    this.subscribeToBootstrapSize();
    this.subscribeToHeight();
    this.subscribeToTemporarilyHide();
    this.subscribeToWidth();
  }

  hide() {
    this.deviceSizeService.temporarilyHide$.next(true);
  }

  subscribeToBootstrapSize() {
    this.deviceSizeService.bootstrapSize$.subscribe(bootstrapSize => {
      this.bootstrapSize = bootstrapSize;
    });
  };

  subscribeToHeight() {
    this.deviceSizeService.innerHeight$.subscribe(innerHeight => {
      this.innerHeight = innerHeight;
    })
  }

  subscribeToTemporarilyHide() {
    this.deviceSizeService.temporarilyHide$.subscribe(temporarilyHide => {
      this.temporarilyHide = temporarilyHide;
    })
  }

  subscribeToWidth() {
    this.deviceSizeService.innerWidth$.subscribe(innerWidth => {
      this.innerWidth = innerWidth;
    })
  }
}
