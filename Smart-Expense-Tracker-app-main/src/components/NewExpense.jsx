import ExpenseForm from "./ExpenseForm";
import "./NewExpense.css";

/* ─── Icons ─── */
const PlusCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
  </svg>
);

const NewExpense = (props) => {
  const saveExpenseDataHandler = (data) => {
    props.onAddExpense({
      ...data,
      id: Math.random().toString(),
    });
  };

  const updateHandler = (data) => {
    props.onUpdateExpense(data);
  };

  const isEditing = !!props.editingExpense;

  return (
    <section className="new-expense" aria-label={isEditing ? "Edit expense" : "Add new expense"}>
      <div className="new-expense__header">
        <div className="new-expense__header-icon" aria-hidden="true">
          {isEditing ? <PencilIcon /> : <PlusCircleIcon />}
        </div>
        <div>
          <h2 className="new-expense__title">
            {isEditing ? "Edit Expense" : "Add New Expense"}
          </h2>
          <p className="new-expense__subtitle">
            {isEditing
              ? "Update the details below and save your changes"
              : "Fill in the details to record a new expense"}
          </p>
        </div>
      </div>

      {!isEditing && (
        <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
      )}

      {isEditing && (
        <ExpenseForm
          existingData={props.editingExpense}
          isEditMode={true}
          onSaveExpenseData={updateHandler}
          onCancel={props.onCancelEdit}
        />
      )}
    </section>
  );
};

export default NewExpense;
