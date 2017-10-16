

//



// @Injectable()
// export class SettingsService {
//   settings$: BehaviorSubject<object> = new BehaviorSubject(null);
//   dummyPos$: BehaviorSubject<string> = new BehaviorSubject(null);
//   dummyPosAddLat$: BehaviorSubject<number> = new BehaviorSubject(null);
//   dummyPosAddLng$: BehaviorSubject<number> = new BehaviorSubject(null);
//   dummyMov$: BehaviorSubject<string> = new BehaviorSubject(null);
//   dummyMovIncLat$: BehaviorSubject<string> = new BehaviorSubject(null);
//   dummyMovIncLng$: BehaviorSubject<string> = new BehaviorSubject(null);
//   dummyUpdateFreq$: BehaviorSubject<number> = new BehaviorSubject(null);
//   dummyPosAddMin$: BehaviorSubject<number> = new BehaviorSubject(null);
//   dummyPosAddMax$: BehaviorSubject<number> = new BehaviorSubject(null);
//   dummyMovIncMin$: BehaviorSubject<number> = new BehaviorSubject(null);
//   dummyMovIncMax$: BehaviorSubject<number> = new BehaviorSubject(null);
//   removeLongDisconnectedRider$: BehaviorSubject<number> = new BehaviorSubject(null);
//   fadeNav$: BehaviorSubject<number> = new BehaviorSubject(null);
//   refreshMapPage$: BehaviorSubject<number> = new BehaviorSubject(null);
//   refreshOnNavigationAfter$: BehaviorSubject<number> = new BehaviorSubject(null);
//   storage$: BehaviorSubject<number> = new BehaviorSubject(null);
//
//   constructor() {
//     const rpSettings = localStorage.getItem('rpSettings');
//
//     let settings: Settings;
//
//     if ( rpSettings === null ) {
//       let settings = new Settings(null);
//       console.log("newly created settings:", settings);
//
//
//       this.settings$.next(settings);
//
//       this.settings$.next(new Settings(settings));
//       for (let prop in settings) {
//         let obs = `${prop}$`;
//         if (this[obs]) this[obs].next(settings[prop]);
//       }
//     } else {
//       let settings = JSON.parse(rpSettings);
//     }
//
//     this.settings$.next(new Settings(settings));
//     for (let prop in settings) {
//       let obs = `${prop}$`;
//       if (this[obs]) this[obs].next(settings[prop]);
//     }
//
//
//   }
// }
