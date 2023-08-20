/* Title: security-routing.module
Author: Megan Walker
Date: 08-19-2023
Description: security-routing.module.ts
Source: Professor Krasso, Angular.io */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';


// routes for the security module
const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      {
        path: 'signin',
        component: SigninComponent,
        title: 'Nodebucket: Sign In'
      }
    ]
  }
];

// exports the SecurityRoutingModule
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

// exports the SecurityRoutingModule
export class SecurityRoutingModule { }