import { Homework } from './homework';

export class Column {
  id: number;
  name: string;
  data: Array<Homework>;
  less_than: number;
  editable: boolean;

  constructor(id: number = -1, name: string = "", less_than: number = 7, editable: boolean = true) {
    this.id = -1;
    this.name = name;
    this.data = new Array();
    this.less_than = less_than;
    this.editable = editable;
  }
}
