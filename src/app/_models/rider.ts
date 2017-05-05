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
    this.opacity = 1;
    this.socketId = obj.socketId || null;
  }

  get colorNumber() {
    return ( this.initials.charCodeAt(0) + this.initials.charCodeAt(1) ) % 8;
  }

  get zIndex() {
    return ( this.initials.charCodeAt(0) + this.initials.charCodeAt(1) );
  }

}