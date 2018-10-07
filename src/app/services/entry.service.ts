import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Expense, BudgetExpense, Income } from '../interfaces';

@Injectable()
export class EntryService {
  private expenseUrl: string;
  private incomeUrl: string;
  private budgetExpenseUrl: string;
  private expenseRef: Observable<any[]>;
  private incomeRef: Observable<any[]>;
  private budgetExpenseRef: Observable<any[]>;

  expenses: Expense[];
  incomes: Income[];
  budgetExpenses: BudgetExpense[];

  constructor(private db: AngularFireDatabase) {
    this.expenseUrl = 'expenses/';
    this.incomeUrl = 'incomes/';
    this.budgetExpenseUrl = 'budgetExpenses/';

    this.expenseRef = db.list(this.expenseUrl).snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));

    this.incomeRef = db.list(this.incomeUrl).snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));
    this.budgetExpenseRef = db.list(this.budgetExpenseUrl).snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));
  }

  getAllExpenses(): Observable<Expense[]> {
    this.expenseRef.subscribe(a => {
      this.expenses = a;
    });

    return this.expenseRef;
  }

  getExpensesLocal(): Expense[] {
    return this.expenses;
  }

  getAllIncomes(): Observable<Income[]> {
    this.incomeRef.subscribe(a => {
      this.incomes = a;
    });

    return this.incomeRef;
  }

  getIncomesLocal(): Income[] {
    return this.incomes;
  }

  getAllBudgetExpenses(): Observable<BudgetExpense[]> {
    this.budgetExpenseRef.subscribe(a => {
      this.budgetExpenses = a;
    });

    return this.budgetExpenseRef;
  }

  getBudgetExpensesLocal(): BudgetExpense[] {
    return this.budgetExpenses;
  }

}
