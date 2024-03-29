import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Homework } from '../../models/homework';
import { FormControl, FormGroup } from '@angular/forms';
import { Alert } from '../../models/alert';
import { WebsocketService } from 'src/app/websocket/websocket.service';
import { ApiService } from 'src/app/api/api.service';

import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject as rxSubject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { Subject } from 'src/app/models/subject';
import { HomeworkvalidatorService } from 'src/app/validators/homeworkvalidator.service';


@Component({
  selector: 'app-homework-details',
  templateUrl: './homework-details.component.html',
  styleUrls: ['./homework-details.component.css']
})
export class HomeworkDetailsComponent implements OnInit {
  homework: Homework = new Homework();
  subjects: Array<Subject>;

  @Input()
  set homeworkset(homework: Homework) {
    this.homework = homework;
    this.homeworkData.setValue({
      name: homework.name,
      description: homework.description,
      isImportant: homework.is_important,
      deadline: homework.deadline,
      subject: homework.subject
    });
  }
  @Input()
  isEditing: boolean = true;

  homeworkData = new FormGroup({
    name: new FormControl(""),
    description: new FormControl(""),
    isImportant: new FormControl(false),
    deadline: new FormControl(),
    subject: new FormControl(""),
  });
  alert: Alert = new Alert();

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new rxSubject<string>();
  click$ = new rxSubject<string>();

  constructor(
    private api: ApiService,
    public activeModal: NgbActiveModal,
    private Websocket: WebsocketService
  ) { }

  ngOnInit(): void {
    this.api.getSubjects().then(resp => {this.subjects = resp;});
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.subjects
        : this.subjects.filter(subject => subject.name.toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  }

  formatter = (subject: Subject) => subject.name;

  submit() {
    if (!HomeworkvalidatorService.validateData(this.homeworkData, this.alert)) {
      return;
    }
    if (this.isEditing) {
      this.api.patchHomework(this.homework.id, this.homeworkData.value)
      .then(resp => {
        this.homework = resp;
        this.alert.clear();
        this.navigateBack("edit");
          this.Websocket.subject.next({'homework': this.homework, 'method': 'edit'});
      }).catch(error => {
        this.alert.set(error.message, 'danger');
      });
    } else {
      this.api.postHomework(this.homeworkData.value)
        .then(resp => {
          this.homework = resp;
          this.alert.clear();
          this.navigateBack("create");
          this.Websocket.subject.next({'homework': this.homework, 'method': 'create'});
        }).catch(error => {
          this.alert.set(error.message, 'danger');
        });
    }
  }

  delete() {
    this.api.deleteHomework(this.homework.id)
      .then(resp => {
      // this.homework = resp;
      this.alert.clear();
      // window.location.reload();
      this.navigateBack("delete");
      this.Websocket.subject.next({'homework': this.homework, 'method': 'delete'});
    }).catch(error => {
      this.alert.set(error.message, 'danger');
    });
  }

  navigateBack(method: string = "get") {
    this.activeModal.close([this.homework, method]);
  }

}
