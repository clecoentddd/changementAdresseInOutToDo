// lib/rebuildTodos.js
import { db } from '../../db';
import { toDoChangeAddress } from '../../stores/toDoChangeAddressStore'; // Import the repository class

export async function rebuildTodos() {
  console.log('[Rebuild] Starting todo list rebuild from event store...');

  try {
    // Start an atomic transaction for the rebuild process
    await db.transaction('rw', db.backEvents, db.toDoChangeAddress, async (tx) => {
      // 1. Use the new repository method to clear the old projection
      await toDoChangeAddress.clear();
      
      // 2. Read events from the backEvents store in order
      await db.backEvents.each(async (event) => {
        // 3. Process each event to build the new projection using repository methods
        if (event.type === 'ChangementAdresseDemandeeEvent') {
          const newTodo = {
            trackingId: event.trackingId,
            isDone: false,
          };
          // Use the save method to add the new todo
          await toDoChangeAddress.save(newTodo);
          console.log(`[Rebuild] Added new todo for trackingId: ${event.trackingId}`);
        } else if (event.type === 'BackOffice_NouvelleAdresseOfficiellePubliée') {
          // Use the new completeWithAddress method to mark the todo as done
          await toDoChangeAddress.complete(event.trackingId);
          console.log(`[Rebuild] Marked todo as done for trackingId: ${event.trackingId}`);
        }
      });
    });
    console.log('[Rebuild] Todo list rebuild completed successfully.');
  } catch (error) {
    console.error('[Rebuild] Failed to rebuild todo list:', error);
  }
}