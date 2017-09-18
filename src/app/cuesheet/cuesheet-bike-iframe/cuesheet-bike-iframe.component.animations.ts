import { animate, state, style, transition, trigger } from '@angular/animations';

export const cuesheetBikeIframeAnimations = [
  trigger('cuesheetContainer', [
    state('up', style({
      transform: 'translate(0, -217px)'
    })),
    state('down', style({
      transform: 'translate(0, 217px)'
    })),
    transition('still => *', animate('500ms ease-in-out')),
  ])
];