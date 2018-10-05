import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from '../pages/calendar/calendar.component';
import { AccountsComponent } from '../pages/accounts/accounts.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
  },
  {
    path: 'accounts',
    component: AccountsComponent,
  },
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
