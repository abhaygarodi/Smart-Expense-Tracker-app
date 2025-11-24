import ExpenseDate from "./ExpenseDate";
import "./ExpenseItem.css";

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  return (
    <li className="expense-item">
      <ExpenseDate expDate={expense.date} />

      <div className="expense-item__description">
        <h2>{expense.title}</h2>
        <p className="expense-item__price">Rs {expense.amount}</p>
      </div>

      <button className="edit-btn" onClick={() => onEdit(expense)}>Edit</button>
      <button className="delete-btn" onClick={() => onDelete(expense.id)}>Delete</button>
    </li>
  );
};

export default ExpenseItem;
