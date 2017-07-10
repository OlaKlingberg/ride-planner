import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cuesheet } from '../_models/cuesheet';
import { ActivatedRoute, Params } from '@angular/router';
import { CuesheetService } from '../_services/cuesheet.service';

@Component({
  selector: 'app-cuesheet',
  templateUrl: './cuesheet.component.html',
  styleUrls: [ './cuesheet.component.scss' ]
})
export class CuesheetComponent implements OnInit, OnDestroy {
  public cuesheet: any;  // Todo: Or should this be: @Input() cuesheet: Cuesheet; ?

  constructor(private route: ActivatedRoute,
              private cuesheetService: CuesheetService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      const _id = params[ '_id' ];
      this.cuesheetService.getCuesheet(_id)
          .then(cuesheet => this.cuesheet = cuesheet);
    });
  }

  ngOnDestroy() {
  }
}
