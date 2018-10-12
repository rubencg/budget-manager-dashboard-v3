import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private authService: AuthenticationService){}

  logout(){
    this.authService.logout();
  }
}

export enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day'
}
