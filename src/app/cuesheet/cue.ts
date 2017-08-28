export class Cue {
  _id: string;
  comment: string;
  createdAt: Date;
  description: string;
  distance: number;
  icon: string;
  lat: number;
  lng: number;
  state: 'display' | 'removed' = 'display';
  total: number = 0;
  turn: string;
  updatedAt: Date;

  constructor(obj) {
    if (obj) {
      this._id = obj._id;
      this.comment = obj.comment;
      this.createdAt = obj.createdAt;
      this.description = obj.description;
      this.distance = obj.distance;
      this.lat = obj.lat;
      this.lng = obj.lng;
      this.turn = obj.turn;
      this.updatedAt = obj.updatedAt;
    }
  }
}