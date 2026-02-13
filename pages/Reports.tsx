import React, { useMemo, useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import { TransactionTable } from "../components/TransactionTable";
import { Button } from "../components/Button";
import { Download, FileText } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, subDays } from "date-fns";
import { exportToCSV, exportToPDF } from "../utils/export";
import { formatCurrency } from "../utils/formatters";
import { DateRange } from "../types";

type TimeRange = 'daily' | 'monthly' | 'yearly' | 'all';

export const Reports: React.FC = () => {
  const { transactions, currency, deleteTransaction } = useTransactions();
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  
  // Filter Logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;

    switch (timeRange) {
      case 'daily':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'monthly':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'yearly':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'all':
        return transactions;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    return transactions.filter(t => isWithinInterval(new Date(t.date), { start, end }));
  }, [timeRange, transactions]);

  // Category Data for Pie Chart
  const categoryData = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const grouped: Record<string, number> = {};
    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const COLORS = ['#F5B700', '#EF4444', '#22C55E', '#3B82F6', '#A855F7', '#EC4899', '#64748B'];

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions, currency, timeRange);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Reports</h2>
        <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportPDF}>
                <FileText size={16} className="mr-2" /> PDF
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportCSV}>
                <Download size={16} className="mr-2" /> CSV
            </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex p-1 rounded-xl bg-gray-100 dark:bg-monarch-card w-full md:w-auto self-start">
        {(['daily', 'monthly', 'yearly', 'all'] as TimeRange[]).map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              timeRange === r
                ? "bg-white dark:bg-white/10 shadow text-black dark:text-monarch-text"
                : "text-monarch-muted hover:text-light-text dark:hover:text-monarch-text"
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Chart */}
        <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6 shadow-sm min-h-[350px]">
          <h3 className="text-lg font-bold mb-4">Expense Breakdown</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => formatCurrency(value, currency)}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-monarch-muted">
                No expense data for this period.
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 content-start">
             <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6">
                <p className="text-sm text-monarch-muted">Filtered Income</p>
                <p className="text-2xl font-bold text-green-500">
                    {formatCurrency(filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0), currency)}
                </p>
             </div>
             <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6">
                <p className="text-sm text-monarch-muted">Filtered Expense</p>
                <p className="text-2xl font-bold text-red-500">
                    {formatCurrency(filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0), currency)}
                </p>
             </div>
             <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6">
                <p className="text-sm text-monarch-muted">Total Transactions</p>
                <p className="text-2xl font-bold text-light-text dark:text-monarch-text">
                    {filteredTransactions.length}
                </p>
             </div>
        </div>
      </div>

      {/* Full Table */}
      <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Transaction History</h3>
        <TransactionTable transactions={filteredTransactions} currency={currency} onDelete={deleteTransaction} />
      </div>
    </div>
  );
};
