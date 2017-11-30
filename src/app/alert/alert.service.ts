import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
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
          this.subject.next();
        }
      }
    });
  }

  error(message: string, autoRemove = false, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message, autoRemove });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, autoRemove = true, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message, autoRemove });
  }
}