import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { alertAnimations } from './alert.component.animations';
import { AlertService } from "./alert.service";

@Component({
  selector: 'rp-alert',
  templateUrl: './alert.component.html',
  styleUrls: [ './alert.component.scss' ],
  animations: alertAnimations
})
export class AlertComponent implements OnInit, OnDestroy {
  display: boolean = true;
  message: any;

  private subscription: Subscription;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      if ( message ) {
        this.display = true;
        this.message = message;
        this.message.state = 'new';
        setTimeout(() => {
          if ( this.message && this.message.autoRemove ) {
            this.message.state = 'faded';
            setTimeout(() => {
              this.message = null;
            }, 1000);
          }
        }, 2500);
      } else {
        this.message = null;
      }
    });
  }

  close() {
    this.display = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
