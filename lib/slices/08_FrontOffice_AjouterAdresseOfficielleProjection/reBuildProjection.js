// lib/projections/AccountsProjection.js
import { db } from '../../db';
import { AccountsRepository } from '../../stores/AccountsStore';

export class BuildAccountsProjection {
  static async rebuild() {
    console.log('[AccountsProjection] Rebuilding accounts from events...');

    // Fetch all relevant events, sorted by timestamp (oldest first)
    const frontEvents = await db.frontEvents
      .where('type')
      .anyOf([
        'FrontOffice_changementAdresseRequis',
        'FrontOffice_NouvelleAdresseOfficielleReçuEtValidée',
      ])
      .toArray();

    // Sort events by timestamp (oldest first)
    const sortedEvents = frontEvents.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Replay each event
    for (const event of sortedEvents) {
      try {
        if (event.type === 'FrontOffice_changementAdresseRequis') {
          // Use updateAccount to create/update the account
          await AccountsRepository.updateAccount(event.payload);
          console.log(
            `[AccountsProjection] Applied changementAdresseRequis for account ${event.payload.accountId}`
          );
        }
        else if (event.type === 'FrontOffice_NouvelleAdresseOfficielleReçuEtValidée') {
          // Use updateAccountAddress to update the address
          await AccountsRepository.updateAccountAddress(
            event.payload.accountId,
            event.payload.address
          );
          console.log(
            `[AccountsProjection] Applied AdresseOfficielleRecueEtValidee for account ${event.payload.accountId}`
          );
        }
      } catch (err) {
        console.error(
          `[AccountsProjection] Failed to replay event ${event.eventId}:`,
          err
        );
      }
    }

    console.log('[AccountsProjection] Rebuild complete');
  }
}
