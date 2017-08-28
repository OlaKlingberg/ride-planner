import { Cue } from './cue';

export class Cuesheet {
  _creator: any;  // Todo: Type this.
  _id: string;
  createdAt: Date;
  cues: Array<Cue> = [];
  description: string;
  name: string;
  updatedAt: Date;

  constructor(obj) {
    this._creator = obj._creator;     // Todo: Is this copied by reference, and is that a problem?
    this._id = obj._id;
    this.createdAt = obj.createdAt;
    this.description = obj.description;
    this.name = obj.name;
    this.updatedAt = obj.updatedAt;

    if (obj.cues) // Todo: Or: obj.cues.length > 0
    for (let i = 0; i < obj.cues.length; i++) {
      let cue = new Cue(obj.cues[i]);
      this.cues.push(cue);
    }
  }
}