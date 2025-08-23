// lib/projections/AccountsProjection.js
import { EventBus } from '../../infrastructure/EventBus';
import { AccountsRepository } from '../../stores/AccountsStore';

let isInitialized = false;

export class AccountsProjection {
  static initialize() {
    if (isInitialized) {
      console.log('[AccountsProjection] Already initialized. Skipping.');
      return;
    }

    EventBus.subscribe('AdresseOfficielleRecueEtValidee', async (event) => {
      try {
        console.log('[AccountsProjection] Received AdresseOfficielleRecueEtValidee:', event);
        const { accountId, address } = event;
        const account = await AccountsRepository.getAccount(accountId);
        if (account) {
          await AccountsRepository.updateAccountAddress(accountId, address);
          console.log(`[AccountsProjection] Updated address for account ${accountId}: ${address}`);
        } else {
          console.warn(`[AccountsProjection] Account not found: ${accountId}`);
        }
      } catch (err) {
        console.error('[AccountsProjection] Failed to update account address:', err);
      }
    });

    isInitialized = true;
    console.log('[AccountsProjection] Subscribed to AdresseOfficielleRecueEtValidee');
  }
}

// Initialize the projection
AccountsProjection.initialize();
