// lib/slices/03_BackOffice_PublierEvenementDeChangementAdresse/AddressChangeCommandHandler.js
import { IdGenerator } from '../../utils/IdGenerator';
import { EventBus } from '../../infrastructure/EventBus';

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

      // Create the event that will be published
      const addressChangeEvent = {
        trackingId: command.trackingId,
        requestId: command.eventId,
        type: 'ChangementAdresseDemandeeEvent',
        timestamp: new Date().toISOString(),
        payload: {
          accountId: command.payload.accountId,
          address: command.payload.address,
        },
        eventId: IdGenerator.generate(),
      };

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