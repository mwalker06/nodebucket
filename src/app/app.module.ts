/* Title: app.module
Author: Megan Walker
Date: 08-19-2023
Description: app.module.ts
Source: Professor Krasso, Angular.io */

// import statements
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavComponent } from './layouts/nav/nav.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';

// NgModule decorator
@NgModule({
  declarations: [
    AppComponent,
    BaseLayoutComponent,
    FooterComponent,
    HomeComponent,
    NavComponent,
    ContactComponent,
    NotFoundComponent,
    AboutComponent,

  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule
  ],
  // providers array
  providers: [],
  bootstrap: [AppComponent]
})

// exports the AppModule class
export class AppModule { }
