// lib/processors/DB1Processor.js
import { EventBus } from '../../infrastructure/EventBus';
import { BackOfficeEventStoreRepository } from '../../stores/BackOfficeEventStore';
import { toDoDB1Repository } from '../../stores/toDoDB1Repository';
import { DB1SuccessfullyUpdatedEvent } from '../../events/DB1SuccessfullyUpdatedEvent';

export class DB1Processor {
  static async processUpdates() {
    console.log('[DB1Processor] entering...');
    
    let todosToProcess;
    let totalProcessedCount = 0;
    const MAX_RETRIES = 3;

    try {
      do {
        // Use the new, specialized query to find its work
        todosToProcess = await toDoDB1Repository.getTodosForDB1Update();

        if (todosToProcess.length === 0) {
          console.log(`[DB1Processor] No todos to update in DB1.`);
          break;
        }

        console.log(`[DB1Processor] Found ${todosToProcess.length} todos to process.`);
        
        for (const todo of todosToProcess) {
          if (todo.retries >= MAX_RETRIES) {
            console.warn(`[DB1Processor] Skipping todo ${todo.trackingId}. Max retries (${MAX_RETRIES}) reached.`);
            continue;
          }
          
          try {
            // ----- Simulate a random failure to test the retry mechanism -----
            //if (Math.random() < 0.1) {
            //  throw new Error("Simulated DB1 update failure.");
            //}
            // -----------------------------------------------------------------

            // Find the event that has the new address data to complete the task
            const addressPublishedEvent = await BackOfficeEventStoreRepository.getEventsByTrackingIdAndType(
              todo.trackingId, 
              'BackOffice_NouvelleAdresseOfficiellePubliée'
            );

            if (addressPublishedEvent.length === 0) {
              console.warn(`[DB1Processor] Skipping todo ${todo.trackingId}. Address published event not found.`);
              continue;
            }

            const newAddress = addressPublishedEvent[0].payload.newAddress;
            
            // 2. Create the event that signals success
          const successEvent = DB1SuccessfullyUpdatedEvent({ trackingId: todo.trackingId, newAddress: {} });

          // 3. Save the event to the event store FIRST
          await BackOfficeEventStoreRepository.save(successEvent);

          // 4. Publish the event to the EventBus AFTER it's saved
          await EventBus.publish(successEvent);

            totalProcessedCount++;

          } catch (individualTodoError) {
            console.error(`[DB1Processor] Failed to update DB1 for ${todo.trackingId}`, individualTodoError);
            await toDoChangeAddress.incrementRetries(todo.trackingId);
          }
        }
      } while (todosToProcess.length > 0);

      console.log(`[DB1Processor] All batches processed. Total processed: ${totalProcessedCount}.`);
      return { ok: true, processed: totalProcessedCount };
    } catch (err) {
      console.error('[DB1Processor] Failed to process updates:', err);
      return { ok: false, error: err.message };
    }
  }
}