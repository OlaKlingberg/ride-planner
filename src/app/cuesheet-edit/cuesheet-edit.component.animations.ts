import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';

export const cuesheetEditAnimations = [


  trigger('cueRow', [
    state('display', style({
      fontSize: '*',
      padding: '*',
      opacity: 1,
    })),
    state('removed', style({
      fontSize: 0,
      padding: 0,
      opacity: 0
    })),
    transition('display => removed', [
      animate('300ms')
    ])
  ]),

  trigger('cueCell', [
    state('display', style({
      fontSize: '*',
      padding: '*',
      opacity: 1
    })),
    state('removed', style({
      fontSize: 0,
      padding: 0,
      opacity: 0
    })),
    transition('display => removed', [
      animate('300ms')
    ])
  ]),
];


