import { Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[focus]'
})
export class FocusDirective implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input('focus') focusEvent: EventEmitter<boolean>;

  constructor(@Inject(ElementRef) private element: ElementRef) { }

  ngOnInit() {
    this.subscription = this.focusEvent.subscribe(event => {
      this.element.nativeElement.focus();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
