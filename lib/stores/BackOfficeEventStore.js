import { db } from '../db';

// db/TodoRepository.js
export class BackOfficeEventStoreRepository {
  static async save(todo) {
    return await db.backEvents.add(todo);
  }
}