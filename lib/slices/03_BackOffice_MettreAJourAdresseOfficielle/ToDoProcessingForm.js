"use client";
import { TodoProcessor } from './ToDoProcessor';

export default function TodoProcessing() {
  const handleProcessTodos = async () => {
    const result = await TodoProcessor.processTodos();
    if (result.ok) {
      alert(`Processed ${result.processed} todos.`);
    } else {
      alert(`Failed to process todos: ${result.error}`);
    }
  };

  return (
    <div className="card">
      <h2>Step 3: Todo Processing - Process business events</h2>
      <button onClick={handleProcessTodos} className="button">
        Process Todos
      </button>
    </div>
  );
}
