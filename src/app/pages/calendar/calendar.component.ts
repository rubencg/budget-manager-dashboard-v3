import { Component, OnInit } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,

} from 'angular-calendar';
import { CalendarView } from '../../app.component';
import { EntryService } from '../../services/entry.service';
import { BudgetExpense, Income, Expense } from '../../interfaces';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  green: {
    primary: '#20ad31',
    secondary: '#c9fdba'
  }
};
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {


  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;


  constructor(private entryService: EntryService) {
    this.entryService.getAllBudgetExpenses()
      .subscribe((items: BudgetExpense[]) => {
        items.forEach(budgetExpense => {
          this.events.push(
            {
              start: moment(new Date(+budgetExpense.date)).toDate(),
              title: "$" + budgetExpense.amount + " " + budgetExpense.category.name + " > " + budgetExpense.category.subcategory.name + (budgetExpense.notes ? " (" + budgetExpense.notes +")" : ""),
              color: colors.blue,
              // actions: this.actions,
            }
          );
        });
      });

      this.entryService.getAllIncomes()
      .subscribe((items: Income[]) => {
        items.forEach(income => {
          this.events.push(
            {
              start: moment(new Date(+income.date)).toDate(),
              title: "$" + income.amount + " " + income.category.name + (income.notes ? " (" + income.notes +")" : ""),
              color: colors.green,
              // actions: this.actions,
            }
          );
        });
      });
      let a : CalendarEvent;

      this.entryService.getAllExpenses()
      .subscribe((items: Expense[]) => {
        items.forEach(expense => {
          this.events.push(
            {
              start: moment(new Date(+expense.date)).toDate(),
              title: "$" + expense.amount + " " + expense.category.name + " > " + expense.category.subcategory.name + (expense.notes ? " (" + expense.notes +")" : ""),
              color: colors.red,
              // actions: this.actions,
            }
          );
        });
      });
  }

  ngOnInit() {

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

}
