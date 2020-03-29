import { Homework } from './homework';

export class Column {
  title: string;
  data: Array<Homework>;

  constructor(title: string = "") {
    this.title = title;
    this.data = new Array();
  }
}
