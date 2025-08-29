// lib/processors/TodoProcessor.js
import { db } from '../../db';
import { EventBus } from '../../infrastructure/EventBus';
import { NouvelleAdressePublieeEvent } from '../../events/NouvelleAdressePublieeEvent';
import { BackOfficeEventStoreRepository } from '../../stores/BackOfficeEventStore';
import { toDoChangeAddress } from '../../stores/toDoChangeAddressStore';


export class TodoProcessor {
  static async processTodos() {
    console.log('[TodoProcessor] entering...');

    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[TodoProcessor] IndexedDB is not available in this environment.');
      return { ok: false, error: 'IndexedDB is not available.' };
    }

    try {
      // 1. Query the new toDoChangeAddress DB for unprocessed items (isDone = false)
      const unprocessedTodos = await toDoChangeAddress.getUnprocessedTodos();

      if (unprocessedTodos.length === 0) {
        console.log('[TodoProcessor] No unprocessed todos found.');
        return { ok: true, processed: 0 };
      }

      for (const todo of unprocessedTodos) {
        // 2. Check the BackOfficeEventStoreRepository for a completion event
        const completionEvents = await BackOfficeEventStoreRepository.getEventsByTrackingIdAndType(
          todo.trackingId, 
          'BackOffice_NouvelleAdresseOfficiellePubliée'
        );

        // 3. If no completion event is found, process the todo
        if (completionEvents.length === 0) {
          console.log('[TodoProcessor] Processing todo:', todo, ' - No completion event found.');
          
          const updatedTodo = {
            ...todo,
            newAddress: `*${todo.newAddress.toUpperCase()} ${Math.floor(Math.random() * 50) + 1}*`,
            isDone: true,
          };
          
          // Apply the new address and mark as done in the toDoChangeAddress DB
          await db.toDoChangeAddress.update(todo.trackingId, updatedTodo);

          console.log('[TodoProcessor] Processed and updated todo:', updatedTodo);

          const event = NouvelleAdressePublieeEvent({
            eventId: todo.frontEndRequestId,
            trackingId: todo.trackingId,
            accountId: todo.accountId,
            newAddress: updatedTodo.newAddress,
            toDoId: todo.id,
          });

          console.log('[TodoProcessor] Processed Event to publish', event);
          await EventBus.publish(event);
        } else {
          console.log(`[TodoProcessor] Skipping todo with trackingId ${todo.trackingId} as a completion event already exists.`);
        }
      }

      return { ok: true, processed: unprocessedTodos.length };
    } catch (err) {
      console.error('[TodoProcessor] Failed to process todos:', err);
      return { ok: false, error: err.message };
    }
  }
}