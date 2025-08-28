// handlers/ChangementAdresseCommandHandler.js
import { EventBus } from '../../infrastructure/EventBus';
import { BackOfficeEventStoreRepository } from '../../stores/BackOfficeEventStore';
import { ChangementAdresseDemandeeEvent } from '../../events/BackOffice_ChangementAdresseDemandeeEvent';

export class TraduireAdresseCommandHandler {
  static async handle(event) {
    try {
      console.log('[ChangementAdresseCommandHandler] Processing:', event);

      // Extract data from the new format
      const payload = typeof event.payload === 'string'
        ? JSON.parse(event.payload)
        : event.payload;

      const accountId = payload.accountId;
      const address = payload.address;

      if (!event.trackingId || !accountId || !address) {
        throw new Error('Missing required fields: trackingId, accountId and address are required');
      }

      const changeAdresseDemandeeEvent = ChangementAdresseDemandeeEvent({
        trackingId: event.trackingId,
        requestId: event.requestId,
        accountId,
        address
      });

      console.log('[ChangementAdresseCommandHandler] Created event:', changeAdresseDemandeeEvent);

      await BackOfficeEventStoreRepository.append(changeAdresseDemandeeEvent);
      await EventBus.publish(changeAdresseDemandeeEvent);
      return { ok: true };
    } catch (err) {
      console.error('[ChangementAdresseCommandHandler] Failed:', err);
      return { ok: false, error: err.message };
    }
  }
}
