// lib/stores/toDoDB1Repository.js
import { db } from '../db';

export class toDoDB1Repository {
  /**
   * Fetches todos that are ready for DB1 update.
   */
  static async getTodosForDB1Update() {
    console.log('[DB1Repository] Fetching todos ready for DB1 update...');
    const todos = [];
    await db.toDoChangeAddress.each(todo => {
      if (todo.isAddressPublished && !todo.isDB1Updated) {
        console.log(`[DB1Repository] Found todo ready for DB1 update: ${todo.trackingId}`);
        todos.push(todo);
      }
    });
    return todos;
  }

  /**
   * Updates a todo item to reflect the DB1 update completion.
   */
  static async updateDB1Complete(trackingId) {
    console.log(`[DB1Repository] Attempting to mark DB1 complete for trackingId: ${trackingId}`);
    try {
      const todo = await db.toDoChangeAddress.get(trackingId);
      if (!todo) {
        console.warn(`[DB1Repository] Todo with trackingId ${trackingId} not found.`);
        return;
      }
      const updateObject = {
        isDB1Updated: true,
      };
      if (todo.isAddressPublished) {
        updateObject.isDone = true;
      }
      return await db.toDoChangeAddress.update(trackingId, updateObject);
    } catch (error) {
      console.error(`[DB1Repository] Failed to update DB1 for todo ${trackingId}:`, error);
      throw error;
    }
  }
}