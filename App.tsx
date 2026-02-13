import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { TransactionProvider } from "./context/TransactionContext";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { AddTransactionModal } from "./components/AddTransactionModal";

const AppLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-monarch-bg text-light-text dark:text-monarch-text transition-colors duration-200">
      <Sidebar onAddTransaction={() => setIsModalOpen(true)} />
      
      <main className="md:pl-64 min-h-screen p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <HashRouter>
          <AppLayout />
        </HashRouter>
      </TransactionProvider>
    </ThemeProvider>
  );
};

export default App;
