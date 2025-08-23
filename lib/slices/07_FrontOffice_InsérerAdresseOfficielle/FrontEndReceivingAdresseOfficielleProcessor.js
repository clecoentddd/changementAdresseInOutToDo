// lib/processors/FrontEventLogger.js
import { EventBus } from '../../infrastructure/EventBus';
import { AdresseOfficielleRecueEtValidee } from '../../events/AdresseOfficielleRecueEtValideeEvent';
import { FrontEventStoreRepository } from '../../stores/FrontEventStore';

let isSubscribed = false;

export class FrontEventLoggerReceiver {
  constructor() {
    if (!isSubscribed) {
      EventBus.subscribe('BackOffice_NouvelleAdresseOfficiellePubliée', this.handleNewAddressEvent);
      console.log('[FrontEventLogger] Subscribed to BackOffice_NouvelleAdresseOfficiellePubliée');
      isSubscribed = true;
    }
  }

  handleNewAddressEvent = async (event) => {
    try {
      console.log('[FrontEventLogger] Received event:', event);
      const adresseEvent = AdresseOfficielleRecueEtValidee({
        eventId: event.eventId,
        trackingId: event.trackingId,
        accountId: event.payload.accountId,
        toDoId: event.id,
        address: event.payload.newAddress,
      });
      console.log('[FrontEventLogger] Created AdresseOfficielleRecueEtValidee:', adresseEvent);
      await FrontEventStoreRepository.addEvent(adresseEvent);
      EventBus.publish(adresseEvent); // Publish the event for the projection
      console.log('[FrontEventLogger] Successfully logged AdresseOfficielleRecueEtValidee to frontEvents');
    } catch (err) {
      console.error('[FrontEventLogger] Failed to log event:', err);
    }
  };
}

// Instantiate the processor ONCE
const frontEventLogger = new FrontEventLoggerReceiver();
export { frontEventLogger };
