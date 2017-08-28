import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RideSubjectService {
  ride$: BehaviorSubject<string> = new BehaviorSubject(null);
}