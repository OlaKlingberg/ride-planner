import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';

import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { MapsAPILoader } from 'angular2-google-maps/core';
import Socket = SocketIOClient.Socket;
import Timer = NodeJS.Timer;
import * as $ from 'jquery'
import * as _ from 'lodash';

import { MapAnimations } from './map.component.animatins';
import { NavService } from '../nav/nav.service';
import { PositionService } from '../core/position.service';
import { RideSubjectService } from '../ride/ride-subject.service';
import { SocketService } from '../core/socket.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { RefreshService } from '../core/refresh.service';
import { MapService } from './map.service';

@Component({
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  animations: MapAnimations
})
export class MapComponent implements OnInit, OnDestroy {
  buttonState: string = 'show';
  colors: Array<string> = [ 'gray', 'red', 'white', 'orange', 'brown', 'blue', 'green', 'lightblue', 'pink', 'purple', 'yellow' ];
  latLng: LatLngBoundsLiteral;
  mapMode: 'focusOnUser' | 'showAllRiders' | 'stationary' = 'focusOnUser';
  markerUrl: string = "assets/img/rider-markers/";
  maxZoom: number = 18;
  riderList: Array<User> = [];
  user: User = null;

  private bounds: LatLngBounds;
  private google: any;
  private hideTimer: Timer;
  private socket: Socket;
  private subscriptions: any = {};
  private timer: any;

  @ViewChild('sebmGoogleMap') sebmGoogleMap;

  @ViewChildren('infoWindows') infoWindows;
  @ViewChildren('markers') markers;
  @ViewChildren('userInfoWindow') userInfoWindow;

  constructor(private mapsAPILoader: MapsAPILoader,
              private mapService: MapService,
              private navService: NavService,
              private positionService: PositionService,
              private socketService: SocketService,
              private refreshService: RefreshService,
              private rideSubjectService: RideSubjectService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.getRiderList();
    this.hideNav();
    // this.listenForSocketConnection();
    this.listenForUpdatedRiderPosition();
    this.loadMapsAPILoader();
    this.positionService.getPosition();
    // this.refresh();
    this.removeLongDisconnectedRiders();
    // this.requestRiderList();
    this.subscribeToUser();
  }


  closeInfoWindows(_id) {
    // This actually works. Apparently, this executes, closing any open infoWindow, before a new one is opened.
    this.infoWindows.forEach(infoWindow => infoWindow.close());
    this.userInfoWindow.forEach(userInfoWindow => userInfoWindow.close());

    // If the above hadn't worked, this is how I would have done it.
    // this.infoWindows.forEach(infoWindow => {
    //   if (infoWindow._el.nativeElement.attributes['data-index'] !== _id) infoWindow.close();
    // });
  }

  focusOnUser() {
    if ( this.subscriptions.positionSub ) this.subscriptions.positionSub.unsubscribe();
      this.subscriptions.positionSub = this.positionService.position$.subscribe(position => {
          if ( position ) {
            this.bounds = new this.google.maps.LatLngBounds();
            this.bounds.extend({ lat: position.coords.latitude, lng: position.coords.longitude });
            this.latLng = this.bounds.toJSON();
          }
        },
        err => {
          // This seems never to be executed, even if navigator.geolocation.watchPosition() times out.
          console.log("MapComponent.trackUser(). coords$ didn't deliver coords, probably because navigator.geolocation.watchPosition() timed out. err: ", err);
        });
  }

  getRiderList() {
    this.mapService.riderList$.subscribe(riderList => {
      this.riderList = riderList;
    });
  }

  hideNav() {
    clearTimeout(this.hideTimer);
    // Wait till the map is shown (which happens when there is a position), set timer for 4s, check that the accordion is not expanded. If it's not, hide the navbar.
    this.positionService.positionPromise().then(() => {
      this.hideTimer = setTimeout(() => {
        let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true'; // Turns string into boolean.
        if ( !ariaExpanded ) {
          this.navService.navBarState$.next('hide');
          this.buttonState = 'hide';
        }
      }, 4000);
    });
  }

  // listenForSocketConnection() {
  //   this.socket.on('socketConnection', () => this.requestRiderList());
  // }

  listenForUpdatedRiderPosition() {
    this.socket.on('updatedRiderPosition', updatedRider => {
      let idx = _.findIndex(this.riderList, rider => rider._id === updatedRider._id);
      if ( idx >= 0 ) {
        this.riderList[ idx ].position.timestamp = updatedRider.position.timestamp;
        this.riderList[ idx ].position.coords.accuracy = updatedRider.position.coords.accuracy;
        this.riderList[ idx ].position.coords.latitude = updatedRider.position.coords.latitude;
        this.riderList[ idx ].position.coords.longitude = updatedRider.position.coords.longitude;

        this.mapService.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
      }
    });
  }

  loadMapsAPILoader() {
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.focusOnUser();
    });
  }

  refresh() {
    setTimeout(() => {
      this.refreshService.refresh();
    }, 10000);
  }

  removeLongDisconnectedRiders() {
    this.timer = setInterval(() => {
      this.riderList = _.filter(this.riderList, rider => {
        // Todo: Use an environment variable for the time? Or a variable that can be set through a UI?
        return !rider.disconnected || (Date.now() - rider.disconnected) < 1800000;
      });

      this.mapService.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
    }, 10000);
  }

  setMapMode(mapMode) {
    if ( this.subscriptions.positionSub ) this.subscriptions.positionSub.unsubscribe();
    if ( this.subscriptions.riderListSub ) this.subscriptions.riderListSub.unsubscribe();

    this.mapMode = mapMode;

    switch ( mapMode ) {
      case 'focusOnUser':
        this.focusOnUser();
        break;
      case 'showAllRiders':
        this.showAllRiders();
        break;
      default:
        break;
    }
  }

  showAllRiders() {
      if ( !this.riderList || this.riderList.length < 0 ) return;
      this.bounds = new this.google.maps.LatLngBounds();
      console.log("showAllRiders(). riderList:", this.riderList);

      this.riderList.forEach(rider => {
        this.bounds.extend({ lat: rider.position.coords.latitude, lng: rider.position.coords.longitude });
      });
      this.bounds.extend({ lat: this.user.position.coords.latitude, lng: this.user.position.coords.longitude });
      this.latLng = this.bounds.toJSON();
      // Add 10% to the map at the upper edge for what is covered by the phone-browser address bar.
      this.latLng.north += (this.latLng.north - this.latLng.south) / 10;
  }

  showNav() {
    this.navService.navBarState$.next('show');
    this.buttonState = 'show';
  }

  subscribeToUser() {
    this.subscriptions.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    // Todo: Add the subscriptions to an array, which I can loop through here.
    clearTimeout(this.hideTimer);
    this.navService.navBarState$.next('show');

    for (let key in this.subscriptions) {
      if (this.subscriptions[key]) this.subscriptions[key].unsubscribe();
    }

    this.socket.removeAllListeners();
    clearInterval(this.timer);

    // Attempt to ameliorate memory leak.
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
    google.maps.event.clearInstanceListeners(this.sebmGoogleMap);
    google.maps.event.clearInstanceListeners(this.markers);
    google.maps.event.clearInstanceListeners(this.infoWindows);
  }

}
