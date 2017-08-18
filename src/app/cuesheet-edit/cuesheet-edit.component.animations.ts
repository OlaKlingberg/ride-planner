import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';

// I had some problems animating the entering and leaving of the rows using :enter, :leave, or void, so I animate the rows out and then remove them, or add them and then animate them in.
export const cuesheetEditAnimations = [
  trigger('cueRow', [
    state('display', style({
      fontSize: '*',
      padding: '*',
    })),
    state('remove', style({
      fontSize: 0,
      padding: 0,
    })),
    transition('display => remove', [
      animate('300ms')
    ])
  ]),

  trigger('cueCell', [
    state('display', style({
      padding: '*',
    })),
    state('remove', style({
      padding: 0,
    })),
    transition('display => remove', [
      animate('200ms 300ms')
    ])
  ]),

  trigger('cueFormRow', [
    state('display', style({
      fontSize: '*',
      padding: '*',
    })),
    state('remove', style({
      fontSize: 0,
      padding: 0,
    })),
    transition('display <=> remove', [
      animate('2000ms')
    ])
  ]),

  trigger('cueFormCell', [
    state('display', style({
      padding: '*'
    })),
    state('remove', style({
      padding: 0
    })),
    transition('display <=> remove', [
      animate('2000ms')
    ])
  ]),

  trigger('cueFormInput', [
    state('display', style({
      fontSize: '*',
      padding: '*',
      height: '*',
      border: '*',
      margin: '*'
    })),
    state('remove', style({
      fontSize: 0,
      padding: 0,
      height: 0,
      border: 0,
      margin: 0
    })),
    transition('display <=> remove', [
      animate('2000ms')
    ])
  ]),

  // The buttons don't animate nicely, so I remove them and set a color to the td instead.
  // A lot of code for very little effect ...
  trigger('cueFormCellRed', [
    state('display', style({
      fontSize: '*',
      padding: '*',
      height: '*',
      border: '*',
      margin: '*'
    })),
    state('remove', style({
      fontSize: 0,
      padding: 0,
      height: 0,
      border: 0,
      margin: 0
    })),
    transition('display <=> remove', [
      style({
        backgroundColor: '#a56264',
        opacity: 1
      }),
      animate('2000ms', style({
        opacity: 0,
        fontSize: 0,
        padding: 0,
        height: 0,
        border: 0,
        margin: 0
      }))
    ])
  ]),

  trigger('cueFormCellYellow', [
    state('display', style({
      fontSize: '*',
      padding: '*',
      height: '*',
      border: '*',
      margin: '*'
    })),
    state('remove', style({
      fontSize: 0,
      padding: 0,
      height: 0,
      border: 0,
      margin: 0
    })),
    transition('display <=> remove', [
      style({
        backgroundColor: '#a86e49',
        opacity: 1
      }),
      animate('2000ms', style({
        opacity: 0,
        fontSize: 0,
        padding: 0,
        height: 0,
        border: 0,
        margin: 0
      }))
    ])
  ])




];


