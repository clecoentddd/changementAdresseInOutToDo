"use client";

import { useState, useEffect } from 'react';
import { db } from '../../db';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    // Correctly fetch from the new toDoChangeAddress store
    const todos = await db.toDoChangeAddress.toArray();
    console.log('[TodoList] Fetched todos:', todos);
    setTodos(todos);
  };

  useEffect(() => {
    fetchTodos();
    // Re-fetch every second to keep the list updated
    const interval = setInterval(fetchTodos, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>Todo List</h2>
      <ul>
        {todos.map(todo => {
          return (
            // Use trackingId as the key since it's the primary key now
            <li key={todo.trackingId} className="todo-item">
              <input type="checkbox" checked={todo.isDone} readOnly />
              <span>Tracking ID : {todo.trackingId} </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}