"use client";

import { useState, useEffect } from 'react';
import { db } from '../../db';
import { rebuildTodos } from './rebuildToDo';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const todos = await db.toDoChangeAddress.toArray();
    setTodos(todos);
  };

  const handleRebuild = async () => {
    await rebuildTodos();
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
    const interval = setInterval(fetchTodos, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Todo List</h2>
        <button
          onClick={handleRebuild}
          style={{
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease',
          }}
        >
          Rebuild 🔨
        </button>
      </div>
      <ul style={{ marginTop: '15px' }}>
        {todos.map(todo => {
          return (
            <li key={todo.trackingId} className="todo-item" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px',
              border: '1px solid #ddd',
            }}>
              {/* Checkbox for Address Published status */}
              <input
                type="checkbox"
                checked={todo.isAddressPublished}
                readOnly
                style={{ marginRight: '5px' }}
              />
              <span style={{ marginRight: '15px' }}>Published</span>

              {/* Checkbox for DB1 Updated status */}
              <input
                type="checkbox"
                checked={todo.isDB1Updated}
                readOnly
                style={{ marginRight: '5px' }}
              />
              <span style={{ marginRight: '15px' }}>DB1 Updated</span>

              {/* The main todo text, styled based on the overall isDone status */}
              <span style={{
                textDecoration: todo.isDone ? 'line-through' : 'none',
                color: todo.isDone ? '#888' : 'black',
              }}>
                Tracking ID: {todo.trackingId}
                {/* Display retries count if it's greater than 0 */}
                {
                  <span style={{
                    color: todo.retries > 0 ? 'red' : 'black',
                    marginLeft: '10px'
                  }}>
                    (Retries: {todo.retries || 0})
                  </span>
                }
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}