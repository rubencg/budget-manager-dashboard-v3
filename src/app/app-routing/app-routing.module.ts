import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from '../pages/calendar/calendar.component';
import { AccountsComponent } from '../pages/accounts/accounts.component';
import { LoginComponent } from '../pages/login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { EditEntryComponent } from '../pages/edit-entry/edit-entry.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'edit-entry/:key/:entryType', component: EditEntryComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'calendar' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
