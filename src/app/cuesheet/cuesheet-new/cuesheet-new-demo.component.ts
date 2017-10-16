import { Component, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { Cuesheet } from '../cuesheet';
import { CuesheetService } from '../cuesheet.service';
import { CuesheetDemoService } from '../cuesheet-demo.service';

@Component({
  templateUrl: './cuesheet-new.component.html',
  styleUrls: [ './cuesheet-new.component.scss' ]
})
export class CuesheetNewDemoComponent implements OnDestroy, AfterViewInit {
  cuesheet: Cuesheet;
  focusTrigger = new EventEmitter<boolean>();
  loading: boolean = false;
  model: any = {};

  private subscription: Subscription;

  constructor(private alertService: AlertService,
              private cuesheetDemoService: CuesheetDemoService,
              private router: Router) {
  }

  ngAfterViewInit() {
    this.focusTrigger.emit(true);
  }

  createCuesheet() {
    console.log("CuesheetNewDemoComponent.createCuesheet()");
    this.loading = true;

    const cuesheet = this.cuesheetDemoService.createCuesheet(this.model);

    this.alertService.success('The Cue Sheet has been created', true, true);
    this.router.navigate([ `/cuesheet/${cuesheet._id}/edit` ]);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
