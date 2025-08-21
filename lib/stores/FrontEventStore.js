import { db } from '../db';
import { AccountsProjection } from '../projections/AccountsProjection';

export class FrontEventStore {
  static async append(event) {
    await db.frontEvents.add(event);
    console.log('Event appended to FrontEventStore:', event);

    // Directly update accounts projection
    if (event.type === 'addressChanged') {
      await AccountsProjection.onAddressChanged(event);
    }
  }

  static async all() {
    return await db.frontEvents.toArray();
  }
}
