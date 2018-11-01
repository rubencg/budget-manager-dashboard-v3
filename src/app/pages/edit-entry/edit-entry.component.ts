import { Component, OnInit } from '@angular/core';
import { EntryType, Category, Account, IdNameBasic, Income, Expense, BudgetExpense, CategoryBasic } from 'src/app/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { EntryService } from 'src/app/services/entry.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { ExpenseService } from 'src/app/services/expense.service';
import { AccountService } from 'src/app/services/account.service';
import { IncomeService } from 'src/app/services/income.service';
import { BudgetExpenseService } from 'src/app/services/budget-expense.service';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss']
})
export class EditEntryComponent implements OnInit {
  key: string;
  entryType: EntryType;
  entryForm: FormGroup;
  categories: Category[];
  accounts: Account[];
  subcategories: IdNameBasic[];
  entry: any;

  private sub: any;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private categoryService: CategoriesService,
    private entryService: EntryService, private spinner: NgxSpinnerService, private expenseService: ExpenseService,
    private accountService: AccountService, private budgetExpenseService: BudgetExpenseService,
    private incomeService: IncomeService, private router: Router) {
    this.entryForm = this.fb.group({
      account: [''],
      category: [''],
      notes: [''],
      amount: ['', Validators.required],
      subcategory: ['']
    })
    this.load();
  }

  ngOnInit() {

  }

  load() {
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.key = params['key'];
      this.entryType = +params['entryType'];
    });

    if (!this.categoryService.getExpenseCategoriesLocal()) {
      this.accountService.getAllAccounts().subscribe(items => {
        this.accounts = items;
        if (this.entryType == EntryType.Income) {
          this.categoryService.getAllIncomeCategories()
            .subscribe((items: Category[]) => {
              this.entryService.getAllIncomes().subscribe(entries => {
                this.loadIncomeCategories(items);
                this.loadEntry();
                this.spinner.hide();
              });
            });
        } else if (this.entryType == EntryType.Expense) {
          this.categoryService.getAllExpenseCategories()
            .subscribe((items: Category[]) => {
              this.entryService.getAllExpenses().subscribe(entries => {
                this.loadExpenseCategories(items);
                this.loadEntry();
                this.spinner.hide();
              });
            });
        } else {
          this.categoryService.getAllExpenseCategories()
            .subscribe((items: Category[]) => {
              this.entryService.getAllBudgetExpenses().subscribe(entries => {
                this.loadExpenseCategories(items);
                this.loadEntry();
                this.spinner.hide();
              });
            });
        }
      });


    } else {
      if (this.entryType == EntryType.Income) {
        this.loadIncomeCategories(this.categoryService.getIncomeCategoriesLocal());
        this.loadEntry();
      } else {
        this.loadExpenseCategories(this.categoryService.getExpenseCategoriesLocal());
        this.loadEntry();
      }
      this.accounts = this.accountService.getAccountsLocal();
      this.spinner.hide();
    }
  }

  loadExpenseCategories(items: Category[]) {
    this.categories = items;
    let cat: Category = items[0];
    this.entryForm.controls['category'].setValue(cat);
    this.subcategories = cat.subcategories;
    this.entryForm.controls['subcategory'].setValue(this.subcategories[0]);
  }

  loadIncomeCategories(items: Category[]) {
    this.categories = items;
    this.entryForm.controls['category'].setValue(items[0]);
  }

  getEntryTypeName(): string {
    switch (this.entryType) {
      case EntryType.BudgetExpense:
        return "Gasto Proyectado";
      case EntryType.Expense:
        return "Gasto";
      case EntryType.Income:
        return "Entrada";
    }
  }

  getIncome(): Income {
    let a: Account = this.entryForm.controls['account'].value;
    let c: Category = this.entryForm.controls['category'].value;
    let amount: number = +this.entryForm.controls['amount'].value;
    let notes: string = this.entryForm.controls['notes'].value;
    let category: CategoryBasic = {
      id: c.key,
      name: c.name,
      img: c.img,
      subcategory: null
    };
    let toAccount: IdNameBasic = {
      id: a.key,
      name: a.name,
      img: a.img
    };

    if (this.key) {
      this.entry.amount = amount;
      this.entry.notes = notes;
      this.entry.category = category;
      this.entry.toAccount = toAccount;
      return this.entry;
    } else {
      let income: Income = {
        amount: amount,
        notes: notes,
        category: category,
        toAccount: toAccount,
        date: moment().format('x')
      };
      return income;
    }
  }

  submit() {
    let a: Account = this.entryForm.controls['account'].value;
    let c: Category = this.entryForm.controls['category'].value;
    // this.entry.amount = +this.entryForm.controls['amount'].value;
    // this.entry.notes = this.entryForm.controls['notes'].value;
    let initialAccount: Account;

    switch (this.entryType) {
      case EntryType.BudgetExpense:
        let bs = this.entryForm.controls['subcategory'].value;
        let bcategory = {
          id: c.key,
          name: c.name,
          subcategory: {
            id: bs.id,
            name: bs.name,
            img: bs.img
          },
          img: c.img
        };
        this.entry.category = bcategory;

        this.budgetExpenseService.updateBudgetExpense(this.entry.key, this.entry);

        break;
      case EntryType.Expense:
        initialAccount = this.accountService.getAccountById(this.entry.fromAccount.id);
        let s = this.entryForm.controls['subcategory'].value;
        let category = {
          id: c.key,
          name: c.name,
          subcategory: {
            id: s.id,
            name: s.name,
            img: s.img
          },
          img: c.img
        };

        this.entry.fromAccount = {
          id: a.key,
          name: a.name,
          img: a.img
        };
        this.entry.category = category;

        this.expenseService.updateExpense(this.entry.key, this.entry)
          .then(() => {
            let initialAmount: number = this.entry.amount;
            if (initialAccount.key != this.entry.fromAccount.id) {
              this.accountService.updateBalance(initialAccount.key, initialAccount.currentBalance + initialAmount);
              let newAccount: Account = this.accountService.getAccountById(this.entry.fromAccount.id);
              this.accountService.updateBalance(newAccount.key, newAccount.currentBalance - this.entry.amount);
            } else if (initialAmount != this.entry.amount) {
              this.accountService.updateBalance(initialAccount.key, initialAccount.currentBalance + (initialAmount - this.entry.amount));
            }
          });
        break;
      case EntryType.Income:

        let income: Income = this.getIncome();

        if (this.key) {
          initialAccount = this.accountService.getAccountById(income.toAccount.id);
          let initialAmount: number = this.entry.amount;

          this.incomeService.updateIncome(this.key, income)
            .then(() => {

              if (initialAccount.key != income.toAccount.id) {
                this.accountService.updateBalance(initialAccount.key, initialAccount.currentBalance - initialAmount);
                let newAccount: Account = this.accountService.getAccountById(income.toAccount.id);
                this.accountService.updateBalance(newAccount.key, newAccount.currentBalance + income.amount);
              } else if (initialAmount != income.amount) {
                this.accountService.updateBalance(initialAccount.key, initialAccount.currentBalance - (initialAmount - income.amount));
              }
            });
        }else{
          this.incomeService.saveIncome(income);
        }


        break;
    }

    this.router.navigate(['/calendar']);

  }

  categoryChanged() {
    let cat: Category = this.entryForm.value.category;
    if (cat.subcategories) {
      this.subcategories = cat.subcategories;
      this.entryForm.controls['subcategory'].setValue(this.subcategories[0]);
    }
  }

  loadEntry() {
    if (this.key) {
      if (this.entryType == EntryType.Income) {
        let income: Income = _.chain(this.entryService.getIncomesLocal())
          .filter((i: Income) => i.key == this.key)
          .first()
          .value();

        this.setValues(income, false);
      } else if (this.entryType == EntryType.Expense) {
        let expense: Expense = _.chain(this.entryService.getExpensesLocal())
          .filter((i: Expense) => i.key == this.key)
          .first()
          .value();

        this.setValues(expense, true);
      } else {
        let budgetExpense: BudgetExpense = _.chain(this.entryService.getBudgetExpensesLocal())
          .filter((i: BudgetExpense) => i.key == this.key)
          .first()
          .value();
        this.setValues(budgetExpense, true);
      }
    }

  }

  getCategory(id: String) {
    return _.chain(this.categories)
      .filter((c: Category) => c.key == id)
      .first()
      .value();
  }

  getSubcategory(id: String) {
    return _.chain(this.subcategories)
      .filter((c: IdNameBasic) => c.id == id)
      .first()
      .value();
  }

  getAccount(id: String) {
    return _.chain(this.accounts)
      .filter((c: Account) => c.key == id)
      .first()
      .value();
  }

  setValues(entry, getSubcat: boolean) {
    this.entry = entry;
    let category = this.getCategory(entry.category.id);
    let subcategory: IdNameBasic;
    if (getSubcat) {
      this.subcategories = category.subcategories;
      subcategory = this.getSubcategory(entry.category.subcategory.id);
    }

    this.entryForm.controls['notes'].setValue(entry.notes);
    this.entryForm.controls['amount'].setValue(entry.amount);
    this.entryForm.controls['category'].setValue(category);
    if (getSubcat) {
      this.entryForm.controls['subcategory'].setValue(subcategory);
    }

    let account;
    if (entry.fromAccount) {
      account = this.getAccount(entry.fromAccount.id);
    } else if (entry.toAccount) {
      account = this.getAccount(entry.toAccount.id);
    }
    this.entryForm.controls['account'].setValue(account);
  }

}
