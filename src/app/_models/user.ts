export class User {
  _id?: string;
  fname: string;
  lname: string;
  email: string;
  password?: string;
  leader: boolean;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  admin: boolean;
  token?: string;

  constructor(obj) {
    this._id = obj._id;
    this.fname = obj.fname;
    this.lname = obj.lname;
    this.email = obj.email;
    this.leader = obj.leader;
    this.phone = obj.phone;
    this.emergencyName = obj.emergencyName;
    this.emergencyPhone = obj.emergencyPhone;
    this.admin = obj.admin;
  }

  get initials() {
    return this.fname.substr(0, 1) + this.lname.substr(0, 1);
  }

  get fullName() {
    return `${this.fname} ${this.lname}`;
  }


}
