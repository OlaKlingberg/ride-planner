import { Component, OnInit, OnDestroy } from '@angular/core';
import { CuesheetService } from '../cuesheet.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './cuesheet-list.component.html',
  styleUrls: ['./cuesheet-list.component.scss']
})
export class CuesheetListComponent implements OnInit, OnDestroy {
  public cuesheets: Array<object> = [];
  private cuesheetSub: Subscription;

  constructor(private cuesheetService: CuesheetService) { }

  ngOnInit() {
    this.cuesheetSub = this.cuesheetService.getAllCuesheets()
        .subscribe(cuesheets => this.cuesheets = cuesheets);
  }

  ngOnDestroy() {
    this.cuesheetSub.unsubscribe();
  }

}
