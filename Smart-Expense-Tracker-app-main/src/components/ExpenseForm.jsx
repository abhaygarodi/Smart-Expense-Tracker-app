import "./ExpenseForm.css";
import React, { useState, useEffect, useRef } from "react";

/* ─── Icons ─── */
const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
);

const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12" /><path d="M6 8h12" /><path d="m6 13 8.5 8" /><path d="M6 13h3" /><path d="M9 13c6.667 0 6.667-10 0-10" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);

const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Education",
  "Other",
];

const ExpenseForm = (props) => {
  const [inputTitle, setInputTitle] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputCategory, setInputCategory] = useState("Other");
  const titleRef = useRef(null);

  useEffect(() => {
    if (props.isEditMode && props.existingData) {
      setInputTitle(props.existingData.title);
      setInputAmount(props.existingData.amount);
      setInputDate(props.existingData.date.toISOString().slice(0, 10));
      setInputCategory(props.existingData.category || "Other");
    }
  }, [props.isEditMode, props.existingData]);

  useEffect(() => {
    if (props.isEditMode && titleRef.current) {
      titleRef.current.focus();
    }
  }, [props.isEditMode]);

  const titleChangeHandler = (event) => setInputTitle(event.target.value);
  const amountChangeHandler = (event) => setInputAmount(event.target.value);
  const dateChangeHandler = (event) => setInputDate(event.target.value);
  const categoryChangeHandler = (event) => setInputCategory(event.target.value);

  const submitHandler = (event) => {
    event.preventDefault();

    const expenseData = {
      id: props.isEditMode ? props.existingData.id : Math.random().toString(),
      title: inputTitle,
      amount: +inputAmount,
      date: new Date(inputDate),
      category: inputCategory,
    };

    props.onSaveExpenseData(expenseData);
    setInputTitle("");
    setInputAmount("");
    setInputDate("");
    setInputCategory("Other");
  };

  return (
    <form onSubmit={submitHandler} className="expense-form" autoComplete="off">
      <div className="expense-form__fields">
        {/* Title */}
        <div className="expense-form__group">
          <label htmlFor="expense-title" className="expense-form__label">
            <TagIcon />
            Title
          </label>
          <input
            ref={titleRef}
            id="expense-title"
            className="expense-form__input"
            type="text"
            placeholder="e.g. Groceries, Rent, Netflix…"
            value={inputTitle}
            onChange={titleChangeHandler}
            required
            aria-required="true"
          />
        </div>

        {/* Amount */}
        <div className="expense-form__group">
          <label htmlFor="expense-amount" className="expense-form__label">
            <CurrencyIcon />
            Amount
          </label>
          <div className="expense-form__input-wrapper">
            <span className="expense-form__currency-prefix" aria-hidden="true">₹</span>
            <input
              id="expense-amount"
              className="expense-form__input expense-form__input--has-prefix"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={inputAmount}
              onChange={amountChangeHandler}
              required
              aria-required="true"
            />
          </div>
        </div>

        {/* Date */}
        <div className="expense-form__group">
          <label htmlFor="expense-date" className="expense-form__label">
            <CalendarIcon />
            Date
          </label>
          <input
            id="expense-date"
            className="expense-form__input"
            type="date"
            value={inputDate}
            onChange={dateChangeHandler}
            required
            aria-required="true"
          />
        </div>

        {/* Category */}
        <div className="expense-form__group">
          <label htmlFor="expense-category" className="expense-form__label">
            <FolderIcon />
            Category
          </label>
          <select
            id="expense-category"
            className="expense-form__input expense-form__select"
            value={inputCategory}
            onChange={categoryChangeHandler}
            aria-label="Select expense category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="expense-form__actions">
        {props.isEditMode && (
          <button type="button" className="btn btn--ghost" onClick={props.onCancel}>
            <XIcon />
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary">
          {props.isEditMode ? (
            <>
              <CheckIcon />
              Update Expense
            </>
          ) : (
            <>
              <PlusIcon />
              Add Expense
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
