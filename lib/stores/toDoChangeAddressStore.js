// lib/stores/toDoChangeAddressStore.js
import { db } from '../db';

export class toDoChangeAddress {
  static async save(todo) {
    return await db.toDoChangeAddress.add(todo);
  }

  static async getAllEvents() {
    return await db.toDoChangeAddress.toArray();
  }

  static async complete(trackingId) {
    console.log(`[Repository] Marking todo with trackingId ${trackingId} as complete.`);
    return await db.toDoChangeAddress.update(trackingId, { isDone: true });
  }

  static async changeAddressComplete(trackingId) {
    console.log(`[Repository] Marking todo with trackingId ${trackingId} as complete.`);
    return await db.toDoChangeAddress.update(trackingId, { isAddressPublished: true });
  }

  static async getUnprocessedTodos() {
    const todos = [];
    await db.toDoChangeAddress.each(todo => {
      if (!todo.isDone) {
        todos.push(todo);
      }
    });
    return todos;
  }

  static async getUnprocessedChangeAddressTodos() {
    const todos = [];
    await db.toDoChangeAddress.each(todo => {
      if (!todo.isAddressPublished) {
        todos.push(todo);
      }
    });
    return todos;
  }

  static async clear() {
    console.log('[Repository] Clearing all todos from the projection.');
    return await db.toDoChangeAddress.clear();
  }

  static async incrementRetries(trackingId) {
    console.log(`[Repository] Incrementing retry count for todo: ${trackingId}`);
    try {
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
      throw error;
    }
  }
}