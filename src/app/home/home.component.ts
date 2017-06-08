import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'rp-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {
  returnUrl: string;
  user: User;
  private userSub: Subscription;
  private counter: number = 0;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }



  ngOnInit() {
    console.log("HomeComponent. About to subscribe to user. Counter:", this.counter++);
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.activatedRoute.snapshot.queryParams[ 'returnUrl' ] || '/';

    // Todo: This looks complicated and messy. Can it be refactored?
    this.userSub = this.userService.user$.subscribe(user => {
      if ((this.returnUrl === '/riders' || this.returnUrl === '/members') && (user && user.leader === true)) {
        this.router.navigate([ this.returnUrl ]);
      }
      if (this.returnUrl === '/debugger' && (user && user.admin === true)) {

        this.router.navigate([ this.returnUrl ])
      }

    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
