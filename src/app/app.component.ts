import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthenticationService } from "./_services/authentication.service";

@Component({
  selector: 'rp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RidePlanner2';

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.logInUserFromLocalStorage();
  }

  logInUserFromLocalStorage() {
    const currentToken = JSON.parse(localStorage.getItem('currentToken'));

    if (currentToken) {
      this.authenticationService.authenticateByToken(currentToken);
    }
  }
}
