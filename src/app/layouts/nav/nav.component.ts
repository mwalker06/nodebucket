/**
 * Title: nav.component.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export interface AppUser {
  fullName: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  // appUser variable
  appUser: AppUser;
  isSignedIn: boolean;

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

  signout() {
    // delete the cookie value
    this.cookieService.deleteAll();

    // reload the window
    window.location.href = '/'
  }
}
