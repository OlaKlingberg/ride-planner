import { environment } from "../../environments/environment";

let latInitialAdd,
    lngInitialAdd,
    latIncrement,
    lngIncrement,
    timer;

if ( environment.dummyPosition ) {
  latInitialAdd = Math.random() * .001 - .0005;
  lngInitialAdd = Math.random() * .001 - .0005;
}

if ( environment.dummyMovement ) {
  latIncrement = Math.random() * .0001 - .00005;
  lngIncrement = Math.random() * .0001 - .00005;
  timer = Math.random() * 3000 + 500;
}

export class User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  // password: string;
  leader: boolean;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  admin: boolean;
  position: {
    coords: {
      accuracy: number,
      latitude: number,
      longitude: number
    },
    timestamp: number,
  } = {
    coords: {
      accuracy: null,
      latitude: null,
      longitude: null
    },
    timestamp: null
  };

  ride: string;
  socketId: string;
  zIndex: number;
  disconnected: number;

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
    this.ride = obj.ride;
    this.socketId = obj.socketId; // Todo: Do I need this?
    this.disconnected = obj.disconnected;

    if ( obj.position ) {
      this.position = {
        coords: {
          accuracy: obj.position.coords.accuracy,
          latitude: obj.position.coords.latitude,
          longitude: obj.position.coords.longitude
        },
        timestamp: obj.position.timestamp
      }
    }
  }

  get initials() {
    return this.fname.substr(0, 1) + this.lname.substr(0, 1);
  }

  get fullName() {
    return `${this.fname} ${this.lname}`;
  }

  get colorNumber() {
    if ( this.leader ) return 1;  // Leader are red even if disconnected.
    if ( this.disconnected && Date.now() - this.disconnected > 5000 ) return 0; // Disconnected riders are gray.
    // Base the colorNumber on the first letter of the first name + the second letter of the last name.
    let colorNumber = this.fname.charCodeAt(0) + this.lname.charCodeAt(0);
    if ( this.lname.length >= 2 ) colorNumber += this.lname.charCodeAt(1);
    return colorNumber % 9 + 2;
  }

  get secondsSinceDisconnected() {
    if ( !this.disconnected ) return null;
    return (Date.now() - this.disconnected) / 1000;
  }

  get minutesSinceDisconnected() {
    if ( !this.disconnected ) return null;
    return Math.round((Date.now() - this.disconnected) / 60000);
  }

  get opacity() {
    if ( this.disconnected && Date.now() - this.disconnected > 5000 ) return .5;
    return 1;
  }

}
