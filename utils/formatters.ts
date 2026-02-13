import { format, parseISO } from "date-fns";
import { CURRENCIES, APP_NAME } from "../constants";
import { Currency } from "../types";

export const formatCurrency = (amount: number, currency: Currency = 'INR'): string => {
  const config = CURRENCIES[currency];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr: string, pattern: string = 'MMM dd, yyyy'): string => {
  try {
    return format(parseISO(dateStr), pattern);
  } catch (e) {
    return dateStr;
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
