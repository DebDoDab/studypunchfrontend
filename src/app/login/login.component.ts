import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Alert } from '../models/alert';
import { CurrentUserService } from '../shared/services/current-user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userPipe = CurrentUserService.userPipe;
  alert: Alert = new Alert();
  loginData = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });

  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {

  }

  login() {
    this.api.login(this.loginData.value).then(result => {
      this.alert.set(result.message, result.type);
    }).catch(err => {});
  };

  logoutClick() {
    this.api.logout();
  }

  signupClick() {
    this.router.navigateByUrl('signup');
  }

}
