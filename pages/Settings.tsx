import React, { useRef, useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Currency } from "../types";
import { CURRENCIES } from "../constants";
import { Moon, Sun, Trash2, Upload, Download, AlertTriangle } from "lucide-react";

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { transactions, importData, clearAllData, currency, setCurrency } = useTransactions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "monarch_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
            importData(json);
            alert("Data restored successfully.");
        } else {
            alert("Invalid JSON format.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to parse file.");
      }
    };
    reader.readAsText(file);
    // Reset
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500 pb-20">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Appearance */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-monarch-muted uppercase tracking-wider text-xs">Appearance</h3>
        <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                <div>
                    <p className="font-medium">App Theme</p>
                    <p className="text-sm text-monarch-muted">Switch between light and dark mode</p>
                </div>
            </div>
            <Button variant="secondary" onClick={toggleTheme}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-monarch-muted uppercase tracking-wider text-xs">Preferences</h3>
        <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6 flex items-center justify-between">
            <div>
                <p className="font-medium">Currency</p>
                <p className="text-sm text-monarch-muted">Select your preferred currency</p>
            </div>
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="rounded-xl border border-light-border dark:border-monarch-border bg-transparent px-3 py-2 text-sm outline-none focus:border-monarch-accent dark:bg-black/20"
            >
                {Object.keys(CURRENCIES).map((c) => (
                    <option key={c} value={c}>{c} ({CURRENCIES[c as Currency].symbol})</option>
                ))}
            </select>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-monarch-muted uppercase tracking-wider text-xs">Data Management</h3>
        <div className="rounded-2xl bg-light-card dark:bg-monarch-card border border-light-border dark:border-monarch-border p-6 space-y-6">
            
            {/* Backup */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Download size={20} className="text-monarch-accent"/>
                    <div>
                        <p className="font-medium">Backup Data</p>
                        <p className="text-sm text-monarch-muted">Download your transactions as JSON</p>
                    </div>
                </div>
                <Button variant="secondary" onClick={handleBackup}>Download</Button>
            </div>
            
            <div className="h-px bg-light-border dark:bg-monarch-border" />

            {/* Restore */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Upload size={20} className="text-monarch-accent"/>
                    <div>
                        <p className="font-medium">Restore Data</p>
                        <p className="text-sm text-monarch-muted">Upload a previously exported JSON file</p>
                    </div>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleRestore}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="secondary">Upload</Button>
                </div>
            </div>

            <div className="h-px bg-light-border dark:bg-monarch-border" />

            {/* Delete */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Trash2 size={20} className="text-red-500"/>
                    <div>
                        <p className="font-medium text-red-500">Delete All Data</p>
                        <p className="text-sm text-monarch-muted">Permanently remove all transactions</p>
                    </div>
                </div>
                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
            </div>
        </div>
      </section>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
                <p className="text-sm text-monarch-muted">
                    Are you sure you want to delete all data? This action cannot be undone.
                </p>
            </div>
            <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="w-full" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="danger" className="w-full" onClick={() => { clearAllData(); setIsDeleteModalOpen(false); }}>Yes, Delete</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
