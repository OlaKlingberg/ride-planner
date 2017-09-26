import { Component, Input } from '@angular/core';

import { Cue } from '../cue';

@Component({
  selector: 'rp-cuesheet-cue',
  templateUrl: './cuesheet-bike-cue.component.html',
  styleUrls: ['./cuesheet-bike-cue.component.scss']
})
export class CuesheetBikeCueComponent {
  @Input() cue: Cue;
  @Input() cueNumber: number;
}
