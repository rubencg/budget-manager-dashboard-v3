import { NgxSpinnerService } from 'ngx-spinner';
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


  constructor(private entryService: EntryService, private spinner: NgxSpinnerService) {
  }

  convertBudgetExepensesToCalendarEvents(items: BudgetExpense[]): void{
    if(!items) return;
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
  }

  convertIncomesToCalendarEvents(items: Income[]): void{
    if(!items) return;
    items.forEach(income => {
      this.events.push(
        {
          start: moment(new Date(+income.date)).toDate(),
          title: "("+ income.toAccount.name + ") $" + income.amount + " " + income.category.name + (income.notes ? " (" + income.notes +")" : ""),
          color: colors.green,
          // actions: this.actions,
        }
      );
    });
  }

  convertExpensesToCalendarEvents(items: Expense[]): void{
    if(!items) return;
    items.forEach(expense => {
      this.events.push(
        {
          start: moment(new Date(+expense.date)).toDate(),
          title: "("+ expense.fromAccount.name + ") $" + expense.amount + " " + expense.category.name + " > " + expense.category.subcategory.name + (expense.notes ? " (" + expense.notes +")" : ""),
          color: colors.red,
          // actions: this.actions,
        }
      );
    });
  }

  ngOnInit() {
    this.spinner.show();

    this.entryService.getAllBudgetExpenses()
      .subscribe((items: BudgetExpense[]) => {
        this.events = [];
        this.convertBudgetExepensesToCalendarEvents(items);
        this.convertIncomesToCalendarEvents(this.entryService.getIncomesLocal());
        this.convertExpensesToCalendarEvents(this.entryService.getExpensesLocal());
      });

      this.entryService.getAllIncomes()
      .subscribe((items: Income[]) => {
        this.events = [];
        this.convertIncomesToCalendarEvents(items);
        this.convertBudgetExepensesToCalendarEvents(this.entryService.getBudgetExpensesLocal());
        this.convertExpensesToCalendarEvents(this.entryService.getExpensesLocal());
      });

      this.entryService.getAllExpenses()
      .subscribe((items: Expense[]) => {
        this.events = [];
        this.convertExpensesToCalendarEvents(items);
        this.convertBudgetExepensesToCalendarEvents(this.entryService.getBudgetExpensesLocal());
        this.convertIncomesToCalendarEvents(this.entryService.getIncomesLocal());

        this.spinner.hide(); // To hide the spinner
      });
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
