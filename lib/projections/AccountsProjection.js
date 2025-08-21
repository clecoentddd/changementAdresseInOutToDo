import { db } from '../db';

export class AccountsProjection {
  static async onAddressChanged(event) {
    console.log('Updating account from event:', event);
    const { accountId, name, address } = event.payload;
    await db.accounts.put({ accountId, name, address });

    // Log the updated account
    const updatedAccount = await db.accounts.get(accountId);
    console.log('Account updated in DB:', updatedAccount);
  }

  static async getAll() {
    const accounts = await db.accounts.toArray();
    //console.log('All accounts in DB:', accounts);
    return accounts;
  }
}
