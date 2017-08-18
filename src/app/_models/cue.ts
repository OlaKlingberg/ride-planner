export class Cue {
  _id: string;
  turn: string;
  icon: string;
  description: string;
  comment: string;
  distance: number;
  total: number = 0;
  lat: number;
  lng: number;
  createdAt: Date;
  updatedAt: Date;
  state: 'display' | 'removed' = 'display';

  constructor(obj) {
    if (obj) {
      this._id = obj._id;
      this.turn = obj.turn;
      this.description = obj.description;
      this.comment = obj.comment;
      this.distance = obj.distance;
      this.lat = obj.lat;
      this.lng = obj.lng;
      this.createdAt = obj.createdAt;
      this.updatedAt = obj.updatedAt;
      // this.icon = obj.icon;
    }
  }
}