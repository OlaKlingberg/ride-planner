// import { Injectable } from '@angular/core';
// import { Http, Response } from '@angular/http';
//
// import { environment } from '../../environments/environment';
//
// @Injectable()
// export class EnvService {
//   googleMapsKey: string;
//
//   constructor(private http: Http) {
//     console.log("EnvService.constructor()");
//     this.getEnvVariables();
//   }
//
//   getEnvVariables() {
//       console.log(`About to request ${environment.api}/environment-config`);
//       return this.http.get(`${environment.api}/environment-config`)
//           .map((response: Response) => {
//             this.googleMapsKey = response.json().googleMapsKey;
//             console.log("googleMapsKey:", this.googleMapsKey);
//           })
//           .subscribe();
//
//   }
//
// }
