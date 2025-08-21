import { InboxStore } from '../stores/InboxStore';
import { TodoCommandHandler } from '../slices/03_BackOffice_MettreAJourAdresseOfficielle/TodoCommandHandler';

export class InboxProcessor {
  constructor(handler) {
    this.handler = handler;
  }

  async process() {
    console.log("[InboxProcessor] entering...");
    const unacknowledgedRecords = await InboxStore.unacknowledged();
    for (const record of unacknowledgedRecords) {
      try {
        console.log('[InboxProcessor] Processing record:', record.event.type);

        // Call the appropriate command handler
        let result;
        if (record.event.type === 'FrontOffice_domainEvent__changementAdresseRequis') {
          console.log('[InboxProcessor] TodoCommandHandler expecting to add :', record);
          result = await TodoCommandHandler.handleTodoAdded(record.event);
          console.log('[InboxProcessor] TodoCommandHandler result:', result);
        }

        // Only acknowledge if the command handler succeeded
        if (result?.ok) {
          await InboxStore.acknowledge(record);
        }
      } catch (err) {
        console.error(`[InboxProcessor] Failed to process event ${record.eventId}:`, err);
      }
    }
  }
}
