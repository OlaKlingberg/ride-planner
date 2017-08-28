export class Ride {
  _creator: any;  // Todo: Type this.
  _id: string;
  description: string;
  name: string;

  constructor(obj) {
    this._creator = obj._creator;
    this._id = obj._id;
    this.description = obj.description;
    this.name = obj.name;
  }
}