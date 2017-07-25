import { Component, Input, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Cue } from '../_models/cue';

@Component({
  selector: 'rp-cuesheet-cue',
  templateUrl: './cuesheet-cue.component.html',
  styleUrls: ['./cuesheet-cue.component.scss'],
  animations: [
    trigger('icon', [
      // state('up', style({
      //   transform: 'scale(.5)',
      // })),
      // state('down', style({
      //   transform: 'scale(.5)'
      // })),
      transition('still => up', animate('500ms', style({
        transform: 'scale(.5)'
      }))),
      transition('still => down', animate('1000ms 1000ms'))
    ])
  ]
})
export class CuesheetCueComponent implements OnInit {
  @Input() cue: Cue;
  @Input() cueNumber: number;
  @Input() position: string;
  @Input() move: string;

  constructor() { }

  ngOnInit() {
  }





}
