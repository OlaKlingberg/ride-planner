import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cuesheet } from '../_models/cuesheet';
import { AlertService } from '../_services/alert.service';
import { CuesheetService } from '../_services/cuesheet.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-cuesheet-new',
  templateUrl: './cuesheet-new.component.html',
  styleUrls: [ './cuesheet-new.component.scss' ]
})
export class CuesheetNewComponent implements OnInit, OnDestroy {
  model: any = {};
  loading: boolean = false;
  cuesheet: Cuesheet;
  private cuesheetSub: Subscription;

  constructor(private alertService: AlertService,
              private cuesheetService: CuesheetService,
              private router: Router) {
  }

  ngOnInit() {
  }

  createCuesheet() {
    this.loading = true;
    this.cuesheetSub = this.cuesheetService.create(this.model)
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
