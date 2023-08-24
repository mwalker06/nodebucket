/* Title: task-management-routing.module
Author: Megan Walker
Date: 08-18-2023
Description: task-management-routing.module.ts
Source: Professor Krasso */

// imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManagementComponent } from './task-management.component';
import { TasksComponent } from './tasks/tasks.component';

// routes with path, component, and title
const routes: Routes = [
  {
    path: '',
    component: TaskManagementComponent,
    children: [
      {
        path: 'my-tasks',
        component: TasksComponent,
        title: 'Nodebucket: My Tasks'
      }
    ]
  }
];

// TaskManagementRoutingModule class
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
// exports the TaskManagementRoutingModule
export class TaskManagementRoutingModule { }
