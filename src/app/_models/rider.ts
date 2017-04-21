import { User } from './user';

export class Rider extends User {
  lat?: number;
  lng?: number;
  color?: number;

  constructor(rider) {
    super(rider);

    this.lat = rider.lat;
    this.lng = rider.lng;
  }

}