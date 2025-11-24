import React, { useState, useEffect } from "react";
import ExpensesList from "./components/ExpensesList";
import NewExpense from "./components/NewExpense";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    setExpenses([
      { id: "e1", title: "Groceries", amount: 900, date: new Date(2020, 7, 14) },
      { id: "e2", title: "New TV", amount: 34000, date: new Date(2021, 2, 12) },
      { id: "e3", title: "Sofa Set", amount: 25000, date: new Date(2021, 2, 28) }
    ]);
  }, []);

  const addExpenseHandler = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpenseHandler = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const startEditingHandler = (expense) => {
    setEditingExpense(expense);   // send selected expense to NewExpense
  };

  const updateExpenseHandler = (updated) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === updated.id ? updated : exp))
    );
    setEditingExpense(null); // close form
  };

  const cancelEditHandler = () => {
    setEditingExpense(null);
  };

  return (
    <div>
      <NewExpense
        onAddExpense={addExpenseHandler}
        editingExpense={editingExpense}
        onUpdateExpense={updateExpenseHandler}
        onCancelEdit={cancelEditHandler}
      />

      <ExpensesList
        items={expenses}
        onDelete={deleteExpenseHandler}
        onEdit={startEditingHandler}
      />
    </div>
  );
}

export default App;
