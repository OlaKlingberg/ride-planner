import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from '../_models/user';
import { StatusService } from '../_services/status.service';

@Component({
  selector: 'rp-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
  returnUrl: string;
  user: User;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private statusService: StatusService) {
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';

    // Todo: This looks complicated and messy. Can it be streamlined somehow?
    this.statusService.user$.subscribe(user => {
      if ((this.returnUrl === '/riders' || this.returnUrl === '/members') && (user && user.leader === true)) {
        this.router.navigate([ this.returnUrl ]);
      }
      if (this.returnUrl === '/debugger' && (user && user.admin === true)) {

        this.router.navigate([ this.returnUrl ])
      }

    })
  }

}
