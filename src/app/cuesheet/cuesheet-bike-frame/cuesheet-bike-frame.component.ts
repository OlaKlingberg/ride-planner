import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CuesheetService } from '../cuesheet.service';

@Component({
  templateUrl: './cuesheet-bike-frame.component.html',
  styleUrls: [ './cuesheet-bike-frame.component.scss' ]
})
export class CuesheetBikeFrameComponent implements OnInit {
  cueNumber: number = null;
  cuesheetId: string = '';
  url: SafeResourceUrl;

  @ViewChild('iframe') iframe;

  constructor(private cuesheetService: CuesheetService,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.cuesheetId = params[ 'cuesheetId' ];
      this.cueNumber = +params[ 'cueNumber' ];

      this.cuesheetId = this.cuesheetId.replace(/[^\w]/g, '');

      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${window.location.origin}/cuesheet/${this.cuesheetId}/bike/${this.cueNumber}`);
    });

  }

  returnToOverview() {
    this.router.navigate([`/cuesheet/${this.cuesheetId}/view`])
  }

  swipeDown() {
    this.cuesheetService.swipeDown(this.iframe.nativeElement.contentWindow);
  }

  swipeUp() {
    this.cuesheetService.swipeUp(this.iframe.nativeElement.contentWindow);
  }


}