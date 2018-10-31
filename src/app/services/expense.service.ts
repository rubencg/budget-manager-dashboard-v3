import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Expense, Account } from '../interfaces';
import { AccountService } from './account.service';
import * as _ from 'lodash';

@Injectable()
export class ExpenseService {

  private expensesUrl: string;

  constructor(private db: AngularFireDatabase, private accountProvider: AccountService) {
    this.expensesUrl = 'expenses/';
  }

  saveExpense(expense: Expense): firebase.database.ThenableReference {
    let returnType = this.db.list(this.expensesUrl).push(expense);
    returnType.then(() => {
      let account: Account = _.chain(this.accountProvider.getAccountsLocal())
        .filter((a: Account) => a.key == expense.fromAccount.id)
        .value()[0];

      if (account) {
        let newBalance: number = account.currentBalance - expense.amount;
        this.accountProvider.updateBalance(account.key, newBalance);
      }
    });

    return returnType;
  }

  deleteExpense(expense: Expense): Promise<void> {
    let promise = this.db.list(this.expensesUrl).remove(expense.key);

    promise.then(() => {
      let account: Account = _.chain(this.accountProvider.getAccountsLocal())
        .filter((a: Account) => a.key == expense.fromAccount.id)
        .value()[0];

      if (account) {
        let newBalance: number = account.currentBalance + expense.amount;
        this.accountProvider.updateBalance(account.key, newBalance);
      }
    });

    return promise;
  }

  updateExpense(key: string, expense: Expense): Promise<void> {
    return this.db.list(this.expensesUrl)
      .update(key, {
        amount: expense.amount,
        date: expense.date,
        notes: expense.notes,
        category: expense.category,
        fromAccount: {
          id: expense.fromAccount.id,
          name: expense.fromAccount.name,
          img: expense.fromAccount.img
        }
      });
  }
}
