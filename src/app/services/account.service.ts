import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { Account } from '../interfaces';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

@Injectable()
export class AccountService {

  private accountsUrl: string = 'accounts/';
  private accountRef: Observable<any[]>;
  accounts: Account[];

  constructor(private db: AngularFireDatabase) {
    this.accountRef = db.list(this.accountsUrl).snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));
  }

  getAllAccounts(): Observable<Account[]> {
    this.accountRef.subscribe(a => {
      this.accounts = a;
    });

    return this.accountRef;
  }

  getAccountsLocal(): Account[] {
    return this.accounts;
  }

  getAccountById(id: string): Account {
    return _.chain(this.accounts)
      .filter((a: Account) => a.key == id)
      .value()[0];
  }

  updateBalance(key: string, newBalance: number) {
    this.db.list(this.accountsUrl)
      .update(key, {
        currentBalance: newBalance
      });
  }

  createNewAccount(account: Account) {
    this.db.list(this.accountsUrl).push(account);
  }
}
