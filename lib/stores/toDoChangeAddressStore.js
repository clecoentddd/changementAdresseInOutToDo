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
    // This new function encapsulates the query for unprocessed items
    return await db.toDoChangeAddress.where('isDone').equals(false).toArray();
  }
}