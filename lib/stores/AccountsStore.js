// db/AccountsRepository.js
import { db } from '../db';

export class AccountsRepository {
  static async updateAccount(account) {
    await db.accounts.put(account);
    return this.getAccount(account.accountId);
  }

  static async getAccount(accountId) {
    return await db.accounts.get(accountId);
  }

  static async getAllAccounts() {
    return await db.accounts.toArray();
  }

static async getAccountById(accountId) {
    return await db.accounts.where('accountId').equals(accountId).first();
  }

  static async updateAccountAddress(accountId, address) {
    await db.accounts.update(accountId, { address });
  }
}
