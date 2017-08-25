import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NavService {
  public navBarState$: BehaviorSubject<string> = new BehaviorSubject('show');
}
