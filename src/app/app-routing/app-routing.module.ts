import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from '../pages/calendar/calendar.component';
import { AccountsComponent } from '../pages/accounts/accounts.component';
import { LoginComponent } from '../pages/login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { EditEntryComponent } from '../pages/edit-entry/edit-entry.component';
import { ApplyBudgetComponent } from '../pages/apply-budget/apply-budget.component';
import { AccountEditComponent } from '../pages/account-edit/account-edit.component';
import { TransferComponent } from '../pages/transfer/transfer.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'edit-entry/:key/:entryType', component: EditEntryComponent, canActivate: [AuthGuard] },
  { path: 'create-entry/:entryType', component: EditEntryComponent, canActivate: [AuthGuard] },
  { path: 'apply-budget/:key', component: ApplyBudgetComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'calendar/:key', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'edit-account/:key', component: AccountEditComponent, canActivate: [AuthGuard] },
  { path: 'transfer', component: TransferComponent, canActivate: [AuthGuard] },
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
