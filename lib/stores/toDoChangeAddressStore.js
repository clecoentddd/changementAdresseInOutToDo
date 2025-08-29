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

  static async changeAddressComplete(trackingId) {
    // This function updates the record with the given trackingId,
    // setting the isDone flag to true.
    console.log(`[Repository] Marking todo with trackingId ${trackingId} as complete.`);
    return await db.toDoChangeAddress.update(trackingId, { isAddressPublished: true });
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

  static async getUnprocessedChangeAddressTodos() {
    const todos = [];

     await db.toDoChangeAddress.each(todo => {
      console.log(`[Repository] getUnprocessedAddressChangeTodos Reading record:`, todo);
      if (!todo.isAddressPublished) {
        console.log(`[Repository] getUnprocessedAddressChangeTodos Found unprocessed todo: ${todo.trackingId}`);
        todos.push(todo);
      } else {
        console.log(`[Repository] getUnprocessedAddressChangeTodos Skipping done todo: ${todo.trackingId}`);
      }
    });
    console.log(`[Repository] Finished reading. Found ${todos.length} unprocessed todos.`);
    return todos;
  }

    static async clear() {
    console.log('[Repository] Clearing all todos from the projection.');
    return await db.toDoChangeAddress.clear();
  }

     static async incrementRetries(trackingId) {
    console.log(`[Repository] Incrementing retry count for todo: ${trackingId}`);
    try {
      // Use a transaction to ensure the operation is atomic
      await db.transaction('rw', db.toDoChangeAddress, async () => {
        const todo = await db.toDoChangeAddress.get(trackingId);
        if (todo) {
          todo.retries = (todo.retries || 0) + 1;
          await db.toDoChangeAddress.put(todo);
          console.log(`[Repository] Retry count updated to ${todo.retries} for ${trackingId}`);
        }
      });
    } catch (error) {
      console.error(`[Repository] Failed to increment retries for ${trackingId}:`, error);
      throw error; // Re-throw the error so the processor can handle it
    }
  }

   static async getTodosForDB1Update() {
    console.log('[Repository] Fetching todos ready for DB1 update...');
    const todos = [];

    await db.toDoChangeAddress.each(todo => {
      // Check for the specific conditions for DB1 processing
      // The to-do must have an address published, but not yet be updated in DB1
      if (todo.isAddressPublished && !todo.isDB1Updated) {
        console.log(`[Repository] Found todo ready for DB1 update: ${todo.trackingId}`);
        todos.push(todo);
      } else {
        console.log(`[Repository] Skipping todo: ${todo.trackingId} (not ready for DB1 update)`);
      }
    });

    console.log(`[Repository] Finished reading. Found ${todos.length} todos for DB1 update.`);
    return todos;
  }

    static async updateDB1Complete(trackingId) {
    // This function updates the record with the given trackingId,
    // setting the isDone flag to true.
    console.log(`[Repository] Marking todo with trackingId ${trackingId} as complete.`);
    return await db.toDoChangeAddress.update(trackingId, { isDB1Updated: true });
  }
}
