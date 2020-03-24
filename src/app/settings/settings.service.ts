import { Injectable } from '@angular/core';

import { Settings } from './settings';

@Injectable()
export class SettingsService {
  api: string;
  demoMode: boolean;
  dummyPos: boolean;
  dummyPosAddLat: number;
  dummyPosAddLng: number;
  dummyMov: boolean;
  dummyMovIncLat: number;
  dummyMovIncLng: number;
  dummyUpdateFreq: number;
  removeLongDisconnectedRider: number;
  fadeNav: number;
  refreshMapPage: number;
  refreshOnNavigationAfter: number;
  settings: Settings;
  showBootstrapSize: boolean;
  storage: string;

  constructor() {

    const rpSettings = JSON.parse(localStorage.getItem('rpSettings'));

    let settings = rpSettings === null ? new Settings({}) : new Settings(rpSettings);

    if (window.location.host === 'ride-planner.herokuapp.com') {
      this.api = 'https://ride-planner-backend.herokuapp.com';
      this.demoMode =  false;
    }

    if (window.location.host === 'ride-planner-demo.herokuapp.com') {
      this.api = 'https://ride-planner-demo-backend.herokuapp.com';
      this.demoMode = true;
    }

    if (window.location.host === 'localhost:3050') {
      this.api = 'http://localhost:3051';
      this.demoMode = settings.demoMode === 'yes';
    }

    this.dummyPos = settings.dummyPos === 'yes';
    this.dummyPosAddLat = settings.dummyPosAdd;
    this.dummyPosAddLng = settings.dummyPosAdd;
    this.dummyMov = settings.dummyMov === 'yes';
    this.dummyMovIncLat = settings.dummyMovInc;
    this.dummyMovIncLng = settings.dummyMovInc;
    this.dummyUpdateFreq = settings.dummyUpdateFreq;
    this.removeLongDisconnectedRider = settings.removeLongDisconnectedRiders;
    this.fadeNav = settings.fadeNav;
    this.refreshMapPage = settings.refreshMapPage;
    this.refreshOnNavigationAfter = settings.refreshOnNavigationAfter;
    this.showBootstrapSize = settings.bootstrapScreenSize === 'yes';
    this.storage = settings.storage;

    this.settings = settings; // Todo: Okay to copy by reference?
  }
}