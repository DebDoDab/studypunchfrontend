import { Group } from './group'

export class User {
  id: number;
  username: string;
  group: Group;

  constructor() {
    this.id = -1;
    this.username = "undefined";
    this.group = new Group();
  }
}
