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
import { WindowRefService } from '../_services/window-ref.service'

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

  // private Hammer: Hammer = Hammer;


  // public focusedOnUser: boolean = true;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'gray', 'white', 'red', 'brown', 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'yellow' ];

  private socket: Socket;
  public debugMessages: Array<string> = [];

  private timer: Array<any> = [];
  private timer2: any;
  public navBarStateTimer: any;

  public minutes: Array<number> = [];


  @ViewChildren('markers') markers;
  @ViewChildren('infoWindows') infoWindows;
  @ViewChild('sebmGoogleMap') sebmGoogleMap;
  // @ViewChild('window') window;

  constructor(private statusService: StatusService,
              private mapsAPILoader: MapsAPILoader,
              private windowRefService: WindowRefService) {
    this
        .socket = this.statusService.socket;

  }

  ngOnInit() {
    this.watchUser();
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.focusOnUser();
      this.watchRiders();
      this.removeLongDisconnectedRiders();
    });
  }

  touch(idx, ev) {
    console.log('touch:', ev, idx);
  }

  closeInfoWindows(riderId) {
    // This actually works. Apparently, this executes, closing any open infoWindow, before a new one is opened.
    this.infoWindows.forEach(infoWindow => infoWindow.close());

    // If the above hadn't worked, this is how I would have done it.
    // this.infoWindows.forEach(infoWindow => {
    //   if (infoWindow._el.nativeElement.attributes['data-index'] !== riderId) infoWindow.close();
    // });
  }

  watchUser() {
    this.userSub = this.statusService.user$.subscribe(user => {
      this.fullName = user ? user.fullName : null;
    });
  }

  watchRiders() {
    this.riderSub = this.statusService.riders$
        .subscribe(riders => {
          riders = this.setMarkerColor(riders);
          riders = this.trackDisconnectedTime(riders);
          this.riders = riders;
        });
  }

// When the nav bar becomes shown, set a timer to hide it again -- but only if the accordion is closed.
  watchNavBarState() {
    this.navBarStateSub = this.statusService.navBarState$.subscribe(navBarState => {
      setTimeout(() => { // Have to wait one tick before checking the value of the aria-expanded attribute.
        let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true'; // Turns string into boolean.
        if ( navBarState === 'show' && !ariaExpanded ) {
          this.navBarStateTimer = setTimeout(() => {
            this.statusService.navBarState$.next('hide');
          }, 150);
        }
      }, 0);
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

  fitAllRiders() {
    // this.focusedOnUser = false;
    this.bounds = new this.google.maps.LatLngBounds();
    this.riders.forEach(rider => {
      if ( rider.lat && rider.lng ) this.bounds.extend({ lat: rider.lat, lng: rider.lng });
    });
    this.latLng = this.bounds.toJSON();
  }

  focusOnUser() {
    // this.focusedOnUser = true;
    this.bounds = new this.google.maps.LatLngBounds();
    this.coordsSub = this.statusService.coords$.subscribe(coords => {
          if ( coords ) {
            if ( this.navBarStateSub ) this.navBarStateSub.unsubscribe();
            this.watchNavBarState();
            this.statusService.navBarState$.next('hide');
            this.bounds.extend({ lat: coords.lat, lng: coords.lng });
            this.latLng = this.bounds.toJSON();
          }
        },
        err => {
          // This seems never to be executed, even if navigator.geolocation.watchPosition() times out.
          console.log("MapComponent.focusOnUser(). coords$ didn't deliver coords, probably because navigator.geolocation.watchPosition() timed out. err: ", err);
        });
    setTimeout(() => {  // Todo: This is a highly unsatisfactory workaround.
      this.coordsSub.unsubscribe();
    }, 15000);
  }

  log(message) {
    console.log(message);
    this.statusService.debugMessages$.next(message);
  }

  ngOnDestroy() {
    this.riderSub.unsubscribe();
    this.userSub.unsubscribe();
    this.coordsSub.unsubscribe();
    this.navBarStateSub.unsubscribe();
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

