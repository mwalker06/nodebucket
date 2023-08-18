/* Title: security.service
Author: Megan Walker
Date: 08-16-2023
Description:''
Source: Professor Krasso, Angular.io
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient) { }

  findEmployeeById(empId: number) {
    return this.http.get('/api/employees/' + empId)
  }
}
