import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../api/api.service';
import { WebsocketService } from '../websocket/websocket.service';
import { Column } from '../models/column';
import { Homework } from '../models/homework';
import { User } from '../models/user';
import { Subject } from '../models/subject';

import { CurrentUserService } from '../shared/services/current-user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeworkDetailsComponent } from './homework-details/homework-details.component';
import { ColumnDetailsComponent } from './column-details/column-details.component';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.css']
})
export class HomeworkComponent implements OnInit {
  userPipe = CurrentUserService.userPipe;
  columns: Array<Column>;
  columnsNames = ["< week", "< 2 weeks", "longterm", "expired"];
  currentSubject: number = undefined;

  constructor(
    private api : ApiService,
    private route: ActivatedRoute,
    private router: Router,
    public modalService: NgbModal,
    private Websocket: WebsocketService
  ) {
    this.api.getCurrentUser().then(resp => {
      var group_id = resp.group.id;
      this.Websocket.connect(group_id).subscribe(
        msg => { 
          let homework = <Homework>msg['homework'];
          let method = msg['method'];
          this.replace(homework, method);
        },
        err => console.log('websocket error', err),
        () => console.log('websocket complete')
      );
    });
  }

  ngOnInit(): void {
    this.currentSubject = undefined;
    this.route.queryParams
      .subscribe(params => {
        this.currentSubject = params.id;

        this.api.getColumns().then(resp => {
          this.set_columns(resp);
          this.api.getHomework(this.currentSubject).then(resp => {
            this.divide(resp)
          });
        });
      });
  }

  set_columns(columns: Array<Column>): void {
    this.columns = columns.map(column => {
      column.data = new Array<Homework>();
      column.editable = true;
      return column;
    });
    this.columns.sort((n1, n2) => {
      return n1.less_than - n2.less_than;
    });
    this.columns.push(new Column(
      -1,
      "longterm",
      Number.MAX_SAFE_INTEGER,
      false
    ));
    this.columns.push(new Column(
      -1,
      "expired",
      0,
      false
    ));
  }

  divide(result: Array<Homework>): void {
    let today = new Date();
    let days_limits = new Array<Date>();
    for (let column of this.columns) {
      days_limits.push(new Date());
      days_limits[days_limits.length - 1].setDate(today.getDate() + column.less_than);
    }

    for (let homework of result) {
      homework.deadline = new Date(homework.deadline);

      if (homework.deadline <= today) {
        this.columns[this.columns.length - 1].data.push(homework);
        continue;
      }
      let longterm = true;
      for (let column_num = 0; column_num < this.columns.length - 2; column_num++) {
        if (homework.deadline <= days_limits[column_num]) {
          this.columns[column_num].data.push(homework);
          longterm = false;
          break;
        }
      }

      if (longterm) {
        this.columns[this.columns.length - 2].data.push(homework);
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
    let method: string;
    const modalRef = this.modalService.open(HomeworkDetailsComponent);
    modalRef.componentInstance.isEditing = false;
    modalRef.result.then((result) => {
      if (result instanceof Array) {
        homework = result[0];
        method = result[1];
      } else if (result) {
        homework = result;
      }
    }, (reason) => {
    }).finally(() => {
      //this.replace(homework, method);
    });
  }

  columnAddClick() : void {
    let column: Column;
    const modalRef = this.modalService.open(ColumnDetailsComponent);
    modalRef.componentInstance.isEditing = false;
    modalRef.result.then((result) => {
      if (result) {
        column = result;
      }
    }, (reason) => {
    }).finally(() => {
      //this.replace(new Homework());
    });
  }

  columnClick(column: Column): void {
    console.log(column);
    const modalRef = this.modalService.open(ColumnDetailsComponent);
    modalRef.componentInstance.columnset = column;
    modalRef.result.then((result) => {
      if (result) {
        column = result;
      }
    }, (reason) => {
    }).finally(() => {
      //this.replace(new Homework());
    });
  }

  homeworkClick(homework: Homework): void {
    let method = "get";
    const modalRef = this.modalService.open(HomeworkDetailsComponent);
    modalRef.componentInstance.homeworkset = homework;
    modalRef.result.then((result) => {
      if (result instanceof Array) {
        homework = result[0];
        method = result[1];
      } else if (result) {
        homework = result;
      }
    }, (reason) => {
    }).finally(() => {
      // this.replace(homework, method);
    });
  }

  replace(homework: Homework, method: string = "get"): void {
    console.log(homework, method);
    if (homework && method == "delete") {
      for (let column_id = 0; column_id < this.columns.length; column_id++) {
        let column = this.columns[column_id];
        for (let hw_id = 0; hw_id < column.data.length; hw_id++) {
          if (column.data[hw_id].id == homework.id) {
            this.columns[column_id].data.splice(hw_id, 1);
          }
        }
      }
    } else if (homework && method == "create") {
      let res = new Array<Homework>();
      res.push(homework);
      this.divide(res);
    } else if (homework && method == "edit") {
      this.replace(homework, "delete");
      this.replace(homework, "create");
    } else {
      window.location.reload();
    }
  }

}
