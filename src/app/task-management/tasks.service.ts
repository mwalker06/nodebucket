/* Title: tasks.service
Author: Megan Walker
Date: 08-24-2023
Description: tasks.service.ts
Source: Professor Krasso */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from './item.interface';

// TaskService class
@Injectable({
  providedIn: 'root'
})
// TaskService class
export class TaskService {

  // TaskService constructor with http
  constructor(private http: HttpClient) { }
    
  // findAllTasks function with empId
    getTask(empId: number) {
      return this.http.get('/api/employees/' + empId + '/tasks')
    }

    // createTask function with empId and task
    addTask(empId: number, task: Item) {
      return this.http.post('/api/employees/' + empId + '/tasks', { task })
    }
  }