// lib/processors/FrontEventLogger.js
import { db } from '../db';
import { EventBus } from '../infrastructure/EventBus';
import { AdresseOfficielleRecueEtValidee } from '../events.js/AdresseOfficielleRecueEtValideeEvent';

let isSubscribed = false; // Track subscription status

export class FrontEventLoggerReceiver {
  constructor() {
    if (!isSubscribed) {
      EventBus.subscribe('NouvelleAdresseOfficiellePubliée', this.handleNewAddressEvent);
      console.log('[FrontEventLogger] Subscribed to NouvelleAdresseOfficiellePubliée');
      isSubscribed = true; // Mark as subscribed
    }
  }

  handleNewAddressEvent = async (event) => {
    try {
      console.log('[FrontEventLogger] Received event:', event);
      const adresseEvent = AdresseOfficielleRecueEtValidee({
        eventId: event.payload.eventId,
        trackingId: event.payload.trackingId,
        accountId: event.payload.accountId,
        toDoId: event.payload.id,
        address: event.payload.newAddress,
      });
      console.log('[FrontEventLogger] Created AdresseOfficielleRecueEtValidee:', adresseEvent);
      await db.frontEvents.add(adresseEvent);
      console.log('[FrontEventLogger] Successfully logged AdresseOfficielleRecueEtValidee to frontEvents');
    } catch (err) {
      console.error('[FrontEventLogger] Failed to log event:', err);
    }
  };
}

// Instantiate the processor ONCE
const frontEventLogger = new FrontEventLoggerReceiver();
export { frontEventLogger };
