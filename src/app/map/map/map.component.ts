import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';
import { Location } from '@angular/common';

import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { MapsAPILoader } from '@agm/core';
import Socket = SocketIOClient.Socket;
import { Subscription } from 'rxjs/Subscription';
import Timer = NodeJS.Timer;
import * as $ from 'jquery'
import * as Rx from 'rxjs';

import { MapAnimations } from './map.component.animatins';
import { NavService } from '../../nav/nav.service';
import { PositionService } from '../../core/position.service';
import { SocketService } from '../../core/socket.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { RefreshService } from '../../core/refresh.service';
import { environment } from '../../../environments/environment';
import { RiderService } from '../../rider/rider.service';

@Component({
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  animations: MapAnimations
})
export class MapComponent implements OnInit, OnDestroy {
  buttonState: string = null;
  colors: Array<string> = [ 'gray', 'red', 'white', 'orange', 'brown', 'blue', 'green', 'lightblue', 'pink', 'purple', 'yellow' ];
  dummyRiders: boolean = false;
  latLng: LatLngBoundsLiteral;
  mapMode: string = 'focusOnUser';
  markerUrl: string = "assets/img/rider-markers/";
  maxZoom: number = 18;
  riders: User[] = [];
  takingTooLong: boolean = false;
  user: User = null;

  private combinedSub: Subscription;
  private google: any;
  private hideTimer: Timer;
  private intervalTimer: Timer;
  private positionSub: Subscription;
  private refreshTimer: any;
  private riderListSub: Subscription;
  private socket: Socket;
  private userSub: Subscription;

  @ViewChild('agmMap') agmMap;

  @ViewChildren('infoWindows') infoWindows;
  @ViewChildren('markers') markers;
  @ViewChildren('userInfoWindow') userInfoWindow;

  constructor(private location: Location,
              private mapsAPILoader: MapsAPILoader,
              private navService: NavService,
              private refreshService: RefreshService,
              private riderService: RiderService,
              private positionService: PositionService,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.subscribeToUser();
    this.hideButtonsOnAutoRefresh();
    this.hideNav();
    this.mapsAPILoader.load().then(() => {
      console.log("mapsAPILoader loaded!");
      this.google = google;
      this.getRiders();
      this.retrieveState();
      this.setRefreshTimer();
      this.setTakingTooLongTimer();
    });
    this.positionService.getPosition();
  }

  addFiveRiders() {
    this.riderService.addFiveRiders();
  }

  calculateBounds(mapMode = this.mapMode) {
    this.mapMode = mapMode;

    if ( mapMode === 'stationary' ) return;

    let bounds: LatLngBounds = new this.google.maps.LatLngBounds();

    if ( mapMode === 'showAllRiders' && this.riders.length > 0 ) {
      this.riders.forEach(rider => {
        if ( rider.position.coords.latitude ) {
          bounds.extend({ lat: rider.position.coords.latitude, lng: rider.position.coords.longitude });
        }
      });
    }

    bounds.extend({ lat: this.user.position.coords.latitude, lng: this.user.position.coords.longitude });

    this.latLng = bounds.toJSON();
    this.latLng.north += (this.latLng.north - this.latLng.south) / 10; // Upper edge might be covered by menu bar.
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

  getRiders() {
    const combined = Rx.Observable.combineLatest(this.riderService.riderList$, this.userService.user$);
    this.combinedSub = combined.subscribe(value => {
      const riderList = value[ 0 ];
      const user = value[ 1 ];

      if ( user && riderList ) {
        let riders = riderList.filter(rider => rider._id !== user._id); // Filter out user, who will get a special marker.
        riders = riders.filter(rider => {                               // Filter out long-disconnected riders.
          return !rider.disconnected || (Date.now() - rider.disconnected) < environment.removeLongDisconnectedRiders;
        });
        this.riders = this.setZIndexAndOpacity(riders);
        // console.log("MapComponent.riders:", riders);
      }

      if ( user.position && user.position.coords && user.position.coords.latitude ) this.calculateBounds();
    });
  }

  hideButtonsOnAutoRefresh() {
    this.refreshService.autoRefreshPromise().then(autoRefresh => {
      this.buttonState = autoRefresh ? 'hide' : 'show';
    });
  }

  hideNav() {
    clearTimeout(this.hideTimer);
    // Wait till the map is shown (which happens when there is a position), set timer for 4s, check that the accordion is not expanded and that the user is till on the map page, and then hide the navbar.
    this.positionService.positionPromise().then(() => {
      this.hideTimer = setTimeout(() => {
        let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true'; // Turns string into boolean.
        if ( !ariaExpanded && this.location.path() === '/map' ) {
          this.navService.navBarState$.next('hide');
          this.buttonState = 'hide';
        }
      }, environment.fadeNav);
    });

  }

  removeDummyRiders() {
    this.riderService.removeDummyRiders(this.user.ride);
    setTimeout(() => {
      this.dummyRiders = false;
    }, 100);
  }

  retrieveState() {
    this.latLng = JSON.parse(environment.storage.getItem('rpLatLng'));
    environment.storage.removeItem('rpLatLng');
    this.mapMode = environment.storage.getItem('rpMapMode') || 'focusOnUser';
    environment.storage.removeItem('rpMapMode');
  }

  setRefreshTimer() {
    console.log("setRefreshTimer(). About to set refreshTimer");
    this.refreshTimer = setTimeout(() => {
      console.log("refreshTimer completed");
      if ( this.latLng ) environment.storage.setItem('rpLatLng', JSON.stringify(this.latLng));
      environment.storage.setItem('rpMapMode', this.mapMode);
      this.refreshService.refresh();
    }, environment.refreshOnMapPage);
  }

  setTakingTooLongTimer() {
    setTimeout(() => {
      this.takingTooLong = true;
    }, 8000);
  }

  setZIndexAndOpacity(riders) {
    let zCounter: number = 0;
    riders = riders.map(rider => {
      rider.zIndex = zCounter++;
      if ( rider.leader ) rider.zIndex = rider.zIndex + 500;
      if ( rider.disconnected ) rider.zIndex = rider.zIndex * -1;
      if ( rider.dummy ) this.dummyRiders = true;

      return rider;
    });

    return riders;
  }

  showNav() {
    this.navService.navBarState$.next('show');
    this.buttonState = 'show';
  }

  subscribeToUser() {
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.navService.navBarState$.next('show');  // Shouldn't be needed, but just to be on the safe side.

    clearTimeout(this.hideTimer);
    clearTimeout(this.refreshTimer);
    clearInterval(this.intervalTimer);

    if ( this.combinedSub ) this.combinedSub.unsubscribe();
    if ( this.positionSub ) this.positionSub.unsubscribe();
    if ( this.riderListSub ) this.riderListSub.unsubscribe();
    if ( this.userSub ) this.userSub.unsubscribe();

    // Attempt to ameliorate memory leak.
    if ( google ) {
      google.maps.event.clearInstanceListeners(window);
      google.maps.event.clearInstanceListeners(document);
      google.maps.event.clearInstanceListeners(this.agmMap);
      google.maps.event.clearInstanceListeners(this.markers);
      google.maps.event.clearInstanceListeners(this.infoWindows);
    }
  }

}






