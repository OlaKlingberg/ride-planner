import { Component, OnInit } from '@angular/core';

import { AlertService } from '../alert/alert.service';
import { environment } from '../../environments/environment'
import { Settings } from './settings';
import { SettingsService } from './settings.service';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
})
export class SettingsComponent implements OnInit {
  currentStorage: string;
  production: boolean = true;
  settings: Settings;
  showRefreshButton: boolean = false;

  constructor(private alertService: AlertService,
              private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.production = environment.production;
    this.settings = new Settings(this.settingsService.settings);
    this.currentStorage = this.settings.storage;
  }

  cancel() {
    setTimeout(() => {
      this.settings = new Settings(this.settingsService.settings);
    }, 0);
  }

  refresh() {
    window.location.reload();
  }

  save() {
    if ( this.settings.dummyUpdateFreq < .5 ) this.settings.dummyUpdateFreq = .5;

    if ( this.settings.storage !== this.currentStorage ) {
      const keys = [ 'rpCuesheets', 'rpDemoMode', 'rpLatLng', 'rpMapMode', 'rpRefreshFlag', 'rpRide', 'rpToken', 'rpUser' ];

      keys.forEach(key => {
        const value = eval(this.currentStorage).getItem(key);
        eval(this.currentStorage).removeItem(key);
        if ( value !== null && value !== 'null' ) eval(this.settings.storage).setItem(key, value);
      });
    }

    localStorage.setItem('rpSettings', JSON.stringify(this.settings));

    this.alertService.success("Settings have been saved – but you must refresh the browser for them to take effect.", false);

    this.showRefreshButton = true;
  }
}
