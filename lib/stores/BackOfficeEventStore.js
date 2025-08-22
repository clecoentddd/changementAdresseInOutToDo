import { db } from '../db';

// db/TodoRepository.js
export class BackOfficeEventStoreRepository {
  static async save(todo) {
    return await db.backEvents.add(todo);
  }

    static async getAllEvents() {
    return await db.backEvents.toArray();
  }
}