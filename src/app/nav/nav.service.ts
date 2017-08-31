import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class NavService {
  public navBarState$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor() {
    const autoRefresh = environment.storage.getItem('rpAutoRefresh');
    environment.storage.removeItem('prAutRefresh');

    autoRefresh ? this.navBarState$.next('hide') : this.navBarState$.next('show');
  }


}
