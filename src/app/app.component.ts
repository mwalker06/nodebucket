/* Title: app.component
Author: Megan Walker
Date: 08-19-2023
Description: app.component.ts 
Source: Professor Krasso, Angular.io
 */
// imports statements
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})

// exports the AppComponent
export class AppComponent {
}
