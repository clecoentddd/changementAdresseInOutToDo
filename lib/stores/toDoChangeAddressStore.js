import { db } from '../db';

// db/TodoRepository.js
export class toDoChangeAddress {
  
  static async save(todo) {
    return await db.toDoChangeAddress.add(todo);
  }

    static async getAllEvents() {
    return await db.toDoChangeAddress.toArray();
  }

   static async complete(trackingId) {
    // This function updates the record with the given trackingId,
    // setting the isDone flag to true.
    console.log(`[Repository] Marking todo with trackingId ${trackingId} as complete.`);
    return await db.toDoChangeAddress.update(trackingId, { isDone: true });
  }

    static async getUnprocessedTodos() {
    const todos = [];
    
    console.log('[Repository] Simple test loop finished.');
    await db.toDoChangeAddress.each(todo => {
      console.log(`[Repository] Reading record:`, todo);
      if (!todo.isDone) {
        console.log(`[Repository] Found unprocessed todo: ${todo.trackingId}`);
        todos.push(todo);
      } else {
        console.log(`[Repository] Skipping done todo: ${todo.trackingId}`);
      }
    });
    console.log(`[Repository] Finished reading. Found ${todos.length} unprocessed todos.`);
    return todos;
  }
}
