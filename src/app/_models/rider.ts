import { User } from './user';

export class Rider extends User {
  lat?: number;
  lng?: number;
  ride?: string;
  socketId?: string;
  disconnected: boolean = false;
  opacity: number = 1;
  color?: number = null;
  zInd?: number;
  disconnectTime?: number;

  constructor(obj, coords = null, ride = null) {
    super(obj);

    if (coords) {
      this.lat = coords.lat;
      this.lng = coords.lng;
    } else if (obj.lat && obj.lng) {
      this.lat = obj.lat;
      this.lng = obj.lng;
    }

    this.ride = ride || obj.ride;
    this.disconnected = obj.disconnected || false;
    this.disconnectTime = obj.disconnectTime || null;
    this.opacity = 1;
    this.socketId = obj.socketId || null;
  }

  get colorNumber() {
    let colorNumber = this.fname.charCodeAt(0) + this.lname.charCodeAt(0);
    if (this.lname.length >= 2) colorNumber += this.lname.charCodeAt(1);
    return colorNumber % 8;
  }

  get zIndex() {
    let zIndex = this.fname.charCodeAt(0) + this.fname.charCodeAt(1);
    if (this.fname.length >= 2) zIndex += this.lname.charCodeAt(1);
    return zIndex;
  }


}