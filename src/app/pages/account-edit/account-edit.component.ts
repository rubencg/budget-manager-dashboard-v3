import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/interfaces';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {
  entryForm: FormGroup;
  account: Account;
  key: string;
  categories: number[] = [
    1,2,3,4,5
  ];

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private accountService: AccountService,
    private route: ActivatedRoute) { 
    this.entryForm = this.fb.group({
      accountName: [''],
      currentBalance: [''],
      category: [''],
      isSummable: [''],
    });
    this.load();
  }

  load(){
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.key = params['key'];
    });

    this.accountService.getAllAccounts().subscribe(items => {
      this.account = _.chain(items)
        .filter((a: Account) => a.key == this.key)
        .first()
        .value();

        this.entryForm.controls['accountName'].setValue(this.account.name);
        this.entryForm.controls['currentBalance'].setValue(this.account.currentBalance);
        this.entryForm.controls['category'].setValue(this.account.type);
        this.entryForm.controls['isSummable'].setValue(this.account.isSummable);

        this.spinner.hide();
    });
    
  }

  getAccountTypeName(type): string {
    return this.accountService.getAccountTypeName(type);
  }

  ngOnInit() {
  }

}
