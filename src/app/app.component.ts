import { Component, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';
import { CurrentUserService } from './shared/services/current-user.service';

import { User } from './models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiService]
})
export class AppComponent implements OnInit {
  title = 'Study Punch';
  userPipe: Observable<User> = CurrentUserService.userPipe;

  constructor(private api: ApiService) {
    CurrentUserService.setCurrentUser(this.api);
  }

  ngOnInit() {
  }


}
