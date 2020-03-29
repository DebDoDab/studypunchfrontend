import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { CurrentUserService } from '../shared/services/current-user.service';
import { Subject } from '../models/subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubjectComponent } from './subject/subject.component';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
})
export class SubjectsComponent implements OnInit {
  subjects: Array<Array<Subject>> = new Array(4).fill(false).map(() => new Array());
  userPipe = CurrentUserService.userPipe;

  constructor(
    private api: ApiService,
    private router: Router,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.api.getSubjects().then(resp => {
      this.divide(resp);
    });
  }

  divide(response: Array<Subject>): void {
    let index = 0;
    for (let subject of response) {
      this.subjects[index % 4].push(subject);
      index++;
    }
  }

  addClick() {
    let subject: Subject;
    const modalRef = this.modalService.open(SubjectComponent);
    modalRef.componentInstance.isEditing = false;
    modalRef.result.then((result) => {
      if (result) {
        subject = result;
      }
    }, (reason) => {
    }).finally(() => {
      this.replace(subject);
    });
  }

  subjectClick(subject: Subject): void {
    const modalRef = this.modalService.open(SubjectComponent);
    modalRef.componentInstance.subjectset = subject;
    modalRef.result.then((result) => {
      if (result) {
        subject = result;
      }
    }, (reason) => {
    }).finally(() => {
      this.replace(subject);
    });
  }

  btnClick(subject: Subject): void {
    this.router.navigateByUrl("homework?id=" + subject.id);
  }

  replace(subject: Subject): void {
    //need async pipes or full replace
    //now its nothing to do
    window.location.reload();
  }


}
