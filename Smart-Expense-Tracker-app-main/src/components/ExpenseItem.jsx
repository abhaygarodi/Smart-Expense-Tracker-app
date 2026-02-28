import ExpenseDate from "./ExpenseDate";
import { CATEGORY_COLORS } from "./CategoryChart";
import "./ExpenseItem.css";

/* ─── Icons ─── */
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const ExpenseItem = ({ expense, onEdit, onDelete, index }) => {
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const cat = expense.category || "Other";
  const catColors = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Other"];

  return (
    <li
      className="expense-item"
      style={{ animationDelay: `${0.05 * index}s` }}
      role="listitem"
    >
      <ExpenseDate expDate={expense.date} />

      <div className="expense-item__body">
        <div className="expense-item__info">
          <h3 className="expense-item__title">{expense.title}</h3>
          <span
            className="expense-item__category"
            style={{ color: catColors.color, background: catColors.bg }}
          >
            {cat}
          </span>
        </div>
        <span className="expense-item__amount">
          {formatCurrency(expense.amount)}
        </span>
      </div>

      <div className="expense-item__actions">
        <button
          className="expense-item__btn expense-item__btn--edit"
          onClick={() => onEdit(expense)}
          aria-label={`Edit ${expense.title}`}
          title="Edit"
        >
          <PencilIcon />
        </button>
        <button
          className="expense-item__btn expense-item__btn--delete"
          onClick={() => onDelete(expense.id)}
          aria-label={`Delete ${expense.title}`}
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

export default ExpenseItem;
