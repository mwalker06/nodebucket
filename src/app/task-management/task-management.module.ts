/* Title: task-management.module
Author: Megan Walker
Date: 08-19-2023
Description: task-management.module.ts
Source: Professor Krasso, Angular.io */

// imports 
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskManagementRoutingModule } from './task-management-routing.module';
import { TaskManagementComponent } from './task-management.component';
import { TasksComponent } from './tasks/tasks.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

// NgModule decorator
@NgModule({
  declarations: [
    TaskManagementComponent,
    TasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    TaskManagementRoutingModule,
    DragDropModule
  ]
})

// exports the TaskManagementModule class
export class TaskManagementModule { }

