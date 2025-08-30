// lib/rebuildTodos.js
import { db } from '../../db';
import { toDoChangeAddress } from '../../stores/toDoChangeAddressStore'; 
import {toDoDB1Repository } from '../../stores/toDoDB1Repository';

export async function rebuildTodos() {
  console.log('[Rebuild] Starting todo list rebuild from event store...');

  try {
    // Start an atomic transaction for the rebuild process
    await db.transaction('rw', db.backEvents, db.toDoChangeAddress, async (tx) => {
      // 1. Clear the old projection to start fresh
      await toDoChangeAddress.clear();
      
      // 2. Read all events from the event store in order
      await db.backEvents.each(async (event) => {
        // 3. Process each event to build the new projection
        if (event.type === 'ChangementAdresseDemandeeEvent') {
          // This event creates the initial todo item
          const newTodo = {
            trackingId: event.trackingId,
            isAddressPublished: false,
            isDB1Updated: false,
            isDone: false,
          };
          await toDoChangeAddress.save(newTodo);
          console.log(`[Rebuild] Added new todo for trackingId: ${event.trackingId}`);
          
        } else if (event.type === 'BackOffice_NouvelleAdresseOfficiellePubliée') {
          // This event sets the first flag without marking it as complete
          await toDoChangeAddress.changeAddressComplete(event.trackingId);
          console.log(`[Rebuild] Marked address as published for trackingId: ${event.trackingId}`);

        } else if (event.type === 'DB1SuccessfullyUpdated') {
          // This event sets the final flags
          await toDoDB1Repository.updateDB1Complete(event.trackingId);
          console.log(`[Rebuild] Marked DB1 update as complete and todo as done for trackingId: ${event.trackingId}`);
        }
      });
    });
    console.log('[Rebuild] Todo list rebuild completed successfully.');
  } catch (error) {
    console.error('[Rebuild] Failed to rebuild todo list:', error);
  }
}