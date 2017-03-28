import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../_services/authentication.service";

@Component({
  selector: 'pr-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
  loggedIn;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

}
