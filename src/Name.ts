import { Gender } from "./Gender";

export interface IName {
  name: string;
  genders: Gender[];
  usage: string;
  details: string;
}

export class Name implements IName {
  genders: Gender[];
  details: string;

  constructor(public name: string, genderStr: string, public usage: string, fullTextStr: string) {
    this.genders = [];
    if (genderStr.includes('m')) {
      this.genders.push(Gender.Male);
    }
    if (genderStr.includes('f')) {
      this.genders.push(Gender.Female);
    }

    this.details = fullTextStr.split('\n')[1];
  }

}