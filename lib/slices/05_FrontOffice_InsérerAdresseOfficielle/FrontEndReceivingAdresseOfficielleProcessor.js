// lib/processors/FrontEventLogger.js
import { EventBus } from '../../infrastructure/EventBus';
import { AdresseOfficielleRecueEtValidee } from '../../events/AdresseOfficielleRecueEtValideeEvent';
import { FrontEventStoreRepository } from '../../stores/FrontEventStore';
import { AccountsRepository } from '../../stores/AccountsStore';

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

      const { accountId, newAddress } = event.payload;
      const account = await AccountsRepository.getAccountById(accountId);

      if (account) {
        await AccountsRepository.updateAccountAddress(accountId, newAddress);
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
