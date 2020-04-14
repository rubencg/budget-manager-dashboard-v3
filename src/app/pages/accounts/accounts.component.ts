import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { EntryService } from 'src/app/services/entry.service';
import { Account, AccountType, Entry, Income, BudgetExpense } from 'src/app/interfaces';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: Account[];
  accountsChunk: any[];
  moneyLeft: number;

  constructor(private accountService: AccountService, private router: Router, private entryService: EntryService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.accountService.getAllAccounts().subscribe((accounts: Account[]) => {
      this.accounts = accounts;
      this.accountsChunk = _.chain(this.accounts)
        .groupBy((account: Account) => account.type)
        .map((value: Account[], key: string) => {

          return {
            title: this.getAccountTypeName(value[0].type),
            entries: value,
            totalValue: _.sumBy(value, v => v.currentBalance)
          };
        })
        .value();

      this.entryService.getAllBudgetExpenses().subscribe(bE => {
        this.entryService.getAllIncomes().subscribe(i => {
          this.setMoneyLeft(this.accounts, i, bE);
          this.spinner.hide();
        });
      });
    });
  }

  getAccountTypeName(type): string {
    return this.accountService.getAccountTypeName(type);
  }

  showAccount(account: Account) {
    this.router.navigate(['/calendar', account.key]);
  }

  setMoneyLeft(accounts: Account[], incomes: Income[], budgets: BudgetExpense[]) {
    let b: number = this.getSumAfterTodaysDate(budgets);
    let i: number = this.getSumAfterTodaysDate(incomes);

    let accountsBalance = _.chain(accounts)
      .filter(a => a.isSummable)
      .sumBy((a: Account) => a.currentBalance)
      .value();

    this.moneyLeft = accountsBalance + i - b;
  }

  getSumAfterTodaysDate(items: Entry[]): number {
    return _.chain(items)
      .filter((i: Entry) => {
        var date = new Date(+i.date), y = date.getFullYear(), m = date.getMonth();

        let endOfMonth: Date = moment(new Date(y, m, 1)).add(1, 'M').subtract(1, 'd').toDate();
        let today: Date = new Date();

        return date > today && date <= endOfMonth;
      })
      .sumBy('amount')
      .value();
  }

  editAccount(account: Account){
    this.router.navigate(['/edit-account', account.key]);
  }

  transfer(){
    this.router.navigate(['/transfer']);
  }

}
