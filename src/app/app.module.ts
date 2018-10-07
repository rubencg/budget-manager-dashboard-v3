import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CalendarModule } from 'angular-calendar';
import { AppComponent } from './app.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from './services/services.module';
import { AngularFireModule } from '@angular/fire';
import { FIREBASE_CONFIG } from './firebase.config';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    AccountsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServicesModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    CalendarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
