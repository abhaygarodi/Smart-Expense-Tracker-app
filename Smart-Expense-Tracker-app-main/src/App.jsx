import React, { useState, useEffect, useMemo, useCallback } from "react";
import ExpensesList from "./components/ExpensesList";
import NewExpense from "./components/NewExpense";
import ExpenseChart from "./components/ExpenseChart";
import CategoryChart from "./components/CategoryChart";
import "./App.css";

/* ─── Inline SVG Icons ─── */
const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const HashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />
  </svg>
);

const AvgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);

const MaxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 16 4-4 4 4" /><path d="M7 20V12" /><path d="m21 8-4 4-4-4" /><path d="M17 4v8" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

/* ─── LocalStorage helpers ─── */
const LS_KEY = "expense-tracker-data";

const loadExpenses = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.map((e) => ({ ...e, date: new Date(e.date) }));
  } catch {
    return null;
  }
};

const saveExpenses = (expenses) => {
  localStorage.setItem(LS_KEY, JSON.stringify(expenses));
};

/* ─── Default data ─── */
const DEFAULT_EXPENSES = [
  { id: "e1", title: "Groceries", amount: 900, date: new Date(2025, 7, 14), category: "Food & Dining" },
  { id: "e2", title: "New TV", amount: 34000, date: new Date(2025, 2, 12), category: "Shopping" },
  { id: "e3", title: "Sofa Set", amount: 25000, date: new Date(2025, 2, 28), category: "Shopping" },
  { id: "e4", title: "Uber Rides", amount: 2400, date: new Date(2025, 1, 5), category: "Transport" },
  { id: "e5", title: "Netflix Subscription", amount: 649, date: new Date(2025, 0, 15), category: "Entertainment" },
  { id: "e6", title: "Electricity Bill", amount: 3200, date: new Date(2025, 1, 20), category: "Bills & Utilities" },
  { id: "e7", title: "Gym Membership", amount: 1500, date: new Date(2025, 0, 1), category: "Health" },
  { id: "e8", title: "Online Course", amount: 4999, date: new Date(2025, 3, 10), category: "Education" },
];

function App() {
  const [expenses, setExpenses] = useState(() => loadExpenses() || DEFAULT_EXPENSES);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterMonth, setFilterMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  /* Persist on change */
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ─── Handlers ─── */
  const addExpenseHandler = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
    setToast({ type: "success", message: "Expense added successfully!" });
  };

  const deleteExpenseHandler = (id) => {
    const exp = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    setToast({ type: "danger", message: `"${exp?.title || "Expense"}" deleted` });
  };

  const startEditingHandler = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateExpenseHandler = (updated) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === updated.id ? updated : exp))
    );
    setEditingExpense(null);
    setToast({ type: "success", message: "Expense updated!" });
  };

  const cancelEditHandler = () => {
    setEditingExpense(null);
  };

  /* ─── CSV Export ─── */
  const exportCSV = useCallback(() => {
    const header = "Title,Amount,Date,Category\n";
    const rows = expenses
      .map((e) => `"${e.title}",${e.amount},${e.date.toISOString().slice(0, 10)},"${e.category || "Other"}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast({ type: "success", message: "Exported as CSV!" });
  }, [expenses]);

  /* ─── Derived Data ─── */
  const filteredExpenses = useMemo(() => {
    let result = expenses;
    if (filterMonth !== "all") {
      result = result.filter((exp) => exp.date.getMonth() === parseInt(filterMonth));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(q) ||
          (exp.category || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [expenses, filterMonth, searchQuery]);

  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [filteredExpenses]
  );

  const avgAmount = useMemo(
    () => (filteredExpenses.length > 0 ? Math.round(totalAmount / filteredExpenses.length) : 0),
    [filteredExpenses, totalAmount]
  );

  const highestExpense = useMemo(
    () => (filteredExpenses.length > 0 ? Math.max(...filteredExpenses.map((e) => e.amount)) : 0),
    [filteredExpenses]
  );

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <main className="app" role="main">
      {/* ── Toast ── */}
      {toast && (
        <div className={`toast toast--${toast.type}`} role="alert" aria-live="polite">
          <span>{toast.message}</span>
          <button className="toast__close" onClick={() => setToast(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__logo">
          <div className="app-header__icon" aria-hidden="true">
            <WalletIcon />
          </div>
          <h1 className="app-header__title">Expense Tracker</h1>
        </div>
        <p className="app-header__subtitle">
          Track, manage &amp; analyze your spending effortlessly
        </p>
      </header>

      {/* ── Summary Cards ── */}
      <section className="summary-grid" aria-label="Expense summary">
        <article className="summary-card summary-card--total">
          <div className="summary-card__icon" aria-hidden="true">
            <ChartIcon />
          </div>
          <p className="summary-card__label">Total Spent</p>
          <p className="summary-card__value">{formatCurrency(totalAmount)}</p>
        </article>

        <article className="summary-card summary-card--count">
          <div className="summary-card__icon" aria-hidden="true">
            <HashIcon />
          </div>
          <p className="summary-card__label">Transactions</p>
          <p className="summary-card__value">{filteredExpenses.length}</p>
        </article>

        <article className="summary-card summary-card--avg">
          <div className="summary-card__icon" aria-hidden="true">
            <AvgIcon />
          </div>
          <p className="summary-card__label">Average</p>
          <p className="summary-card__value">{formatCurrency(avgAmount)}</p>
        </article>

        <article className="summary-card summary-card--max">
          <div className="summary-card__icon" aria-hidden="true">
            <MaxIcon />
          </div>
          <p className="summary-card__label">Highest</p>
          <p className="summary-card__value">{formatCurrency(highestExpense)}</p>
        </article>
      </section>

      {/* ── Charts Grid ── */}
      <section className="charts-grid" aria-label="Expense analytics">
        <ExpenseChart expenses={expenses} />
        <CategoryChart expenses={expenses} />
      </section>

      {/* ── Add / Edit Expense ── */}
      <NewExpense
        onAddExpense={addExpenseHandler}
        editingExpense={editingExpense}
        onUpdateExpense={updateExpenseHandler}
        onCancelEdit={cancelEditHandler}
      />

      {/* ── Expense List Section ── */}
      <section aria-label="Expense list">
        <div className="section-header">
          <h2 className="section-header__title">
            <ListIcon />
            Recent Expenses
          </h2>
          <div className="section-header__controls">
            {/* Search */}
            <div className="search-box">
              <span className="search-box__icon" aria-hidden="true"><SearchIcon /></span>
              <input
                type="text"
                className="search-box__input"
                placeholder="Search expenses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search expenses"
              />
            </div>

            {/* Month filter */}
            <div className="section-header__filter">
              <select
                id="month-filter"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                aria-label="Filter expenses by month"
              >
                <option value="all">All Months</option>
                {months.map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
              <span className="section-header__filter-icon" aria-hidden="true">
                <ChevronDownIcon />
              </span>
            </div>

            {/* Export */}
            <button className="btn btn--outline-sm" onClick={exportCSV} title="Export as CSV" aria-label="Export expenses as CSV">
              <DownloadIcon />
              Export
            </button>
          </div>
        </div>

        <ExpensesList
          items={filteredExpenses}
          onDelete={deleteExpenseHandler}
          onEdit={startEditingHandler}
        />
      </section>
    </main>
  );
}

export default App;
