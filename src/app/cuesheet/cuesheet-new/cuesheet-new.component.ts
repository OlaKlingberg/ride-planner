import { Component, OnDestroy, EventEmitter, AfterViewInit, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../../alert/alert.service';
import { Cuesheet } from '../cuesheet';
import { CuesheetService } from '../cuesheet.service';
import { SettingsService } from '../../settings/settings.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  templateUrl: './cuesheet-new.component.html',
  styleUrls: [ './cuesheet-new.component.scss' ]
})
export class CuesheetNewComponent implements OnInit, OnDestroy, AfterViewInit {
  cuesheet: Cuesheet;
  focusTrigger = new EventEmitter<boolean>();
  loading: boolean = false;
  modalRef: BsModalRef;
  model: any = {};

  private subscription: Subscription;

  @ViewChild('demoModeModal') demoModeModal: TemplateRef<any>;

  constructor(private alertService: AlertService,
              private cuesheetService: CuesheetService,
              private modalService: BsModalService,
              private router: Router,
              private settingsService: SettingsService) {
  }

  ngOnInit() {
    if (this.settingsService.demoMode) this.modalRef = this.modalService.show(this.demoModeModal);
  }

  ngAfterViewInit() {
    this.focusTrigger.emit(true);
  }

  createCuesheet() {
    this.loading = true;
    this.subscription = this.cuesheetService.createCuesheet(this.model)
        .subscribe((cuesheet: Cuesheet) => {
              this.alertService.success('The Cue Sheet has been created', true, true);
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
