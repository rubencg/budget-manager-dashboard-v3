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
import { BudgetExpense, Income, Expense, EntryType } from '../../interfaces';

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
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {


  view: CalendarView = CalendarView.Month;
  key: string;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;


  constructor(private entryService: EntryService, private spinner: NgxSpinnerService, private router: Router,
    private accountService: AccountService, private route: ActivatedRoute) {

  }

  convertBudgetExepensesToCalendarEvents(items: BudgetExpense[]): void {
    if (!items) return;
    items.forEach(budgetExpense => {
      this.events.push(
        {
          start: moment(new Date(+budgetExpense.date)).toDate(),
          title: "$" + budgetExpense.amount + " " + budgetExpense.category.name + " > " + budgetExpense.category.subcategory.name + (budgetExpense.notes ? " (" + budgetExpense.notes + ")" : ""),
          color: colors.blue,
          meta: {
            entryType: EntryType.BudgetExpense,
            key: budgetExpense.key
          }
        }
      );
    });
  }

  convertIncomesToCalendarEvents(items: Income[]): void {
    if (!items) return;
    items.forEach(income => {
      this.events.push(
        {
          start: moment(new Date(+income.date)).toDate(),
          title: "(" + income.toAccount.name + ") $" + income.amount + " " + income.category.name + (income.notes ? " (" + income.notes + ")" : ""),
          color: colors.green,
          meta: {
            entryType: EntryType.Income,
            key: income.key
          }
          // actions: this.actions,
        }
      );
    });
  }

  convertExpensesToCalendarEvents(items: Expense[]): void {
    if (!items) return;
    items.forEach(expense => {
      this.events.push(
        {
          start: moment(new Date(+expense.date)).toDate(),
          title: "(" + expense.fromAccount.name + ") $" + expense.amount + " " + expense.category.name + " > " + expense.category.subcategory.name + (expense.notes ? " (" + expense.notes + ")" : ""),
          color: colors.red,
          meta: {
            entryType: EntryType.Expense,
            key: expense.key
          }
          // actions: this.actions,
        }
      );
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.key = params['key'];
    });
    this.spinner.show();
    this.accountService.getAllAccounts().subscribe(items => {
      this.entryService.getAllBudgetExpenses()
        .subscribe((items: BudgetExpense[]) => {
          this.events = [];
          if (this.key) {
            this.convertIncomesToCalendarEvents(this.filterByAccount(this.entryService.getIncomesLocal(), EntryType.Income));
            this.convertExpensesToCalendarEvents(this.filterByAccount(this.entryService.getExpensesLocal(), EntryType.Expense));
          } else {
            this.convertIncomesToCalendarEvents(this.entryService.getIncomesLocal());
            this.convertExpensesToCalendarEvents(this.entryService.getExpensesLocal());
          }
          this.convertBudgetExepensesToCalendarEvents(items);
        });

      this.entryService.getAllIncomes()
        .subscribe((items: Income[]) => {
          this.events = [];
          if (this.key) {
            this.convertIncomesToCalendarEvents(this.filterByAccount(items, EntryType.Income));
            this.convertExpensesToCalendarEvents(this.filterByAccount(this.entryService.getExpensesLocal(), EntryType.Expense));
          } else {
            this.convertIncomesToCalendarEvents(items);
            this.convertExpensesToCalendarEvents(this.entryService.getExpensesLocal());
          }
          this.convertBudgetExepensesToCalendarEvents(this.entryService.getBudgetExpensesLocal());
        });

      this.entryService.getAllExpenses()
        .subscribe((items: Expense[]) => {
          this.events = [];
          if (this.key) {
            this.convertExpensesToCalendarEvents(this.filterByAccount(items, EntryType.Expense));
            this.convertIncomesToCalendarEvents(this.filterByAccount(this.entryService.getIncomesLocal(), EntryType.Income));
          } else {
            this.convertExpensesToCalendarEvents(items);
            this.convertIncomesToCalendarEvents(this.entryService.getIncomesLocal());
          }
          this.convertBudgetExepensesToCalendarEvents(this.entryService.getBudgetExpensesLocal());

          this.spinner.hide(); // To hide the spinner
        });
    });
  }

  filterByAccount(items, entryType: EntryType) {
    switch (entryType) {
      case EntryType.Expense:
        return _.filter(items, (item: Expense) => item.fromAccount.id == this.key);
      case EntryType.Income:
        return _.filter(items, (item: Income) => item.toAccount.id == this.key);
    }
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

  handleEvent(action: string, event: CalendarEvent): void {
    this.router.navigate(['/edit-entry', event.meta.key, event.meta.entryType]);
  }

  addExpense() {
    this.router.navigate(['/create-entry', EntryType.Expense]);
  }

  addBudgetExpense() {
    this.router.navigate(['/create-entry', EntryType.BudgetExpense]);
  }

  addIncome() {
    this.router.navigate(['/create-entry', EntryType.Income]);
  }

  clearAccount() {
    this.router.navigate(['/calendar']);
  }

}
