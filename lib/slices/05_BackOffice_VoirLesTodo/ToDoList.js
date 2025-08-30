"use client";
import { useState, useEffect } from 'react';
import { db } from '../../db';
import { rebuildTodos } from './rebuildToDo';
import { liveQuery } from 'dexie'; 

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  // Use a separate useEffect for the live query
  useEffect(() => {
    // liveQuery automatically re-runs and updates the state whenever data changes
    const subscription = liveQuery(() => db.toDoChangeAddress.toArray())
      .subscribe(updatedTodos => {
        // This is the key: updatedTodos contains the new data
        // The console log here will correctly show the fetched data
        console.log('liveQuery] Fetched todos:', updatedTodos); 
        setTodos(updatedTodos);
      });

    // The return function cleans up the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array ensures this effect runs once

  const handleRebuild = async () => {
    await rebuildTodos();
  };

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
              <input
                type="checkbox"
                checked={todo.isAddressPublished}
                readOnly
                style={{ marginRight: '5px' }}
              />
              <span style={{ marginRight: '15px' }}>Published</span>

              <input
                type="checkbox"
                checked={todo.isDB1Updated}
                readOnly
                style={{ marginRight: '5px' }}
              />
              <span style={{ marginRight: '15px' }}>DB1 Updated</span>

              <span style={{
                textDecoration: todo.isDone ? 'line-through' : 'none',
                color: todo.isDone ? '#888' : 'black',
              }}>
                Tracking ID: {todo.trackingId}
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