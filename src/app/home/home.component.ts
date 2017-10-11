import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { Http, Response } from '@angular/http';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {
  returnUrl: string;
  user: User;
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private http: Http,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';

    // Todo: This looks complicated and messy. Can it be refactored?
    this.subscription = this.userService.user$.subscribe(user => {
      if ((this.returnUrl === '/riders' || this.returnUrl === '/members') && (user && user.leader === true)) {
        this.router.navigate([ this.returnUrl ]);
      }
      if (this.returnUrl === '/debugger' && (user && user.admin === true)) {

        this.router.navigate([ this.returnUrl ]);
      }

    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}