import { Component, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { Cuesheet } from '../cuesheet';
import { CuesheetService } from '../cuesheet.service';

@Component({
  templateUrl: './cuesheet-new.component.html',
  styleUrls: [ './cuesheet-new.component.scss' ]
})
export class CuesheetNewComponent implements OnDestroy, AfterViewInit {
  cuesheet: Cuesheet;
  focusTrigger = new EventEmitter<boolean>();
  loading: boolean = false;
  model: any = {};

  private subscription: Subscription;

  constructor(private alertService: AlertService,
              private cuesheetService: CuesheetService,
              private router: Router) {
  }

  ngAfterViewInit() {
    this.focusTrigger.emit(true);
  }

  createCuesheet() {
    this.loading = true;
    this.subscription = this.cuesheetService.createCuesheet(this.model)
        .subscribe((cuesheet: Cuesheet) => {
              this.alertService.success('The Cue Sheet has been created', true);
              this.router.navigate([ `/cuesheet/${cuesheet._id}/edit` ]);
            },
            error => {
              this.loading = false;
              console.log(error);
            });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
