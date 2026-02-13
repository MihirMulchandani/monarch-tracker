export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO String
  notes?: string;
  createdAt: string;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: string;
  category: string;
  date: string;
  notes: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type Theme = 'dark' | 'light';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';

export interface AppSettings {
  currency: Currency;
  theme: Theme;
}
