// lib/slices/03_BackOffice_PublierEvenementDeChangementAdresse/AddressChangeCommandHandler.js
import { EventBus } from '../../infrastructure/EventBus';
import { BackOfficeEventStoreRepository} from '../../stores/BackOfficeEventStore';
import { AddressChangeRequestedEvent } from '../../events/AddressChangeEvents'; // <-- New Import

export class AddressChangeCommandHandler {

  static async handleAddressChangeCommand(command) {
    try {
      console.log('[AddressChangeCommandHandler] Handling command:', command);

      // Validate the incoming command payload
      if (!command.trackingId) {
        throw new Error('Missing required trackingId');
      }

      // Validate the incoming command payload
      if (!command.payload.accountId || !command.payload.address) {
        throw new Error('Missing required fields: accountId and address are both required.');
      }

      // Create the event using the dedicated function
      const addressChangeEvent = AddressChangeRequestedEvent({
        trackingId: command.trackingId,
        payload: command.payload,
      });

      // Save the new todo event to the BackOffice event store
      await BackOfficeEventStoreRepository.save(addressChangeEvent);

      // Publish the event to the EventBus
      await EventBus.publish(addressChangeEvent);

      console.log('[AddressChangeCommandHandler] Published event:', addressChangeEvent);
      return { ok: true, trackingId: addressChangeEvent.trackingId };
    } catch (err) {
      console.error('[AddressChangeCommandHandler] Failed to publish event:', err);
      return { ok: false, error: err.message };
    }
  }
}