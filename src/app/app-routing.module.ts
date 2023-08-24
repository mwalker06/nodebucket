/* Title: app-routing.module
Author: Megan Walker
Date: 08-19-2023
Description: app-routing.module.ts
Source: Professor Krasso, Angular.io */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './shared/auth.guard';
import { ContactComponent } from './contact/contact.component';

// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        // path for the home page
        path: '',
        component: HomeComponent,
        title: 'Nodebucket: Home' // title for the home page
      },
      {
        // path for the home page
        path: 'home',
        component: HomeComponent,
        title: 'Nodebucket: Home'
      },
      {
        // path for the contact page
        path: 'contact',
        component: ContactComponent,
        title: 'Nodebucket: Contact Us'
      },
      {
        // path for the tasks page
        path: 'task-management',
        loadChildren: () => import('./task-management/task-management.module').then(m => m.TaskManagementModule),
        canActivate: [authGuard]
      }
    ]
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    path: 'security',
    loadChildren: () => import('./security/security.module').then(m => m.SecurityModule)
  }
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
