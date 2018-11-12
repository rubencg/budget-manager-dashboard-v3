import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { Account, Expense, BudgetExpense, Income, IdNameBasic } from 'src/app/interfaces';
import { EntryService } from 'src/app/services/entry.service';
import * as _ from 'lodash';
import { IMyDpOptions } from 'mydatepicker';
import * as moment from 'moment';
import { ExpenseService } from 'src/app/services/expense.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BudgetExpenseService } from 'src/app/services/budget-expense.service';

@Component({
  selector: 'app-apply-budget',
  templateUrl: './apply-budget.component.html',
  styleUrls: ['./apply-budget.component.scss']
})
export class ApplyBudgetComponent implements OnInit {
  key: string;
  entryForm: FormGroup;
  accounts: Account[];
  budget: BudgetExpense;
  datePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private accountService: AccountService,
    private entryService: EntryService, private expenseService: ExpenseService, private spinner: NgxSpinnerService,
    private budgetExpenseService: BudgetExpenseService, private router: Router) {
    this.entryForm = this.fb.group({
      account: [''],
      entryDate: [null, Validators.required]
    })
  }

  setDate(date: Date = new Date()): void {

    this.entryForm.patchValue({
      entryDate: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  getStringDate() {
    let date = this.entryForm.controls['entryDate'].value.date;
    return moment(new Date(date.year, date.month - 1, date.day)).format('x')
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.key = params['key'];
    });
    this.budget = _.chain(this.entryService.getBudgetExpensesLocal())
      .filter((i: Income) => i.key == this.key)
      .first()
      .value();
    this.accounts = this.accountService.getAccountsLocal();
    this.entryForm.controls['account'].setValue(this.accounts[0]);
    this.setDate();
  }

  submit() {
    this.spinner.show();
    let a: Account = this.entryForm.controls['account'].value;
    let fromAccount: IdNameBasic = {
      id: a.key,
      name: a.name,
      img: a.img
    };

    let expense: Expense = {
      amount: this.budget.amount,
      category: this.budget.category,
      notes: this.budget.notes,
      date: this.getStringDate(),
      fromAccount: fromAccount
    }

    this.budgetExpenseService.deleteBudgetExpense(this.key)
      .then(() => {
        this.expenseService.saveExpense(expense).then(() => {
          this.spinner.hide();
          this.router.navigate(['/calendar']);
        });
      });


  }

}
