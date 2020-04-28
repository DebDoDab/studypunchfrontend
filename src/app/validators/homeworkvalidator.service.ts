import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class HomeworkvalidatorService {

  constructor() { }

  static validateData(homeworkData: FormGroup, alert: Alert): boolean {
    if (!homeworkData.get('name').value) {
      alert.set("Name field may not be blank", "danger");
      return false;
    }

    if (!(homeworkData.get('deadline').value instanceof Date)) {
      alert.set("Use right deadline format", "danger");
      return false;
    }

    if (!(homeworkData.get('subject').value.id)) {
      alert.set("Select subject from a list below", "danger");
      return false;
    }
    return true;
  }
}
