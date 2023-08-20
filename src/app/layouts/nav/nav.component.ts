/* Title: nav.component
Author: Megan Walker
Date: 08-19-2023
Description: nav.component.ts
Source: Professor Krasso, Angular.io */

// imports statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export interface AppUser {
  fullName: string;
}

// NavComponent class

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

// exports the NavComponent class
export class NavComponent {
  // appUser variable
  appUser: AppUser;
  isSignedIn: boolean;


  // NavComponent constructor with cookieService
  constructor(private cookieService: CookieService) {
    // get the cookie value
    this.appUser = {} as AppUser
    this.isSignedIn = this.cookieService.get('session_user') ? true : false;

    // check if there is a cookie value
    if (this.isSignedIn) {
      this.appUser = {
        fullName: this.cookieService.get('session_name')
      }
    }
  }


  // signout function
  signout() {
    // delete the cookie value
    this.cookieService.deleteAll();

    // reload the window
    window.location.href = '/'
  }
}
