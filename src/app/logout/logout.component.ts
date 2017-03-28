import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";

@Component({
  selector: 'pr-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentToken');
    this.authenticationService.logout();

    this.router.navigate(['/']);
  }

}
