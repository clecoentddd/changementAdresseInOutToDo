"use client";
import { TodoProcessor } from '../processors/ToDoProcessor';

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
      <h2>Todo Processing</h2>
      <button onClick={handleProcessTodos} className="button">
        Process Todos
      </button>
    </div>
  );
}
