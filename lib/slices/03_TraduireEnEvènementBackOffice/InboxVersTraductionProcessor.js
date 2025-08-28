import { InboxStore } from '../../stores/InboxStore';
import { TraduireAdresseCommandHandler } from './TraduireAdresseCommandHandler';
import { queryNouvellesAdressesSoumisesFromInboxRecords } from '../../stores/InboxStoreHelpers'

export class InboxProcessor {
  constructor(handler) {
    this.handler = handler;
  }

  async process() {
    console.log("[InboxProcessor] entering...");
    const unacknowledgedRecords = await queryNouvellesAdressesSoumisesFromInboxRecords();

    for (const record of unacknowledgedRecords) {
      try {
        console.log('[InboxProcessor] Processing record:', record);

        // Call the appropriate command handler
        let result;
        if (record.type === 'FrontOffice_domainEvent__changementAdresseSoumise') {
          console.log('[InboxProcessor] TraduireAdresseCommandHandler expecting to add :', record);
          result = await TraduireAdresseCommandHandler.handle(record);
          console.log('[InboxProcessor] TranslaTraduireAdresseCommandHandlerteAdresseCommandHandler result:', result);
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
