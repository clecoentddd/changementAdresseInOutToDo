"use client";
import { useState, useEffect } from 'react';
import { TodoProcessor } from './ToDoProcessor';
import { DB1Processor } from '../12_DB1_Update/DB1Processor';
import { ToDoDB1Terminator } from '../13_DB1_Projection/toDoDB1Terminator';
import { ToDoTerminator } from '../05_BackOffice_VoirLesTodo/toDoTerminator';

export default function TodoProcessing() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeSystem = async () => {

      console.log('Initializing system for ToDoTerminator and ToDoDB1Terminator...');

      // Initialize only the terminators (event listeners) that are managed here.
      ToDoTerminator.initialize();
      ToDoDB1Terminator.initialize();
      
      console.log('System initialized successfully.');
      setIsInitialized(true);
    };

    initializeSystem();
    
    return () => {
      // Clean up subscriptions when the component unmounts
      ToDoTerminator.unsubscribe();
      ToDoDB1Terminator.unsubscribe();
    };
  }, []);

  const handleProcessAll = async () => {
    if (!isInitialized) {
      alert("Please wait for the system to initialize.");
      return;
    }

    let totalProcessed = 0;
    let hasError = false;
    let errorMessage = '';

    const result1 = await TodoProcessor.processTodos();
    if (result1.ok) {
      totalProcessed += result1.processed;
    } else {
      hasError = true;
      errorMessage = result1.error;
    }

    if (!hasError) {
      const result2 = await DB1Processor.processUpdates();
      if (result2.ok) {
        totalProcessed += result2.processed;
      } else {
        hasError = true;
        errorMessage = result2.error;
      }
    }

    if (!hasError) {
      alert(`Processed a total of ${totalProcessed} todos.`);
    } else {
      alert(`Failed to process todos: ${errorMessage}`);
    }
  };

  return (
    <div className="card">
      <h2>Step 3: Todo Processing - Process business events</h2>
      <button onClick={handleProcessAll} className="button" disabled={!isInitialized}>
        Process All Todos
      </button>
    </div>
  );
}