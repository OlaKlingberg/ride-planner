import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';

import { MapsAPILoader } from 'angular2-google-maps/core';
import LatLngBounds = google.maps.LatLngBounds;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { Subscription } from 'rxjs/Subscription';
import Socket = SocketIOClient.Socket;
import * as _ from 'lodash';
import * as $ from 'jquery';
import { environment } from '../../environments/environment';
import { UserService } from '../_services/user.service';
import { MiscService } from '../_services/misc.service';
import { User } from '../_models/user';
import { DebuggingService } from '../_services/debugging.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Component({
  selector: 'rp-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
  animations: [
    trigger('buttons', [
      state('show', style({
        opacity: 1,
        display: "block"
      })),
      state('hide', style({
        opacity: 0,
        display: "none"
      })),
      transition('show => hide', animate('500ms 4s')),
      // transition('hide => show', animate('10ms'))
    ])
  ]
})
export class MapComponent implements OnInit, OnDestroy {
  public production = environment.production;
  private fullName: string = '';
  public maxZoom: number = 16;

  public user: User;

  private google: any;
  private bounds: LatLngBounds;
  public latLng: LatLngBoundsLiteral;

  private userSub: Subscription;
  private userRideSub: Subscription;
  private positionSub: Subscription;
  private navBarStateSub: Subscription;
  private riderListSub: Subscription;

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'gray', 'red', 'white', 'orange', 'brown', 'blue', 'green', 'lightblue', 'pink', 'purple', 'yellow' ];

  private socket: Socket;

  private timer: any;
  public navBarStateTimer: any;

  private zCounter: number = 0;

  public mapMode: 'focusOnUser' | 'showAllRiders' | 'stationary' = 'focusOnUser';

  public riderList: Array<User> = [];
  private riderList$: BehaviorSubject<Array<User>> = new BehaviorSubject(null);

  public navBarState: string;


  @ViewChildren('markers') markers;
  @ViewChildren('infoWindows') infoWindows;
  @ViewChildren('userInfoWindow') userInfoWindow;
  @ViewChild('sebmGoogleMap') sebmGoogleMap;

  constructor(private userService: UserService,
              private miscService: MiscService,
              private mapsAPILoader: MapsAPILoader,
              private debuggingService: DebuggingService,
              private router: Router) {
    this.socket = this.miscService.socket;
  }

  ngOnInit() {
    this.subscribeToUser();
    this.subscribeToNavBarState();
    this.listenForSocketConnection();
    this.requestRiderList();
    this.listenForRiderList();
    this.listenForJoinedRider();
    this.listenForUpdatedRiderPosition();
    this.listenForRemovedRider();
    this.listenForDisconnectedRider();
    this.removeLongDisconnectedRiders();
    console.log("About to load mapsAPILoader.");
    this.mapsAPILoader.load().then(() => {
      this.google = google;
      this.focusOnUser();

      setTimeout(() => {
        this.router.navigate([ '/map' ]);
      }, 6000);


    });
  }

  subscribeToUser() {
    console.log("subscribeToUser");
    this.userSub = this.userService.user$.subscribe(user => {
      this.user = user;
      // if (user && user.position && user.position.coords) console.log("User lat:", user.position.coords.latitude * 1000);
    });
  }

  // When the nav bar becomes shown, set a timer to hide it again -- but only if the accordion is closed.
  subscribeToNavBarState() {
    this.navBarStateSub = this.miscService.navBarState$
        .combineLatest(this.userService.position$)  // Todo: Do I need to unsubscribe from this?
        .subscribe(([ navBarState, position ]) => {
          // Start the timer to hide the nav bar only when the map is shown, which happens when there is a latitude.
          // Todo: The condition is kind of ugly.
          if ( position && position.coords && position.coords.latitude ) {
            this.navBarState = navBarState;
            setTimeout(() => { // Have to wait one tick before checking the value of the aria-expanded attribute.
              let ariaExpanded = $("[aria-expanded]").attr('aria-expanded') === 'true'; // Turns string into boolean.
              if ( navBarState === 'show' && !ariaExpanded ) {
                // this.navBarStateTimer = setTimeout(() => {  // Don't remember why the setTimeout is needed, but it is.
                this.miscService.navBarState$.next('hide');
                // }, 0);
              }
            }, 0);
          }
        });
  }

  listenForSocketConnection() {
    this.socket.on('socketConnection', () => this.requestRiderList());
  }

  requestRiderList() {
    console.log("MapComponent.requestRiderList");
    // Wait till a ride has been selected ...
    let userRidePromise = new Promise((resolve, reject) => {
      this.userRideSub = this.userService.user$.subscribe(user => {
        if ( user.ride ) resolve(user.ride);
      })
    });

    // ... and then request the riderList.
    userRidePromise.then(ride => {
      this.userRideSub.unsubscribe();
      this.socket.emit('giveMeRiderList', ride);
    });
  }


  setZIndexAndOpacity() {
    this.riderList = this.riderList.map(rider => {
      rider.zIndex = this.zCounter++;
      if ( rider.leader ) rider.zIndex = rider.zIndex + 500;
      if ( rider.disconnected ) rider.zIndex = rider.zIndex * -1;
      return rider;
    });
  }

  listenForRiderList() {
    this.socket.on('riderList', riderList => {
      console.log('riderList:', riderList);
      this.riderList = riderList.map(rider => new User(rider));
      // Filter out the user, which will be displayed using a separate marker.
      this.riderList = this.riderList.filter(rider => rider._id !== this.user._id);
      this.setZIndexAndOpacity();
    });
  }

  listenForJoinedRider() {
    this.socket.on('joinedRider', joinedRider => {
      // If the zIndices are getting too high, it's time to request the whole riderList again.
      console.log("zCounter:", this.zCounter);
      if ( this.zCounter >= 1000 ) {
        this.zCounter = 0;
        console.log("Counter reached 1000! About to emit giveMeRiderList.");
        this.socket.emit('giveMeRiderList', this.user.ride);
      } else {
        if ( joinedRider._id !== this.user._id ) {
          joinedRider = new User(joinedRider);
          joinedRider.zIndex = this.zCounter++;
          if ( joinedRider.leader ) joinedRider.zIndex += 500;
          // joinedRider = this.setDummyMovement(joinedRider);
          console.log("listenForJoinedRider(). rider:", joinedRider);
          // The rider can be a new rider, or a disconnected rider who reconnected.
          this.riderList = this.riderList.filter(rider => rider._id !== joinedRider._id);
          this.riderList.push(joinedRider);

          this.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
        }
      }
    });
  }

  listenForUpdatedRiderPosition() {
    this.socket.on('updatedRiderPosition', updatedRider => {
      let idx = _.findIndex(this.riderList, rider => rider._id === updatedRider._id);
      if ( idx >= 0 ) {
        this.riderList[ idx ].position.timestamp = updatedRider.position.timestamp;
        this.riderList[ idx ].position.coords.accuracy = updatedRider.position.coords.accuracy;
        this.riderList[ idx ].position.coords.latitude = updatedRider.position.coords.latitude;
        this.riderList[ idx ].position.coords.longitude = updatedRider.position.coords.longitude;

        this.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
      }
    });
  }

  listenForRemovedRider() {
    this.socket.on('removedRider', _id => {
      console.log("listenForRemovedRider(). _id:", _id);
      this.riderList = this.riderList.filter(rider => rider._id !== _id);

      // This will be used to set the map bounds.
      this.riderList$.next(this.riderList);
    });
  }

  listenForDisconnectedRider() {
    this.socket.on('disconnectedRider', disconnectedRider => {
      console.log("listenForDisconnectedRider(). disconnectedRider:", disconnectedRider);
      let idx = _.findIndex(this.riderList, rider => rider._id === disconnectedRider._id);
      this.riderList[ idx ].disconnected = disconnectedRider.disconnected;

      this.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
    });
  }

  removeLongDisconnectedRiders() {
    this.timer = setInterval(() => {
      // console.log("removeLongDisconnectedRiders. A new 30-second interval started ...");
      this.riderList = _.filter(this.riderList, rider => {
        // Todo: Use an environment variable for the time? Or a variable that can be set through a UI?
        return !rider.disconnected || (Date.now() - rider.disconnected) < 1800000;
      });

      this.riderList$.next(this.riderList); // riderList$ is used for setting the map bounds.
    }, 30000);
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

  setMapMode(mapMode) {
    this.miscService.navBarState$.next('show');

    if ( this.positionSub ) this.positionSub.unsubscribe();
    if ( this.riderListSub ) this.riderListSub.unsubscribe();

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

  // Todo: Update bounds only if position has changed more than a certain amount.
  focusOnUser() {
    console.log("focusOnUser()");
    if (this.positionSub) this.positionSub.unsubscribe();
    this.positionSub = this.userService.position$.subscribe(position => {
          // console.log("MapComponent.focusOnUser() position$.subscribe()");
          if ( position ) {
            // console.log("About to extend bounds. Lat:", position.coords.latitude * 1000);
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

  showAllRiders() {
    console.log("showAllRiders()");
    if (this.riderListSub) this.riderListSub.unsubscribe();
    this.riderListSub = this.riderList$.subscribe(riderList => {
      console.log("MapComponent.showAllRiders() riderList$.subscribe()");
      if ( !riderList || riderList.length < 0 ) return;
      this.bounds = new this.google.maps.LatLngBounds();
      riderList.forEach(rider => {
        this.bounds.extend({ lat: rider.position.coords.latitude, lng: rider.position.coords.longitude });
      });
      this.bounds.extend({ lat: this.user.position.coords.latitude, lng: this.user.position.coords.longitude });
      this.latLng = this.bounds.toJSON();
    });

  }

  ngOnDestroy() {
    if ( this.userSub ) this.userSub.unsubscribe();
    if ( this.userRideSub ) this.userRideSub.unsubscribe();
    if ( this.navBarStateSub ) this.navBarStateSub.unsubscribe();
    if ( this.positionSub ) this.positionSub.unsubscribe();
    if ( this.riderListSub ) this.riderListSub.unsubscribe();

    this.socket.removeAllListeners();

    clearInterval(this.timer);
    clearTimeout(this.navBarStateTimer);
    setTimeout(() => {
      this.miscService.navBarState$.next('show');
    }, 200);

    // Attempt to ameliorate memory leak.
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
    google.maps.event.clearInstanceListeners(this.sebmGoogleMap);
    google.maps.event.clearInstanceListeners(this.markers);
    google.maps.event.clearInstanceListeners(this.infoWindows);

  }

}

