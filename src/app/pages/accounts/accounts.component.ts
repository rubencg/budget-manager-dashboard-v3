import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Account, AccountType } from 'src/app/interfaces';
import * as _ from 'lodash';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: Account[];
  accountsChunk: any[];

  constructor(private accountService: AccountService) { }

  ngOnInit() {
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
    });
  }

  getAccountTypeName(type): string {
    switch (type) {
      case AccountType.Debit:
        return "Debito";
      case AccountType.Cash:
        return "Efectivo";
      case AccountType.Credit:
        return "Credito";
      case AccountType.Savings:
        return "Ahorros Ruben";
      case AccountType.SarahiSavings:
        return "Ahorros Sarahi";
    }
    return "";
  }

}
