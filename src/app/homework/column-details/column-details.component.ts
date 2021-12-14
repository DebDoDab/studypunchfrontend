import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Column } from '../../models/column';
import { FormControl, FormGroup } from '@angular/forms';
import { Alert } from '../../models/alert';
import { ApiService } from 'src/app/api/api.service';

import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject as rxSubject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { ColumnvalidatorService } from 'src/app/validators/columnvalidator.service';

@Component({
  selector: 'app-column-details',
  templateUrl: './column-details.component.html',
  styleUrls: ['./column-details.component.css']
})
export class ColumnDetailsComponent implements OnInit {
  column: Column = new Column();

  @Input()
  set columnset(column: Column) {
    this.column = column;
    this.columnData.setValue({
      name: column.name,
      less_than: column.less_than,
    });
  }
  @Input()
  isEditing: boolean = true;

  columnData = new FormGroup({
    name: new FormControl(""),
    less_than: new FormControl(7),
  });
  alert: Alert = new Alert();

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new rxSubject<string>();
  click$ = new rxSubject<string>();

  constructor(
    private api: ApiService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {

  }

  submit() {
    if (!ColumnvalidatorService.validateData(this.columnData, this.alert)) {
      return;
    }
    if (this.isEditing) {
      this.api.patchColumn(this.column.id, this.columnData.value)
      .then(resp => {
        this.column = resp;
        this.alert.clear();
        this.navigateBack();
      }).catch(error => {
        this.alert.set(error.message, 'danger');
      });
    } else {
      this.api.postColumn(this.columnData.value)
        .then(resp => {
          this.column = resp;
          this.alert.clear();
          this.navigateBack();
        }).catch(error => {
          this.alert.set(error.message, 'danger');
        });
    }
  }

  delete(): void {
    this.api.deleteColumn(this.column.id)
          .then(resp => {
            this.column = resp;
            this.alert.clear();
            this.navigateBack();
          }).catch(error => {
            this.alert.set(error.message, 'danger');
          });
  }

  navigateBack() {
    this.activeModal.close(this.column);
  }

}
