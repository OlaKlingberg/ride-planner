export class User {
  _id?: string;
  fname: string;
  lname: string;
  email: string;
  password?: string;

  constructor(model: any) {
    this.fname = model.fname;
    this.lname = model.lname;
    this.email = model.email;
  }

  get initials() {
    return this.fname.substr(0, 1) + this.lname.substr(0, 1);
  }

  get fullName() {
    return `${this.fname} ${this.lname}`;
  }


}
