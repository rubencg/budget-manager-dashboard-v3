import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}

export enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day'
}
