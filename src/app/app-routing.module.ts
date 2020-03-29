import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeworkComponent } from './homework/homework.component';
import { LoginComponent } from './login/login.component';
import { GroupComponent } from './group/group.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/homework', pathMatch: 'full' },
  { path: 'homework', component: HomeworkComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'group', component: GroupComponent },
  { path: 'subjects', component: SubjectsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
