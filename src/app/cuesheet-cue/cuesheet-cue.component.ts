import { Component, Input, OnInit } from '@angular/core';
import { Cue } from '../_models/cue';

@Component({
  selector: 'rp-cuesheet-cue',
  templateUrl: './cuesheet-cue.component.html',
  styleUrls: ['./cuesheet-cue.component.scss']
})
export class CuesheetCueComponent implements OnInit {
  @Input() cue: Cue;
  @Input() cueNumber: number;

  constructor() { }

  ngOnInit() {
  }





}
