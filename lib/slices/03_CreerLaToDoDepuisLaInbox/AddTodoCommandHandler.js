import { IdGenerator } from '../../utils/IdGenerator';
import { EventBus } from '../../infrastructure/EventBus';
import {BackOfficeEventStoreRepository} from '../../stores/BackOfficeEventStore';

export class TodoCommandHandler {
  static async handleTodoAdded(event) {
    try {
      console.log('[handleTodoAdded] Getting:', event);

      // Validate required fields
      this._validateEvent(event);

      // Format the todo text
      const todoText = this._formatTodoText(event);

      // Create the todo object
      const todo = this._createTodo(event, todoText);

      // Save to the database
      await BackOfficeEventStoreRepository.save(todo);

      // Create and publish the event
      const changeAdresseEvent = this._createChangeAdresseEvent(event, todo);
      await EventBus.publish(changeAdresseEvent);

      return { ok: true };
    } catch (err) {
      console.error('[TodoCommandHandler] Failed to add todo:', err);
      return { ok: false, error: err.message };
    }
  }

  static _validateEvent(event) {
    if (!event.payload.accountId || !event.payload?.address) {
      throw new Error('Missing required fields: accountId and address are both required');
    }
  }

  static _formatTodoText(event) {
    return `[${event.type}] New address: ${event.payload.address}`;
  }

  static _createTodo(event, todoText) {
    return {
      id: IdGenerator.generate(),
      frontEndRequestId: event.eventId,
      trackingId: event.trackingId,
      type: "TodoAdded",
      isDone: false,
      text: todoText,
      accountId: event.payload.accountId,
      newAddress: event.payload.address,
    };
  }

  static _createChangeAdresseEvent(event, todo) {
    return {
      trackingId: event.trackingId,
      eventId: todo.frontEndRequestId,
      type: "BackOffice_ChangeAdresseATraiter",
      timestamp: new Date().toISOString(),
    };
  }
}
