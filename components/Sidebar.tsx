import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PieChart, Settings, Plus, Wallet } from "lucide-react";

interface SidebarProps {
  onAddTransaction: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddTransaction }) => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: PieChart, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-light-border dark:border-monarch-border bg-light-card dark:bg-monarch-card">
        <div className="flex h-20 items-center px-8 border-b border-light-border dark:border-monarch-border">
          <Wallet className="h-8 w-8 text-monarch-accent mr-3" />
          <h1 className="text-xl font-bold tracking-tight">Monarch</h1>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-monarch-accent/10 text-monarch-accent"
                    : "text-monarch-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-light-text dark:hover:text-monarch-text"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? "text-monarch-accent" : ""} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-monarch-accent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-light-border dark:border-monarch-border">
          <button
            onClick={onAddTransaction}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-monarch-accent px-4 py-3 text-sm font-bold text-black shadow-lg shadow-monarch-accent/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-light-border dark:border-monarch-border bg-light-card dark:bg-monarch-card px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-monarch-accent"
                  : "text-monarch-muted"
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={onAddTransaction}
          className="flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs font-medium text-monarch-accent"
        >
           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-monarch-accent text-black">
             <Plus size={20} />
           </div>
           Add
        </button>
      </nav>
    </>
  );
};
