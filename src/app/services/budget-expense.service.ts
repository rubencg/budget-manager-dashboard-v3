import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { BudgetExpense } from '../interfaces';

@Injectable()
export class BudgetExpenseService {
  private bExpensesUrl: string;
  private budgetExpenses;

  constructor(private db: AngularFireDatabase) {
    this.bExpensesUrl = 'budgetExpenses/';
    this.budgetExpenses = this.db.list(this.bExpensesUrl);
  }

  saveBudgetExpense(expense: BudgetExpense): firebase.database.ThenableReference {
    return this.budgetExpenses.push(expense);
  }

  deleteBudgetExpense(key: string): firebase.database.ThenableReference {
    return this.budgetExpenses.remove(key);
  }

  updateBudgetExpense(key: string, be: BudgetExpense): firebase.database.ThenableReference {
    return this.budgetExpenses
      .update(key, {
        amount: be.amount,
        date: be.date,
        notes: be.notes,
        category: be.category
      });
  }
}
