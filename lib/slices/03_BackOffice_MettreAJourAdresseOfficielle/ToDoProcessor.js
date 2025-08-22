// lib/processors/TodoProcessor.js
import { db } from '../../db';
import { EventBus } from '../../infrastructure/EventBus';
import {  NouvelleAdressePublieeEvent} from '../../events/NouvelleAdressePublieeEvent.js';

export class TodoProcessor {
  static async processTodos() {
    // Check if IndexedDB is available
     console.log('[TodoProcessor] entering...');

    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[TodoProcessor] IndexedDB is not available in this environment.');
      return { ok: false, error: 'IndexedDB is not available.' };
    }

    try {
      const allTodos = await db.backEvents.toArray();
      const unprocessedTodos = allTodos.filter(todo => !todo.isDone);

      if (unprocessedTodos.length === 0) {
        console.log('[TodoProcessor] No unprocessed todos found.');
        return { ok: true, processed: 0 };
      }

       for (const todo of unprocessedTodos) {
        const updatedTodo = {
          ...todo,
          newAddress: `*${todo.newAddress.toUpperCase()} ${Math.floor(Math.random() * 50) + 1}*`,
          isDone: true,
        };
        await db.backEvents.update(todo.id, updatedTodo);
        console.log('[TodoProcessor] Processed todo:', updatedTodo, ' for ', todo, ' and trackingId is :', todo.trackingId,);

        const event = NouvelleAdressePublieeEvent({
            eventId: todo.frontEndRequestId,
            trackingId: todo.trackingId,
            accountId: todo.accountId,
            newAddress: updatedTodo.newAddress,
            toDoId: todo.id,
        });
        console.log('[TodoProcessor] Processed Event to publish', event);
        await EventBus.publish(event);
            }

      return { ok: true, processed: unprocessedTodos.length };
    } catch (err) {
      console.error('[TodoProcessor] Failed to process todos:', err);
      return { ok: false, error: err.message };
    }
  }
}
