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
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxLoadingModule } from 'ngx-loading';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditEntryComponent } from './pages/edit-entry/edit-entry.component';
import { FormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { ApplyBudgetComponent } from './pages/apply-budget/apply-budget.component';
import { AccountEditComponent } from './pages/account-edit/account-edit.component';
import { TransferComponent } from './pages/transfer/transfer.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    AccountsComponent,
    LoginComponent,
    EditEntryComponent,
    ApplyBudgetComponent,
    AccountEditComponent,
    TransferComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServicesModule,
    AngularFireAuthModule,
    NgxSpinnerModule,
    FormsModule,
    MyDatePickerModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    CalendarModule.forRoot(),
    NgxLoadingModule.forRoot({})
  ],
  providers: [ AuthGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
