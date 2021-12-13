import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../../models/subject';
import { FormControl, FormGroup } from '@angular/forms';
import { Alert } from '../../models/alert';
import { ApiService } from 'src/app/api/api.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subject: Subject = new Subject();
  @Input()
  set subjectset(subject: Subject) {
    this.subject = subject;
    this.subjectData.setValue({name: subject.name, color: subject.color});
  }
  @Input()
  isEditing: boolean = true;

  subjectData = new FormGroup({
    name: new FormControl(""),
    color: new FormControl(""),
  });
  alert: Alert = new Alert();


  constructor(
    private api: ApiService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  submit() {
    if (this.isEditing) {
      this.api.patchSubject(this.subject.id, this.subjectData.value)
      .then(resp => {
        this.subject = resp;
        this.alert.clear();
        this.navigateBack();
      }).catch(error => {
        this.alert.set(error.message, 'danger');
      });
    } else {
      this.api.postSubject(this.subjectData.value)
        .then(resp => {
          this.subject = resp;
          this.alert.clear();
          this.navigateBack();
        }).catch(error => {
          this.alert.set(error.message, 'danger');
        });
    }
  }

  navigateBack() {
    this.activeModal.close(this.subject);
  }

}
