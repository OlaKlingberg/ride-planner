export class Ride {
  _id: string;
  name: string;
  description: string;
  _creator: any;  // Todo: Type this.

  constructor(obj) {
    this._id = obj._id;
    this.name = obj.name;
    this.description = obj.description;
    this._creator = obj._creator;
  }
}