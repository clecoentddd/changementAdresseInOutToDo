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

      // 3. If no completion event is found, process the to-do
            if (completionEvents.length === 0) {
              console.log('[TodoProcessor] Processing todo:', todo, ' - No completion event found.');
              
              // Get the original "ChangementAdresseDemandeeEvent" from the event source
              const originalEvent = await BackOfficeEventStoreRepository.getEventsByTrackingIdAndType(
                todo.trackingId,
                'ChangementAdresseDemandeeEvent'
              );

              if (!originalEvent || originalEvent.length === 0) {
                console.error(`[TodoProcessor] Original event not found for trackingId: ${todo.trackingId}. Skipping.`);
                continue; // Skip to the next to-do item
              }

              // Use data from the original event source as the base
              const sourceEvent = originalEvent[0].payload;
              
              // Generate a new, random address for the updated todo object
              const newAddressValue = `*${sourceEvent.address.toUpperCase()} ${Math.floor(Math.random() * 50) + 1}*`;
              
              const event = NouvelleAdressePublieeEvent({
                eventId: originalEvent[0].eventId, // Use original event's ID
                trackingId: todo.trackingId,
                accountId: sourceEvent.accountId,
                newAddress: newAddressValue, // Use the new generated address
                toDoId: todo.id,
              });

              // This logic now processes the new event, not the old todo
              await EventBus.publish(event);
              console.log('[TodoProcessor] Processed Event to publish:', event);
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