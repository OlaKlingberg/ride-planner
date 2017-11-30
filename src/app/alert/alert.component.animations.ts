import { animate, state, style, transition, trigger } from '@angular/animations';

export const alertAnimations = [
  trigger('messageState', [
    state('new', style({
      display: 'block',
      opacity: 1,
      transform: 'scaleY(1)'
    })),
    state('faded', style({
      display: 'none',
      opacity: 0,
      transform: 'scaleY(0)'
    })),
    transition('void => new', [
      style({
        opacity: 0,
      }),
      animate('200ms ease-in')
    ]),
    transition('new => faded', [
      style({
        height: '*',
        border: '*',
        padding: '*',
        margin: '*'
      }),
      animate('500ms ease-in')
    ])
  ])
]