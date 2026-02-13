import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { CATEGORIES } from "../constants";
import { TransactionFormData, TransactionType } from "../types";
import { generateId } from "../utils/formatters";
import { useTransactions } from "../context/TransactionContext";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    addTransaction({
      id: generateId(),
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    });

    // Reset and Close
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    });
    onClose();
  };

  const categories = formData.type === "income" ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-black/20 p-1">
          {(['expense', 'income'] as TransactionType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type, category: '' })}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                formData.type === type
                  ? "bg-white dark:bg-monarch-card shadow text-black dark:text-monarch-text"
                  : "text-monarch-muted hover:text-light-text dark:hover:text-monarch-text"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-monarch-muted mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            required
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full rounded-xl border border-light-border dark:border-monarch-border bg-transparent px-4 py-3 text-lg font-bold outline-none focus:border-monarch-accent focus:ring-1 focus:ring-monarch-accent transition-all placeholder:text-gray-500"
            placeholder="0.00"
          />
        </div>

        {/* Category & Date Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-monarch-muted mb-1">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl border border-light-border dark:border-monarch-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-monarch-accent dark:bg-monarch-card"
            >
              <option value="" disabled>Select</option>
              {categories.map(c => (
                <option key={c} value={c} className="dark:bg-monarch-card">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-monarch-muted mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-xl border border-light-border dark:border-monarch-border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-monarch-accent dark:[color-scheme:dark]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-monarch-muted mb-1">Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-xl border border-light-border dark:border-monarch-border bg-transparent px-4 py-3 text-sm outline-none focus:border-monarch-accent resize-none h-24"
            placeholder="What was this for?"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" size="lg">
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};
