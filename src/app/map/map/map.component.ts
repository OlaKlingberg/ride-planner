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

import { MapAnimations } from './map.component.animations';
import { NavService } from '../../nav/nav.service';
import { PositionService } from '../../core/position.service';
import { SocketService } from '../../core/socket.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { RefreshService } from '../../core/refresh.service';
import { RiderService } from '../../rider/rider.service';
import { SettingsService } from '../../settings/settings.service';

@Component({
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  animations: MapAnimations
})
export class MapComponent implements OnInit, OnDestroy {
  buttonState: string = null;
  colors: Array<string> = [ 'gray', 'red', '9E60EF', '55BFC4', '56BF62', '56C195', '69BC57', '91BA58', '98D28A', '548AC6', '4848A4', '6262ED', '917875', 'A2CACA', 'AC8F74', 'AF5E5A', 'B0F4DA', 'B2F7B5', 'B2F49D', 'B7B758', 'B27F59', 'B59B59', 'C2C6EF', 'C3DBED', 'C3E5CD', 'C3EAE9', 'C4E8DD', 'CDF29E', 'D5B0D3', 'D5C2F2', 'DAAB73', 'E05FF2', 'EEC3F4', 'EFED9E', 'F4B3A8', 'F7C4E5', 'F7D3A9', 'F9C2D5', 'F45DD1', 'FCC3CA', 'FCEE22', 'FF9FA6' ];
  demoMode: boolean = false;
  dummyRiders: boolean = false;
  latLng: LatLngBoundsLiteral;
  mapMode: 'focusOnUser' | 'showAllRiders' | 'stationary' = 'showAllRiders';
  markerUrl: string = "assets/img/rider-markers/";
  maxZoom: number = 18;
  oneSecondPassed = null;
  riders: User[] = [];
  takingTooLong: boolean = false;
  user: User = null;

  private combinedSub: Subscription;
  private google: any;
  private hideTimer: Timer;
  private intervalTimer: Timer;
  private positionSub: Subscription;
  private refreshTimer: Timer;
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
              private settingsService: SettingsService,
              private socketService: SocketService,
              private userService: UserService) {
    this.socket = this.socketService.socket;
  }

  ngOnInit() {
    this.demoMode = this.settingsService.demoMode;
    this.subscribeToUser();
    this.hideButtonsOnAutoRefresh();
    this.hideNav();
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.getRiders();
      this.retrieveState();
      this.setRefreshTimer();
      this.setTakingTooLongTimer();
      this.waitOneSecond();
    });
    this.positionService.getPosition();
  }

  addDummyRiders() {
    console.log("MapComponent.addDummyRiders()");
    this.riderService.addDummyRiders(err => {
      if ( err ) return;  // Todo: Handle error.
    });
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

    setTimeout(() => {
      this.latLng = bounds.toJSON();
      this.latLng.north += (this.latLng.north - this.latLng.south) / 10; // Upper edge might be covered by menu bar.
    }, 0);  // Todo: Figure out why I need to wait a tick here. Seems to solve the problem with latLng not getting a value in the view -- but why?

  }

  closeInfoWindows(_id) {
    this.infoWindows.forEach(infoWindow => infoWindow.close());
    this.userInfoWindow.forEach(userInfoWindow => userInfoWindow.close());
  }

  getRiders() {
    const combined = Rx.Observable.combineLatest(this.riderService.riderList$, this.userService.user$);
    this.combinedSub = combined.subscribe(value => {
      const riderList = value[ 0 ];
      const user = value[ 1 ];

      if ( user && riderList ) {
        let riders = riderList.filter(rider => rider._id !== user._id); // Filter out user, who will get a special marker.
        riders = riders.filter(rider => {                               // Filter out long-disconnected riders.
          return !rider.disconnected || (Date.now() - rider.disconnected) < this.settingsService.removeLongDisconnectedRider * 60000;
        });
        this.riders = this.setZIndexAndOpacity(riders);
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
        let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true';
        if ( !ariaExpanded && this.location.path() === '/map' ) {
          this.navService.navBarState$.next('hide');
          this.buttonState = 'hide';
        }
      }, this.settingsService.fadeNav * 1000);
    });

  }

  removeDummyRiders() {
    this.riderService.removeDummyRiders(this.user.ride);
    setTimeout(() => {
      this.dummyRiders = false;
    }, 100);
  }

  retrieveState() {
    this.latLng = JSON.parse(eval(this.settingsService.storage).getItem('rpLatLng'));
    eval(this.settingsService.storage).removeItem('rpLatLng');
    this.mapMode = eval(this.settingsService.storage).getItem('rpMapMode') || 'showAllRiders';
    eval(this.settingsService.storage).removeItem('rpMapMode');
  }

  setRefreshTimer() {
    this.refreshTimer = setTimeout(() => {
      if ( this.latLng ) eval(this.settingsService.storage).setItem('rpLatLng', JSON.stringify(this.latLng));
      eval(this.settingsService.storage).setItem('rpMapMode', this.mapMode);
      this.refreshService.refresh();
    }, this.settingsService.refreshMapPage * 60000);
  }

  setTakingTooLongTimer() {
    setTimeout(() => {
      this.takingTooLong = true;
    }, 8000);
  }

  setZIndexAndOpacity(riders) {
    this.dummyRiders = false;
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

  waitOneSecond() {
    setTimeout(() => {
      this.oneSecondPassed = { something: 'or other' };
    }, 10000);
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






