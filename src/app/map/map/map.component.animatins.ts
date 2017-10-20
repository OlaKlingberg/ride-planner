import { animate, state, style, transition, trigger } from '@angular/animations';

export const MapAnimations = [
  trigger('buttons', [
    state('show', style({
      opacity: 1,
      display: "block"
    })),
    state('hide', style({
      opacity: 0,
      display: "none"
    })),
    transition('show => hide', animate('500ms')),
  ]),
  trigger('notLoggedInWarning', [
    state('0', style({
      opacity: 0,
      display: "none"
    })),
    state('1', style({
      opacity: 1,
      display: "block"
    })),
    transition("0 => 1", animate('400ms 2s')),
  ])
];