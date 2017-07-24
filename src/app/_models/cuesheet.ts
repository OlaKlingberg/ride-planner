import { Cue } from './cue';

export class Cuesheet {
  _id: string;
  name: string;
  description: string;
  // _creator: string | object;
  _creator: any;  // Todo: Type this.
  updatedAt: Date;
  createdAt: Date;
  cues: Array<Cue> = [];

  constructor(obj) {
    this._id = obj._id;
    this.name = obj.name;
    this.description = obj.description;
    this._creator = obj._creator;     // Todo: Is this copied by reference, and is that a problem?
    this.updatedAt = obj.updatedAt;
    this.createdAt = obj.createdAt;

    if (obj.cues) // Todo: Or: obj.cues.length > 0
    for (let i = 0; i < obj.cues.length; i++) {
      let cue = new Cue(obj.cues[i]);
      this.cues.push(cue);
    }
  }
}