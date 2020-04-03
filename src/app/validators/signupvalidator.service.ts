import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignupvalidatorService {

  constructor() { }

  static validateData(signupData, alert): boolean {
    if (signupData.get('password').value !== signupData.get('passwordConfirm').value) {
      alert.set("Passwords don't match", "danger");
      return false;
    } else if (signupData.get('password').value.length < 8) {
      alert.set("Password should be at least 8 symbols", "danger");
      return false;
    } else if (signupData.get('group_action').value === "Group" && signupData.get('group_name').value === "") {
      alert.set("Group field may not be blank", "danger");
      return false;
    }
    return true;
  }
}
