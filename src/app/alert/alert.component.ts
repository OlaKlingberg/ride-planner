import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from "./alert.service";
import { Subscription } from 'rxjs/Subscription';
import { alertAnimations } from './alert.component.animations';


@Component({
  selector: 'rp-alert',
  templateUrl: './alert.component.html',
  styleUrls: [ './alert.component.scss' ],
  animations: alertAnimations
})
export class AlertComponent implements OnInit, OnDestroy {
  message: any;
  getMessageSub: Subscription;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.getMessageSub = this.alertService.getMessage().subscribe(message => {
      if ( message ) {
        this.message = message;
        this.message.state = 'new';
        setTimeout(() => {
          if ( message && message.type === 'success') {
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
    this.getMessageSub.unsubscribe();
  }

}
