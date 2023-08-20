/* Title: security.service
Author: Megan Walker
Date: 08-16-2023
Description: security.service.ts
Source: Professor Krasso, Angular.io
 */


// imports statements
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// SecurityService class
@Injectable({
  providedIn: 'root'
})

// exports the SecurityService class
export class SecurityService {

  constructor(private http: HttpClient) { }

  findEmployeeById(empId: number) {
    return this.http.get('/api/employees/' + empId)
  }
}
