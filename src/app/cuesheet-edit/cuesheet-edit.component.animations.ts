// import {
//   trigger,
//   state,
//   style,
//   animate,
//   transition,
//   keyframes
// } from '@angular/animations';

import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';


export const cuesheetEditAnimations = [
  trigger('cueState', [
    state('display', style({
      opacity: 1,
      height: '*',
      fontSize: '*',
      padding: '*',
      border: '*'
    })),
    state('remove', style({
      opacity: 0,
      height: 0,
      fontSize: 0,
      padding: 0,
      border: 0
    })),
    transition('display => remove', [
      animate('800ms', keyframes([
        style({
          opacity: 0,
          offset: .5
        }),
        style({
          opacity: 0,
          height: 0,
          fontSize: 0,
          padding: 0,
          border: 0,
          offset: 1
        })
      ]))
    ])
  ]),
  trigger('newCueRow', [
    state('display', style({
      opacity: 1,
      height: '*',
      fontSize: '*',
      padding: '*',
      border: '*'
    })),
    state('hide', style({
      opacity: 0.2,
      height: 0,
      fontSize: 0,
      padding: 0,
      border: 0
    })),
    transition('display => move', [
      animate(`1400ms`, keyframes([
        style({
          opacity: .2,
          offset: .1
        }),
        style({
          opacity: 0,
          height: 0,
          fontSize: 0,
          padding: 0,
          border: 0,
          offset: .45
        }),
        style({
          opacity: 0,
          height: 0,
          fontSize: 0,
          padding: 0,
          border: 0,
          offset: .55
        }),
        style({
          opacity: .2,
          height: '*',
          fontSize: '*',
          padding: '*',
          border: '*',
          offset: .9
        }),
        style({
          opacity: 1,
          offset: 1
        })
      ]))
    ])
  ])
];


