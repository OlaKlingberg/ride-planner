import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';
import { Settings } from './settings';
import { UserService } from '../user/user.service';
import { User } from '../user/user';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
})
export class SettingsComponent implements OnInit {
  currentStorage: string;
  settings: Settings;
  showRefreshButton: boolean = false;

  constructor(private alertService: AlertService,
              private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.settings = new Settings(this.settingsService.settings$.value);
    this.currentStorage = this.settings.storage;
    // this.user = this.userService.user$.value;
  }

  cancel() {
    this.settings = new Settings(this.settingsService.settings$.value);
  }

  refresh() {
    window.location.reload();
  }

  save() {
    if ( this.settings.storage !== this.currentStorage ) {
      const keys = [ 'rpCuesheets', 'rpDemoMode', 'rpLatLng', 'rpMapMode', 'rpRefreshFlag', 'rpRide', 'rpToken', 'rpUser' ];

      keys.forEach(key => {
        const value = eval(this.currentStorage).getItem(key);
        eval(this.currentStorage).removeItem(key);
        if ( value !== null && value !== 'null' ) eval(this.settings.storage).setItem(key, value);
      });
    }

    localStorage.setItem('rpSettings', JSON.stringify(this.settings));

    this.alertService.success("Settings have been saved – but you must refresh the browser for them to take effect.", false)

    this.showRefreshButton = true;
  }
}
