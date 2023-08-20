/* Title: task-management.module
Author: Megan Walker
Date: 08-19-2023
Description: task-management.module.ts
Source: Professor Krasso, Angular.io */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskManagementRoutingModule } from './task-management-routing.module';
import { TaskManagementComponent } from './task-management.component';
import { TasksComponent } from './tasks/tasks.component';

// declarations
@NgModule({
  declarations: [
    TaskManagementComponent,
    TasksComponent
  ],
  imports: [
    CommonModule,
    TaskManagementRoutingModule
  ]
})

// exports the TaskManagementModule
export class TaskManagementModule { }
