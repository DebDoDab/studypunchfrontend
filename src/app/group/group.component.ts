import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ApiService } from '../api/api.service';
import { CurrentUserService } from '../shared/services/current-user.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  userPipe = CurrentUserService.userPipe;
  users: Array<Array<User>> = new Array(4).fill(false).map(() => {
    return new Array();
  });

  constructor(private api: ApiService, private router: Router) {

  }

  ngOnInit(): void {
    this.api.getUsers().then(resp => {
      this.divide(resp);
    });
  }

  divide(response: Array<User>) {
    let index = 0;
    for (let user of response) {
      this.users[index % 4].push(user);
      index++;
    }
  }

}
