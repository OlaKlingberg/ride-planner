import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class MapService {

  constructor(private http: Http,
              private settingsService: SettingsService) {
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenCoords(lat1, lng1, lat2, lng2) {
    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lng2 - lng1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  getLegs(lat1, lng1, lat2, lng2) {
    const requestOptions = this.setHeaders();

    // console.log("MapService.getPath()");
    return this.http.get(`${this.settingsService.api}/geo/legs/${lat1}/${lng1}/${lat2}/${lng2}`, requestOptions)
        .map((response: Response) => {
          return response.json().data.routes[0].legs[0].steps;
        })
        .toPromise();
  };

  getPlace(lat, lng) {
    const requestOptions = this.setHeaders();

    return this.http.get(`${this.settingsService.api}/geo/place/${lat}/${lng}`, requestOptions)
        .map((response: Response) => {
          return response.json().data;
        })
        .toPromise();
  }


  setHeaders() {
    const token = JSON.parse(eval(this.settingsService.storage).getItem('rpToken'));
    const headers = new Headers({ 'x-auth': token });
    return new RequestOptions({ headers });
  }

}
