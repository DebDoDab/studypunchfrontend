import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { User } from '../models/user';
import { Subject } from '../models/subject';
import { Homework } from '../models/homework';
import { Group } from '../models/group';
import { CurrentUserService } from '../shared/services/current-user.service';
import { ApierrorhandlerService } from '../validators/apierrorhandler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
//   private baseurl = "http://api.vadi.tel/api/";
  private baseurl = "http://localhost:8000/api/";
  private httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'},
  );

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router) {
  }

  private setHeadersAuth(): void {
    if (this.cookies.check('access_token')) {
      this.httpHeaders = this.httpHeaders.set(
        'Authorization', 'JWT ' + this.cookies.get('access_token'),
      );
    }
  }

  private setCookiesAuth(response: JSON) {
    if (response['access']) {
      this.cookies.delete('access_token');
      this.cookies.set('access_token', response['access'], undefined, '/');
    }
    if (response['refresh']) {
      this.cookies.delete('refresh_token');
      this.cookies.set('refresh_token', response['refresh'], undefined, '/');
    }
    this.setHeadersAuth();
  }

  private redirectToLogin(): void {
    this.router.navigateByUrl('login');
  }

  private async createJWT(loginData): Promise<any> {
    if (loginData['username']) {
      loginData['username'] = loginData['username'].toLowerCase()
    }
    return this.http
      .post(this.baseurl + 'auth/jwt/create/',
        loginData,
        {headers: this.httpHeaders, observe: 'body'})
      .toPromise()
      .then(response => {
        this.setCookiesAuth(<JSON>response);
      });
  }

  private async refreshJWT(): Promise<any> {
    return this.http
      .post(this.baseurl + 'auth/jwt/refresh/',
        {refresh: this.cookies.get('refresh_token')},
        {headers: this.httpHeaders, observe: 'body'}
    ).toPromise()
      .then(response => {
        this.setCookiesAuth(<JSON>response);
      });
  }

  private async verifyJWT(token: string = this.cookies.get('access_token')): Promise<any> {
    return this.http
      .post(this.baseurl + 'auth/jwt/verify/',
        {token: token},
        {headers: this.httpHeaders, observe: 'body'}
    ).toPromise();
  }

  private async setJWT(): Promise<any> {
    await this.refreshJWT()
      .then(() => {
        this.setHeadersAuth();
        return;
      }).catch(() => {
        CurrentUserService.setCurrentUsertoNone();
        this.redirectToLogin();
        throw new Error("Need to authenticate");
      });
  }

  async login(loginData): Promise<any> {
    try {
      var x = await this.createJWT(loginData);
      CurrentUserService.setCurrentUser(this);
      return new Observable((observer) => {
        observer.next({message: "You succesfully logined", type: "success"});
        observer.complete();
      }).toPromise();
    } catch(error) {
      return new Observable((observer) => {
        observer.next({message: ApierrorhandlerService.parseError(error), type: "danger"});
        observer.complete();
      }).toPromise();
    }
  }

  logout() {
    this.httpHeaders.delete('access_token');
    this.httpHeaders.delete('refresh_token');
    this.cookies.delete('access_token');
    this.cookies.delete('refresh_token');
    CurrentUserService.setCurrentUser(this);
  }

  async signup(signupData): Promise<any> {
    try {
      let user = await this.http
      .post(this.baseurl + 'users/', signupData, {headers: this.httpHeaders})
      .toPromise()
      .then(resp => <User>resp);

      await this.createJWT({username: signupData['username'], password: signupData['password']});
      CurrentUserService.setCurrentUser(this);
      return new Observable((observer) => {
        observer.next({message: "You succesfully logined", type: "success"});
        observer.complete();
      }).toPromise();
    } catch(error) {
      return new Observable((observer) => {
        observer.next({message: ApierrorhandlerService.parseError(error), type: "danger"});
        observer.complete();
      }).toPromise();
    }

  }

  async createGroup(groupData): Promise<Group> {
    return this.http
      .post(this.baseurl + 'groups/', groupData, {headers: this.httpHeaders})
      .toPromise()
      .then(resp => <Group>resp);
      // .catch(error => {message: ApierrorhandlerService.parseError(error), type: "danger"});
  }

  async getCurrentUser(): Promise<User> {
    await this.setJWT();
    let user = await this.http
      .get(this.baseurl + "auth/users/me/", {headers: this.httpHeaders})
      .toPromise();
    return this.http
      .get(this.baseurl + 'users/' + user['id'] + '/', {headers: this.httpHeaders})
      .toPromise()
      .then(resp => {
        return <User>resp;
      });
  }

  async changeUserData(userData): Promise<any> {
    return; // TODO:
  }

  async getHomework(subject = undefined): Promise<Array<Homework>> {
    await this.setJWT();
    let query = ""
    if (subject) {
      query = "?subject_id=" + subject;
    }
    return this.http
      .get(this.baseurl + "homework/" + query, {headers: this.httpHeaders})
      .toPromise()
      .then(resp => {
        return <Array<Homework>>resp['results'];
      });
  }

  async getUsers(): Promise<Array<User>> {
    await this.setJWT();
    return this.http
      .get(this.baseurl + "users/", {headers: this.httpHeaders})
      .toPromise()
      .then(resp => {
        return <Array<User>>resp['results'];
      });
  }

  async getSubjects(): Promise<Array<Subject>> {
    await this.setJWT();
    return this.http
      .get(this.baseurl + 'subjects/', {headers: this.httpHeaders})
      .toPromise()
      .then(resp => {
        return <Array<Subject>>resp['results'];
      });
  }

  async getSubjectHomework(subjectId: number): Promise<Array<Homework>> {
    await this.setJWT();
    return this.http
      .get(this.baseurl + 'homework/?subject_id' + subjectId, {headers: this.httpHeaders})
      .toPromise()
      .then(resp => {
        return <Array<Homework>>resp['results'];
      });
  }

  async getSubject(subjectId: number): Promise<Subject> {
    await this.setJWT();
    return this.http
      .get(this.baseurl + 'subjects/' + subjectId + '/', {headers: this.httpHeaders})
      .toPromise()
      .then(resp => <Subject>resp);
  }

  async patchSubject(subjectId: number, data): Promise<Subject> {
    await this.setJWT();
    return this.http
      .patch(this.baseurl + 'subjects/' + subjectId + '/',
        data,
        {headers: this.httpHeaders})
      .toPromise()
      .then(resp => <Subject>resp);
  }

  async postSubject(data): Promise<Subject> {
    await this.setJWT();
    let group_id = CurrentUserService.user.group.id;
    data['group_id'] = group_id;
    return this.http
      .post(this.baseurl + 'subjects/',
        data,
        {headers: this.httpHeaders})
      .toPromise()
      .then(resp => <Subject>resp);
  }

  async patchHomework(homeworkId: number, data): Promise<Homework> {
    let datacopy = data;
    datacopy['deadline'] = data['deadline'].toISOString().split('T')[0];
    datacopy['subject_id'] = data['subject'].id;
    delete data['subject'];
    await this.setJWT();
    return this.http
      .patch(this.baseurl + 'homework/' + homeworkId + '/',
        data,
        {headers: this.httpHeaders})
      .toPromise()
      .then(resp => <Homework>resp);
  }

  async postHomework(data): Promise<Homework> {
    let datacopy = data;
    datacopy['deadline'] = data['deadline'].toISOString().split('T')[0];
    datacopy['subject_id'] = data['subject'].id;
    delete data['subject'];
    await this.setJWT();
    let group_id = CurrentUserService.user.group.id;
    data['group_id'] = group_id;
    return this.http
      .post(this.baseurl + 'homework/',
        data,
        {headers: this.httpHeaders})
      .toPromise()
      .then(resp => <Homework>resp);
  }
}
