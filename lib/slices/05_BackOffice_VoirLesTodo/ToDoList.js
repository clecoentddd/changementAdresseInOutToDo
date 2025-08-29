"use client";

import { useState, useEffect } from 'react';
import { db } from '../../db';
import { rebuildTodos } from './rebuildToDo';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    // Correctly fetch from the new toDoChangeAddress store
    const todos = await db.toDoChangeAddress.toArray();
    console.log('[TodoList] Fetched todos:', todos);
    setTodos(todos);
  };

  // New handler for the rebuild button
  const handleRebuild = async () => {
    await rebuildTodos();
    fetchTodos(); // Refresh the list after the rebuild
  };

  useEffect(() => {
    fetchTodos();
    // Re-fetch every second to keep the list updated
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
            // Use trackingId as the key since it's the primary key now
            <li key={todo.trackingId} className="todo-item" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px',
              border: '1px solid #ddd',
            }}>
              <input 
                type="checkbox" 
                checked={todo.isAddressPublished} 
                readOnly 
                style={{ marginRight: '10px' }}
              />
              <span style={{
                textDecoration: todo.isAddressPublished ? 'line-through' : 'none',
                color: todo.isAddressPublished ? '#888' : 'black',
              }}>
                Tracking ID : {todo.trackingId} -
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