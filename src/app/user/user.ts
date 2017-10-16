import { environment } from "../../environments/environment";

// let latInitialAdd,
//     latIncrement,
//     lngInitialAdd,
//     lngIncrement,
//     timer;

// if ( environment.dummyPosition ) {
//   latInitialAdd = Math.random() * .001 - .0005;
//   lngInitialAdd = Math.random() * .001 - .0005;
// }
//
// if ( environment.dummyMovement ) {
//   latIncrement = Math.random() * .0001 - .00005;
//   lngIncrement = Math.random() * .0001 - .00005;
//   timer = Math.random() * 3000 + 500;
// }

export class User {
  _id: string;
  admin: boolean;
  disconnected: number;
  dummy: boolean;
  email: string;
  emergencyName: string;
  emergencyPhone: string;
  fname: string;
  leader: boolean;
  lname: string;
  phone: string;
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

  constructor(obj) {
    this._id = obj._id;
    this.admin = obj.admin;
    this.disconnected = obj.disconnected;
    this.dummy = obj.dummy;
    this.email = obj.email;
    this.emergencyName = obj.emergencyName;
    this.emergencyPhone = obj.emergencyPhone;
    this.fname = obj.fname;
    this.leader = obj.leader;
    this.lname = obj.lname;
    this.phone = obj.phone;
    this.ride = obj.ride;
    this.socketId = obj.socketId; // Todo: Do I need this?

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

  get colorNumber() {
    if ( this.leader ) return 1;  // Leader are red even if disconnected.
    if ( this.disconnected && Date.now() - this.disconnected > 5000 ) return 0; // Disconnected riders are gray.
    // Base the colorNumber on the first letter of the first name + the second letter of the last name.
    let colorNumber = this.fname.charCodeAt(0) + this.lname.charCodeAt(0);
    if ( this.lname.length >= 2 ) colorNumber += this.lname.charCodeAt(1);
    return colorNumber % 40 + 2;
  }

  get fullName() {
    return `${this.fname} ${this.lname}`;
  }

  get initials() {
    return this.fname.substr(0, 1) + this.lname.substr(0, 1);
  }

  get minutesSinceDisconnected() {
    if ( !this.disconnected ) return null;
    return Math.round((Date.now() - this.disconnected) / 60000);
  }

  get opacity() {
    if ( this.disconnected && Date.now() - this.disconnected > 5000 ) return .5;
    return 1;
  }

  get secondsSinceDisconnected() {
    if ( !this.disconnected ) return null;
    return (Date.now() - this.disconnected) / 1000;
  }
}
