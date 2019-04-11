import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { AccountService } from './account.service';
import * as moment from 'moment';
import { Income, Account } from '../interfaces';
import * as _ from 'lodash';

@Injectable()
export class IncomeService {

  private incomesUrl: string;
  private incomes;

  constructor(private db: AngularFireDatabase, private accountProvider: AccountService) {
    this.incomesUrl = 'incomes/';
    this.incomes = this.db.list(this.incomesUrl);
  }


  saveIncome(income: Income): firebase.database.ThenableReference {
    let date: Date = new Date(+income.date);

    income.isApplied = moment(date).isSameOrBefore(moment(new Date()), 'day');
    let incomeReturn = this.incomes.push(income);

    incomeReturn
      .then(() => {

        if (income.isApplied) {
          let account: Account = _.chain(this.accountProvider.getAccountsLocal())
            .filter((a: Account) => a.key == income.toAccount.id)
            .value()[0];

          if (account) {
            let newBalance: number = account.currentBalance + income.amount;
            this.accountProvider.updateBalance(account.key, newBalance);
          }
          return;
        }
      });
    return incomeReturn;
  }

  applyIncome(income: Income) {
    let account: Account = _.chain(this.accountProvider.getAccountsLocal())
      .filter((a: Account) => a.key == income.toAccount.id)
      .value()[0];

    let date: Date = new Date(+income.date);
    if (!moment(date).isSameOrBefore(moment(new Date()), 'day')) {
      this.incomes
        .update(income.key, {
          date: moment(new Date()).format('x')
        });
    }

    if (account) {
      let newBalance: number = account.currentBalance + income.amount;
      this.accountProvider.updateBalance(account.key, newBalance);
      this.incomes
        .update(income.key, {
          isApplied: true
        });
    }
  }

  applyIncomesOfTheDay(incomes: Income[], accounts: Account[]) {
    incomes.forEach(income => {
      let account: Account = _.chain(accounts)
        .filter((a: Account) => a.key == income.toAccount.id)
        .value()[0];

      if (account) {
        let newBalance: number = account.currentBalance + income.amount;
        this.accountProvider.updateBalance(account.key, newBalance);
        this.incomes
          .update(income.key, {
            isApplied: true
          });
      }
    });
  }

  deleteIncome(income: Income): firebase.database.ThenableReference {
    let promise = this.incomes.remove(income.key);

    promise.then(() => {
      if(income.isApplied){
        let account: Account = _.chain(this.accountProvider.getAccountsLocal())
          .filter((a: Account) => a.key == income.toAccount.id)
          .value()[0];

        if (account) {
          let newBalance: number = account.currentBalance - income.amount;
          this.accountProvider.updateBalance(account.key, newBalance);
        }
      }
    });

    return promise;
  }

  updateIncome($key: string, income: Income): firebase.database.ThenableReference {
    return this.incomes
      .update($key, {
        amount: income.amount,
        date: income.date,
        notes: income.notes,
        category: income.category,
        toAccount: {
          id: income.toAccount.id,
          name: income.toAccount.name,
          img: income.toAccount.img
        }
      });
  }
}
