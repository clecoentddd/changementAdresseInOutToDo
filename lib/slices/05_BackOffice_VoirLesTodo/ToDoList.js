"use client";

import { useState, useEffect } from 'react';
import { db } from '../../db';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const todos = await db.backEvents.toArray();
    console.log('[TodoList] Fetched todos:', todos); 
    setTodos(todos);
  };

  useEffect(() => {
    fetchTodos();
    const interval = setInterval(fetchTodos, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>Todo List</h2>
      <ul>
        {todos.map(todo => {
          // console.log('[TodoList] Rendering todo:', todo); // Log each todo
          return (
            <li key={todo.id} className="todo-item">
              <input type="checkbox" checked={todo.isDone} readOnly />
              <span>{todo.newAddress} - {todo.frontEndRequestId}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
