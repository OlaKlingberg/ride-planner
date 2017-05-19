import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';

import { StatusService } from '../_services/status.service';
import { Rider } from '../_models/rider';
import { MapsAPILoader } from 'angular2-google-maps/core';
import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { Subscription } from 'rxjs/Subscription';
import Socket = SocketIOClient.Socket;
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'rp-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit, OnDestroy {
  private fullName: string = '';
  public maxZoom: number = 18;
  public riders: Array<Rider> = [];

  private google: any;
  private bounds: LatLngBounds;
  public latLng: LatLngBoundsLiteral;

  private riderSub: Subscription;
  private userSub: Subscription;
  private coordsSub: Subscription;
  private navBarStateSub: Subscription;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'gray', 'white', 'red', 'brown', 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'yellow' ];

  private socket: Socket;
  public debugMessages: Array<string> = [];

  private timer: Array<any> = [];
  private timer2: any;
  public navBarStateTimer: any;

  public minutes: Array<number> = [];

  public mapMode: 'trackUser' | 'trackAllRiders' | 'stationary' = 'trackAllRiders';


  @ViewChildren('markers') markers;
  @ViewChildren('infoWindows') infoWindows;
  @ViewChild('sebmGoogleMap') sebmGoogleMap;

  constructor(private statusService: StatusService,
              private mapsAPILoader: MapsAPILoader) {
    this.socket = this.statusService.socket;

  }

  ngOnInit() {
    this.subscribeToUser();
    this.subscribeToNavBarState();
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.trackUser();
      this.subscribeToRiders();
      this.removeLongDisconnectedRiders();
    });
  }

  // touch(ev) {
  //   this.statusService.debugMessages$.next(`touch: ${ev}`);
  // }

  closeInfoWindows(riderId) {
    // This actually works. Apparently, this executes, closing any open infoWindow, before a new one is opened.
    this.infoWindows.forEach(infoWindow => infoWindow.close());

    // If the above hadn't worked, this is how I would have done it.
    // this.infoWindows.forEach(infoWindow => {
    //   if (infoWindow._el.nativeElement.attributes['data-index'] !== riderId) infoWindow.close();
    // });
  }

  subscribeToUser() {
    this.userSub = this.statusService.user$.subscribe(user => {
      this.fullName = user ? user.fullName : null;
    });
  }

  subscribeToRiders() {
    this.riderSub = this.statusService.riders$
        .subscribe(riders => {
          riders = this.setMarkerColor(riders);
          riders = this.trackDisconnectedTime(riders);
          this.riders = riders;
          if ( this.mapMode === 'trackAllRiders' ) this.trackAllRiders();
        });
  }

// When the nav bar becomes shown, set a timer to hide it again -- but only if the accordion is closed.
  subscribeToNavBarState() {
    this.statusService.navBarState$.subscribe(navBarState => {
      console.log("Independent subscription of navBarState:", navBarState);
    });

    this.navBarStateSub = this.statusService.navBarState$
        .combineLatest(this.statusService.coords$)
        .subscribe(([ navBarState, coords ]) => {
          // Start the timer to hide the nav bar only when the map is shown, which happens when there are coords.
          if ( coords ) {
            setTimeout(() => { // Have to wait one tick before checking the value of the aria-expanded attribute.
              let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true'; // Turns string into boolean.
              if ( navBarState === 'show' && !ariaExpanded ) {
                this.navBarStateTimer = setTimeout(() => {
                  this.statusService.navBarState$.next('hide');
                }, 150);
              }
            }, 0);
          }


        });
  }

  removeLongDisconnectedRiders() {
    this.timer2 = setInterval(() => {
      this.riders = _.filter(this.riders, (rider) => { // Todo: Use an environment variable? Or a variable that can be set through a UI?
        return !rider.disconnected || (Date.now() - rider.disconnectTime) < 1800000;
      });
    }, 30000);
  }

  setMarkerColor(riders) {
    let user = this.statusService.user$.value;
    riders = riders.map(rider => {
      rider.color = rider.colorNumber + 3;
      rider.zInd = rider.zIndex;

      // Disconnected rider
      if ( rider.disconnected ) {
        rider.color = 0;
        rider.opacity = .5;
        rider.zInd = 0 - rider.zIndex;
      }

      // Ride leader
      if ( rider.leader === true ) {
        rider.color = 2;
        rider.zInd = rider.zIndex + 1000;
      }

      // The user's own marker
      if ( user && user._id === rider._id ) {
        rider.color = 1;
        rider.zInd = rider.zIndex + 2000;
      }

      return rider;
    });
    return riders;
  }

  trackDisconnectedTime(riders) {
    riders.forEach(rider => {
      // console.log(`${rider.fname} ${rider.lname}. zInd:, ${rider.zInd}`);
      if ( rider.disconnected ) {
        clearInterval(this.timer[ rider._id ]);
        this.timer[ rider._id ] = setInterval(() => {
          // Todo: Show seconds up to a minute, and then minutes.
          this.minutes[ rider._id ] = Math.round((Date.now() - rider.disconnectTime) / 1000);
          // console.log(this.minutes[ rider._id ]);
        }, 1000);
      } else {
        this.minutes[ rider._id ] = 0;
        // console.log("About to clear timer:", this.timer[ rider._id ]);
        clearInterval(this.timer[ rider._id ]);
      }
    });

    return riders;
  }

  setMapMode(mapMode) {
    this.mapMode = mapMode;
    switch ( mapMode ) {
      case 'trackAllRiders':
        this.trackAllRiders();
        break;
      case 'trackUser':
        this.trackUser();
        break;
      case 'stationary':
        if (this.coordsSub) this.coordsSub.unsubscribe();
        break;
      default:
        // Todo: Do I need to handle this? This will never be reached if things work correctly.
        break;
    }
  }

  trackAllRiders() {
    this.bounds = new this.google.maps.LatLngBounds();
    this.riders.forEach(rider => {
      if ( rider.lat && rider.lng ) this.bounds.extend({ lat: rider.lat, lng: rider.lng });
    });
    this.latLng = this.bounds.toJSON();
  }

  // Sets the map to the user's location. Doesn't assure that there will be a rider marker for the user.
  trackUser() {
    this.bounds = new this.google.maps.LatLngBounds();
    if ( this.coordsSub ) this.coordsSub.unsubscribe();
    this.coordsSub = this.statusService.coords$.subscribe(coords => {
          if ( coords ) {
            this.bounds.extend({ lat: coords.lat, lng: coords.lng });
            this.latLng = this.bounds.toJSON();
          }
        },
        err => {
          // This seems never to be executed, even if navigator.geolocation.watchPosition() times out.
          console.log("MapComponent.trackUser(). coords$ didn't deliver coords, probably because navigator.geolocation.watchPosition() timed out. err: ", err);
        });
  }

  ngOnDestroy() {
    if ( this.riderSub ) this.riderSub.unsubscribe();
    if ( this.userSub ) this.userSub.unsubscribe();
    if ( this.coordsSub ) this.coordsSub.unsubscribe();
    if ( this.navBarStateSub ) this.navBarStateSub.unsubscribe();
    this.riders.forEach(rider => clearInterval(this.timer[ rider._id ]));
    clearInterval(this.timer2);
    clearTimeout(this.navBarStateTimer);
    setTimeout(() => {
      this.statusService.navBarState$.next('show');
    }, 200);

    // Attempt to ameliorate memory leak.
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
    google.maps.event.clearInstanceListeners(this.sebmGoogleMap);
    google.maps.event.clearInstanceListeners(this.markers);
    google.maps.event.clearInstanceListeners(this.infoWindows);

  }


}

