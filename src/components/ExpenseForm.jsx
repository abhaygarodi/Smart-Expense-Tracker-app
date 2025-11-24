import "./ExpenseForm.css";
import React, { useState, useEffect } from 'react';

const ExpenseForm = (props) => {

  const [inputTitle, setInputTitle] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputDate, setInputDate] = useState('');

  useEffect(() => {
    if (props.isEditMode && props.existingData) {
      setInputTitle(props.existingData.title);
      setInputAmount(props.existingData.amount);
      setInputDate(props.existingData.date.toISOString().slice(0, 10));
    }
  }, [props.isEditMode, props.existingData]);

  const titleChangeHandler = (event) => setInputTitle(event.target.value);
  const amountChangeHandler = (event) => setInputAmount(event.target.value);
  const dateChangeHandler = (event) => setInputDate(event.target.value);

  const submitHandler = (event) => {
    event.preventDefault();

    const expenseData = {
      id: props.isEditMode ? props.existingData.id : Math.random().toString(),
      title: inputTitle,
      amount: +inputAmount,
      date: new Date(inputDate)
    };

    props.onSaveExpenseData(expenseData);

    setInputTitle('');
    setInputAmount('');
    setInputDate('');
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="new-expense__controls">

        <div className="new-expense__control">
          <label>Title</label>
          <input value={inputTitle} onChange={titleChangeHandler} />
        </div>

        <div className="new-expense__control">
          <label>Amount</label>
          <input type="number" value={inputAmount} onChange={amountChangeHandler} />
        </div>

        <div className="new-expense__control">
          <label>Date</label>
          <input type="date" value={inputDate} onChange={dateChangeHandler} />
        </div>
      </div>

      <div className="new-expense__actions">
        {props.isEditMode && (
          <button type="button" onClick={props.onCancel}>
            Cancel
          </button>
        )}

        <button type="submit">
          {props.isEditMode ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
