import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { User } from "../_models/user";
import { environment } from "../../environments/environment";
import { RiderService } from './rider.service';

@Injectable()
export class UserService {
  currentToken: string;
  headers: Headers;
  requestOptions: RequestOptions;

  constructor(private http: Http) {
  }

  create(user: User) {
    return this.http.post(`${environment.api}/users`, user);
  }

  getAllUsers() {
    this.currentToken = JSON.parse(sessionStorage.getItem('currentToken'));
    this.headers = new Headers({ 'x-auth': this.currentToken });
    this.requestOptions = new RequestOptions({ headers: this.headers });

    return this.http.get(`${environment.api}/users`, this.requestOptions);
  }



}