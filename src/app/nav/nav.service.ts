import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import { RefreshService } from '../core/refresh.service';

@Injectable()
export class NavService {
  public navBarState$: BehaviorSubject<string> = new BehaviorSubject('hide');

  constructor(private refreshService: RefreshService) {
    this.refreshService.checkAutoRefresh().then(autoRefresh => {
      autoRefresh ? this.navBarState$.next('hide') : this.navBarState$.next('show');
    });

  }


}
