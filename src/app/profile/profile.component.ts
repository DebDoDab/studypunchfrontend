import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api/api.service';
import { CurrentUserService } from '../shared/services/current-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  userPipe = CurrentUserService.userPipe;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  logoutClick() {
    this.api.logout();
  }

}
