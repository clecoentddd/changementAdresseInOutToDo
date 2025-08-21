// lib/processors/FrontEventLogger.js
import { db } from '../db';
import { EventBus } from '../infrastructure/EventBus';
import { AdresseOfficielleRecueEtValidee } from '../events/AdresseOfficielleRecueEtValideeEvent';

let isSubscribed = false; // Track subscription status

export class FrontEventLoggerReceiver {
  constructor() {
    if (!isSubscribed) {
      EventBus.subscribe('BackOffice_NouvelleAdresseOfficiellePubliée', this.handleNewAddressEvent);
      console.log('[FrontEventLogger] Subscribed to BackOffice_NouvelleAdresseOfficiellePubliée');
      isSubscribed = true; // Mark as subscribed
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
      await db.frontEvents.add(adresseEvent);

      // Extract necessary data from the event payload
      const { accountId, newAddress } = event.payload;

      // Update the account's address in the db.accounts table
      const account = await db.accounts.where('accountId').equals(accountId).first();
      if (account) {
        await db.accounts.update(account.accountId, { address: newAddress });
        EventBus.publish(adresseEvent);
        console.log(`[FrontEventLogger] Updated address for account ${accountId}: ${newAddress}`);
      } else {
        console.warn(`[FrontEventLogger] Account not found: ${accountId}`);
      }
      console.log('[FrontEventLogger] Successfully logged AdresseOfficielleRecueEtValidee to frontEvents');
    } catch (err) {
      console.error('[FrontEventLogger] Failed to log event:', err);
    }
  };
}

// Instantiate the processor ONCE
const frontEventLogger = new FrontEventLoggerReceiver();
export { frontEventLogger };
