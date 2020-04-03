import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApierrorhandlerService {

  constructor() { }

  static parseError(error) {
    console.log(error);
    if (((error['status'] / 100) >> 0) == 4) {
      let s: string = "";
      for (let err in error['error']) {
        console.log(err);
        s += err + ": " + error['error'][err] + "\n";
      }
      return s;
    } else {
      return "Error " + error['status'] + ": " + error['statusText'];
    }
  }
}
