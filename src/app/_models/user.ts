export class User {
  _id?: string;
  fname: string;
  lname: string;
  email: string;
  password?: string;
  leader: boolean;

  constructor(obj) {
    this._id = obj._id;
    this.fname = obj.fname;
    this.lname = obj.lname;
    this.email = obj.email;
    this.leader = obj.leader;
  }

  get initials() {
    return this.fname.substr(0, 1) + this.lname.substr(0, 1);
  }

  get fullName() {
    return `${this.fname} ${this.lname}`;
  }


}
