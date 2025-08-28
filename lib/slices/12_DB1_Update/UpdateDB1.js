// slices/BackOffice_DB1_Handler.js
import { EventBus } from '../../infrastructure/EventBus';
import  { reconstructDB1TodoList} from '../11_ToDo_DB1_Projection/LiveModelProjection';
import { BackOfficeDB1DemandeTraitéeEvent } from '../../events/createBackOfficeDB1DemandeTraitéeEvent';
import { BackOfficeEventStoreRepository } from '../../stores/BackOfficeEventStore';

export async function processDB1TodoList() {
  console.log('[DB1 Handler] Processing DB1 todo list ...');

  const todoList = await reconstructDB1TodoList();
  console.log('[DB1 Handler] Found', todoList.length, 'pending DB1 updates');

  for (const event of todoList) {
    try {
      // Simulate random delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

      // Save the DB1 updated event to BackEndStore
      await updateDB1({
        eventId: uuidv4(),
        trackingEventId: event.eventId,
        accountId: event.payload.accountId,
        address: event.payload.address,
      });

      // Update live model first
      //db1UpdatedAccounts.add(event.payload.accountId);
      console.log('[DB1 Handler] Updated live model for account', event.payload.accountId);

      // Publish completion event using the existing event format
      const db1UpdatedEvent = BackOfficeDB1DemandeTraitéeEvent({
        trackingId: event.eventId,
        accountId: event.payload.accountId,
      });

      await BackOfficeEventStoreRepository.append(db1UpdatedEvent);

      console.log('[DB1 Handler] Publishing DB1 updated event:', db1UpdatedEvent);
      EventBus.publish(db1UpdatedEvent);
    } catch (err) {
      console.error(`[DB1 Handler] Failed to update account ${event.payload.accountId}:`, err);
    }
  }
}

// Function to initialize the DB1 handler
export function initializeDB1Handler() {
  console.log('[DB1 Handler] Initializing...');

  // Trigger on new event
  EventBus.subscribe("BackOffice_NouvelleAdresseOfficiellePubliée", async () => {
    console.log('[DB1 Handler] New BackOffice_NouvelleAdresseOfficiellePubliée event received');
    const todoList = await reconstructDB1TodoList();
    console.log('[DB1 Handler] Found', todoList.length, 'pending DB1 updates');
    await processDB1TodoList(todoList);
  });

  // Trigger via cron job
  setInterval(async () => {
    console.log('[DB1 Handler] Running scheduled check for pending DB1 updates');
    const todoList = await reconstructDB1TodoList();
    console.log('[DB1 Handler] Found', todoList.length, 'pending DB1 updates in scheduled check');
    await processDB1TodoList(todoList);
  }, 60000); // Every minute

  console.log('[DB1 Handler] Initialization complete');
}
