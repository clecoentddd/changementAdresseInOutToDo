import { db } from '../db';
import { IdGenerator } from '../utils/IdGenerator';
import { EventBus } from '../infrastructure/EventBus';

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
      
      // // Create the event object
      const changeAdresseEvent = {
        trackingId: event.trackingId, // Use the trackingId from the original event
        eventId: todo.frontEndRequestId,
        type: "BackOffice_ChangeAdresseATraiter", // The specific type you requested
        timestamp: new Date().toISOString() // Current timestamp
        };

       console.log('[TodoCommandHandler] Adding changeAdresseEvent:', changeAdresseEvent);
      // Publish the event
      EventBus.publish(changeAdresseEvent);

      return { ok: true };
    } catch (err) {
      console.error('[TodoCommandHandler] Failed to add todo:', err);
      return { ok: false, error: err.message };
    }
  }
}
