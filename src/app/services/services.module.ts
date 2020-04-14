import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryService } from './entry.service';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AuthenticationService } from './authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { CategoriesService } from './categories.service';
import { ExpenseService } from './expense.service';
import { IncomeService } from './income.service';
import { BudgetExpenseService } from './budget-expense.service';
import { AccountService } from './account.service';
import { TransferService } from './transfer.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireDatabaseModule,
    AngularFireModule
  ],
  providers: [
    AngularFireAuth,
    AuthenticationService,
    EntryService,
    CategoriesService,
    ExpenseService,
    IncomeService,
    BudgetExpenseService,
    AccountService,
    TransferService
  ],
  declarations: []
})
export class ServicesModule { }
