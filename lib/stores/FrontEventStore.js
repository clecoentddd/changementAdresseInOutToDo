import { db } from '../db';

export class FrontEventStoreRepository {
  static async append(event) {
    await db.frontEvents.add(event);
    console.log('Event appended to FrontEventStore:', event);
    }

  static async addEvent(event) {
    await db.frontEvents.add(event);
  }

  static async all() {
    return await db.frontEvents.toArray();
  }
}
