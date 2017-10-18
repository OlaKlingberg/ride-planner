import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { environment } from "../../environments/environment";

import { Settings } from './settings';

@Injectable()
export class SettingsService {
  demoMode$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  dummyPos$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  dummyPosAddLat$: BehaviorSubject<number> = new BehaviorSubject(null);
  dummyPosAddLng$: BehaviorSubject<number> = new BehaviorSubject(null);
  dummyMov$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  dummyMovIncLat$: BehaviorSubject<number> = new BehaviorSubject(null);
  dummyMovIncLng$: BehaviorSubject<number> = new BehaviorSubject(null);
  dummyUpdateFreq$: BehaviorSubject<number> = new BehaviorSubject(null);
  removeLongDisconnectedRider$: BehaviorSubject<number> = new BehaviorSubject(null);
  fadeNav$: BehaviorSubject<number> = new BehaviorSubject(null);
  refreshMapPage$: BehaviorSubject<number> = new BehaviorSubject(null);
  refreshOnNavigationAfter$: BehaviorSubject<number> = new BehaviorSubject(null);
  settings$: BehaviorSubject<object> = new BehaviorSubject(null);
  storage$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor() {
    const rpSettings = JSON.parse(localStorage.getItem('rpSettings'));

    let settings = rpSettings === null ? new Settings({}) : new Settings(rpSettings);

    // Todo: Remove this line when I have created another solution for setting demo/live mode than using an environment variable.
    settings.demoMode = environment.demoMode ? 'yes' : 'no';

    settings.demoMode === 'yes' ? this.dummyPos$.next(true) : false;
    settings.dummyPos === 'yes' ? this.dummyPos$.next(true) : false;
    this.dummyPosAddLat$.next(settings.dummyPosAdd);
    this.dummyPosAddLng$.next(settings.dummyPosAdd);
    settings.dummyMov === 'yes' ? this.dummyMov$.next(true) : false;
    this.dummyMovIncLat$.next(settings.dummyMovInc);
    this.dummyMovIncLng$.next(settings.dummyMovInc);
    this.dummyUpdateFreq$.next(settings.dummyUpdateFreq);
    this.removeLongDisconnectedRider$.next(settings.removeLongDisconnectedRiders);
    this.fadeNav$.next(settings.fadeNav);
    this.refreshMapPage$.next(settings.refreshMapPage);
    this.refreshOnNavigationAfter$.next(settings.refreshOnNavigationAfter);
    this.storage$.next(settings.storage);

    this.settings$.next(settings);
  }
}