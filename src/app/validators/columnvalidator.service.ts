import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class ColumnvalidatorService {

  constructor() { }

  static validateData(columnData: FormGroup, alert: Alert): boolean {
    if (!columnData.get('name').value) {
      alert.set("Name field may not be blank", "danger");
      return false;
    }

    // if (!(columnData.get('less_than').value instanceof Number)) {
    //   alert.set("Write less_than in number of days, for example '7'", "danger");
    //   return false;
    // }

    return true;
  }
}
