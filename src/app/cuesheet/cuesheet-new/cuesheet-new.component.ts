import { Component, OnInit, OnDestroy, EventEmitter, AfterViewChecked, AfterViewInit, ElementRef } from '@angular/core';
import { Cuesheet } from '../cuesheet';
import { AlertService } from '../../alert/alert.service';
import { CuesheetService } from '../cuesheet.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'rp-cuesheet-new',
  templateUrl: './cuesheet-new.component.html',
  styleUrls: [ './cuesheet-new.component.scss' ]
})
export class CuesheetNewComponent implements OnInit, OnDestroy, AfterViewInit {
  model: any = {};
  loading: boolean = false;
  cuesheet: Cuesheet;
  private cuesheetSub: Subscription;
  public focusTrigger = new EventEmitter<boolean>();

  constructor(private alertService: AlertService,
              private cuesheetService: CuesheetService,
              private router: Router) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.focusTrigger.emit(true);
  }

  createCuesheet() {
    this.loading = true;
    this.cuesheetSub = this.cuesheetService.createCuesheet(this.model)
        .subscribe((cuesheet: Cuesheet) => {
              console.log(cuesheet);
              this.alertService.success('The Cue Sheet has been created', true);
              this.router.navigate([ `/cuesheets/${cuesheet._id}/edit` ]);
            },
            error => {
              this.loading = false;
              console.log(error);
            });
  }

  ngOnDestroy() {
    if (this.cuesheetSub) this.cuesheetSub.unsubscribe();
  }
}
