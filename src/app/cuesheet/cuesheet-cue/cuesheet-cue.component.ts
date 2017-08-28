import { Component, Input } from '@angular/core';

import { Cue } from '../cue';

@Component({
  selector: 'rp-cuesheet-cue',
  templateUrl: './cuesheet-cue.component.html',
  styleUrls: ['./cuesheet-cue.component.scss']
})
export class CuesheetCueComponent {
  @Input() cue: Cue;
  @Input() cueNumber: number;
}
