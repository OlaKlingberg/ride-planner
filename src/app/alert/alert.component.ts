import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from "../_services/alert.service";
import { Subscription } from 'rxjs/Subscription';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'rp-alert',
  templateUrl: './alert.component.html',
  styleUrls: [ './alert.component.scss' ],
  animations: [
    trigger('messageState', [
      state('new', style({
        display: 'block',
        opacity: 1,
        transform: 'scaleY(1)'
      })),
      state('faded', style({
        // height: '0',   // Does not work on Firefox.
        // padding: '0',  // Does not work on Firefox.
        // border: '0',   // Does not work on Firefox.
        // margin: '0',   // Does not work on Firefox.
        display: 'none',
        opacity: 0,
        transform: 'scaleY(0)'
      })),
      transition('void => new', [
        style({
          opacity: 0,
        }),
        animate('300ms 100ms ease-in')
      ]),
      transition('new => faded', [
        style({
          height: '*',
          border: '*',
          padding: '*',
          margin: '*'
        }),
        animate('500ms ease-in')
      ])
    ])
  ]
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
        }, 5000);
      }
    });
  }

  ngOnDestroy() {
    this.getMessageSub.unsubscribe();
  }

}
