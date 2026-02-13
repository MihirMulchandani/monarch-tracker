import { Currency } from "./types";

export const APP_NAME = "Monarch";
export const LOCAL_STORAGE_KEY = "monarch_transactions";
export const SETTINGS_STORAGE_KEY = "monarch_settings";

export const CATEGORIES = {
  income: [
    "Salary",
    "Freelance",
    "Investments",
    "Gift",
    "Other",
  ],
  expense: [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Health",
    "Shopping",
    "Education",
    "Travel",
    "Other",
  ],
};

export const CURRENCIES: Record<Currency, { symbol: string; locale: string }> = {
  INR: { symbol: "₹", locale: "en-IN" },
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
  JPY: { symbol: "¥", locale: "ja-JP" },
};
