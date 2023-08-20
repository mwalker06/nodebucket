/* Title: security.module
Author: Megan Walker
Date: 08-19-2023
Description: security.module.ts
Source: Professor Krasso, Angular.io */

// imports statements
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';

// declarations
@NgModule({
  declarations: [
    SecurityComponent,
    SigninComponent
  ],

  // imports statements
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    SecurityRoutingModule
  ]
})

// exports the SecurityModule
export class SecurityModule { }