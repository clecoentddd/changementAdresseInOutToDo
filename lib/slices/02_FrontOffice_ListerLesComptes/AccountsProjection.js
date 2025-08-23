// projections/AccountsProjection.js
import { AccountsRepository } from '../../stores/AccountsStore';

export class AccountsProjection {
  static async onAddressChanged(event) {
    console.log('Updating account from event:', event);
    const { accountId, name, address } = event.payload;
    const updatedAccount = await AccountsRepository.updateAccount({ accountId, name, address });
    console.log('Account updated in DB:', updatedAccount);
  }

  static async getAll() {
    console.log('[AccountsProjection] getAll...');
    return await AccountsRepository.getAllAccounts();
  }

  static async clear () {
    return await AccountsRepository.clearAccounts();
  }
}
