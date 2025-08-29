import { InboxStore } from '../../stores/InboxStore';
import { AddressChangeCommandHandler } from './changeAddressTranslationHandler';
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
        console.log('[InboxProcessor] Processing record:', record.event.type);

        // Call the appropriate command handler
        let result;
        if (record.event.type === 'FrontOffice_domainEvent__changementAdresseSoumise') {
            console.log('[InboxProcessor] AddressChangeCommandHandler handling command:', record);
            // Refactor this line to use the new command handler
            result = await AddressChangeCommandHandler.handleAddressChangeCommand(record.event);
            console.log('[InboxProcessor] AddressChangeCommandHandler result:', result);
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
