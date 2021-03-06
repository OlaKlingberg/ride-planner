import { animate, state, style, transition, trigger } from '@angular/animations';

export const navAnimations = [
  trigger('navBar', [
    state('show', style({
      opacity: 1,
      display: "block"
    })),
    state('hide', style({
      opacity: 0,
      display: "none"
    })),
    transition('show => hide', animate('500ms')),
  ])
];
