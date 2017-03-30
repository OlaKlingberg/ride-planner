import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { MapsAPILoader } from "angular2-google-maps/core"
import { rider } from "../../interfaces/rider";

import { environment } from '../../environments/environment';
import { MapService } from "../_services/map.service";
import { Observable } from "rxjs";
import { AuthenticationService } from "../_services/authentication.service";


@Component({
  selector: 'rp-riders-map3',
  templateUrl: './riders-map3.component.html',
  styleUrls: [ './riders-map3.component.scss' ]
})
export class RidersMap3Component implements OnInit, OnDestroy {
  private socket;
  public ridersMap;
  public position$;
  public positionSubscriptionForMap;
  public positionSubscriptionForRiderMarker;


  @ViewChild("mapDiv")
  public mapElementRef: ElementRef;

  constructor(private mapService: MapService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    console.log("RidersMap3Component.ngOnInit");
    this.socket = io(environment.api);  // io is made available through import into index.html.

    this.watchPosition();
    this.createMap();
    this.createRiderMarker();
  }


  watchPosition() {
    this.position$ = this.mapService.watchPosition();
  }

  createMap() {
    this.positionSubscriptionForMap = this.position$.subscribe(
        position => {
          if ( position ) {
            console.log(position.coords.latitude, position.coords.longitude);
            this.ridersMap = this.mapService.createMap(this.mapElementRef, position);
          }
        },
        err => {
          console.log(err);
        },
        () => console.log('Completed')
    );


  }

  createRiderMarker() {
    this.positionSubscriptionForRiderMarker = this.position$.subscribe(
        position => {
          this.authenticationService.loggedIn$.subscribe(
              loggedInUser => {
                if ( position && loggedInUser ) {
                  this.mapService.createRiderMarker(this.ridersMap, position, loggedInUser);
                }
              },
              err => {
                console.log(err);
              },
              () => console.log('Completed')
          )
        }
    );

  }


  ngOnDestroy() {
    this.positionSubscriptionForMap.unsubscribe();
    this.positionSubscriptionForRiderMarker.unsubscribe();
  }

}
