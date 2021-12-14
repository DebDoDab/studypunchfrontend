import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeworkComponent } from './homework.component';
import { HomeworkDetailsComponent } from './homework-details/homework-details.component';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDetailsComponent } from './column-details/column-details.component';



@NgModule({
  declarations: [
    HomeworkComponent,
    HomeworkDetailsComponent,
    ColumnDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  entryComponents: [HomeworkDetailsComponent, ColumnDetailsComponent],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class HomeworkModule { }
