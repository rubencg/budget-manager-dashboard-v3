import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CalendarModule } from 'angular-calendar';
import { AppComponent } from './app.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AccountsComponent } from './pages/accounts/accounts.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    AccountsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
