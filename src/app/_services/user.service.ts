import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { User } from "../_models/user";
import { environment } from "../../environments/environment";
import { MapService } from './map.service';

@Injectable()
export class UserService {
  currentToken;
  headers;
  requestOptions;

  constructor(private http: Http,
              private mapService: MapService) {
  }

  create(user: User) {
    return this.http.post(`${environment.api}/users`, user);
  }

  getAllUsers() {
    this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    return this.http.get(`${environment.api}/users`, this.requestOptions);
  }

  getAllRiders() {
    this.currentToken = JSON.parse(localStorage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    // let riders = this.mapService.riders$.value;
    // console.log("UserService.getAllRiders: riders:", riders);

    return this.http.get(`${environment.api}/users/riders`, this.requestOptions);


    // this.mapService.riders$
    //     .subscribe(riders => {
    //       console.log("UserService.getAllRiders", riders);
    //       return riders;
    //     });
  }


}