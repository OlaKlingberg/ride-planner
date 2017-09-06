import { DataSource } from '@angular/cdk/collections';
import { MdSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from '../user.service';

export class MemberListDataSource extends DataSource<any> {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  get data() {
    return this.dataChange.value;
  }

  constructor(private _sort: MdSort,
              private userService: UserService) {
    super();
    this.userService.getAllUsers().subscribe(data => {
      this.dataChange.next(data.json().users);
    });
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any> {
    const displayDataChanges = [
      this.dataChange,
      this._sort.mdSortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData() {
    const data = this.data.slice();
    if ( !this._sort.active || this._sort.direction == '' ) {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch ( this._sort.active ) {
        case 'fullName':
          [ propertyA, propertyB ] = [ a.lname, b.lname ];
          break;
          case 'fname':
          [ propertyA, propertyB ] = [ a.fname, b.fname ];
          break;
        case 'phone':
          [ propertyA, propertyB ] = [ a.phone, b.phone ];
          break;
        case 'email':
          [ propertyA, propertyB ] = [ a.email, b.email ];
          break;
        case 'emergencyName':
          [ propertyA, propertyB ] = [ a.emergencyName, b.emergencyName ];
          break;
        case 'emergencyPhone':
          [ propertyA, propertyB ] = [ a.emergencyPhone, b.emergencyPhone ];
          break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
