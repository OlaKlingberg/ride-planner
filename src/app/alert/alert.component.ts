import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { alertAnimations } from './alert.component.animations';
import { AlertService } from "./alert.service";
import Timer = NodeJS.Timer;

@Component({
  selector: 'rp-alert',
  templateUrl: './alert.component.html',
  styleUrls: [ './alert.component.scss' ],
  animations: alertAnimations
})
export class AlertComponent implements OnInit, OnDestroy {
  message: any;

  private subscription: Subscription;
  private timer: Timer;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      if (this.timer) clearTimeout(this.timer);
      if ( message ) {
        this.message = message;
        this.message.state = 'new';
        this.timer = setTimeout(() => {
          if ( this.message && this.message.type === 'success' ) {
            this.message.state = 'faded';
            setTimeout(() => {
              this.message = null;
            }, 1000);
          }
        }, 2500);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
