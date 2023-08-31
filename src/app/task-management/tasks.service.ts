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

    // updateTask function with empId, taskId, and task 
    updateTask(empId: number, todo: Item [], done: Item []) {
      return this.http.put('/api/employees/' + empId + '/tasks', {
        todo,
        done
      })
    }

    // deleteTask function with empId and taskId
    deleteTask(empId: number, taskId: string) {
      return this.http.delete('/api/employees/' + empId + '/tasks/' + taskId)
    }

  }