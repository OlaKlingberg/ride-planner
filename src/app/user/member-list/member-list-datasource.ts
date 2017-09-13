import { DataSource } from '@angular/cdk/collections';
import { MdSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from '../user.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

export class MemberListDataSource extends DataSource<any> {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  get data() {
    return this.dataChange.value;
  }

  constructor(private _sort: MdSort,
              private userService: UserService) {
    super();
    // Todo: Do I have a memory leak here? When should I unsubscribe from this?
    this.userService.getAllUsers().subscribe(data => {
      console.log("MemberList. data:", data);
      this.dataChange.next(data);
    });
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any> {
    const displayDataChanges = [
      this.dataChange,
      this._sort.mdSortChange,
      this._filterChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData().filter(item => {
        let searchStr = (item.fname + item.lname).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData() {
    const data = this.data.slice();
    if ( !this._sort.active || this._sort.direction === '' ) {
      return data;
    }

    return data.sort((a, b) => {
      let primaryA: number | string = '';
      let primaryB: number | string = '';
      let secondaryA: number | string = '';
      let secondaryB: number | string = '';

      switch ( this._sort.active ) {
        case 'fullName':
          [ primaryA, primaryB, secondaryA, secondaryB ] = [ a.lname, b.lname, a.fname, b.fname ];
          break;
        case 'email':
          [ primaryA, primaryB, secondaryA, secondaryB ] = [ a.email, b.email, null, null ];
          break;
        case 'emergencyName':
          [ primaryA, primaryB, secondaryA, secondaryB ] = [ a.emergencyName, b.emergencyName, null, null ];
          break;
      }

      let primA = isNaN(+primaryA) ? primaryA : +primaryA;
      let primB = isNaN(+primaryB) ? primaryB : +primaryB;
      let secA = isNaN(+secondaryA) ? secondaryA : +secondaryA;
      let secB = isNaN(+secondaryB) ? secondaryB : +secondaryB;

      /** Sort on primary values. If primary values are equal, sort on secondary values. **/
      return (primA < primB ? -1 : primA > primB ? 1 : secA < secB ? -1 : 1) *
          (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
