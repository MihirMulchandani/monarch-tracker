# Monarch | Premium Expense Tracker

Monarch is a high-performance, privacy-focused personal finance application built with modern web technologies. It operates entirely client-side, ensuring your financial data never leaves your device unless you explicitly export it.

## 🚀 Overview

- **Architecture**: Single Page Application (SPA)
- **Data Storage**: LocalStorage (Persistent)
- **Design System**: Minimalist Dark Mode UI
- **License**: MIT

## ✨ Features

- **Dashboard**: Real-time net worth tracking and monthly visualization.
- **Transaction Management**: Rapid entry of income and expenses.
- **Analytics**: Interactive charts powered by Recharts.
- **Reports**: Generate PDF summaries and export CSV data.
- **Settings**: Dark/Light mode, multi-currency support, and data backup/restore.

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router (HashRouter for static compatibility)
- **Charts**: Recharts
- **Utilities**: date-fns, jsPDF, Lucide React
- **Build Tool**: Vite (implied by structure)

## 📂 Project Structure

```
/
├── components/         # Reusable UI components
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Sidebar.tsx
│   └── ...
├── context/           # Global state (Theme, Transactions)
├── pages/             # Route views (Dashboard, Reports, Settings)
├── utils/             # Helpers (Formatters, Export logic)
├── types.ts           # TS Interfaces
├── App.tsx            # Main layout & Routing
└── index.tsx          # Entry point
```

## 📦 Installation & Local Development

1.  **Install Dependencies**
    ```bash
    npm install react react-dom react-router-dom lucide-react date-fns recharts jspdf
    npm install -D tailwindcss postcss autoprefixer typescript @types/react @types/react-dom
    ```

2.  **Run Development Server**
    If using Vite:
    ```bash
    npm run dev
    ```

## 📤 Data Management

All data is stored in your browser's `localStorage` under the key `monarch_transactions`.
- **Backup**: Go to Settings > Backup Data to download a JSON file.
- **Restore**: Upload a previously generated JSON file to restore your history.

## 🔮 Future Improvements

- [ ] Budget goals and tracking
- [ ] Recurring transactions
- [ ] Multiple accounts/wallets support
- [ ] PWA (Progressive Web App) support for offline mobile use

---
Built with strict adherence to clean architecture and type safety.
