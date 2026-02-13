import React from "react";
import { Transaction, Currency } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  limit?: number;
  currency: Currency;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDelete,
  limit,
  currency,
}) => {
  const displayedData = limit ? transactions.slice(0, limit) : transactions;

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
          <ArrowUpRight className="text-monarch-muted" />
        </div>
        <p className="text-monarch-muted">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-light-border dark:border-monarch-border text-monarch-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Note</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            {onDelete && <th className="px-4 py-3 font-medium w-[50px]"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-light-border dark:divide-monarch-border">
          {displayedData.map((t) => (
            <tr key={t.id} className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-light-text dark:text-monarch-text">
                {formatDate(t.date)}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-white/10 px-2 py-1 text-xs font-medium text-light-text dark:text-monarch-text">
                  {t.category}
                </span>
              </td>
              <td className="px-4 py-3 text-monarch-muted max-w-[200px] truncate">
                {t.notes || "-"}
              </td>
              <td className={`px-4 py-3 text-right font-medium ${t.type === 'income' ? 'text-green-500' : 'text-light-text dark:text-monarch-text'}`}>
                {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount, currency)}
              </td>
              {onDelete && (
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-monarch-muted hover:text-red-500 transition-all"
                    title="Delete transaction"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
