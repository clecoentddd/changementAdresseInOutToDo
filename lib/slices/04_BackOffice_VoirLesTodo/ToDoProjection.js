import { db } from '../../db';

export class TodoProjection {
  static async onTodoAdded(event) {
    console.log('[TodoProjection] Todo to be added:', event.payload);
    await db.todos.add(event.payload);
    console.log('[TodoProjection] Todo added:', event.payload);
  }
}