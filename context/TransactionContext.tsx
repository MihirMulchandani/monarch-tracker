import React, { createContext, useContext, useEffect, useState } from "react";
import { Transaction, AppSettings, Currency } from "../types";
import { LOCAL_STORAGE_KEY, SETTINGS_STORAGE_KEY } from "../constants";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  clearAllData: () => void;
  importData: (data: Transaction[]) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrencyState] = useState<Currency>('INR');

  // Load Data
  useEffect(() => {
    const savedTx = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTx) {
      try {
        setTransactions(JSON.parse(savedTx));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }

    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.currency) setCurrencyState(parsed.currency);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save Data on Change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...parsed, currency: c }));
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllData = () => {
    setTransactions([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const importData = (data: Transaction[]) => {
    setTransactions(data);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        clearAllData,
        importData,
        currency,
        setCurrency,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("useTransactions must be used within a TransactionProvider");
  return context;
};
