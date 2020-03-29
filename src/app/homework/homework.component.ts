import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../api/api.service';
import { Column } from '../models/column';
import { Homework } from '../models/homework';
import { User } from '../models/user';
import { Subject } from '../models/subject';

import { CurrentUserService } from '../shared/services/current-user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeworkDetailsComponent } from './homework-details/homework-details.component';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit {
  userPipe = CurrentUserService.userPipe;
  homework: Array<Column>;
  columnsNames = ["< week", "< 2 weeks", "longterm", "expired"];
  currentSubject: number = undefined;

  constructor(
    private api : ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.currentSubject = undefined;
    this.route.queryParams
      .subscribe(params => {
        this.currentSubject = params.id;

        this.homework = new Array(4).fill(false).map((value, index) => {
          return new Column(this.columnsNames[index]);
        });

        this.api.getHomework(this.currentSubject).then(resp => {
          this.divide(resp)
        });
      });
  }

  divide(result: Array<Homework>): void {
    let today = new Date();
    let week = new Date();
    week.setDate(today.getDate() + 7);
    let twoWeeks = new Date();
    twoWeeks.setDate(today.getDate() + 14);

    for (let homework of result) {
      homework.deadline = new Date(homework.deadline);
      if (homework.deadline <= today) {
        this.homework[3].data.push(homework);
      } else if (homework.deadline <= week) {
        this.homework[0].data.push(homework);
      } else if (homework.deadline <= twoWeeks) {
        this.homework[1].data.push(homework);
      } else {
        this.homework[2].data.push(homework);
      }
    }
  }

  btnClick(subject: Subject): void {
    if (subject.id == this.currentSubject) {
      this.router.navigateByUrl("homework");
    } else {
      this.router.navigateByUrl("homework?id=" + subject.id);
    }
  }

  addClick() {
    let homework: Homework;
    const modalRef = this.modalService.open(HomeworkDetailsComponent);
    modalRef.componentInstance.isEditing = false;
    modalRef.result.then((result) => {
      if (result) {
        homework = result;
      }
    }, (reason) => {
    }).finally(() => {
      this.replace(homework);
    });
  }

  homeworkClick(homework: Homework): void {
    const modalRef = this.modalService.open(HomeworkDetailsComponent);
    modalRef.componentInstance.homeworkset = homework;
    modalRef.result.then((result) => {
      if (result) {
        homework = result;
      }
    }, (reason) => {
    }).finally(() => {
      this.replace(homework);
    });
  }

  replace(subject: Subject): void {
    //need async pipes or full replace
    //now its nothing to do
    window.location.reload();
  }

}
