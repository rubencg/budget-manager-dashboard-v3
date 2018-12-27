export interface Entry {
  key?: string;
  date: string;
  amount: number;
  notes?: string;
}

export interface Account {
  key?: string;
  currentBalance: number;
  name: string;
  isSummable?: boolean;
  img?: string;
  type?: AccountType;
}

export interface Expense extends Entry {
  category: CategoryBasic;
  fromAccount: IdNameBasic;
}

export interface Income extends Entry {
  category: CategoryBasic;
  toAccount: IdNameBasic;
  isApplied?: boolean;
}

export interface BudgetExpense extends Entry {
  category: CategoryBasic;
}

export interface Transfer extends Entry {
  fromAccount: IdNameBasic;
  toAccount: IdNameBasic;
}

export interface CategoryBasic {
  id: string;
  name: string;
  subcategory: IdNameBasic;
  img?: string;
}

export interface IdNameBasic {
  id: string;
  name: string;
  img?: string;
}

export enum EntryType {
  Expense = 1,
  Income = 2,
  BudgetExpense = 3
}

export enum AccountType {
  Debit = 1,
  Cash = 2,
  Credit = 3,
  Savings = 4,
  SarahiSavings = 5
}

export interface Category {
  key?: string;
  name: string;
  img?: string;
  subcategories?: IdNameBasic[];
}

export interface Group {
  title: string,
  date: Date,
  toggleActive: boolean,
  totalValue: number
}
