import ExpenseForm from "./ExpenseForm";
import "./NewExpense.css";

const NewExpense = (props) => {

  const saveExpenseDataHandler = (data) => {
    props.onAddExpense({
      ...data,
      id: Math.random().toString()
    });
  };

  const updateHandler = (data) => {
    props.onUpdateExpense(data);
  };

  return (
    <div className="new-expense">

      {!props.editingExpense && (
        <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
      )}

      {props.editingExpense && (
        <ExpenseForm
          existingData={props.editingExpense}
          isEditMode={true}
          onSaveExpenseData={updateHandler}
          onCancel={props.onCancelEdit}
        />
      )}
    </div>
  );
};

export default NewExpense;
