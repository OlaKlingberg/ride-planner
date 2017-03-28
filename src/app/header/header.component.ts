import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../_services/authentication.service";

@Component({
  selector: 'pr-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    console.log("HeaderComponent.ngOnInit");
    this.authenticationService.loggedIn$.subscribe(
        loggedIn => {
          this.loggedIn = loggedIn;
          console.log(`HeaderComponent.loggedIn: ${this.loggedIn}`);
        }
    );
  }

}
