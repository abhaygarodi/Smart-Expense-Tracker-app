import "./ExpenseDate.css";

const ExpenseDate = (props) => {
  const month = props.expDate.toLocaleString("en-US", { month: "short" });
  const day = props.expDate.toLocaleString("en-US", { day: "2-digit" });
  const year = props.expDate.getFullYear();

  return (
    <time
      className="expense-date"
      dateTime={props.expDate.toISOString().slice(0, 10)}
    >
      <span className="expense-date__month">{month}</span>
      <span className="expense-date__day">{day}</span>
      <span className="expense-date__year">{year}</span>
    </time>
  );
};

export default ExpenseDate;
