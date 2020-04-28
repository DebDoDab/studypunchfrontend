import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { CurrentUserService } from '../shared/services/current-user.service';
import { Alert } from '../models/alert';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userPipe = CurrentUserService.userPipe;
  alert: Alert = new Alert();
  userData = new FormGroup({
    username: new FormControl(""),
    firstname: new FormControl(""),
    lastname: new FormControl(""),
  });

  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.alert.set("Coming soon...", "danger");
  }

  changeData() {
    this.api.changeUserData(this.userData.value).then(result => {
      return;  // TODO:
    });
  }

  logoutClick() {
    this.api.logout();
  }

  // login() {
  //   this.api.login(this.loginData.value).then(result => {
  //     this.alert.set(result.message, result.type);
  //     if (result.type == 'success') {
  //       this.router.navigateByUrl('group', {skipLocationChange: false});
  //     }
  //   }).catch(err => {});
  // };
  //
  // signupClick() {
  //   this.router.navigateByUrl('signup', {skipLocationChange: true});
  // }

}
