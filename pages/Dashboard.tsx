import React, { useMemo } from "react";
import { useTransactions } from "../context/TransactionContext";
import { SummaryCard } from "../components/SummaryCard";
import { TransactionTable } from "../components/TransactionTable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, subMonths } from "date-fns";

export const Dashboard: React.FC = () => {
  const { transactions, currency } = useTransactions();

  // Summary Calcs
  const { income, expense, balance } = useMemo(() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions]);

  // Chart Data (Last 30 days daily breakdown)
  const chartData = useMemo(() => {
    const end = new Date();
    const start = subMonths(end, 1); // Last month window
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));
      const inc = dayTransactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
      const exp = dayTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
      return {
        date: format(day, 'MMM dd'),
        income: inc,
        expense: exp
      };
    });
  }, [transactions]);

  // Recent Transactions sorted by date
  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Net Balance" amount={balance} type="balance" currency={currency} />
        <SummaryCard title="Total Income" amount={income} type="income" currency={currency} />
        <SummaryCard title="Total Expenses" amount={expense} type="expense" currency={currency} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2 rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold">Monthly Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#666' }} 
                  minTickGap={30}
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6 shadow-sm flex flex-col">
          <h3 className="mb-4 text-lg font-bold">Recent</h3>
          <div className="flex-1 overflow-auto -mx-4 px-4">
             <TransactionTable transactions={recentTransactions} currency={currency} limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
};
