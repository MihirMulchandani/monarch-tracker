import jsPDF from "jspdf";
import { format } from "date-fns";
import { Transaction, Currency } from "../types";
import { formatCurrency, formatDate } from "./formatters";

export const exportToCSV = (transactions: Transaction[]) => {
  const headers = ["ID", "Date", "Type", "Category", "Amount", "Notes"];
  const rows = transactions.map((t) => [
    t.id,
    formatDate(t.date, 'yyyy-MM-dd'),
    t.type,
    t.category,
    t.amount.toString(),
    t.notes || "",
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `monarch_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (transactions: Transaction[], currency: Currency, dateRangeLabel: string) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MONARCH", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Generated on ${format(new Date(), "PPpp")}`, 14, 26);
  doc.text(`Range: ${dateRangeLabel}`, 14, 31);

  // Summary
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const net = totalIncome - totalExpense;

  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text("Summary", 14, 45);
  
  doc.setFontSize(10);
  doc.text(`Total Income: ${formatCurrency(totalIncome, currency)}`, 14, 52);
  doc.text(`Total Expense: ${formatCurrency(totalExpense, currency)}`, 14, 57);
  doc.text(`Net Balance: ${formatCurrency(net, currency)}`, 14, 62);

  // Table Header
  let y = 75;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Date", 14, y);
  doc.text("Category", 50, y);
  doc.text("Type", 90, y);
  doc.text("Amount", 120, y);
  doc.text("Notes", 150, y);
  
  // Line
  doc.setDrawColor(200);
  doc.line(14, y + 2, 196, y + 2);
  y += 10;

  // Table Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  transactions.forEach((t) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(formatDate(t.date, 'MMM dd, yyyy'), 14, y);
    doc.text(t.category, 50, y);
    
    // Type colored text? PDF is simpler with black, but let's try case
    const typeLabel = t.type.toUpperCase();
    doc.text(typeLabel, 90, y);
    
    const amountStr = formatCurrency(t.amount, currency);
    doc.text(amountStr, 120, y);
    
    const notes = t.notes ? t.notes.substring(0, 25) + (t.notes.length > 25 ? "..." : "") : "-";
    doc.text(notes, 150, y);

    y += 8;
  });

  doc.save(`monarch_report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
};
