import { db } from '../db';

// db/TodoRepository.js
export class BackOfficeEventStoreRepository {

  static async save(todo) {
    return await db.backEvents.add(todo);
  }

    static async getAllEvents() {
    return await db.backEvents.toArray();
  }

   static async getEventsByTrackingIdAndType(trackingId, type) {
    try {
      console.log(`[BackOfficeEventStoreRepository] Querying for events with trackingId: ${trackingId} and type: ${type}`);
      
      // Use Dexie's where() clause on the correct fields
      const result = await db.backEvents
        .where({ trackingId: trackingId, type: type })
        .toArray();
      
      console.log(`[BackOfficeEventStoreRepository] Found ${result.length} matching events.`);
      return result;
    } catch (error) {
      console.error("[BackOfficeEventStoreRepository] Failed to query events:", error);
      return [];
    }
  }
}