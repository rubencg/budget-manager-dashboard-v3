import { Component, OnInit } from '@angular/core';
import { EntryType, Category, CategoryBasic, IdNameBasic, Income, Expense, BudgetExpense } from 'src/app/interfaces';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { EntryService } from 'src/app/services/entry.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';

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
  subcategories: IdNameBasic[];

  private sub: any;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private categoryService: CategoriesService,
    private entryService: EntryService, private spinner: NgxSpinnerService) {
    this.entryForm = this.fb.group({
      category: [''],
      notes: [''],
      amount: ['', Validators.required],
      subcategory: ['']
    })
    this.load();
  }

  ngOnInit() {

  }

  load(){
    this.spinner.show();
    this.route.params.subscribe(params => {
      this.key = params['key'];
      this.entryType = +params['entryType'];
    });

    if (!this.categoryService.getExpenseCategoriesLocal()) {

      if (this.entryType == EntryType.Income) {
        this.categoryService.getAllIncomeCategories()
          .subscribe((items: Category[]) => {
            this.entryService.getAllIncomes().subscribe(entries => {
              this.loadIncomeCategories(items);
              this.loadEntry();
              this.spinner.hide();
            });
          });
      } else if (this.entryType == EntryType.Expense)  {
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
    } else {
      if (this.entryType == EntryType.Income) {
        this.loadIncomeCategories(this.categoryService.getIncomeCategoriesLocal());
        this.loadEntry();
      } else {
        this.loadExpenseCategories(this.categoryService.getExpenseCategoriesLocal());
        this.loadEntry();
      }
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

  submit() {
    console.log(this.entryForm.value);

  }

  categoryChanged() {
    let cat: Category = this.entryForm.value.category;
    this.subcategories = cat.subcategories;
    this.entryForm.controls['subcategory'].setValue(this.subcategories[0]);
  }

  loadEntry() {
    if (this.entryType == EntryType.Income) {
      let income: Income = _.chain(this.entryService.getIncomesLocal())
        .filter((i: Income) => i.key == this.key)
        .first()
        .value();
      let selectedCategory = _.chain(this.categories)
        .filter((c: Category) => c.key == income.category.id)
        .first()
        .value();

      this.entryForm.controls['notes'].setValue(income.notes);
      this.entryForm.controls['amount'].setValue(income.amount);
      this.entryForm.controls['category'].setValue(selectedCategory);
    }else if (this.entryType == EntryType.Expense) {
      let expense: Expense = _.chain(this.entryService.getExpensesLocal())
        .filter((i: Expense) => i.key == this.key)
        .first()
        .value();
      let selectedCategory = _.chain(this.categories)
        .filter((c: Category) => c.key == expense.category.id)
        .first()
        .value();
      this.subcategories = selectedCategory.subcategories;
      let selectedSubcategory : IdNameBasic = _.chain(this.subcategories)
      .filter((c: IdNameBasic) => c.id == expense.category.subcategory.id)
      .first()
      .value();

      this.entryForm.controls['notes'].setValue(expense.notes);
      this.entryForm.controls['amount'].setValue(expense.amount);
      this.entryForm.controls['category'].setValue(selectedCategory);
      this.entryForm.controls['subcategory'].setValue(selectedSubcategory);
    }else{
      let budgetExpense: BudgetExpense = _.chain(this.entryService.getBudgetExpensesLocal())
        .filter((i: BudgetExpense) => i.key == this.key)
        .first()
        .value();
      let selectedCategory = _.chain(this.categories)
        .filter((c: Category) => c.key == budgetExpense.category.id)
        .first()
        .value();
      this.subcategories = selectedCategory.subcategories;
      let selectedSubcategory : IdNameBasic = _.chain(this.subcategories)
      .filter((c: IdNameBasic) => c.id == budgetExpense.category.subcategory.id)
      .first()
      .value();

      this.entryForm.controls['notes'].setValue(budgetExpense.notes);
      this.entryForm.controls['amount'].setValue(budgetExpense.amount);
      this.entryForm.controls['category'].setValue(selectedCategory);
      this.entryForm.controls['subcategory'].setValue(selectedSubcategory);
    }
  }

}
