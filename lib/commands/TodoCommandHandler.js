import { db } from '../db';
import { IdGenerator } from '../utils/IdGenerator';

export class TodoCommandHandler {
  static async handleTodoAdded(event) {
    try {
      console.log('[handleTodoAdded] Getting:', event);
      // Format the text using the address and event type
      const todoText = `[${event.type}] New address: ${event.payload.address}`;
      console.log('[handleTodoAdded] Text to add:', todoText);

      const toDoId = IdGenerator.generate();
      const todo = {
        id: toDoId, // Use the imported generator to create a new unique ID
        frontEndRequestId: event.eventId, // Use the original eventId as frontEndRequestId
        trackingId: event.trackingId,
        type: "TodoAdded",
        isDone: Boolean(false),
        text: todoText,
        accountId: event.payload.accountId,
        newAddress: event.payload.address,
      };

      console.log('[TodoCommandHandler] Adding todo:', todo);
      await db.todos.add(todo);
      return { ok: true };
    } catch (err) {
      console.error('[TodoCommandHandler] Failed to add todo:', err);
      return { ok: false, error: err.message };
    }
  }
}
