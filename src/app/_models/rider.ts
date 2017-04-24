import { User } from './user';

export class Rider extends User {
  lat?: number;
  lng?: number;
  color?: number;
  ride?: string;

  constructor(user, coords = null, ride = null) {
    super(user);

    if (coords) {
      this.lat = coords.lat;
      this.lng = coords.lng;
    } else if (user.lat && user.lng) {
      this.lat = user.lat;
      this.lng = user.lng;
    }

    this.ride = ride || user.ride;
  }

  get colorNumber() {
    return ( this.initials.charCodeAt(0) + this.initials.charCodeAt(1) ) % 8
  }

}