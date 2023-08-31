/* Title: tasks.component
Author: Megan Walker
Date: 08-24-2023
Description: tasks.component.ts
Source: Professor Krasso */


// imports
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Employee } from '../employee.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../item.interface';
import { TaskService } from '../tasks.service';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


// TasksComponent class with employee, empId, todo, done, errorMessage, and successMessage
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

//export class TasksComponent
export class TasksComponent {

  // variables
  employee: Employee
  empId: number
  todo: Item[]
  done: Item[]
  errorMessage: string
  successMessage: string

  // form validators for newTaskForm
  newTaskForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
    category: [null]
  })

  // TasksComponent constructor with cookieService, taskService, and fb
  constructor(private cookieService: CookieService, private taskService: TaskService, private fb: FormBuilder) {
    this.employee = {} as Employee
    this.todo = []
    this.done = []
    this.errorMessage = ''
    this.successMessage = ''

    this.empId = parseInt(this.cookieService.get('session_user'), 10)

    this.taskService.getTask(this.empId).subscribe({
      next: (emp: any) => {
        console.log('emp', emp)
        this.employee = emp
      },
      error: (err) => {
        console.log('error', err)
        this.errorMessage = err.message
      },
      complete: () => {
        console.log('complete')

        this.todo = this.employee.todo ? this.employee.todo : []
        this.done = this.employee.done ? this.employee.done : []

        console.log('todo', this.todo)
        console.log('done', this.done)
      }
    })
  }

  // deleteTask function with taskId
  addTask() {
    const text = this.newTaskForm.controls['text'].value
    const category = this.newTaskForm.controls['category'].value

    // Compare this snippet from src/app/task-management/tasks/tasks.component.ts: 
    if (!category) {
      this.errorMessage = 'Please provide a category'
      this.hideAlert()
      return
    }
    let newTask = this.getTask(text, category)

    this.taskService.addTask(this.empId, newTask).subscribe({
      next: (task: any) => {
        console.log('Task added with id', task.id)

        newTask._id = task.id // set the new task

        this.todo.push(newTask)
        this.newTaskForm.reset()

        this.successMessage = 'Task added successfully'

        this.hideAlert()
      },
      // error function with err
      error: (err) => {
        this.errorMessage = err.message
        this.hideAlert()
      }
    })
  }

  // deleteTask function with taskId and index
  deleteTask(taskId: string) {
    console.log('Task item:', taskId)

    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    this.taskService.deleteTask(this.empId, taskId).subscribe({
      next: (res: any) => {
        console.log('Task deleted with id', taskId)

        if (!this.todo) this.todo = [];
        if (!this.done) this.done = [];

        this.todo = this.todo.filter(t => t._id?.toString() !== taskId)
        this.done = this.done.filter(t => t._id?.toString() !== taskId)

        this.successMessage = 'Task deleted successfully'
        this.hideAlert()
      },
      error: (err) => {
        console.log('Error deleting task', err)
        this.errorMessage = err.message
        this.hideAlert()
      }
    })
  }

  // drop function with event
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)

      console.log('Reordered item in an existing column/array', event.container.data)

      this.updateTaskList(this.empId, this.todo, this.done)
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)

      console.log('Moved item into a new column/array', event.container.data)

      this.updateTaskList(this.empId, this.todo, this.done)
    }
  }

  //call update API
  updateTaskList(empId: number, todo: Item[], done: Item[]) {
    this.taskService.updateTask(empId, todo, done).subscribe({
      next: (res: any) => {
        console.log('Update successful')
      },
      error: (err) => {
        console.log('Update failed', err)
        this.errorMessage = err.message
        this.hideAlert()
      }
    })
  }

  // hideAlert function with setTimeout
  hideAlert() {
    setTimeout(() => {
      this.errorMessage = ''
      this.successMessage = ''
    }, 3000)
  }

  // get task function with text and categoryName
  getTask(text: string, categoryName: string) {

    let task: Item = {} as Item

    // define colors for each category
    const white = '#FFFFFF'
    const green = '#4BCE97'
    const purple = '#9F8FEF'
    const red = '#F87462'

    // switch statement for each category
    switch (categoryName) {
      case 'testing':
        task = {
          text: text,
          category: {
            categoryName: categoryName,
            backgroundColor: green
          }
        }
        return task
      case 'meetings':
        task = {
          text: text,
          category: {
            categoryName: categoryName,
            backgroundColor: red
          }
        }
        return task
      case 'projects':
        task = {
          text: text,
          category: {
            categoryName: categoryName,
            backgroundColor: purple
          }
        }
        return task
      default:
        task = {
          text: text,
          category: {
            categoryName: categoryName,
            backgroundColor: white
          }
        }
        return task
    }
  }

}