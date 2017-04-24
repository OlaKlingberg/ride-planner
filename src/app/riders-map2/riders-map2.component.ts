import { Component, OnInit } from '@angular/core';

// import { environment } from '../../environments/environment';
import { StatusService } from '../_services/status.service';
import { RiderService } from '../_services/rider.service';
import { Rider } from '../_models/rider';

@Component({
  selector: 'rp-riders-map2',
  templateUrl: './riders-map2.component.html',
  styleUrls: [ './riders-map2.component.scss' ]
})
export class RidersMap2Component implements OnInit {
  private lat: number;
  private lng: number;
  private zoom: number = 15;
  private riders: Rider[];

  private markerUrl: string = "assets/img/";
  private colors: Array<string> = [ 'blue', 'green', 'lightblue', 'orange', 'pink', 'purple', 'red', 'yellow' ];

  constructor(private riderService: RiderService,
              private statusService: StatusService) {
  }

  ngOnInit() {
    this.watchCoords();
    this.watchRiders();
  }

  watchCoords() {
    this.statusService.coords$.subscribe((coords) => {
      if ( coords ) {
        this.lat = coords.latitude;
        this.lng = coords.longitude;
      }
    });
  }

  watchRiders() {
    this.statusService.riders$.subscribe(riders => {
      if ( riders && riders.length > 0 ) {
      // if ( riders ) {
        this.riders = riders.map(rider => new Rider(rider));
        console.log(this.riders.map(rider => `${rider.fname} ${rider.lname}`));
      }
    });
  }


}

