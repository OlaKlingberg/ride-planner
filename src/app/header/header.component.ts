import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../_services/authentication.service";

@Component({
  selector: 'rp-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
  user: Object;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.authenticationService.user$.subscribe(
        user => this.user = user
    );
  }

}
