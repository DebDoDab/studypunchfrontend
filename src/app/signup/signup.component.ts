import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../shared/services/current-user.service';
import { Alert } from '../models/alert';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../api/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApierrorhandlerService } from '../validators/apierrorhandler.service';
import { SignupvalidatorService } from '../validators/signupvalidator.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  alert: Alert = new Alert();
  signupData = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
    passwordConfirm: new FormControl(""),
    group_token: new FormControl(""),
    group_name: new FormControl(""),
    group_action: new FormControl("Group")
  });

  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  signup() {
    if (!SignupvalidatorService.validateData(this.signupData, this.alert)) {
      return;
    }
    if (this.signupData.get('group_action').value == 'Token') {
      this.api.signup(this.signupData.value).then(result => {
        this.alert.set(result.message, result.type);
        if (result.type == 'success') {
          this.router.navigateByUrl('group', {skipLocationChange: false});
        }
      }).catch(err => {});
    } else {
      let token = "";
      this.api.createGroup({name: this.signupData.get('group_name').value})
        .then(group => {
          token = group['token'];

          this.signupData.patchValue({group_token: token});
          this.api.signup(this.signupData.value).then(result => {
            this.alert.set(result.message, result.type);
            if (result.type == 'success') {
              this.router.navigateByUrl('group', {skipLocationChange: false});
            }
          });
        }).catch(error => {
          this.alert.set(ApierrorhandlerService.parseError(error), "danger");
        });
    }
  };

  loginClick() {
    this.router.navigateByUrl('login', {skipLocationChange: true});
  }

}
