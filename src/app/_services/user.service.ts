import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { User } from "../_models/user";
import { environment } from "../../environments/environment";

@Injectable()
export class UserService {
  constructor(private http: Http) { }

create(user: User) {
    return this.http.post(environment.api + '/users', user );
}


}