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
      let unprocessedTodos;
      let totalProcessedCount = 0; // New variable to track the total count
      const MAX_RETRIES = 7;

      do {
        // 1. Query for unprocessed items
        unprocessedTodos = await toDoChangeAddress.getUnprocessedChangeAddressTodos();

        if (unprocessedTodos.length === 0) {
          console.log(`[TodoProcessor] No unprocessed todos found in this batch.`);
          break; // Exit the loop if no todos were found
        }
        
        console.log(`[TodoProcessor] Found ${unprocessedTodos.length} unprocessed todos in this batch.`);
        
        for (const todo of unprocessedTodos) {
          // Check for a retry limit BEFORE processing
          if (todo.retries >= MAX_RETRIES) {
            console.warn(`[TodoProcessor] Skipping todo ${todo.trackingId}. Max retries (${MAX_RETRIES}) reached.`);
            continue; // Skip this todo and go to the next one
          }

          try {
            // ----- Simulate a random failure to test the retry mechanism -----
            //if (Math.random() < 0.1) {
            //  throw new Error("Simulated failure to test retry mechanism.");
            //}
            // -----------------------------------------------------------------

            // 2. Check the BackOfficeEventStoreRepository for a completion event
            const completionEvents = await BackOfficeEventStoreRepository.getEventsByTrackingIdAndType(
              todo.trackingId, 
              'BackOffice_NouvelleAdresseOfficiellePubliée'
            );

            // 3. If no completion event is found, process the todo
            if (completionEvents.length === 0) {
              console.log('[TodoProcessor] Processing todo:', todo, ' - No completion event found.');
              
              const originalEvent = await BackOfficeEventStoreRepository.getEventsByTrackingIdAndType(
                todo.trackingId,
                'ChangementAdresseDemandeeEvent'
              );

              if (!originalEvent || originalEvent.length === 0) {
                console.error(`[TodoProcessor] Original event not found for trackingId: ${todo.trackingId}. Skipping.`);
                continue;
              }

              const sourceEvent = originalEvent[0].payload;
              const newAddressValue = `*${sourceEvent.address.toUpperCase()} ${Math.floor(Math.random() * 50) + 1}*`;
              
              const event = NouvelleAdressePublieeEvent({
                eventId: originalEvent[0].eventId,
                trackingId: todo.trackingId,
                accountId: sourceEvent.accountId,
                newAddress: newAddressValue,
                toDoId: todo.id,
              });

              await BackOfficeEventStoreRepository.save(event);
              await EventBus.publish(event);
              console.log('[TodoProcessor] Processed Event to publish:', event);
              totalProcessedCount++; // Increment the total count here
              
            } else {
              console.log(`[TodoProcessor] Skipping todo with trackingId ${todo.trackingId} as a completion event already exists.`);
            }
          } catch (individualTodoError) {
            console.error(`[TodoProcessor] Failed to process todo: ${todo.trackingId}`, individualTodoError);
            await toDoChangeAddress.incrementRetries(todo.trackingId);
          }
        }
      } while (unprocessedTodos.length > 0);

      console.log(`[TodoProcessor] All batches processed. Total processed: ${totalProcessedCount}.`);
      return { ok: true, processed: totalProcessedCount }; // Return the correct total
    } catch (err) {
      console.error('[TodoProcessor] Failed to process todos:', err);
      return { ok: false, error: err.message };
    }
  }
}