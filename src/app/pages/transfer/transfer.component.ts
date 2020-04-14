import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { TransferService } from 'src/app/services/transfer.service';
import { Account } from 'src/app/interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  accounts: Account[];
  originAccount: Account;
  destinationAccount: Account;
  entryForm: FormGroup;

  constructor(private spinner: NgxSpinnerService, private accountService: AccountService, private fb: FormBuilder,
      private transferService: TransferService, private router: Router) { 
    this.entryForm = this.fb.group({
      originAccount: [''],
      destinationAccount: [''],
      amount: ['', Validators.required]
    })
    this.load();
  }

  load(){
  }

  ngOnInit() {
    this.accounts = this.accountService.getAccountsLocal();    
    this.entryForm.controls['originAccount'].setValue(this.accounts[0]);
    this.entryForm.controls['destinationAccount'].setValue(this.accounts[0]);
  }

  submit() {
    this.transfer();
  }

  transfer(){
    let a: Account = this.entryForm.controls['originAccount'].value;
    let d: Account = this.entryForm.controls['destinationAccount'].value;
    let amount: number = this.entryForm.controls['amount'].value;
    let originAccount = _.chain(this.accounts)
      .filter((i: Account) => i.key == a.key)
      .first()
      .value();
    let destinationAccount = _.chain(this.accounts)
      .filter((i: Account) => i.key == d.key)
      .first()
      .value();

    let newOriginBalance: number = originAccount.currentBalance - amount;
    this.accountService.updateBalance(originAccount.key, newOriginBalance);

    let newDestinationBalance: number = destinationAccount.currentBalance + amount;
    this.accountService.updateBalance(destinationAccount.key, newDestinationBalance);

    this.transferService.saveTransfer({
      amount: amount,
      date: moment(new Date()).format('x'),
      fromAccount: {
        id: originAccount.key,
        img: originAccount.img,
        name: originAccount.name
      },
      toAccount: {
        id: destinationAccount.key,
        img: destinationAccount.img,
        name: destinationAccount.name
      }
    }).then(() => this.redirectToAccounts());
  }

  redirectToAccounts(){
    this.router.navigate(['/accounts']);
  }

  

}
