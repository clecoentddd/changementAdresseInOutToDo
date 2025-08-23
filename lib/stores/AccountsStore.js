// db/AccountsRepository.js
import { db } from '../db';

export class AccountsRepository {
  // Update the entire account (preserves createdAt, updates updatedAt)
  static async updateAccount(account) {
    const existing = await db.accounts.get(account.accountId);
    const accountToSave = {
      ...account,
      createdAt: existing?.createdAt || new Date(), // Preserve original creation time
      updatedAt: new Date(), // Always update
    };
    await db.accounts.put(accountToSave);
    return this.getAccount(account.accountId);
  }

  // Update only the address (updates updatedAt)
  static async updateAccountAddress(accountId, address) {
    const existing = await db.accounts.get(accountId);
    const updatedAccount = {
      ...existing,
      address,
      updatedAt: new Date(), // Always update
    };
    await db.accounts.put(updatedAccount);
    return this.getAccount(accountId);
  }

  // Get a single account
  static async getAccount(accountId) {
    return await db.accounts.get(accountId);
  }

  static async getAllAccounts() {
    console.log('[AccountsRepository - getAllAccounts] Fetching all accounts...');
    const accounts = await db.accounts.toArray();
    // Sort by updatedAt (descending)
    const sortedAccounts = accounts.sort((a, b) =>
      new Date(a.updatedAt) - new Date(b.updatedAt)
    );
    console.log('[AccountsRepository - getAllAccounts] Fetched accounts (sorted by updatedAt):', sortedAccounts);
    return sortedAccounts;
  }

  static async clearAccounts () {
  try {
    await db.accounts.clear();
    console.log("All accounts cleared from the database.");
    return true; // Success
  } catch (err) {
    console.error("Failed to clear accounts:", err);
    return false; // Failure
  }
}

}
