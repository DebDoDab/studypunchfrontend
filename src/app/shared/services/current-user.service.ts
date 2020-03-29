import { Injectable } from '@angular/core';

import { User } from '../../models/user';
import { ApiService } from '../../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  static user = new User();
  static userPipe: Observable<User> = new Observable<User>(observer => {
    observer.next(CurrentUserService.user);
    setInterval(() => {
      observer.next(CurrentUserService.user);
    }, 500);
  });

  constructor() {}

  static setCurrentUser(api: ApiService): void {
    api.getCurrentUser().then(user => {
      CurrentUserService.user = user;
    }).catch(err => {});
  }

  static setCurrentUsertoNone(): void {
    CurrentUserService.user = new User();
  }

  getCurrentUser(): User {
    return CurrentUserService.user;
  }




}
