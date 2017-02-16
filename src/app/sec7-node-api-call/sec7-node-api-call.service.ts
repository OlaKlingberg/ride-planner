import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";

@Injectable()
export class Sec7NodeApiCallService {

  constructor(private http: Http) { }

  getTodos() {
    return this.http.get('http://localhost:3007/todos')
        .map((response: Response) => response.json());


  }


}
