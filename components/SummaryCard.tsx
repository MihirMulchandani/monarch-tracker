import React from "react";
import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { Currency } from "../types";

interface SummaryCardProps {
  title: string;
  amount: number;
  type: "balance" | "income" | "expense";
  currency: Currency;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type, currency }) => {
  const getIcon = () => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="text-green-500" size={20} />;
      case "expense":
        return <ArrowDownRight className="text-red-500" size={20} />;
      default:
        return <DollarSign className="text-monarch-accent" size={20} />;
    }
  };

  const getColorClass = () => {
    switch(type) {
        case "income": return "text-green-500";
        case "expense": return "text-red-500";
        default: return "text-light-text dark:text-monarch-text";
    }
  }

  return (
    <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/5">
          {getIcon()}
        </div>
        <span className="text-sm font-medium text-monarch-muted">{title}</span>
      </div>
      <div className={`text-2xl md:text-3xl font-bold tracking-tight ${getColorClass()}`}>
        {formatCurrency(amount, currency)}
      </div>
    </div>
  );
};
