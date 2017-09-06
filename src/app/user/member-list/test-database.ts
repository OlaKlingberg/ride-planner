/** An example database that the data source uses to retrieve data for the table. */
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from '../user.service';

export class TestDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  get data() { return this.dataChange.value; }

  constructor(private userService: UserService) {
    this.userService.getAllUsers().subscribe(data => {
      this.dataChange.next(data.json().users);
    });

  }
}