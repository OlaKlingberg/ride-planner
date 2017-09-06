/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
import { DataSource } from '@angular/cdk/collections';
// import { ExampleDatabase } from '../example-database';
import { MdSort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../user.service';
import { TestDatabase } from './test-database';

// import { UserData } from '../user-data.interface';

export class MemberListDataSource extends DataSource<any> {

  constructor(private _testDatabase: TestDatabase,
              private _sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any> {
    const displayDataChanges = [
      this._testDatabase.dataChange,
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
    const data = this._testDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'name': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'phone': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'emergencyContact': [propertyA, propertyB] = [a.progress, b.progress]; break;
        case 'emergencyPhone': [propertyA, propertyB] = [a.color, b.color]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
