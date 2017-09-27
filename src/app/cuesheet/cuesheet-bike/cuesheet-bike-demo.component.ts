import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CuesheetDemoService } from '../cuesheet-demo.service';
import { Cuesheet } from '../cuesheet';

@Component({
  templateUrl: './cuesheet-bike.component.html',
  styleUrls: [ './cuesheet-bike.component.scss' ]
})
export class CuesheetBikeDemoComponent implements OnInit {
  cueNumber: number = null;
  cuesheetId: string = '';
  url: SafeResourceUrl;

  @ViewChild('iframe') iframe;

  constructor(private cuesheetDemoService: CuesheetDemoService,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    // console.log("CuesheetBikeDemoComponent");
    this.route.params.forEach((params: Params) => {
      this.cuesheetId = params[ 'cuesheetId' ];
      this.cueNumber = +params[ 'cueNumber' ];

      this.cuesheetId = this.cuesheetId.replace(/[^\w]/g, '');

      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(`${window.location.origin}/cuesheet/${this.cuesheetId}/bike-iframe/${this.cueNumber}`);

      // this.getCuesheet(this.cuesheetId);
    });
  }

  // getCuesheet(_id) {
  //   this.cuesheetDemoService.getCuesheet(_id).then((cuesheet: Cuesheet) => {
  //     // console.log("CuesheetBikeDemoComponent.getCuesheet() cuesheet:", cuesheet);
  //     // this.cuesheetDemoService.putCuesheetInStorage(cuesheet);
  //     // this.cuesheetDemoService.sendCuesheetToIframe(this.iframe.nativeElement.contentWindow, cuesheet);
  //   })
  // }

  returnToOverview() {
    this.router.navigate([`/cuesheet/${this.cuesheetId}/view`])
  }

  swipeDown() {
    this.cuesheetDemoService.swipeDown(this.iframe.nativeElement.contentWindow);
  }

  swipeUp() {
    this.cuesheetDemoService.swipeUp(this.iframe.nativeElement.contentWindow);
  }


}