export class User {
  _id: string;
  email: string;
  password: string;
  fname: string;
  lname: string;
  token?: string;
  initials: string;

  constructor(model: any) {
    this.fname = model.fname;
    this.lname = model.lname;
    this.initials = this.getInitials(model);
    console.log("User initialized!");
  }

  private getInitials(model: any) {
    return this.initials = this.fname.substr(0, 1) + this.lname.substr(0, 1);
  }


}
