// lib/processors/AccountsProjectionSubscriber.js
import { EventBus } from '../../infrastructure/EventBus';
import { AccountsProjection } from '../../slices/02_FrontOffice_ListerLesComptes/AccountsProjection';

let isSubscribed = false;

export class AccountsProjectionSubscriber {
  constructor() {
    if (!isSubscribed) {
      EventBus.subscribe(
        'FrontOffice_changementAdresseRequis',
        this.handleAddressChangeRequestEvent
      );
      console.log('[AccountsProjectionSubscriber] Subscribed to FrontOffice_changementAdresseRequis');
      isSubscribed = true;
    }
  }

  handleAddressChangeRequestEvent = async (event) => {
    try {
      console.log('[AccountsProjectionSubscriber] Received FrontOffice_changementAdresseRequis:', event);
      await AccountsProjection.onAddressChanged(event);
    } catch (err) {
      console.error('[AccountsProjectionSubscriber] Failed to handle address change request:', err);
    }
  };
}

// Instantiate the subscriber ONCE
const accountsProjectionSubscriber = new AccountsProjectionSubscriber();
export { accountsProjectionSubscriber };
