import ExpenseItem from "./ExpenseItem";

const ExpensesList = (props) => {
  if (props.items.length === 0) {
    return <p style={{ textAlign: "center" }}>No expenses found.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {props.items.map((exp) => (
        <ExpenseItem
          key={exp.id}
          expense={exp}
          onDelete={props.onDelete}
          onEdit={props.onEdit}
        />
      ))}
    </ul>
  );
};

export default ExpensesList;
