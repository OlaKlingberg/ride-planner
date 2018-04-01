import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs';

@Injectable()
export class AlertService {
  private messageSubject = new BehaviorSubject<any>(null);
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // Clear alert message on route change.
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // Keep only for a single location change.
          this.keepAfterNavigationChange = false;
        } else {
          // Clear alert.
          this.messageSubject.next(null);
        }
      }
    });
  }

  error(message: string, autoRemove = false, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.messageSubject.next({ type: 'error', text: message, autoRemove });
  }

  getMessage(): Observable<any> {
    return this.messageSubject;
  }

  success(message: string, autoRemove = true, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.messageSubject.next({ type: 'success', text: message, autoRemove });
  }
}